"use client";

import React, { useState, useEffect } from "react";
import type { DailyReflection, Habit, HabitLog, DailyPrayerLog } from "@/types";
import { getDailyReflections, createDailyReflection, updateDailyReflection, getHabits, getAllHabitLogs, getDailyPrayerLogs } from "@/lib/mockData";
import { generateMuraqqabahReport } from "@/ai/flows/generate-muraqqabah-report";
import { Button } from "@/components/ui/button";
import { Brain, Sparkles, RefreshCw, MessageCircle, TrendingUp } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

import InsightsList from "@/components/aicoach/InsightsList";
import PatternAnalysis from "@/components/aicoach/PatternAnalysis";
import CoachingChat from "@/components/aicoach/CoachingChat";
import WeeklyReport from "@/components/aicoach/WeeklyReport";

export default function AICoachPage() {
  const [insights, setInsights] = useState<any[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [recentLogs, setRecentLogs] = useState<HabitLog[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("insights");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadCoachData();
  }, []);

  const loadCoachData = async () => {
    setIsLoading(true);
    try {
      const [reflectionsData, habitsData, logsData] = await Promise.all([
        getDailyReflections(),
        getHabits(),
        getAllHabitLogs()
      ]);
      
      const formattedInsights = reflectionsData
        .filter(i => i.muraqqabah_report)
        .map(i => ({
          id: i.id,
          date: i.reflection_date,
          report: i.muraqqabah_report,
          ago: formatDistanceToNow(new Date(i.reflection_date), { addSuffix: true })
        }));
      
      setInsights(formattedInsights.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setHabits(habitsData);
      setRecentLogs(logsData);
    } catch (error) {
      console.error("Error loading coach data:", error);
      toast({ title: "Error", description: "Could not load coach data.", variant: "destructive" });
    }
    setIsLoading(false);
  };

  const generateDailyInsight = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    toast({ title: "Generating Report", description: "The Murabbi is analyzing your progress..." });
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const dayOfWeek = format(new Date(), 'eeee');
      
      let allReflections = await getDailyReflections();
      let todaysReflection = allReflections.find(r => r.reflection_date === today);

      if (!todaysReflection) {
        todaysReflection = await createDailyReflection({ reflection_date: today } as Omit<DailyReflection, 'id' | 'created_by'>);
      }

      const prayersToday = (await getDailyPrayerLogs(today))[0];
      const prayerStatus = prayersToday 
        ? { fajr: prayersToday.fajr_completed, dhuhr: prayersToday.dhuhr_completed, asr: prayersToday.asr_completed, maghrib: prayersToday.maghrib_completed, isha: prayersToday.isha_completed }
        : { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false };

      const activeHabits = habits.filter(h => h.is_active);

      const reportInput = {
        dayOfWeek,
        today,
        activeHabits: activeHabits.map(h => h.title).join(", ") || "None set.",
        todaysCompletions: recentLogs.filter(l => l.completion_date === today && l.status === 'completed').map(l => habits.find(h => h.id === l.habit_id)?.title).join(', ') || "None so far.",
        prayerStatus
      };
      
      const response = await generateMuraqqabahReport(reportInput);
      
      await updateDailyReflection(todaysReflection.id, {
        muraqqabah_report: response
      });

      toast({ title: "Report Ready!", description: "Your Muraqqabah Report for today is complete." });
      loadCoachData();
    } catch (error) {
      console.error("Error generating insight:", error);
      toast({ title: "Error", description: "Could not generate report.", variant: "destructive" });
    }
    setIsGenerating(false);
  };

  const tabs = [
    { id: "insights", label: "Muraqqabah Reports", icon: Sparkles },
    { id: "patterns", label: "Pattern Analysis", icon: TrendingUp },
    { id: "chat", label: "Coach Chat", icon: MessageCircle },
    { id: "report", label: "Weekly Summary", icon: Brain }
  ];

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
            <Brain className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-800 to-purple-600 bg-clip-text text-transparent font-headline">
              Murabbi Core
            </h1>
          </div>
          <p className="text-lg text-purple-700 font-medium mb-6">
            A mirror to your soul, powered by wisdom.
          </p>
          
          <Button 
            onClick={generateDailyInsight}
            disabled={isGenerating}
            className="bg-purple-600 hover:bg-purple-700 shadow-lg"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Your Progress...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Request Muraqqabah Report
              </>
            )}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-slate-700 pb-4">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "secondary" : "ghost"}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2"
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        <div className="min-h-[400px]">
          {activeTab === "insights" && <InsightsList insights={insights} isLoading={isLoading} />}
          {activeTab === "patterns" && <PatternAnalysis habits={habits} recentLogs={recentLogs} isLoading={isLoading} />}
          {activeTab === "chat" && <CoachingChat />}
          {activeTab === "report" && <WeeklyReport habits={habits} recentLogs={recentLogs} isLoading={isLoading} />}
        </div>
      </div>
    </div>
  );
}
