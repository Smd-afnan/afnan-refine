
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Volume2, VolumeX, Settings } from "lucide-react";
import type { OpeningDua, UserSettings } from '@/types';
import { getOpeningDuas, getMockUserSettings, updateMockUserSettings } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

export default function OpeningDuaScreen({ onComplete }: { onComplete: () => void; }) {
  const [currentDua, setCurrentDua] = useState<OpeningDua | null>(null);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadDuaAndSettings = async () => {
      setIsLoading(true);
      try {
        const settings = await getMockUserSettings();
        setUserSettings(settings);

        const allDuas = await getOpeningDuas();
        let selectedDua;

        if (settings.contextual_dua_mode) {
          const hour = new Date().getHours();
          const context = hour < 12 ? 'morning' : hour >= 18 ? 'evening' : 'general';
          const contextualDuas = allDuas.filter(dua => dua.context === context || dua.context === 'general');
          selectedDua = settings.randomize_daily_dua
            ? contextualDuas[Math.floor(Math.random() * contextualDuas.length)]
            : contextualDuas[0];
        } else {
          selectedDua = settings.randomize_daily_dua
            ? allDuas[Math.floor(Math.random() * allDuas.length)]
            : allDuas[0];
        }
        setCurrentDua(selectedDua || allDuas[0]);
      } catch (error) {
        console.error("Error loading du'a:", error);
        toast({ title: "Error", description: "Could not load the daily prayer.", variant: "destructive"});
        onComplete();
      }
      setIsLoading(false);
    };

    loadDuaAndSettings();
  }, [onComplete, toast]);

  const handleUpdateSetting = async (key: keyof UserSettings, value: boolean) => {
    if (!userSettings) return;
    const newSettings = { ...userSettings, [key]: value };
    setUserSettings(newSettings);
    await updateMockUserSettings({ [key]: value });
  };

  if (isLoading || !currentDua) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center z-50 p-4">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4"></div>
          <div className="w-64 h-4 bg-white/20 rounded mb-2"></div>
          <div className="w-48 h-4 bg-white/20 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      <Card className="relative max-w-2xl w-full bg-white/10 backdrop-blur-xl border-0 shadow-2xl animate-fade-in-up">
        <CardContent className="p-8 text-center space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles className="w-8 h-8 text-amber-300 animate-pulse" />
              <h1 className="text-2xl font-bold text-white font-headline">Begin with Du&apos;a</h1>
              <Sparkles className="w-8 h-8 text-amber-300 animate-pulse" />
            </div>
            <p className="text-purple-100 text-sm">&quot;{currentDua.spiritual_focus}&quot;</p>
          </div>

          <div className="space-y-6">
            { (userSettings?.preferred_language !== 'translation_only') && (
              <div className="text-center">
                <p className="text-3xl leading-relaxed text-white font-arabic mb-4" dir="rtl">{currentDua.arabic}</p>
                <p className="text-lg text-purple-200 italic mb-2">{currentDua.transliteration}</p>
              </div>
            )}
            { (userSettings?.preferred_language !== 'arabic_only') && (
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <p className="text-xl text-white leading-relaxed">&quot;{currentDua.translation}&quot;</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => handleUpdateSetting('dua_audio_enabled', !userSettings?.dua_audio_enabled)} className="text-white hover:bg-white/10">
              {userSettings?.dua_audio_enabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </Button>
            <Button onClick={onComplete} className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-3 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300">
              Āmīn - Begin 🤲
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)} className="text-white hover:bg-white/10">
              <Settings className="w-5 h-5" />
            </Button>
          </div>

          {showSettings && (
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm text-left space-y-4">
              <h3 className="text-white font-semibold mb-4">Du&apos;a Settings</h3>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <label className="flex items-center gap-3 text-purple-100"><input type="checkbox" checked={userSettings?.show_opening_dua} onChange={(e) => handleUpdateSetting('show_opening_dua', e.target.checked)} className="rounded" />Show du&apos;a on app launch</label>
                <label className="flex items-center gap-3 text-purple-100"><input type="checkbox" checked={userSettings?.randomize_daily_dua} onChange={(e) => handleUpdateSetting('randomize_daily_dua', e.target.checked)} className="rounded" />Randomize daily du&apos;a</label>
                <label className="flex items-center gap-3 text-purple-100"><input type="checkbox" checked={userSettings?.contextual_dua_mode} onChange={(e) => handleUpdateSetting('contextual_dua_mode', e.target.checked)} className="rounded" />Show contextual du&apos;a</label>
              </div>
            </div>
          )}
          <div className="pt-4 border-t border-white/10">
            <Button variant="ghost" onClick={onComplete} className="text-purple-200 hover:text-white text-sm">Skip for today</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
