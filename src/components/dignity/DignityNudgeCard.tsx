"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Gift, Heart, Smile } from "lucide-react";
import type { DignityDare } from '@/types';
import { getDignityDare } from '@/lib/mockData';

const dareIcons: Record<string, React.ElementType> = {
  connection: Smile,
  generosity: Gift,
  reflection: Heart,
  'self-discipline': Check
};

interface DignityNudgeCardProps {
  userLevel: number;
  onDareCompleted: (dare: DignityDare) => void;
}

export default function DignityNudgeCard({ userLevel, onDareCompleted }: DignityNudgeCardProps) {
  const [dare, setDare] = useState<DignityDare | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDare = async () => {
      setIsLoading(true);
      const fetchedDare = await getDignityDare(userLevel);
      setDare(fetchedDare);
      setIsLoading(false);
    };
    fetchDare();
  }, [userLevel]);

  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <Skeleton className="w-12 h-12 rounded-full mb-4" />
          <Skeleton className="h-5 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-10 w-32 mt-4" />
        </CardContent>
      </Card>
    );
  }

  if (!dare) {
    return null; // Or show a "no dares available" message
  }

  const DareIcon = dareIcons[dare.category] || Heart;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all duration-300 dark:bg-slate-800/50 dark:border-slate-700">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-4">
          <DareIcon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 dark:text-gray-100">{dare.title}</h3>
        <p className="text-sm text-gray-600 mb-4 dark:text-gray-400">{dare.description}</p>
        <Button onClick={() => onDareCompleted(dare)} className="bg-emerald-600 hover:bg-emerald-700">
          <Check className="w-4 h-4 mr-2" />
          I did it!
        </Button>
      </CardContent>
    </Card>
  );
}
