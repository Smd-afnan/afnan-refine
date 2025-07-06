"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Habit, HabitLog } from '@/types';
import { format, subDays, eachDayOfInterval } from 'date-fns';

interface PatternAnalysisProps {
  habits: Habit[];
  recentLogs: HabitLog[];
  isLoading: boolean;
}

export default function PatternAnalysis({ habits, recentLogs, isLoading }: PatternAnalysisProps) {
  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg dark:bg-slate-800/50 dark:border-slate-700">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date()
  });

  const data = last7Days.map(day => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const logsForDay = recentLogs.filter(log => log.completion_date === dateStr && log.status === 'completed');
    const completedCount = new Set(logsForDay.map(l => l.habit_id)).size;
    const activeHabitCount = habits.filter(h => h.is_active).length;
    
    return {
      name: format(day, 'EEE'),
      completed: completedCount,
      total: activeHabitCount,
      rate: activeHabitCount > 0 ? (completedCount / activeHabitCount) * 100 : 0,
    };
  });

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg dark:bg-slate-800/50 dark:border-slate-700">
      <CardHeader>
        <CardTitle>Habit Completion Patterns</CardTitle>
        <CardDescription>Your consistency over the last 7 days.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                }}
              />
              <Legend />
              <Bar dataKey="completed" fill="hsl(var(--primary))" name="Completed Habits" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
