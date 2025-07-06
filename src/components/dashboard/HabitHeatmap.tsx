"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, TrendingUp, Flame } from "lucide-react";
import { getAllHabitLogs, getHabits } from "@/lib/mockData";
import { format, subDays, isToday, isYesterday } from "date-fns";
import type { Habit } from '@/types';

interface DayData {
    date: string;
    day: string;
    dayNum: string;
    completionRate: number;
    completedCount: number;
    totalHabits: number;
    isToday: boolean;
    isYesterday: boolean;
}

export default function HabitHeatmap({ habits: initialHabits = [] }: { habits: Habit[] }) {
  const [weekData, setWeekData] = useState<DayData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [habits, setHabits] = useState<Habit[]>(initialHabits);

  useEffect(() => {
    const fetchHabits = async () => {
      if (initialHabits.length === 0) {
        const fetchedHabits = await getHabits();
        setHabits(fetchedHabits);
      }
    };
    fetchHabits();
  }, [initialHabits]);

  useEffect(() => {
    if (habits.length > 0) {
      loadWeekData();
    } else {
      setWeekData([]);
      setIsLoading(false);
    }
  }, [habits]);

  const loadWeekData = async () => {
    setIsLoading(true);
    try {
      const days: DayData[] = [];
      const today = new Date();
      const activeHabits = habits.filter(h => h.is_active);
      const totalHabits = activeHabits.length;

      if (totalHabits === 0) {
        setWeekData([]);
        setIsLoading(false);
        return;
      }
      
      const allLogs = await getAllHabitLogs();
      
      for (let i = 6; i >= 0; i--) {
        const date = subDays(today, i);
        const dateStr = format(date, 'yyyy-MM-dd');
        
        const dayLogs = allLogs.filter(log => log.completion_date === dateStr && log.status === 'completed' && activeHabits.some(h => h.id === log.habit_id));
        const uniqueHabitsCompleted = new Set(dayLogs.map(log => log.habit_id)).size;
        const completionRate = Math.round((uniqueHabitsCompleted / totalHabits) * 100);
        
        days.push({
          date: dateStr, day: format(date, 'EEE'), dayNum: format(date, 'd'), completionRate, completedCount: uniqueHabitsCompleted, totalHabits, isToday: isToday(date), isYesterday: isYesterday(date)
        });
      }
      setWeekData(days);
    } catch (error) {
      console.error("Error loading week data:", error);
    }
    setIsLoading(false);
  };

  const getIntensityColor = (rate: number) => {
    if (rate >= 90) return 'bg-emerald-600 shadow-lg shadow-emerald-200 dark:shadow-emerald-900';
    if (rate >= 70) return 'bg-emerald-500 shadow-md shadow-emerald-200 dark:shadow-emerald-900';
    if (rate >= 50) return 'bg-emerald-400 shadow-sm shadow-emerald-200 dark:shadow-emerald-900';
    if (rate >= 30) return 'bg-emerald-300';
    if (rate > 0) return 'bg-emerald-200';
    return 'bg-gray-200 dark:bg-gray-700';
  };

  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md dark:bg-slate-800/50 dark:border-slate-700">
        <CardHeader><Skeleton className="h-5 w-36 rounded" /></CardHeader>
        <CardContent><div className="grid grid-cols-7 gap-2 mb-4">{Array(7).fill(0).map((_, i) => <div key={i} className="text-center"><Skeleton className="w-8 h-8 rounded-lg mx-auto mb-2" /><Skeleton className="h-3 w-8 rounded mx-auto" /></div>)}</div></CardContent>
      </Card>
    );
  }

  if (weekData.length === 0 || habits.filter(h => h.is_active).length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md dark:bg-slate-800/50 dark:border-slate-700">
        <CardHeader><CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-gray-100"><Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />7-Day Progress</CardTitle></CardHeader>
        <CardContent className="text-center py-8"><Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" /><p className="text-gray-500 dark:text-gray-400 text-sm">Set up habits to see your progress!</p></CardContent>
      </Card>
    );
  }

  const avgCompletionRate = weekData.reduce((sum, day) => sum + day.completionRate, 0) / 7;
  const streak = weekData.reduce((count, day, index) => {
      const isStreakDay = day.completionRate > 0;
      if (!isStreakDay) return 0;
      if (index === 0) return 1;
      const prevDay = weekData[index - 1];
      return prevDay.completionRate > 0 ? count + 1 : 1;
  }, 0);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all duration-300 dark:bg-slate-800/50 dark:border-slate-700 dark:hover:bg-slate-800">
      <CardHeader><CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-gray-100"><Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /><span className="truncate">7-Day Progress</span></CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekData.map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-xs text-gray-500 mb-1 font-medium dark:text-gray-400">{day.day}</div>
              <div className={`w-8 h-8 rounded-lg mx-auto transition-all duration-200 hover:scale-110 cursor-pointer ${getIntensityColor(day.completionRate)}`} title={`${day.day} ${day.dayNum}: ${day.completedCount}/${day.totalHabits} habits (${day.completionRate}%)`}>
                {day.completionRate === 100 && <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">✓</div>}
              </div>
              <div className="text-xs text-gray-600 mt-1 font-medium dark:text-gray-300">{day.isToday ? 'Today' : day.dayNum}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3 dark:text-gray-400"><span>Less</span><div className="flex gap-1"><div className="w-3 h-3 rounded bg-gray-200 dark:bg-gray-700"></div><div className="w-3 h-3 rounded bg-emerald-200 dark:bg-emerald-800"></div><div className="w-3 h-3 rounded bg-emerald-400 dark:bg-emerald-600"></div><div className="w-3 h-3 rounded bg-emerald-600 dark:bg-emerald-400"></div></div><span>More</span></div>
        {weekData.some(d => d.completionRate > 0) && (
          <div className="bg-emerald-50 rounded-lg p-3 space-y-2 dark:bg-emerald-900/30">
            <div className="flex items-center justify-between text-sm"><div className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /><span className="font-medium text-emerald-800 dark:text-emerald-200">Weekly Average:</span></div><span className="font-bold text-emerald-700 dark:text-emerald-300">{Math.round(avgCompletionRate)}%</span></div>
            {streak > 0 && <div className="flex items-center justify-between text-sm"><div className="flex items-center gap-2"><Flame className="w-4 h-4 text-orange-500" /><span className="font-medium text-emerald-800 dark:text-emerald-200">Current Streak:</span></div><span className="font-bold text-orange-600 dark:text-orange-400">{streak} {streak > 1 ? "days" : "day"}</span></div>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
