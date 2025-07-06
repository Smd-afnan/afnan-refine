import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is the profile page. Content to be added here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
