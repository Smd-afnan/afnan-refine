"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Send, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { generateCoachingResponse, type ChatMessage } from '@/ai/flows/generate-coaching-response';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function CoachingChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const scrollableNode = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (scrollableNode) {
            scrollableNode.scrollTo({
                top: scrollableNode.scrollHeight,
                behavior: 'smooth'
            });
        }
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
        const response = await generateCoachingResponse([...messages, userMessage]);
        const modelMessage: ChatMessage = { role: 'model', content: response };
        setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
        console.error("Error getting coaching response:", error);
        toast({
            title: "Error",
            description: "Could not get a response from The Murabbi. Please try again.",
            variant: "destructive"
        });
        // remove the user message that failed
        setMessages(prev => prev.filter(m => m.content !== currentInput));
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg dark:bg-slate-800/50 dark:border-slate-700 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
          <MessageCircle className="w-5 h-5 text-purple-600" />
          Chat with The Murabbi
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        <ScrollArea className="flex-1 pr-4 -mr-4" ref={scrollAreaRef}>
           <div className="space-y-4">
            {messages.length === 0 && (
                 <div className="text-center text-gray-500 dark:text-gray-400 p-8">
                    <p>Bismillah. How is your heart today?</p>
                    <p className="text-sm">You can ask The Murabbi for guidance.</p>
                </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-end gap-2',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'model' && (
                   <Avatar className="w-8 h-8">
                     <AvatarFallback className="bg-purple-200 text-purple-700 dark:bg-purple-800 dark:text-purple-200">M</AvatarFallback>
                   </Avatar>
                )}
                 <div
                  className={cn(
                    'max-w-xs md:max-w-md lg:max-w-lg rounded-xl px-4 py-3 text-sm whitespace-pre-wrap',
                    message.role === 'user'
                      ? 'bg-purple-600 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none dark:bg-slate-700 dark:text-gray-200'
                  )}
                >
                  {message.content}
                </div>
                 {message.role === 'user' && (
                   <Avatar className="w-8 h-8">
                     <AvatarFallback>U</AvatarFallback>
                   </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
                 <div className="flex items-end gap-2 justify-start">
                    <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-purple-200 text-purple-700 dark:bg-purple-800 dark:text-purple-200">M</AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 dark:bg-slate-700 rounded-xl rounded-bl-none px-4 py-3">
                        <RefreshCw className="w-4 h-4 text-gray-500 animate-spin" />
                    </div>
                </div>
            )}
          </div>
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-4 border-t dark:border-slate-700">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for guidance..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={isLoading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
