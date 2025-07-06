"use client";

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Habit } from '@/types';

const habitSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  category: z.enum(['worship', 'health', 'learning', 'self_care', 'community', 'personal']),
  is_active: z.boolean(),
  reminder_time: z.string().optional(),
});

type HabitFormData = z.infer<typeof habitSchema>;

interface HabitFormProps {
  habit: Habit | null;
  onSubmit: (data: HabitFormData) => void;
  onCancel: () => void;
}

export default function HabitForm({ habit, onSubmit, onCancel }: HabitFormProps) {
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      title: '',
      category: 'personal',
      is_active: true,
      reminder_time: '',
    }
  });

  useEffect(() => {
    if (habit) {
      reset(habit);
    } else {
      reset({
        title: '',
        category: 'personal',
        is_active: true,
        reminder_time: '',
      });
    }
  }, [habit, reset]);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg dark:bg-slate-800/50 dark:border-slate-700">
      <CardHeader>
        <CardTitle>{habit ? 'Edit Habit' : 'Create New Habit'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Habit Title</Label>
            <Input id="title" {...register('title')} />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <div>
                <Label>Category</Label>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="worship">Worship</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="learning">Learning</SelectItem>
                    <SelectItem value="self_care">Self Care</SelectItem>
                    <SelectItem value="community">Community</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />
          
          <div>
            <Label htmlFor="reminder_time">Reminder Time (optional)</Label>
            <Input id="reminder_time" type="time" {...register('reminder_time')} />
            {errors.reminder_time && <p className="text-red-500 text-sm mt-1">{errors.reminder_time.message}</p>}
          </div>

          <Controller
            name="is_active"
            control={control}
            render={({ field }) => (
              <div className="flex items-center space-x-2 pt-2">
                <Switch id="is_active" checked={field.value} onCheckedChange={field.onChange} />
                <Label htmlFor="is_active">Track this habit</Label>
              </div>
            )}
          />
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="submit">{habit ? 'Save Changes' : 'Create Habit'}</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
