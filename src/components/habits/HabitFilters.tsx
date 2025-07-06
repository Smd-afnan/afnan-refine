"use client";

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Habit } from '@/types';

const categories: Habit['category'][] = ['worship', 'health', 'learning', 'self_care', 'community', 'personal'];

interface HabitFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function HabitFilters({ selectedCategory, onCategoryChange }: HabitFiltersProps) {
  return (
    <Select value={selectedCategory} onValueChange={onCategoryChange}>
      <SelectTrigger className="w-full lg:w-[180px] bg-white/80 backdrop-blur-sm border-0 shadow-md dark:bg-slate-800/50 dark:border-slate-700">
        <SelectValue placeholder="Filter by category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Categories</SelectItem>
        {categories.map(category => (
          <SelectItem key={category} value={category} className="capitalize">
            {category.replace('_', ' ')}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
