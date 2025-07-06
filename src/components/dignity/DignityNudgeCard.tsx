"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Circle, Sparkles } from "lucide-react";
import type { DignityDare } from '@/types';
import { getDignityDare } from '@/lib/mockData';
import { cn } from '@/lib/utils';


interface DignityNudgeCardProps {
  userLevel: number;
  onDareCompleted: (dare: DignityDare) => void;
}

export default function DignityNudgeCard({ userLevel, onDareCompleted }: DignityNudgeCardProps) {
  const [dare, setDare] = useState<DignityDare | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const fetchDare = async () => {
      setIsLoading(true);
      const fetchedDare = await getDignityDare(userLevel);
      setDare(fetchedDare);
      setIsCompleted(false); // Reset completion state when dare changes
      setIsLoading(false);
    };
    fetchDare();
  }, [userLevel]);

  const handleComplete = () => {
    if (dare) {
      setIsCompleted(true);
      onDareCompleted(dare);
    }
  };

  if (isLoading) {
    return (
       <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md dark:bg-slate-800/50 dark:border-slate-700">
        <CardContent className="p-4 flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-2xl flex-shrink-0" />
          <div className="flex-grow space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
        </CardContent>
      </Card>
    );
  }

  if (!dare) {
    return (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md dark:bg-slate-800/50 dark:border-slate-700">
            <CardContent className="p-8 text-center text-gray-500">
                <Sparkles className="w-10 h-10 mx-auto text-amber-400 mb-4"/>
                <p className="font-medium">No new nudges right now.</p>
                <p className="text-sm">Check back tomorrow for a new spiritual dare!</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className={cn(
        "bg-white/80 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all duration-300 dark:bg-slate-800/50 dark:border-slate-700",
        isCompleted && "bg-emerald-50/50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800"
    )}>
      <CardContent className="p-4 flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/20">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <div className="flex-grow">
          <h3 className={cn(
              "font-semibold text-gray-900 dark:text-gray-100",
              isCompleted && "line-through text-gray-500 dark:text-gray-400"
          )}>{dare.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{dare.description}</p>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleComplete} 
          disabled={isCompleted}
          aria-label={isCompleted ? "Completed" : "Mark as complete"}
          className={cn(
            "w-10 h-10 rounded-full flex-shrink-0 transition-colors",
            isCompleted 
              ? 'bg-emerald-100' 
              : 'hover:bg-emerald-100 dark:hover:bg-slate-700'
          )}>
          {isCompleted ? <Check className="w-6 h-6 text-emerald-600 dark:text-emerald-400" /> : <Circle className="w-6 h-6 text-gray-400 dark:text-gray-500" />}
        </Button>
      </CardContent>
    </Card>
  );
}
