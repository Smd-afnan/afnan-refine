"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, CheckCircle, Flame, BookOpen, Activity } from 'lucide-react';

interface ProfileStatsProps {
  stats: {
    totalHabits?: number;
    activeHabits?: number;
    completionRate?: number;
    totalStreak?: number;
    reflectionDays?: number;
  };
}

export default function ProfileStats({ stats }: ProfileStatsProps) {
  const statItems = [
    { icon: Activity, label: 'Active Habits', value: stats.activeHabits || 0 },
    { icon: CheckCircle, label: 'Completion Rate', value: `${stats.completionRate || 0}%` },
    { icon: Flame, label: 'Total Streak Days', value: stats.totalStreak || 0 },
    { icon: BookOpen, label: 'Days Reflected', value: stats.reflectionDays || 0 },
  ];

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg dark:bg-slate-800/50 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="w-5 h-5 text-purple-600" />
          Overall Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-center">
          {statItems.map((item, index) => (
            <div key={index} className="p-2 bg-gray-50 dark:bg-slate-900/50 rounded-lg">
              <item.icon className="w-6 h-6 mx-auto text-purple-500 mb-1" />
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{item.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
