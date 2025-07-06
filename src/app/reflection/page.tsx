"use client";

import React, { useState, useEffect, useMemo } from "react";
import type { DailyReflection, Habit } from "@/types";
import { getDailyReflections, createDailyReflection, updateDailyReflection, deleteDailyReflection, getHabits } from "@/lib/mockData";
import { generateReflectionInsights } from "@/ai/flows/generate-reflection-insights";
import { Button } from "@/components/ui/button";
import { Calendar, Heart, Brain, Star, Sparkles, Save } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

import ReflectionForm from "@/components/reflection/ReflectionForm";
import ReflectionHistory from "@/components/reflection/ReflectionHistory";
import MoodTracker from "@/components/reflection/MoodTracker";
import AIReflectionInsights from "@/components/reflection/AIReflectionInsights";

export default function ReflectionPage() {
  const [reflections, setReflections] = useState<DailyReflection[]>([]);
  const [selectedReflections, setSelectedReflections] = useState<Record<string, boolean>>({});
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("today");
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const { toast } = useToast();

  const today = format(new Date(), 'yyyy-MM-dd');

  const todayReflection = useMemo(() => {
    const found = reflections.find(r => r.reflection_date === today);
    if (found) return found;
    // Prepare a new unsaved reflection object for today
    return { id: '', reflection_date: today, created_by: 'user-123' };
  }, [reflections, today]);

  useEffect(() => {
    loadReflectionData();
  }, []);

  const loadReflectionData = async () => {
    setIsLoading(true);
    try {
      const [reflectionsData, habitsData] = await Promise.all([
        getDailyReflections(),
        getHabits()
      ]);
      
      setReflections(reflectionsData);
      setHabits(habitsData);
      
    } catch (error) {
      console.error("Error loading reflection data:", error);
      toast({ title: "Error", description: "Could not load reflection data.", variant: "destructive" });
    }
    setIsLoading(false);
  };

  const handleSaveReflection = async (reflectionData: Partial<DailyReflection>) => {
    try {
      if (todayReflection && todayReflection.id) {
        await updateDailyReflection(todayReflection.id, reflectionData);
        toast({ title: "Success", description: "Reflection updated." });
      } else {
        await createDailyReflection({
          ...reflectionData,
          reflection_date: today
        } as Omit<DailyReflection, 'id' | 'created_by'>);
        toast({ title: "Success", description: "Reflection saved." });
      }
      await loadReflectionData();
    } catch (error) {
      console.error("Error saving reflection:", error);
      toast({ title: "Error", description: "Could not save reflection.", variant: "destructive" });
    }
  };

  const handleDeleteReflection = async (reflectionId: string) => {
    if (window.confirm("Are you sure you want to delete this reflection? This action cannot be undone.")) {
      try {
        await deleteDailyReflection(reflectionId);
        toast({ title: "Success", description: "Reflection deleted." });
        await loadReflectionData();
      } catch (error) {
        console.error("Error deleting reflection:", error);
        toast({ title: "Error", description: "Could not delete reflection.", variant: "destructive" });
      }
    }
  };

  const handleToggleReflectionSelection = (reflectionId: string) => {
    setSelectedReflections(prev => ({
      ...prev,
      [reflectionId]: !prev[reflectionId]
    }));
  };

  const generateAIInsightsForSelection = async () => {
    setIsGeneratingInsights(true);
    setAiInsights(null);
    
    const selectedIds = Object.keys(selectedReflections).filter(id => selectedReflections[id]);
    
    if (selectedIds.length === 0) {
      toast({ title: "No Selection", description: "Please select at least one reflection to generate insights.", variant: "destructive" });
      setIsGeneratingInsights(false);
      return;
    }

    try {
      const reflectionsToAnalyze = reflections
        .filter(r => selectedIds.includes(r.id))
        .map(r => ({
            date: r.reflection_date,
            gratitude: r.gratitude_entry,
            challenges: r.challenges_faced,
            lessons: r.lessons_learned,
            mood_morning: r.mood_morning,
            mood_evening: r.mood_evening,
            spiritual_connection: r.spiritual_connection,
        }));

      const response = await generateReflectionInsights({ reflections: reflectionsToAnalyze });
      setAiInsights(response);
      setActiveTab("insights");
    } catch (error) {
      console.error("Error generating AI insights:", error);
      setAiInsights({ error: "Sorry, I couldn't generate insights at this moment. Please try again later." });
    }
    setIsGeneratingInsights(false);
  };

  const tabs = [
    { id: "today", label: "Today's Reflection", icon: Calendar },
    { id: "history", label: "Reflection History", icon: Brain },
    { id: "insights", label: "AI Insights", icon: Sparkles },
    { id: "mood", label: "Mood Tracking", icon: Heart }
  ];

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
            <Calendar className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 dark:from-blue-500 dark:to-blue-700 bg-clip-text text-transparent font-headline">
              Daily Reflection
            </h1>
          </div>
          <p className="text-lg text-blue-700 dark:text-blue-300 font-medium">
            Connect with your inner self and track your spiritual journey.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 ${
                activeTab === tab.id 
                  ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600" 
                  : "hover:bg-blue-50 dark:hover:bg-slate-700"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        <div className="min-h-[400px]">
          {activeTab === "today" && (
            <ReflectionForm 
              reflection={todayReflection} 
              onSave={handleSaveReflection} 
              isLoading={isLoading}
            />
          )}
          {activeTab === "history" && (
            <ReflectionHistory 
              reflections={reflections}
              selectedReflections={selectedReflections}
              onToggleSelection={handleToggleReflectionSelection}
              onDelete={handleDeleteReflection}
              onGenerateInsights={generateAIInsightsForSelection}
              isGenerating={isGeneratingInsights}
              isLoading={isLoading}
            />
          )}
          {activeTab === "insights" && (
            <AIReflectionInsights
              insights={aiInsights}
              isGenerating={isGeneratingInsights}
            />
          )}
          {activeTab === "mood" && (
            <MoodTracker 
              reflections={reflections} 
              isLoading={isLoading} 
            />
          )}
        </div>
      </div>
    </div>
  );
}
