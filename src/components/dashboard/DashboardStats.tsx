
"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Target, Flame, CheckCircle, Star, Heart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Habit, HabitLog } from '@/types';

interface DashboardStatsProps {
  habits: Habit[];
  todayLogs: HabitLog[];
  streakData: { totalStreak: number; bestStreak: number };
  isLoading: boolean;
}

export default function DashboardStats({ habits = [], todayLogs = [], streakData = { totalStreak: 0, bestStreak: 0 }, isLoading }: DashboardStatsProps) {
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i} className="bg-white/80 backdrop-blur-sm border-0 shadow-md dark:bg-slate-800/50 dark:border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <Skeleton className="w-10 h-10 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-8 w-16 rounded" />
                <Skeleton className="h-3 w-20 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const activeHabits = habits.filter(h => h.is_active);
  const completedToday = new Set(todayLogs.filter(log => log.status === 'completed').map(l => l.habit_id)).size;
  const totalHabits = activeHabits.length;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  const totalStreakDays = streakData.totalStreak;
  const bestStreak = streakData.bestStreak;

  const stats = [
    { title: "Today's Progress", value: `${completedToday}/${totalHabits}`, subtitle: `${completionRate}% Complete`, icon: CheckCircle, color: "text-emerald-600", bgColor: "bg-emerald-100 dark:bg-emerald-900/50 dark:text-emerald-300", trend: completionRate >= 80 ? "excellent" : completionRate >= 60 ? "good" : "needs-focus" },
    { title: "Active Habits", value: totalHabits, subtitle: "Being tracked", icon: Target, color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900/50 dark:text-blue-300", trend: totalHabits >= 5 ? "good" : "growing" },
    { title: "Total Streak Days", value: totalStreakDays, subtitle: "Across all habits", icon: Flame, color: "text-orange-600", bgColor: "bg-orange-100 dark:bg-orange-900/50 dark:text-orange-300", trend: totalStreakDays >= 30 ? "excellent" : totalStreakDays >= 10 ? "good" : "building" },
    { title: "Best Streak", value: bestStreak, subtitle: "Personal record", icon: Star, color: "text-purple-600", bgColor: "bg-purple-100 dark:bg-purple-900/50 dark:text-purple-300", trend: bestStreak >= 21 ? "mastery" : bestStreak >= 7 ? "momentum" : "starting" }
  ];

  const getTrendEmoji = (trend: string) => {
    switch(trend) {
      case "excellent": case "mastery": return "🔥";
      case "good": case "momentum": return "📈";
      case "growing": case "building": return "🌱";
      default: return "💪";
    }
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-0 shadow-md group dark:bg-slate-800/50 dark:border-slate-700 dark:hover:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className="text-lg" title={`${stat.trend} performance`}>{getTrendEmoji(stat.trend)}</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600 truncate dark:text-gray-400" title={stat.title}>{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 truncate dark:text-gray-100" title={String(stat.value)}>{stat.value}</p>
              <p className="text-xs text-gray-500 truncate dark:text-gray-400" title={stat.subtitle}>{stat.subtitle}</p>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {totalHabits > 0 && (
        <Card className="lg:col-span-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 shadow-md dark:from-emerald-900/50 dark:to-teal-900/50 dark:border-emerald-800">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                {completionRate === 100 ? "Masha'Allah! Perfect day achieved!" :
                 completionRate >= 80 ? "Excellent progress! You're thriving!" :
                 completionRate >= 60 ? "Good momentum! Keep the consistency!" :
                 completionRate >= 40 ? "Steady progress! Every step counts!" :
                 completionRate > 0 ? "You've begun! That's the hardest part!" :
                 "Ready for a fresh start? Your journey begins now!"}
              </p>
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">&quot;And whoever relies upon Allah - then He is sufficient for him.&quot; (65:3)</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
