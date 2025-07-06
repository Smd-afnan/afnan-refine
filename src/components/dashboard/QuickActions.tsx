"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Brain, Target } from "lucide-react";
import { createPageUrl } from "@/lib/utils";

export default function QuickActions() {
  const actions = [
    { title: "Add New Habit", description: "Create a new discipline", icon: Plus, url: createPageUrl("Habits"), color: "bg-emerald-500 hover:bg-emerald-600" },
    { title: "Daily Reflection", description: "Journal your thoughts", icon: Calendar, url: createPageUrl("Reflection"), color: "bg-blue-500 hover:bg-blue-600" },
    { title: "AI Guidance", description: "Get personalized insights", icon: Brain, url: createPageUrl("AICoach"), color: "bg-purple-500 hover:bg-purple-600" }
  ];

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md dark:bg-slate-800/50 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-gray-100">
          <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <Button key={index} asChild variant="ghost" className="w-full justify-start p-4 h-auto hover:bg-gray-50 transition-all duration-200 dark:hover:bg-slate-700/50">
            <Link href={action.url}>
              <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center mr-3 flex-shrink-0`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900 dark:text-gray-100">{action.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
              </div>
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
