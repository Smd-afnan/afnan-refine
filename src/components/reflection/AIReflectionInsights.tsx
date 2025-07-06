"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles } from 'lucide-react';
import type { ReflectionInsightReport } from '@/types';

interface AIReflectionInsightsProps {
  insights: (ReflectionInsightReport & { error?: string }) | null;
  isGenerating: boolean;
}

export default function AIReflectionInsights({ insights, isGenerating }: AIReflectionInsightsProps) {
  if (isGenerating) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48 rounded" />
          <Skeleton className="h-4 w-64 rounded mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-16 w-full rounded" />
          <Skeleton className="h-16 w-full rounded" />
          <Skeleton className="h-16 w-full rounded" />
        </CardContent>
      </Card>
    );
  }

  if (!insights) {
    return (
      <Card className="text-center py-12 bg-gray-50 dark:bg-slate-800/50 border-dashed">
        <CardHeader>
          <Sparkles className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500" />
          <CardTitle className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-200">AI-Powered Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400">
            Select reflections from the &quot;History&quot; tab and click &quot;Generate Insights&quot; to see what The Inner Guide has to say.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (insights.error) {
    return (
        <Card className="text-center py-12 bg-red-50 dark:bg-red-900/50 border-dashed border-red-300">
            <CardHeader>
                <Sparkles className="w-12 h-12 mx-auto text-red-400" />
                <CardTitle className="mt-4 text-xl font-semibold text-red-800 dark:text-red-200">Error</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-red-600 dark:text-red-300">{insights.error}</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-0 shadow-lg dark:from-indigo-900/30 dark:to-purple-900/30">
        <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800 dark:text-gray-200">
                <Sparkles className="w-6 h-6 text-purple-600" />
                Your Muraqqabah Report
            </CardTitle>
            <CardDescription>Guidance from your selected reflections.</CardDescription>
        </CardHeader>
      <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-4">
        <div>
            <h3 className="font-semibold text-lg">🧠 Soul Reflection</h3>
            <p>{insights.soul_reflection}</p>
        </div>
        <div>
            <h3 className="font-semibold text-lg">📖 Inner Meaning</h3>
            <p>{insights.inner_meaning}</p>
        </div>
        <div>
            <h3 className="font-semibold text-lg">🛠️ Today&apos;s Mujahadah</h3>
            <p>{insights.todays_mujahadah}</p>
        </div>
        <div>
            <h3 className="font-semibold text-lg">✨ Barakah Boost</h3>
            <p><em>{insights.barakah_boost}</em></p>
        </div>
      </CardContent>
    </Card>
  );
}
