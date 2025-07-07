
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Flame, BookOpen, Heart, Shield } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Habit, HabitLog, DailyReflection } from '@/types';
import { useAuth } from '@/context/AuthContext';

interface AchievementsBadgesProps {
  habits: Habit[];
  recentLogs: HabitLog[];
  reflections: DailyReflection[];
}

export default function AchievementsBadges({ habits, recentLogs, reflections }: AchievementsBadgesProps) {
  const { user } = useAuth();
  if (!user) return null;

  const achievements = [
    { name: "Perfect Week", icon: Shield, description: "Complete all active habits for 7 days in a row.", achieved: false },
    { name: "30-Day Streak", icon: Flame, description: "Maintain a streak of 30 days on any single habit.", achieved: habits.some(h => h.best_streak >= 30) },
    { name: "The Scholar", icon: BookOpen, description: "Complete a 'learning' habit 50 times.", achieved: recentLogs.filter(l => habits.find(h => h.id === l.habit_id)?.category === 'learning').length >= 50 },
    { name: "Reflective Heart", icon: Heart, description: "Write 30 daily reflections.", achieved: reflections.length >= 30 },
    { name: "Habit Master", icon: Award, description: "Create 10 or more habits.", achieved: habits.length >= 10 },
  ];

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg dark:bg-slate-800/50 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5 text-purple-600" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="flex flex-wrap gap-4">
            {achievements.map((ach, index) => (
              <Tooltip key={index}>
                <TooltipTrigger>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${ach.achieved ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg' : 'bg-gray-200 text-gray-500 dark:bg-slate-700 dark:text-gray-400'}`}>
                    <ach.icon className="w-6 h-6" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold">{ach.name} {ach.achieved && "- Unlocked!"}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{ach.description}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
