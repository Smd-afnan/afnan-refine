"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { DailyReflection } from '@/types';
import { format } from 'date-fns';
import { Skeleton } from '../ui/skeleton';

interface MoodTrackerProps {
  reflections: DailyReflection[];
  isLoading: boolean;
}

export default function MoodTracker({ reflections, isLoading }: MoodTrackerProps) {
  if (isLoading) {
    return (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg dark:bg-slate-800/50 dark:border-slate-700">
            <CardHeader>
                <Skeleton className="h-6 w-48 rounded" />
                <Skeleton className="h-4 w-64 rounded mt-2" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-64 w-full rounded-lg" />
            </CardContent>
        </Card>
    );
  }

  const data = reflections
    .slice()
    .reverse()
    .map(r => ({
      name: format(new Date(r.reflection_date), 'MMM d'),
      Morning: r.mood_morning,
      Evening: r.mood_evening,
      Spiritual: r.spiritual_connection,
    }));

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg dark:bg-slate-800/50 dark:border-slate-700">
      <CardHeader>
        <CardTitle>Mood & Spiritual Connection Tracker</CardTitle>
        <CardDescription>Your emotional and spiritual state over time (rated 1-5).</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 5]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="Morning" stroke="#8884d8" name="Morning Mood" />
              <Line type="monotone" dataKey="Evening" stroke="#82ca9d" name="Evening Mood" />
              <Line type="monotone" dataKey="Spiritual" stroke="#ffc658" name="Spiritual Connection" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
