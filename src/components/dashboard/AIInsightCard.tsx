"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Lightbulb, AlertTriangle, Sparkles, ArrowRight } from "lucide-react";
import { createPageUrl } from "@/lib/utils";
import type { AIInsight } from '@/types';

const insightIcons: Record<string, React.ElementType> = {
  daily_reflection: Lightbulb, pattern_analysis: Brain, encouragement: Sparkles, warning: AlertTriangle, celebration: Sparkles
};

const insightColors: Record<string, string> = {
  daily_reflection: "text-blue-600 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/50",
  pattern_analysis: "text-purple-600 bg-purple-100 dark:text-purple-300 dark:bg-purple-900/50", 
  encouragement: "text-green-600 bg-green-100 dark:text-green-300 dark:bg-green-900/50",
  warning: "text-orange-600 bg-orange-100 dark:text-orange-300 dark:bg-orange-900/50",
  celebration: "text-emerald-600 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/50"
};

const priorityColors: Record<string, string> = {
  low: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200",
  medium: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
  urgent: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
};

export default function AIInsightCard({ insights }: { insights: AIInsight[] }) {
  if (!insights || insights.length === 0) return null;

  const primaryInsight = insights[0];
  const IconComponent = insightIcons[primaryInsight.insight_type] || Brain;

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 dark:from-indigo-900/30 dark:to-purple-900/30 dark:border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-gray-100">
            <div className={`w-10 h-10 rounded-xl ${insightColors[primaryInsight.insight_type]} flex items-center justify-center`}>
              <IconComponent className="w-5 h-5" />
            </div>
            AI Guidance
          </CardTitle>
          <Badge variant="outline" className={priorityColors[primaryInsight.priority]}>{primaryInsight.priority}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg text-gray-900 mb-2 dark:text-gray-100">{primaryInsight.title}</h3>
          <p className="text-gray-700 leading-relaxed mb-3 dark:text-gray-300">{primaryInsight.message}</p>
          {primaryInsight.action_suggestion && (
            <div className="bg-white/70 rounded-lg p-3 border border-indigo-100 dark:bg-slate-800/50 dark:border-indigo-800">
              <p className="text-sm font-medium text-indigo-800 mb-1 dark:text-indigo-300">💡 Suggested Action:</p>
              <p className="text-sm text-indigo-700 dark:text-indigo-400">{primaryInsight.action_suggestion}</p>
            </div>
          )}
        </div>

        {insights.length > 1 && (
          <div>
            <p className="text-sm text-gray-600 mb-2 dark:text-gray-400">+ {insights.length - 1} more insight{insights.length > 2 ? 's' : ''} waiting</p>
          </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t border-indigo-100 dark:border-indigo-800">
          <p className="text-xs text-gray-500 dark:text-gray-400">Your AI Coach is analyzing your patterns</p>
          <Link href={createPageUrl("AICoach")}>
            <Button variant="outline" size="sm" className="dark:hover:bg-slate-700">
              View All Insights
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
