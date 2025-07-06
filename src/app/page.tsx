"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { 
  Sun,
  Moon,
  Sparkles
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import { getHabits, getHabitLogs, getAIInsights, islamicWisdoms } from "@/lib/mockData";
import type { Habit, HabitLog, AIInsight } from "@/types";
import { useTranslation } from "@/lib/i18n/useTranslation";

import DashboardStats from "@/components/dashboard/DashboardStats";
import TodayHabits from "@/components/dashboard/TodayHabits";
import AIInsightCard from "@/components/dashboard/AIInsightCard";
import ProgressRing from "@/components/dashboard/ProgressRing";
import HabitHeatmap from "@/components/dashboard/HabitHeatmap";
import QuickActions from "@/components/dashboard/QuickActions";
import DignityNudgeSection from "@/components/dashboard/DignityNudgeSection";
import BarakahBoostCard from "@/components/dashboard/BarakahBoostCard";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [todayLogs, setTodayLogs] = useState<HabitLog[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [greeting, setGreeting] = useState("");
  const [showBarakahBoost, setShowBarakahBoost] = useState(false);
  const { t } = useTranslation();
  const { toast } = useToast();

  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    loadDashboardData();
    setDynamicGreeting();
  }, []);

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

  if (isLoading) {
    return (
      <div className="p-4 lg:p-8 space-y-8">
        <div className="space-y-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Skeleton className="h-64 lg:col-span-1 rounded-lg" />
            <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Skeleton className="h-28 rounded-lg" />
                <Skeleton className="h-28 rounded-lg" />
                <Skeleton className="h-28 rounded-lg" />
                <Skeleton className="h-28 rounded-lg" />
            </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-96 lg:col-span-2 rounded-lg" />
            <div className="space-y-6">
                <Skeleton className="h-48 rounded-lg" />
                <Skeleton className="h-48 rounded-lg" />
            </div>
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
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-800 to-emerald-600 dark:from-emerald-400 dark:to-emerald-600 bg-clip-text text-transparent font-headline">
              {greeting}! 🌟
            </h1>
          </div>
          <p className="text-lg text-emerald-700 dark:text-emerald-300 font-medium">
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

        <Card className="bg-gradient-to-r from-purple-600 to-indigo-800 text-white border-0 shadow-2xl dark:from-purple-700 dark:to-indigo-900">
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
