
"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { Habit } from "@/types";
import { getHabits, createHabit, updateHabit, deleteHabit } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import HabitGrid from "@/components/habits/HabitGrid";
import HabitForm from "@/components/habits/HabitForm";
import HabitFilters from "@/components/habits/HabitFilters";
import HabitStats from "@/components/habits/HabitStats";
import { useAuth } from "@/context/AuthContext";

export default function HabitsPage() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [filteredHabits, setFilteredHabits] = useState<Habit[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadHabits = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await getHabits(user.uid);
      setHabits(data);
    } catch (error) {
      console.error("Error loading habits:", error);
      toast({ title: "Error", description: "Could not load habits.", variant: "destructive" });
    }
    setIsLoading(false);
  }, [user, toast]);

  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  const filterHabits = useCallback(() => {
    let currentHabits = habits;
    if (searchTerm) {
      currentHabits = currentHabits.filter(habit => 
        habit.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory !== "all") {
      currentHabits = currentHabits.filter(habit => habit.category === selectedCategory);
    }
    setFilteredHabits(currentHabits);
  }, [habits, searchTerm, selectedCategory]);

  useEffect(() => {
    filterHabits();
  }, [filterHabits]);

  const handleSubmit = async (habitData: Partial<Habit>) => {
    if (!user) return;
    try {
      if (editingHabit) {
        await updateHabit(editingHabit.id, habitData);
        toast({ title: "Success", description: "Habit updated." });
      } else {
        await createHabit(user.uid, habitData as Omit<Habit, 'id' | 'streak_days' | 'best_streak' | 'created_by'>);
        toast({ title: "Success", description: "Habit created." });
      }
      setShowForm(false);
      setEditingHabit(null);
      await loadHabits();
    } catch (error) {
      console.error("Error saving habit:", error);
      toast({ title: "Error", description: "Could not save habit.", variant: "destructive" });
    }
  };

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  const handleDelete = async (habitId: string) => {
    if (window.confirm("Are you sure you want to delete this habit? All its logs will be removed too.")) {
      try {
        await deleteHabit(habitId);
        toast({ title: "Success", description: "Habit deleted." });
        await loadHabits();
      } catch (error) {
        console.error("Error deleting habit:", error);
        toast({ title: "Error", description: "Could not delete habit.", variant: "destructive" });
      }
    }
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
            <Target className="w-8 h-8 text-emerald-600" />
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-800 to-emerald-600 dark:from-emerald-400 dark:to-emerald-600 bg-clip-text text-transparent font-headline">
              Your Habits
            </h1>
          </div>
          <p className="text-lg text-emerald-700 dark:text-emerald-300 font-medium">
            Build discipline through consistent, meaningful actions.
          </p>
        </div>
        <HabitStats habits={habits} />
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search habits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/80 backdrop-blur-sm border-0 shadow-md dark:bg-slate-800/50 dark:border-slate-700"
              />
            </div>
          </div>
          <div className="flex gap-3 w-full lg:w-auto">
            <HabitFilters 
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
            <Button 
              onClick={() => {
                setEditingHabit(null);
                setShowForm(true);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Habit
            </Button>
          </div>
        </div>
        {showForm && (
          <HabitForm
            habit={editingHabit}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingHabit(null);
            }}
          />
        )}
        <HabitGrid
          habits={filteredHabits}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
