"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Brain } from 'lucide-react';

interface WeeklyReportProps {
    habits: any[];
    recentLogs: any[];
    isLoading: boolean;
}

export default function WeeklyReport({ habits, recentLogs, isLoading }: WeeklyReportProps) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg dark:bg-slate-800/50 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <Brain className="w-5 h-5 text-purple-600"/>
            Weekly Summary
        </CardTitle>
        <CardDescription>A summary of your weekly performance and insights.</CardDescription>
      </CardHeader>
      <CardContent className="text-center text-gray-500 dark:text-gray-400 py-16">
        <p>Weekly Summary feature is coming soon.</p>
        <p className="text-sm">This section will provide a consolidated report of your progress and AI insights at the end of each week.</p>
      </CardContent>
    </Card>
  );
}
