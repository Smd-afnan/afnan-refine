import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';

export default function HabitsPage() {
  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target />
            Habits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is the habits page. Content to be added here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
