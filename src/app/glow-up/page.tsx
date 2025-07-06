import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';

export default function GlowUpPage() {
  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star />
            Glow-Up Path
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is the Glow-Up Path page. Content to be added here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
