
"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { Habit, HabitLog } from "@/types";
import { getHabits, getAllHabitLogs } from "@/lib/mockData";
import GlowUpTracker from "@/components/glowup/GlowUpTracker";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";

export default function GlowUpPage() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [recentLogs, setRecentLogs] = useState<HabitLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [habitsData, logsData] = await Promise.all([
        getHabits(user.uid),
        getAllHabitLogs(user.uid),
      ]);
      setHabits(habitsData);
      setRecentLogs(logsData);
    } catch (error) {
      console.error("Error loading data for Glow-Up page:", error);
      toast({
        title: "Error",
        description: "Could not load data for this page.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }, [user, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Star className="w-8 h-8 text-amber-500" />
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-amber-700 to-amber-500 dark:from-amber-400 dark:to-amber-600 bg-clip-text text-transparent font-headline">
              Glow-Up Path
            </h1>
          </div>
          <p className="text-lg text-amber-800 dark:text-amber-200 font-medium max-w-2xl mx-auto mb-8">
            This is your path of Tazkiyah (purification of the self). Each level unlocks a new dimension of your character, bringing you closer to the best version of yourself, for the sake of Allah.
          </p>
        </div>
        
        <div>
          {isLoading ? (
            <Skeleton className="h-96 w-full rounded-xl bg-gray-200 dark:bg-slate-700" />
          ) : (
            <GlowUpTracker habits={habits} recentLogs={recentLogs} />
          )}
        </div>
      </div>
    </div>
 );
}
