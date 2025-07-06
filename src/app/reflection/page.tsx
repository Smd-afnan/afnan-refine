import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

export default function ReflectionPage() {
  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar />
            Reflection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is the reflection page. Content to be added here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
