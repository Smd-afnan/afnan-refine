"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, Lock, CheckCircle } from 'lucide-react';
import type { Habit, HabitLog } from '@/types';

interface GlowUpTrackerProps {
  habits: Habit[];
  recentLogs: HabitLog[];
}

const levels = [
  { level: 1, name: "The Awakened Heart", goal: "Establish a baseline of daily worship and self-awareness.", points: 100 },
  { level: 2, name: "The Disciplined Nafs", goal: "Build consistency in core habits and introduce new challenges.", points: 250 },
  { level: 3, name: "The Polished Character", goal: "Focus on community, generosity, and refining interactions.", points: 500 },
  { level: 4, name: "The Reflective Soul", goal: "Deepen your connection through regular reflection and night prayer.", points: 1000 },
  { level: 5, name: "The Garden of Gnosis", goal: "Experience the sweetness of faith through advanced spiritual practices.", points: 2000 },
];

export default function GlowUpTracker({ habits, recentLogs }: GlowUpTrackerProps) {

  const calculatePoints = () => {
    let points = 0;
    // 1 point for each completed log
    points += recentLogs.filter(log => log.status === 'completed').length;
    // 5 points for each day of streak
    points += habits.reduce((acc, habit) => acc + (habit.streak_days || 0), 0) * 5;
    // 10 points for each habit with a best streak over 21
    points += habits.filter(h => (h.best_streak || 0) > 21).length * 10;
    return points;
  };
  
  const userPoints = calculatePoints();
  const currentLevelIndex = levels.findIndex(level => userPoints < level.points);
  const currentLevel = currentLevelIndex === -1 ? levels[levels.length - 1] : levels[Math.max(0, currentLevelIndex - 1)];
  const nextLevel = currentLevelIndex !== -1 ? levels[currentLevelIndex] : null;

  const getLevelProgress = () => {
    if (!nextLevel) return 100;
    const pointsInLevel = nextLevel.points - (currentLevel.points);
    const userPointsInLevel = userPoints - (currentLevel.points);
    return Math.round((userPointsInLevel / pointsInLevel) * 100);
  };

  return (
    <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-xl dark:bg-slate-800/70 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Your Current Level: {currentLevel.name}
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          You have earned {userPoints} points on your journey.
        </CardDescription>
        {nextLevel && (
            <div className="pt-4">
                <div className="flex justify-between items-center mb-1 text-sm font-medium">
                    <span className="text-gray-700 dark:text-gray-300">Progress to Level {nextLevel.level}</span>
                    <span className="text-amber-600 dark:text-amber-400">{getLevelProgress()}%</span>
                </div>
                <Progress value={getLevelProgress()} className="[&>*]:bg-gradient-to-r [&>*]:from-amber-400 [&>*]:to-amber-600" />
                 <p className="text-xs text-gray-500 mt-2">Next up: {nextLevel.name}</p>
            </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {levels.map((level, index) => {
            const isUnlocked = userPoints >= (level.points - level.points / 4) || index < currentLevelIndex;
            const isCompleted = userPoints >= level.points;

            return (
              <div key={level.level} className={`p-4 rounded-lg flex items-start gap-4 transition-all duration-300 ${isCompleted ? 'bg-emerald-50 dark:bg-emerald-900/50 border-l-4 border-emerald-500' : isUnlocked ? 'bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-500' : 'bg-gray-100 dark:bg-slate-900/50 opacity-70'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isCompleted ? 'bg-emerald-500' : isUnlocked ? 'bg-amber-500' : 'bg-gray-400'}`}>
                  {isCompleted ? <CheckCircle className="w-6 h-6 text-white" /> : isUnlocked ? <Star className="w-6 h-6 text-white" /> : <Lock className="w-6 h-6 text-white" />}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">{level.level}. {level.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{level.goal}</p>
                   <p className="text-xs font-bold text-gray-500 dark:text-gray-300 mt-1">{level.points} Points</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
