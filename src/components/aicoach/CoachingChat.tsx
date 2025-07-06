"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

export default function CoachingChat() {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg dark:bg-slate-800/50 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
          <MessageCircle className="w-5 h-5 text-purple-600" />
          Chat with The Murabbi
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col h-80 border rounded-lg p-4 bg-gray-50 dark:bg-slate-900/50 overflow-y-auto">
            {/* Chat messages would go here */}
            <div className="text-center text-gray-500 dark:text-gray-400 p-8">
              <p>Chat feature coming soon.</p>
              <p className="text-sm">You'll be able to have a conversation with your AI coach here.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Input placeholder="Ask for guidance..." className="flex-1" />
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
