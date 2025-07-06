"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, CheckCircle, Circle, Target, Plus, AlarmClock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { createPageUrl } from "@/lib/utils";
import type { Habit, HabitLog, DailyPrayerLog } from '@/types';
import { updateHabitLog, createHabitLog, updateHabit, getHabits, getHabitLogs, getDailyPrayerLogs, createDailyPrayerLog, updateDailyPrayerLog } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const categoryIcons: Record<string, string> = {
  worship: "🤲", health: "💪", learning: "📚", self_care: "✨", community: "🤝", personal: "🎯"
};

const categoryColors: Record<string, string> = {
  worship: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-800",
  health: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800",
  learning: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800",
  self_care: "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/50 dark:text-pink-300 dark:border-pink-800",
  community: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/50 dark:text-orange-300 dark:border-orange-800",
  personal: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
};

const prayerNames = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
type PrayerName = typeof prayerNames[number];

// Define Mosque icon as it's not in lucide-react
const Mosque = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12 1.5a1 1 0 00-1 1V4H6.78a2 2 0 00-1.9 1.38L2.1 13.1a1 1 0 000 .8l2.78 7.72A2 2 0 006.78 23h10.44a2 2 0 001.9-1.38l2.78-7.72a1 1 0 000-.8l-2.78-7.72A2 2 0 0017.22 4H13V2.5a1 1 0 00-1-1zm-3 5h6a1 1 0 011 1v1a1 1 0 01-1 1H9a1 1 0 01-1-1V7.5a1 1 0 011-1z" />
  </svg>
);


interface TodayHabitsProps {
    habits: Habit[];
    todayLogs: HabitLog[];
    onRefresh: () => void;
    isLoading: boolean;
}

