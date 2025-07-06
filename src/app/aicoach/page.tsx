import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';

export default function AICoachPage() {
  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain />
            AI Coach
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is the AI Coach page. Content to be added here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
