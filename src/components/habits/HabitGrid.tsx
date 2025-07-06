"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Flame, Star, Target, AlarmClock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Habit } from '@/types';

const categoryIcons: Record<string, string> = {
  worship: "🤲", health: "💪", learning: "📚", self_care: "✨", community: "🤝", personal: "🎯"
};

const categoryColors: Record<string, string> = {
  worship: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-800",
  health: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800",
  learning: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800",
  self_care: "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/50 dark:text-pink-300 dark:border-pink-800",
  community: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/50 dark:text-orange-300 dark:border-orange-800",
  personal: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
};

interface HabitGridProps {
  habits: Habit[];
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
  isLoading: boolean;
}

export default function HabitGrid({ habits, onEdit, onDelete, isLoading }: HabitGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(3).fill(0).map((_, i) => (
          <Card key={i} className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <CardHeader><Skeleton className="h-5 w-3/4 rounded" /></CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-1/2 rounded" />
              <Skeleton className="h-4 w-1/3 rounded" />
            </CardContent>
            <CardFooter><Skeleton className="h-8 w-24 rounded" /></CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed border-emerald-200 rounded-xl">
        <Target className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No habits found</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your filters or add a new habit.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {habits.map(habit => (
        <Card key={habit.id} className="flex flex-col bg-white/80 backdrop-blur-sm border-0 shadow-md hover:shadow-xl transition-shadow duration-300 dark:bg-slate-800/50 dark:border-slate-700">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="flex items-center gap-3 text-lg text-gray-900 dark:text-gray-100">
                <span className="text-3xl">{categoryIcons[habit.category] || "🎯"}</span>
                {habit.title}
              </CardTitle>
              <Badge variant={habit.is_active ? "default" : "secondary"} className={habit.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'}>
                {habit.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-grow space-y-4">
            <Badge variant="outline" className={categoryColors[habit.category]}>{habit.category.replace('_', ' ')}</Badge>
            <div className="flex justify-around text-center">
              <div>
                <Flame className="w-5 h-5 mx-auto text-orange-500" />
                <p className="font-bold text-lg">{habit.streak_days}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Streak</p>
              </div>
              <div>
                <Star className="w-5 h-5 mx-auto text-yellow-500" />
                <p className="font-bold text-lg">{habit.best_streak}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Best</p>
              </div>
            </div>
             {habit.reminder_time && (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-slate-700">
                    <AlarmClock className="w-4 h-4" />
                    <span>Reminder at {habit.reminder_time}</span>
                </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit(habit)}>
              <Pencil className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => onDelete(habit.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
