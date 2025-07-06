"use client";

import React, { useState, useEffect } from "react";
import type { User, Habit, HabitLog, DailyReflection } from "@/types";
import { getMockUser, updateMockUser, getHabits, getAllHabitLogs, getDailyReflections } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User as UserIcon, Edit, Save } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

import ProfileStats from "@/components/profile/ProfileStats";
import AchievementsBadges from "@/components/profile/AchievementsBadges";
import GrowthChart from "@/components/profile/GrowthChart";
import PersonalGoals from "@/components/profile/PersonalGoals";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [recentLogs, setRecentLogs] = useState<HabitLog[]>([]);
  const [reflections, setReflections] = useState<DailyReflection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<User>>({});
  const { toast } = useToast();

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setIsLoading(true);
    try {
      const [userData, habitsData, logsData, reflectionsData] = await Promise.all([
        getMockUser(),
        getHabits(),
        getAllHabitLogs(),
        getDailyReflections()
      ]);
      
      setUser(userData);
      setHabits(habitsData);
      setRecentLogs(logsData);
      setReflections(reflectionsData);
      setEditData(userData || {});
    } catch (error) {
      console.error("Error loading profile data:", error);
      toast({ title: "Error", description: "Failed to load profile data.", variant: "destructive" });
    }
    setIsLoading(false);
  };

  const handleSaveProfile = async () => {
    try {
      const updatedUser = await updateMockUser(editData);
      setUser(updatedUser);
      setIsEditing(false);
      toast({ title: "Success", description: "Profile updated successfully." });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
    }
  };

  const calculateStats = () => {
    if (!habits) return { totalHabits: 0, activeHabits: 0, completionRate: 0, totalStreak: 0, reflectionDays: 0 };

    const totalHabits = habits.length;
    const activeHabits = habits.filter(h => h.is_active).length;
    
    const activeHabitIds = habits.filter(h => h.is_active).map(h => h.id);
    const relevantLogs = recentLogs.filter(log => activeHabitIds.includes(log.habit_id));
    const completedLogs = relevantLogs.filter(log => log.status === 'completed').length;
    
    const uniqueLogDays = new Set(relevantLogs.map(log => log.completion_date)).size;

    const completionRate = uniqueLogDays > 0 ? Math.round((completedLogs / (activeHabits * uniqueLogDays)) * 100) : 0;
    
    let totalStreak = 0;
    habits.forEach(habit => {
      totalStreak += habit.streak_days || 0;
    });
    
    const reflectionDays = reflections.length;
    
    return {
      totalHabits,
      activeHabits,
      completionRate: isNaN(completionRate) ? 0 : completionRate,
      totalStreak,
      reflectionDays
    };
  };

  const stats = isLoading ? {} : calculateStats();

  if (isLoading) {
    return (
      <div className="p-4 lg:p-8">
        <div className="space-y-8 max-w-6xl mx-auto">
          <Skeleton className="h-12 bg-gray-200 dark:bg-slate-700 rounded w-64" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-6">
              <Skeleton className="h-64 bg-gray-200 dark:bg-slate-700 rounded-lg" />
              <Skeleton className="h-48 bg-gray-200 dark:bg-slate-700 rounded-lg" />
            </div>
            <div className="lg:col-span-2 space-y-6">
               <Skeleton className="h-80 bg-gray-200 dark:bg-slate-700 rounded-lg" />
               <Skeleton className="h-64 bg-gray-200 dark:bg-slate-700 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <div className="p-8 text-center">Could not load user profile.</div>
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
            <UserIcon className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-800 to-purple-600 bg-clip-text text-transparent font-headline">
              Your Profile
            </h1>
          </div>
          <p className="text-lg text-purple-700 font-medium">
            Track your growth journey and celebrate your achievements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg dark:bg-slate-800/50 dark:border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-purple-600" />
                    Profile Info
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                  >
                    {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">
                      {user?.full_name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  {isEditing ? (
                    <div className="space-y-4 text-left">
                       <div>
                         <Label htmlFor="fullName">Full Name</Label>
                         <Input 
                           id="fullName" 
                           value={editData.full_name || ''} 
                           onChange={(e) => setEditData({...editData, full_name: e.target.value})}
                         />
                       </div>
                       <div>
                         <Label htmlFor="email">Email</Label>
                         <Input id="email" value={user.email} disabled />
                       </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.full_name}</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <ProfileStats stats={stats} />
            
            <AchievementsBadges 
              habits={habits}
              recentLogs={recentLogs}
              reflections={reflections}
            />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <GrowthChart 
              habits={habits}
              recentLogs={recentLogs}
            />
            
            <PersonalGoals 
              user={user}
              habits={habits}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
