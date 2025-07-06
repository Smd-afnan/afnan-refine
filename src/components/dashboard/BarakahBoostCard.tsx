"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import type { IslamicWisdom } from '@/types';

interface BarakahBoostCardProps {
  trigger: boolean;
  wisdomPool: IslamicWisdom[];
}

export default function BarakahBoostCard({ trigger, wisdomPool }: BarakahBoostCardProps) {
  const [wisdom, setWisdom] = useState<IslamicWisdom | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger) {
      fetchWisdom();
    }
  }, [trigger, fetchWisdom]);

  const fetchWisdom = () => {
    try {
      if (wisdomPool.length > 0) {
        const randomWisdom = wisdomPool[Math.floor(Math.random() * wisdomPool.length)];
        setWisdom(randomWisdom);
        setShow(true);
        
        setTimeout(() => setShow(false), 8000);
      }
    } catch (error) {
      console.error("Error fetching wisdom:", error);
    }
  };

  if (!show || !wisdom) {
    return null;
  }

  return (
    <div className="my-6 animate-fade-in-up">
      <Card className="bg-gradient-to-tr from-amber-400 to-amber-600 text-white border-0 shadow-2xl shadow-amber-200 dark:shadow-amber-900/50">
        <CardContent className="p-6 text-center">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Star className="w-6 h-6 text-amber-200" />
            <h3 className="text-xl font-bold font-headline">Barakah Boost!</h3>
            <Star className="w-6 h-6 text-amber-200" />
          </div>
          <p className="text-lg italic text-amber-50 mb-3 leading-relaxed">&quot;{wisdom.content}&quot;</p>
          <p className="font-semibold text-sm text-amber-200">- {wisdom.source}</p>
        </CardContent>
      </Card>
    </div>
  );
}
