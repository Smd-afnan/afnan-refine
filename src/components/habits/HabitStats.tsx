"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Target, Flame, Activity, CheckSquare } from "lucide-react";
import type { Habit } from '@/types';

interface HabitStatsProps {
  habits: Habit[];
}

export default function HabitStats({ habits }: HabitStatsProps) {
  const totalHabits = habits.length;
  const activeHabits = habits.filter(h => h.is_active).length;
  const totalStreakDays = habits.reduce((acc, h) => acc + (h.streak_days || 0), 0);
  const longestStreak = habits.reduce((max, h) => Math.max(max, h.best_streak || 0), 0);

  const stats = [
    { title: "Total Habits", value: totalHabits, icon: Target, color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900/50" },
    { title: "Active Habits", value: activeHabits, icon: Activity, color: "text-emerald-600", bgColor: "bg-emerald-100 dark:bg-emerald-900/50" },
    { title: "Longest Streak", value: `${longestStreak} days`, icon: Flame, color: "text-orange-600", bgColor: "bg-orange-100 dark:bg-orange-900/50" },
    { title: "Total Streak Days", value: totalStreakDays, icon: CheckSquare, color: "text-purple-600", bgColor: "bg-purple-100 dark:bg-purple-900/50" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-0 shadow-md group dark:bg-slate-800/50 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 truncate dark:text-gray-400">{stat.title}</p>
            <p className="text-2xl font-bold text-gray-900 truncate dark:text-gray-100">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
