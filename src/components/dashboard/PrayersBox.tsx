"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Circle } from "lucide-react";
import type { PrayerTime } from '@/types';
import { getPrayerTimes } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

interface PrayersBoxProps {
  onRefresh: () => void;
}

export default function PrayersBox({ onRefresh }: PrayersBoxProps) {
  const [prayers, setPrayers] = useState<PrayerTime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPrayers = async () => {
      setIsLoading(true);
      const prayerData = await getPrayerTimes();
      setPrayers(prayerData);
      setIsLoading(false);
    };
    fetchPrayers();
  }, []);

  const handleTogglePrayer = (prayerName: string) => {
    setPrayers(prevPrayers =>
      prevPrayers.map(p =>
        p.name === prayerName ? { ...p, isCompleted: !p.isCompleted } : p
      )
    );
    // In a real app, you would also update the backend here.
    toast({
        title: "Prayer status updated!",
        description: `You've marked ${prayerName} as ${prayers.find(p=>p.name === prayerName)?.isCompleted ? 'pending' : 'completed'}.`
    });
    onRefresh();
  };

  if (isLoading) {
    return (
      <div className="p-4 rounded-xl border border-gray-100 dark:border-slate-700 space-y-2">
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="w-6 h-6 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl border border-gray-100 dark:border-slate-700 space-y-2 bg-gray-50/50 dark:bg-slate-800/20">
      {prayers.map(prayer => (
        <div key={prayer.name} className="flex items-center justify-between text-sm">
          <span className="font-semibold text-gray-800 dark:text-gray-200">{prayer.name}</span>
          <span className="text-gray-500 dark:text-gray-400">{prayer.time}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleTogglePrayer(prayer.name)}
            className="w-8 h-8 rounded-full"
          >
            {prayer.isCompleted ? (
              <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            )}
          </Button>
        </div>
      ))}
    </div>
  );
}
