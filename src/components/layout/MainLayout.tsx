
"use client";

import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, Target, Brain, User as UserIcon, Calendar, Settings, Sparkles, Star, Bell, Moon, Sun, Languages, LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useNotifier } from "@/components/notifications/NotificationProvider";
import type { UserSettings } from "@/types";
import { getUserSettings, updateUserSettings, checkDuaSettings } from '@/lib/mockData';
import { useTranslation } from "@/lib/i18n/useTranslation";
import { createPageUrl } from "@/lib/utils";
import { scheduleDailyNotifications } from "@/lib/notifications";
import OpeningDuaScreen from "@/components/dua/OpeningDuaScreen";
import { format } from "date-fns";
import { registerServiceWorker, requestNotificationPermission, onMessageListener } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { type MessagePayload } from "firebase/messaging";
import { useAuth, AuthLoadingSpinner } from '@/context/AuthContext';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const notifier = useNotifier();
  const { t, currentLanguage, changeLanguage } = useTranslation();
  const { toast } = useToast();

  const [showDuaScreen, setShowDuaScreen] = useState(false);
  const [duaCheckComplete, setDuaCheckComplete] = useState(false);

  const [, setForceUpdate] = useState(0);
  useEffect(() => {
    const handleLanguageChange = () => setForceUpdate(c => c + 1);
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      if (pathname !== '/login') {
        router.push('/login');
      }
      return;
    }

    const initApp = async () => {
      try {
        const settings = await checkDuaSettings(user.uid);
        setUserSettings(settings);
        
        const today = format(new Date(), 'yyyy-MM-dd');
        
        if (settings.show_opening_dua && settings.last_dua_shown_date !== today) {
          setShowDuaScreen(true);
        } else {
          setDuaCheckComplete(true);
        }
      } catch (error) {
        console.error("Error initializing app:", error);
        setDuaCheckComplete(true);
      }
    };
    initApp();
  }, [user, loading, pathname, router]);
  
  useEffect(() => {
    if (userSettings) {
      setDarkMode(userSettings.dark_mode);
      document.documentElement.classList.toggle('dark', userSettings.dark_mode);
      if (userSettings.app_language && userSettings.app_language !== currentLanguage) {
        changeLanguage(userSettings.app_language);
      }
    }
  }, [userSettings, currentLanguage, changeLanguage]);
  
  useEffect(() => {
    if (notifier && userSettings?.notifications_enabled && notifier.permission === 'granted' && user) {
      scheduleDailyNotifications(notifier, user.uid);
    }
  }, [notifier, userSettings?.notifications_enabled, notifier?.permission, user]);

  useEffect(() => {
    registerServiceWorker();
    onMessageListener()
      .then((payload: MessagePayload) => {
        toast({
          title: payload.notification?.title,
          description: payload.notification?.body,
        });
        console.log('Received foreground message: ', payload);
      })
      .catch((err) => console.log('Failed to listen for foreground messages: ', err));
  }, [toast]);

  const handleDuaComplete = async () => {
    setShowDuaScreen(false);
    setDuaCheckComplete(true);
    if (user) {
      const today = format(new Date(), 'yyyy-MM-dd');
      await updateUserSettings(user.uid, { last_dua_shown_date: today });
    }
  };

  const updateUserSetting = async <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    if (!userSettings || !user) return;
    const oldSettings = { ...userSettings };
    const newSettingsData = { ...oldSettings, [key]: value };
    setUserSettings(newSettingsData);
    try {
      await updateUserSettings(user.uid, { [key]: value });
    } catch (error) {
      console.error("Error updating user setting:", error);
      setUserSettings(oldSettings); 
    }
  };

  const navigationItems = [
    { title: t("dashboard"), url: "/", icon: Home, description: t("dashboard_desc") },
    { title: t("habits"), url: createPageUrl("Habits"), icon: Target, description: t("habits_desc") },
    { title: t("murabbi_core"), url: createPageUrl("AICoach"), icon: Brain, description: t("murabbi_desc") },
    { title: t("reflection"), url: createPageUrl("Reflection"), icon: Calendar, description: t("reflection_desc") },
    { title: t("glow_up_path"), url: createPageUrl("Glow-Up"), icon: Star, description: t("glow_up_desc") },
    { title: t("profile"), url: createPageUrl("Profile"), icon: UserIcon, description: t("profile_desc") }
  ];

  const handleNotificationRequest = async () => {
    if (!user) return;
    const token = await requestNotificationPermission(user.uid);
    if (token) {
        toast({ title: 'Notifications Enabled', description: 'You are now set up to receive push notifications.' });
    } else {
        toast({ title: 'Permission Required', description: 'Notification permission was not granted.', variant: 'destructive' });
    }
    await updateUserSetting('notifications_enabled', !!token);
  };

  const toggleDarkMode = async () => await updateUserSetting('dark_mode', !darkMode);
  const handleLanguageChange = async (newLanguage: 'english' | 'telugu') => {
    changeLanguage(newLanguage);
    await updateUserSetting('app_language', newLanguage);
  };

  if (loading) {
    return <AuthLoadingSpinner />;
  }
  
  if (!user) {
    // If not logged in, only the login page should be rendered
    return <>{pathname === '/login' ? children : <AuthLoadingSpinner />}</>;
  }

  if (showDuaScreen) {
    return <OpeningDuaScreen onComplete={handleDuaComplete} />;
  }

  if (!duaCheckComplete) {
     return <AuthLoadingSpinner />;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-900`}>
      <header className="lg:hidden nav-glass sticky top-0 z-50 px-4 py-3 border-b border-emerald-100 dark:border-emerald-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-800 to-emerald-600 bg-clip-text text-transparent font-headline dark:text-white">
                {t("app_name")}
              </h1>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="text-emerald-700 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-slate-700"><Settings className="w-6 h-6" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={handleNotificationRequest}><Bell className="w-4 h-4 mr-2" /><span>{t("enable_notifications")}</span></DropdownMenuItem>
              <DropdownMenuItem onClick={toggleDarkMode}>{darkMode ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}<span>{darkMode ? t("light_mode") : t("dark_mode")}</span></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-500 focus:text-red-500"><LogOut className="w-4 h-4 mr-2" /><span>Logout</span></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <div className="flex lg:flex-row flex-col min-h-screen">
        <aside className="hidden lg:flex lg:flex-col lg:w-80 nav-glass border-r border-emerald-100 dark:border-emerald-800 sacred-pattern">
          <div className="p-8 border-b border-emerald-100 dark:border-emerald-800">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl flex items-center justify-center shadow-xl"><Sparkles className="w-7 h-7 text-white" /></div>
              <div><h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-800 to-emerald-600 bg-clip-text text-transparent font-headline dark:text-white">{t("app_name")}</h1><p className="text-sm text-emerald-600 font-medium dark:text-emerald-400">{t("app_tagline")}</p></div>
            </div>
          </div>
          <nav className="flex-1 p-6 overflow-y-auto"><div className="space-y-3">{navigationItems.map((item) => (<Link key={item.title} href={item.url} className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group text-clip ${pathname === item.url ? 'nav-active' : 'nav-inactive'}`}><item.icon className="w-5 h-5 flex-shrink-0" /><div className="flex-1 min-w-0"><span className="font-semibold text-sm block truncate">{item.title}</span><p className={`text-xs mt-0.5 truncate ${pathname === item.url ? 'text-emerald-100' : 'text-emerald-600 dark:text-emerald-400'}`}>{item.description}</p></div></Link>))}</div></nav>
          <div className="p-6 border-t border-emerald-100 dark:border-emerald-800">
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="outline" className="w-full justify-start gap-2 text-emerald-700 border-emerald-200 hover:bg-emerald-50 dark:text-emerald-300 dark:border-slate-700 dark:hover:bg-slate-700"><Settings className="w-4 h-4" />{t("settings")}</Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={handleNotificationRequest}><Bell className="w-4 h-4 mr-2" /><span>{t("enable_notifications")}</span></DropdownMenuItem>
                <DropdownMenuItem onClick={toggleDarkMode}>{darkMode ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}<span>{darkMode ? t("light_mode") : t("dark_mode")}</span></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-default"><Languages className="w-4 h-4 mr-2" /><span>{t("app_language")}</span></DropdownMenuItem>
                <div className="px-2 py-1"><Button variant={currentLanguage === 'english' ? 'secondary' : 'ghost'} size="sm" className="w-full justify-start mb-1" onClick={() => handleLanguageChange('english')}>English</Button><Button variant={currentLanguage === 'telugu' ? 'secondary' : 'ghost'} size="sm" className="w-full justify-start" onClick={() => handleLanguageChange('telugu')}>తెలుగు</Button></div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-500 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-900/50"><LogOut className="w-4 h-4 mr-2" /><span>Logout</span></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </aside>
        <main className="flex-1 lg:overflow-auto min-h-0"><div className="h-full">{children}</div></main>
        <nav className="lg:hidden nav-glass border-t border-emerald-100 dark:border-emerald-800 px-2 py-2 fixed bottom-0 left-0 right-0"><div className="flex justify-around">{navigationItems.slice(0, 5).map((item) => (<Link key={item.title} href={item.url} className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 min-w-0 ${pathname === item.url ? 'nav-active text-white' : 'nav-inactive'}`}><item.icon className="w-5 h-5 flex-shrink-0" /><span className="text-xs font-medium truncate max-w-16">{item.title}</span></Link>))}</div></nav>
      </div>
    </div>
  );
}
