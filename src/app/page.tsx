"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { 
  Sun,
  Moon,
  Sparkles
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import { getHabits, getHabitLogs, getAIInsights, checkDuaSettings, getMockUser, updateMockUserSettings, islamicWisdoms } from "@/lib/mockData";
import type { Habit, HabitLog, AIInsight, UserSettings, User } from "@/types";
import { useTranslation } from "@/lib/i18n/useTranslation";

import DashboardStats from "@/components/dashboard/DashboardStats";
import TodayHabits from "@/components/dashboard/TodayHabits";
import AIInsightCard from "@/components/dashboard/AIInsightCard";
import ProgressRing from "@/components/dashboard/ProgressRing";
import HabitHeatmap from "@/components/dashboard/HabitHeatmap";
import QuickActions from "@/components/dashboard/QuickActions";
import DignityNudgeSection from "@/components/dashboard/DignityNudgeSection";
import OpeningDuaScreen from "@/components/dua/OpeningDuaScreen";
import BarakahBoostCard from "@/components/dashboard/BarakahBoostCard";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [todayLogs, setTodayLogs] = useState<HabitLog[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [greeting, setGreeting] = useState("");
  const [showDuaScreen, setShowDuaScreen] = useState(false);
  const [duaCheckComplete, setDuaCheckComplete] = useState(false);
  const [showBarakahBoost, setShowBarakahBoost] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { t } = useTranslation();
  const { toast } = useToast();

  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    const init = async () => {
      const userData = await getMockUser();
      setUser(userData);
      const settings = await checkDuaSettings(userData.email);

      if (settings.show_opening_dua && settings.last_dua_shown_date !== today) {
        setShowDuaScreen(true);
      } else {
        setDuaCheckComplete(true);
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (duaCheckComplete && !showDuaScreen) {
      loadDashboardData();
      setDynamicGreeting();
    }
  }, [duaCheckComplete, showDuaScreen]);

  const handleDuaComplete = async () => {
    setShowDuaScreen(false);
    setDuaCheckComplete(true);
     if (user) {
        await updateMockUserSettings(user.email, { last_dua_shown_date: today });
      }
  };

  const setDynamicGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting(t('good_morning'));
    else if (hour < 17) setGreeting(t('good_afternoon'));
    else setGreeting(t('good_evening'));
  };

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [habitsData, logsData, insightsData] = await Promise.all([
        getHabits(),
        getHabitLogs(today),
        getAIInsights(),
      ]);
      
      setHabits(habitsData);
      setTodayLogs(logsData);
      setInsights(insightsData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast({
        title: "Error",
        description: "Could not load dashboard data.",
        variant: "destructive",
      });
      setHabits([]);
      setTodayLogs([]);
      setInsights([]);
    }
    setIsLoading(false);
  };

  if (showDuaScreen && user) {
    return <OpeningDuaScreen onComplete={handleDuaComplete} user={user} />;
  }

  if (!duaCheckComplete || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Sparkles className="w-12 h-12 text-emerald-600 mx-auto animate-spin" />
          <p className="text-emerald-700 font-medium font-headline">{t('preparing_journey')}</p>
        </div>
      </div>
    );
  }

  const getTodayProgress = () => {
    if (habits.length === 0) return 0;
    const activeHabits = habits.filter(h => h.is_active);
    if(activeHabits.length === 0) return 0;
    
    const completedHabitIds = new Set(todayLogs.filter(log => log.status === 'completed').map(l => l.habit_id));
    const completedCount = activeHabits.filter(h => completedHabitIds.has(h.id)).length;
    
    const progress = Math.round((completedCount / activeHabits.length) * 100);
    
    if (progress === 100 && !showBarakahBoost) {
        setShowBarakahBoost(true);
    }
    
    return progress;
  };

  const getStreakData = () => {
    let totalStreak = 0;
    let bestStreak = 0;
    
    habits.forEach(habit => {
      totalStreak += habit.streak_days || 0;
      if ((habit.best_streak || 0) > bestStreak) {
        bestStreak = habit.best_streak || 0;
      }
    });
    
    return { totalStreak, bestStreak };
  };

  const progress = getTodayProgress();
  const streakData = getStreakData();
  const completedHabits = habits.filter(h => todayLogs.some(l => l.habit_id === h.id && l.status === 'completed')).length;
  const totalActiveHabits = habits.filter(h => h.is_active).length;

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
            {new Date().getHours() < 12 ? (
              <Sun className="w-8 h-8 text-amber-500" />
            ) : (
              <Moon className="w-8 h-8 text-indigo-500" />
            )}
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-800 to-emerald-600 bg-clip-text text-transparent font-headline">
              {greeting}! 🌟
            </h1>
          </div>
          <p className="text-lg text-emerald-700 font-medium">
            {t('dashboard_tagline')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <ProgressRing 
              progress={progress}
              isLoading={isLoading}
              completedHabits={completedHabits}
              totalHabits={totalActiveHabits}
            />
          </div>
          <div className="lg:col-span-3">
            <DashboardStats 
              habits={habits}
              todayLogs={todayLogs}
              streakData={streakData}
              isLoading={isLoading}
            />
          </div>
        </div>
        
        <BarakahBoostCard trigger={showBarakahBoost} wisdomPool={islamicWisdoms} />

        <DignityNudgeSection userLevel={1} />

        {insights.length > 0 && (
          <AIInsightCard insights={insights} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TodayHabits 
              habits={habits}
              todayLogs={todayLogs}
              onRefresh={loadDashboardData}
              isLoading={isLoading}
            />
          </div>
          <div className="space-y-6">
            <QuickActions />
            {!isLoading && (
              <HabitHeatmap habits={habits} />
            )}
          </div>
        </div>

        <Card className="bg-gradient-to-r from-purple-600 to-indigo-800 text-white border-0 shadow-2xl">
          <CardContent className="p-8 text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-200" />
            <h3 className="text-2xl font-bold mb-2 font-headline">{t('no_track_title')}</h3>
            <p className="text-purple-100 mb-2 text-lg font-medium">
              {t('no_track_subtitle')}
            </p>
            <p className="text-purple-200 mb-6 max-w-2xl mx-auto leading-relaxed">
              {t('no_track_desc')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
