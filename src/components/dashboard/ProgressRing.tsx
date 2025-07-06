"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Target } from "lucide-react";

interface ProgressRingProps {
  progress?: number;
  isLoading: boolean;
  totalHabits?: number;
  completedHabits?: number;
}

export default function ProgressRing({ progress = 0, isLoading, totalHabits = 0, completedHabits = 0 }: ProgressRingProps) {
  const safeProgress = Math.max(0, Math.min(100, Number(progress) || 0));
  
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (safeProgress / 100) * circumference;

  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md dark:bg-slate-800/50 dark:border-slate-700">
        <CardContent className="p-8 flex flex-col items-center">
          <Skeleton className="w-32 h-32 rounded-full mb-4" />
          <Skeleton className="h-6 w-24 rounded mb-2" />
          <Skeleton className="h-4 w-32 rounded" />
        </CardContent>
      </Card>
    );
  }

  const getMotivationalMessage = (prog: number) => {
    if (prog === 100) return { message: "Perfect! You're unstoppable!", emoji: "🔥" };
    if (prog >= 80) return { message: "Outstanding! Keep this energy!", emoji: "⭐" };
    if (prog >= 60) return { message: "Great momentum! Stay consistent!", emoji: "📈" };
    if (prog >= 40) return { message: "Good progress! Every step counts!", emoji: "💪" };
    if (prog >= 20) return { message: "Nice start! Build the rhythm!", emoji: "🌱" };
    return { message: "Ready to begin? Let's make it happen!", emoji: "🚀" };
  };

  const motivation = getMotivationalMessage(safeProgress);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all duration-300 group dark:bg-slate-800/50 dark:border-slate-700 dark:hover:bg-slate-800">
      <CardContent className="p-8 flex flex-col items-center">
        <div className="relative w-32 h-32 mb-4 group-hover:scale-105 transition-transform duration-300">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="50%" stopColor="#059669" />
                <stop offset="100%" stopColor="#065F46" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" stroke="hsl(var(--border))" strokeWidth="6" fill="transparent" />
            <circle cx="50" cy="50" r="45" stroke="url(#progressGradient)" strokeWidth="6" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="transition-all duration-1000 ease-out" style={{ filter: safeProgress > 0 ? 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.3))' : 'none' }} />
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1 dark:text-gray-100">{safeProgress}%</div>
              <div className="text-xs text-gray-500 font-medium dark:text-gray-400">Complete</div>
              {totalHabits > 0 && <div className="text-xs text-emerald-600 font-medium mt-1 dark:text-emerald-400">{completedHabits}/{totalHabits}</div>}
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Today's Progress</h3>
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-lg">{motivation.emoji}</span>
            <p className="text-sm text-gray-600 font-medium dark:text-gray-300">{motivation.message}</p>
          </div>
          {safeProgress > 0 && <p className="text-xs text-emerald-600 italic dark:text-emerald-500">"And Allah will reward the grateful." (3:144)</p>}
        </div>
      </CardContent>
    </Card>
  );
}
