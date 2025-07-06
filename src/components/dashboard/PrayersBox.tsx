"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Circle } from "lucide-react";
import type { DailyPrayerLog } from '@/types';
import { getDailyPrayerLogs, createDailyPrayerLog, updateDailyPrayerLog } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface PrayersBoxProps {
  onRefresh: () => void;
}

const prayerNames = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
type PrayerName = typeof prayerNames[number];

export default function PrayersBox({ onRefresh }: PrayersBoxProps) {
  const [prayerLog, setPrayerLog] = useState<DailyPrayerLog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    const fetchPrayers = async () => {
      setIsLoading(true);
      try {
        let logs = await getDailyPrayerLogs(today);
        if (logs.length > 0) {
          setPrayerLog(logs[0]);
        } else {
          const newLog = await createDailyPrayerLog({
            completion_date: today,
            fajr_completed: false,
            dhuhr_completed: false,
            asr_completed: false,
            maghrib_completed: false,
            isha_completed: false,
          });
          setPrayerLog(newLog);
        }
      } catch (error) {
        console.error("Error fetching or creating prayer log:", error);
        toast({ title: "Error", description: "Could not load prayer data.", variant: "destructive" });
      }
      setIsLoading(false);
    };
    fetchPrayers();
  }, [today, toast]);

  const handleTogglePrayer = async (prayerName: PrayerName) => {
    if (!prayerLog) return;
    
    const dbKey = `${prayerName.toLowerCase()}_completed` as keyof DailyPrayerLog;
    const currentStatus = prayerLog[dbKey];
    
    const updatedLog = await updateDailyPrayerLog(prayerLog.id, { [dbKey]: !currentStatus });
    setPrayerLog(updatedLog);

    toast({
        title: "Prayer status updated!",
        description: `You've marked ${prayerName} as ${!currentStatus ? 'completed' : 'pending'}.`
    });
    onRefresh();
  };

  if (isLoading) {
    return (
      <div className="p-4 rounded-xl border border-gray-100 dark:border-slate-700 space-y-2">
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="w-6 h-6 rounded-full" />
          </div>
        ))}
      </div>
    );
  }
  
  if (!prayerLog) {
      return <div className="p-4 text-center text-sm text-gray-500">Could not load prayer tracker.</div>
  }

  return (
    <div className="p-4 rounded-xl border border-gray-100 dark:border-slate-700 space-y-2 bg-gray-50/50 dark:bg-slate-800/20">
      {prayerNames.map(prayer => {
        const isCompleted = prayerLog[`${prayer.toLowerCase()}_completed` as keyof DailyPrayerLog];
        return (
          <div key={prayer} className="flex items-center justify-between text-sm">
            <span className="font-semibold text-gray-800 dark:text-gray-200">{prayer}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleTogglePrayer(prayer)}
              className="w-8 h-8 rounded-full"
            >
              {isCompleted ? (
                <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              )}
            </Button>
          </div>
        )
      })}
    </div>
  );
}
