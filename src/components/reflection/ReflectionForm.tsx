"use client";

import React, { useState, useEffect } from 'react';
import type { DailyReflection } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Save, CheckCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ReflectionFormProps {
  reflection: Partial<DailyReflection> | null;
  onSave: (data: Partial<DailyReflection>) => void;
  isLoading: boolean;
}

export default function ReflectionForm({ reflection, onSave, isLoading }: ReflectionFormProps) {
  const [formData, setFormData] = useState<Partial<DailyReflection>>({});
  
  useEffect(() => {
    setFormData(reflection || {});
  }, [reflection]);

  const handleSave = () => {
    onSave(formData);
  };

  if (isLoading || !reflection) {
    return (
        <Card>
            <CardHeader><Skeleton className="h-8 w-48 rounded"/></CardHeader>
            <CardContent className="space-y-6">
                <Skeleton className="h-24 w-full rounded"/>
                <Skeleton className="h-24 w-full rounded"/>
                <Skeleton className="h-24 w-full rounded"/>
            </CardContent>
            <CardFooter><Skeleton className="h-10 w-24 rounded"/></CardFooter>
        </Card>
    );
  }

  const isSaved = !!reflection.id;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg dark:bg-slate-800/50 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
            <span>Today's Reflection</span>
            {isSaved && <span className="text-sm font-medium flex items-center gap-1 text-emerald-600"><CheckCircle className="w-4 h-4"/> Saved</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="gratitude" className="text-lg font-semibold text-gray-700 dark:text-gray-300">What are you grateful for today?</Label>
          <Textarea
            id="gratitude"
            placeholder="Alhamdulillah for..."
            value={formData.gratitude_entry || ''}
            onChange={(e) => setFormData({ ...formData, gratitude_entry: e.target.value })}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="challenges" className="text-lg font-semibold text-gray-700 dark:text-gray-300">What challenges did you face?</Label>
          <Textarea
            id="challenges"
            placeholder="I struggled with..."
            value={formData.challenges_faced || ''}
            onChange={(e) => setFormData({ ...formData, challenges_faced: e.target.value })}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="lessons" className="text-lg font-semibold text-gray-700 dark:text-gray-300">What lessons did you learn?</Label>
          <Textarea
            id="lessons"
            placeholder="I learned that..."
            value={formData.lessons_learned || ''}
            onChange={(e) => setFormData({ ...formData, lessons_learned: e.target.value })}
            className="mt-2"
          />
        </div>
        <div className="space-y-4">
            <div>
                <Label>Morning Mood: {formData.mood_morning || 0}/5</Label>
                <Slider defaultValue={[formData.mood_morning || 0]} max={5} step={1} onValueChange={(v) => setFormData({...formData, mood_morning: v[0]})} />
            </div>
            <div>
                <Label>Evening Mood: {formData.mood_evening || 0}/5</Label>
                <Slider defaultValue={[formData.mood_evening || 0]} max={5} step={1} onValueChange={(v) => setFormData({...formData, mood_evening: v[0]})}/>
            </div>
            <div>
                <Label>Spiritual Connection: {formData.spiritual_connection || 0}/5</Label>
                <Slider defaultValue={[formData.spiritual_connection || 0]} max={5} step={1} onValueChange={(v) => setFormData({...formData, spiritual_connection: v[0]})}/>
            </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          {isSaved ? 'Update Reflection' : 'Save Reflection'}
        </Button>
      </CardFooter>
    </Card>
  );
}
