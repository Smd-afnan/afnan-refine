"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import type { Habit, HabitLog } from '@/types';
import { format, subDays, eachDayOfInterval } from 'date-fns';

interface GrowthChartProps {
  habits: Habit[];
  recentLogs: HabitLog[];
}

export default function GrowthChart({ habits, recentLogs }: GrowthChartProps) {
  const last30Days = eachDayOfInterval({
    start: subDays(new Date(), 29),
    end: new Date()
  });

  const data = last30Days.map(day => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const logsForDay = recentLogs.filter(log => log.completion_date === dateStr && log.status === 'completed');
    return {
      name: format(day, 'MMM d'),
      completed: new Set(logsForDay.map(l => l.habit_id)).size,
    };
  });

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg dark:bg-slate-800/50 dark:border-slate-700">
      <CardHeader>
        <CardTitle>30-Day Growth</CardTitle>
        <CardDescription>Daily completed habits over the last month.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="completed" stroke="hsl(var(--primary))" strokeWidth={2} name="Completed Habits" dot={{ r: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
