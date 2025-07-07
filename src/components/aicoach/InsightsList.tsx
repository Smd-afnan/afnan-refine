"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface InsightsListProps {
  insights: { id: string; date: string; ago: string; report: { soul_reflection: string; inner_meaning: string; mujahadah: string; barakah_boost: string } }[];
  isLoading: boolean;
}

export default function InsightsList({ insights, isLoading }: InsightsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(3).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!insights || insights.length === 0) {
    return (
      <Card className="text-center py-12 bg-gray-50 dark:bg-slate-800/50 border-dashed">
        <CardHeader>
          <Lightbulb className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500" />
          <CardTitle className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-200">No Reports Yet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400">
            Request a Muraqqabah Report to get personalized daily guidance from your AI coach.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg dark:bg-slate-800/50 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Your Muraqqabah Reports</CardTitle>
        <CardDescription>Review the guidance provided by your AI coach.</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {insights.map((insight, index) => (
            <AccordionItem value={`item-${index}`} key={insight.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-4">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <div className="text-left">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">Report for {format(new Date(insight.date), 'MMMM d, yyyy')}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{insight.ago}</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="prose prose-sm dark:prose-invert max-w-none p-4 bg-gray-50 dark:bg-slate-900/50 rounded-md">
                <h4>📖 The Story of Your Day</h4>
                <p>{insight.report.soul_reflection}</p>
                <h4>💡 The Light Within the Pattern</h4>
                <p>{insight.report.inner_meaning}</p>
                <h4>🛠️ One Step Closer to Him</h4>
                <p>{insight.report.mujahadah}</p>
                <h4>✨ A Gift for Your Heart</h4>
                <p><em>{insight.report.barakah_boost}</em></p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
