"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckSquare, Target } from 'lucide-react';
import type { Habit } from '@/types';

interface PersonalGoalsProps {
  habits: Habit[];
}

export default function PersonalGoals({ habits }: PersonalGoalsProps) {
  // Mock goals for now
  const goals = [
    { text: "Establish all 5 daily prayers consistently.", completed: habits.some(h => h.title.includes("Prayer") && h.streak_days >= 7) },
    { text: "Read the entire Qur'an.", completed: false },
    { text: "Memorize the last 10 Surahs.", completed: false },
  ];

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg dark:bg-slate-800/50 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-600" />
          Personal Goals
        </CardTitle>
        <CardDescription>Your long-term spiritual aspirations.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {goals.map((goal, index) => (
            <li key={index} className="flex items-center gap-3">
              <CheckSquare className={`w-5 h-5 flex-shrink-0 ${goal.completed ? 'text-emerald-500' : 'text-gray-400'}`} />
              <span className={`${goal.completed ? 'line-through text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>
                {goal.text}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-gray-500 mt-4 text-center">Goal setting feature coming soon.</p>
      </CardContent>
    </Card>
  );
}
