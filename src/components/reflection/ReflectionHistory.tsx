"use client";

import React from 'react';
import type { DailyReflection } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Sparkles, Brain } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { Skeleton } from '../ui/skeleton';

interface ReflectionHistoryProps {
  reflections: DailyReflection[];
  selectedReflections: Record<string, boolean>;
  onToggleSelection: (id: string) => void;
  onDelete: (id: string) => void;
  onGenerateInsights: () => void;
  isGenerating: boolean;
  isLoading: boolean;
}

export default function ReflectionHistory({
  reflections,
  selectedReflections,
  onToggleSelection,
  onDelete,
  onGenerateInsights,
  isGenerating,
  isLoading
}: ReflectionHistoryProps) {

  const selectedCount = Object.values(selectedReflections).filter(Boolean).length;

  if (isLoading) {
    return (
        <Card>
            <CardHeader><Skeleton className="h-8 w-64 rounded"/></CardHeader>
            <CardContent className="space-y-3">
                <Skeleton className="h-12 w-full rounded"/>
                <Skeleton className="h-12 w-full rounded"/>
                <Skeleton className="h-12 w-full rounded"/>
                <Skeleton className="h-12 w-full rounded"/>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg dark:bg-slate-800/50 dark:border-slate-700">
      <CardHeader>
        <CardTitle>Reflection History</CardTitle>
        <CardDescription>
          Select reflections to generate AI-powered insights, or review your past entries.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {reflections.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-blue-200 rounded-xl">
                <Brain className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No reflections yet</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Your past reflections will appear here.</p>
            </div>
        ) : (
            <ScrollArea className="h-96 pr-4">
            <div className="space-y-3">
              {reflections.map((reflection) => (
                <div key={reflection.id} className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50">
                  <Checkbox
                    id={`select-${reflection.id}`}
                    checked={!!selectedReflections[reflection.id]}
                    onCheckedChange={() => onToggleSelection(reflection.id)}
                  />
                  <label htmlFor={`select-${reflection.id}`} className="flex-grow cursor-pointer">
                    <p className="font-semibold">{format(new Date(reflection.reflection_date), 'MMMM d, yyyy')}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {reflection.gratitude_entry?.substring(0, 50) || 'No entry.'}...
                    </p>
                  </label>
                  <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
                    {formatDistanceToNow(new Date(reflection.reflection_date), { addSuffix: true })}
                  </span>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(reflection.id)} className="text-red-500 hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
      {reflections.length > 0 && (
         <CardFooter className="flex justify-end">
            <Button onClick={onGenerateInsights} disabled={isGenerating || selectedCount === 0} className="bg-purple-600 hover:bg-purple-700">
              <Sparkles className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Generating...' : `Generate Insights on ${selectedCount} day(s)`}
            </Button>
        </CardFooter>
      )}
    </Card>
  );
}