export default function TodayHabits({ habits = [], todayLogs = [], onRefresh, isLoading: isHabitsLoading }: TodayHabitsProps) {
  const [updatingHabits, setUpdatingHabits] = useState(new Set());
  const [prayerLog, setPrayerLog] = useState<DailyPrayerLog | null>(null);
  const [isPrayerLoading, setIsPrayerLoading] = useState(true);
  const today = format(new Date(), 'yyyy-MM-dd');
  const { toast } = useToast();

  useEffect(() => {
    const fetchPrayers = async () => {
      setIsPrayerLoading(true);
      try {
        const logs = await getDailyPrayerLogs(today);
        if (logs.length > 0) {
          setPrayerLog(logs[0]);
        } else {
          const newLog = await createDailyPrayerLog({
            completion_date: today, fajr_completed: false, dhuhr_completed: false, asr_completed: false, maghrib_completed: false, isha_completed: false,
          });
          setPrayerLog(newLog);
        }
      } catch (error) {
        console.error("Error fetching or creating prayer log:", error);
        toast({ title: "Error", description: "Could not load prayer data.", variant: "destructive" });
      }
      setIsPrayerLoading(false);
    };
    fetchPrayers();
  }, [today, toast]);

  const handleTogglePrayer = async (prayerName: PrayerName) => {
    if (!prayerLog) return;
    
    const dbKey = `${prayerName.toLowerCase()}_completed` as keyof DailyPrayerLog;
    const currentStatus = prayerLog[dbKey];
    
    const updatedLog = await updateDailyPrayerLog(prayerLog.id, { [dbKey]: !currentStatus });
    setPrayerLog(updatedLog);

    const prayerHabit = habits.find(h => h.title === '5 Daily Prayers');
    if (prayerHabit) {
        const prayerStates = prayerNames.map(p => updatedLog[`${p.toLowerCase()}_completed` as keyof DailyPrayerLog]);
        const allComplete = prayerStates.every(Boolean);
        const prayerLogForHabit = todayLogs.find(l => l.habit_id === prayerHabit.id);

        if (allComplete && prayerLogForHabit?.status !== 'completed') {
             markHabitComplete(prayerHabit.id);
        }
    }

    toast({
        title: "Prayer status updated!",
        description: `You've marked ${prayerName} as ${!currentStatus ? 'completed' : 'pending'}.`
    });
    onRefresh();
  };


  const markHabitComplete = async (habitId: string) => {
    if (updatingHabits.has(habitId)) return;
    
    setUpdatingHabits(prev => new Set(prev).add(habitId));
    
    try {
      const allHabits = await getHabits();
      const allLogsToday = await getHabitLogs(today);
      const existingLog = allLogsToday.find(log => log.habit_id === habitId);
      const habit = allHabits.find(h => h.id === habitId);

      if (!habit) throw new Error("Habit not found");

      if (existingLog) {
        if (existingLog.status === 'completed') {
          await updateHabitLog(existingLog.id, { status: 'pending', completed_at: undefined });
          if (habit.streak_days > 0) {
            await updateHabit(habitId, { streak_days: Math.max(0, habit.streak_days - 1) });
          }
           toast({ title: "Habit undone.", description: `"${habit.title}" marked as pending.` });
        } else {
          await updateHabitLog(existingLog.id, { status: 'completed', completed_at: new Date().toISOString() });
          const newStreak = (habit.streak_days || 0) + 1;
          await updateHabit(habitId, { streak_days: newStreak, best_streak: Math.max(habit.best_streak || 0, newStreak) });
           toast({ title: "Masha'Allah!", description: `You completed "${habit.title}"!` });
        }
      } else {
        await createHabitLog({ habit_id: habitId, completion_date: today, status: 'completed', completed_at: new Date().toISOString() });
        const newStreak = (habit.streak_days || 0) + 1;
        await updateHabit(habitId, { streak_days: newStreak, best_streak: Math.max(habit.best_streak || 0, newStreak) });
         toast({ title: "Masha'Allah!", description: `You completed "${habit.title}"!` });
      }
      
      if (onRefresh) await onRefresh();
    } catch (error) {
      console.error("Error updating habit:", error);
      toast({ title: "Error", description: "Could not update habit status.", variant: "destructive" });
    } finally {
      setUpdatingHabits(prev => {
        const newSet = new Set(prev);
        newSet.delete(habitId);
        return newSet;
      });
    }
  };

  const getHabitStatus = (habitId: string) => {
    const log = todayLogs.find(log => log.habit_id === habitId);
    return log?.status || 'pending';
  };

  const isLoading = isHabitsLoading || isPrayerLoading;

  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md dark:bg-slate-800/50 dark:border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-48 rounded" />
            <Skeleton className="h-6 w-16 rounded" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <Skeleton className="h-4 w-32 rounded mb-2" />
                  <Skeleton className="h-3 w-20 rounded" />
                </div>
              </div>
              <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const activeHabits = habits.filter(h => h.is_active);
  const completedHabitIds = new Set(todayLogs.filter(log => log.status === 'completed').map(l => l.habit_id));
  const completedCount = activeHabits.filter(h => completedHabitIds.has(h.id)).length;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all duration-300 dark:bg-slate-800/50 dark:border-slate-700 dark:hover:bg-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-gray-100">
            <Target className="w-6 h-6 text-emerald-600 flex-shrink-0 dark:text-emerald-400" />
            <span className="truncate">Today's Focus</span>
          </CardTitle>
          <Badge variant="outline" className="text-emerald-700 border-emerald-200 flex-shrink-0 dark:text-emerald-300 dark:border-emerald-700">
            {completedCount}/{activeHabits.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {activeHabits.length === 0 ? (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">No habits set up yet</p>
              <Link href={createPageUrl("Habits")}>
                <Button variant="outline" className="hover:bg-emerald-50 dark:hover:bg-slate-700">
                  <Plus className="w-4 h-4 mr-2" /> Add Your First Habit
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {activeHabits.map((habit) => {
                if (habit.title === '5 Daily Prayers') {
                  const completedPrayers = prayerNames.filter(p => prayerLog?.[`${p.toLowerCase()}_completed` as keyof DailyPrayerLog]).length;
                  return (
                    <div key={habit.id} className="p-4 rounded-xl border bg-purple-50/30 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800">
                       <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                              <Mosque className="w-5 h-5 text-purple-700 dark:text-purple-300" />
                              <h4 className="font-semibold text-purple-800 dark:text-purple-200">{habit.title}</h4>
                          </div>
                          <Badge variant="outline" className="border-purple-200 bg-purple-100 text-purple-700 dark:bg-purple-800/50 dark:text-purple-200 dark:border-purple-700/50">{completedPrayers}/5</Badge>
                       </div>
                       <div className="flex justify-around items-center pt-2">
                         {prayerNames.map(prayer => {
                            const isCompleted = prayerLog ? !!prayerLog[`${prayer.toLowerCase()}_completed` as keyof DailyPrayerLog] : false;
                            return (
                                <div key={prayer} className="text-center flex flex-col items-center">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleTogglePrayer(prayer)}
                                      className={cn(
                                        "w-12 h-12 rounded-full transition-all duration-200",
                                        isCompleted
                                          ? "bg-purple-600 text-white hover:bg-purple-700 border-0"
                                          : "bg-gray-200 hover:bg-gray-300 dark:bg-slate-800 dark:hover:bg-slate-700 border border-gray-300 dark:border-slate-600"
                                      )}
                                    >
                                      {isCompleted ? <Check className="w-6 h-6" /> : null}
                                    </Button>
                                    <span className="text-xs font-medium text-purple-800 mt-2 block dark:text-purple-300">{prayer}</span>
                                </div>
                            )
                         })}
                       </div>
                    </div>
                  );
                }

                const status = getHabitStatus(habit.id);
                const isCompleted = status === 'completed';
                const isUpdating = updatingHabits.has(habit.id);
                
                return (
                  <div key={habit.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${isCompleted ? 'border-emerald-200 bg-emerald-50/50 dark:bg-emerald-900/30 dark:border-emerald-800' : 'border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30 dark:border-slate-700 dark:hover:border-emerald-700 dark:hover:bg-slate-700/50'}`}>
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={`text-2xl flex-shrink-0 ${isCompleted ? 'opacity-75' : ''}`}>{categoryIcons[habit.category] || "🎯"}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold truncate ${isCompleted ? 'text-emerald-800 line-through dark:text-emerald-400' : 'text-gray-900 dark:text-gray-100'}`}>{habit.title}</h4>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <Badge variant="outline" className={`${categoryColors[habit.category]} text-xs`}>{habit.category.replace('_', ' ')}</Badge>
                          {isCompleted && <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-300 text-xs dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-700">✓ Completed</Badge>}
                          {habit.streak_days > 0 && <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300 text-xs dark:bg-orange-900/50 dark:text-orange-300 dark:border-orange-700">🔥 {habit.streak_days} days</Badge>}
                          {habit.reminder_time && (
                            <Badge variant="outline" className="text-xs font-normal text-gray-600 border-gray-300 dark:text-gray-400 dark:border-gray-600">
                                <AlarmClock className="w-3 h-3 mr-1.5" />
                                {habit.reminder_time}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => markHabitComplete(habit.id)} disabled={isUpdating} className={`w-10 h-10 rounded-full flex-shrink-0 ${isCompleted ? 'hover:bg-emerald-200 dark:hover:bg-emerald-800' : 'hover:bg-emerald-100 dark:hover:bg-slate-700'} ${isUpdating ? 'animate-pulse' : ''}`}>
                      {isCompleted ? <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" /> : <Circle className="w-6 h-6 text-gray-400 dark:text-gray-500" />}
                    </Button>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
