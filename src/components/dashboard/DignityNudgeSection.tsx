"use client";

import React from 'react';
import { Sparkles } from "lucide-react";
import DignityNudgeCard from "../dignity/DignityNudgeCard";

export default function DignityNudgeSection({ userLevel = 1 }: { userLevel: number }) {
  const handleDareCompleted = (completedDare: { id: string; text: string }) => {
    // In a real app, this would trigger achievements, update streaks, etc.
    console.log("Dare completed:", completedDare);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-amber-500" />
          <h2 className="text-xl font-bold text-gray-900 font-headline dark:text-gray-100">
            The Dignity Nudge Engine
          </h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Small spiritual dares that polish the soul
        </p>
      </div>
      
      <DignityNudgeCard 
        userLevel={userLevel}
        onDareCompleted={handleDareCompleted}
      />
    </div>
  );
}
