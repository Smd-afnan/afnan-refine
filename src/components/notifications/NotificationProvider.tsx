"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

type NotificationContextType = {
  permission: NotificationPermission;
  requestPermission: () => void;
  notify: (title: string, options?: NotificationOptions) => void;
} | null;

const NotificationContext = createContext<NotificationContextType>(null);

export function useNotifier() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const { toast } = useToast();

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(() => {
    if (!('Notification' in window)) {
      console.error("This browser does not support desktop notification");
      toast({
        title: 'Notifications Not Supported',
        description: 'Your browser does not support notifications.',
        variant: 'destructive',
      });
      return;
    }
    Notification.requestPermission().then((perm) => {
        setPermission(perm);
        if (perm === 'granted') {
            toast({
                title: 'Notifications Enabled',
                description: 'You will now receive notifications.',
            });
        } else {
             toast({
                title: 'Notifications Blocked',
                description: 'You have blocked notifications. You can change this in your browser settings.',
                variant: 'destructive'
            });
        }
    });
  }, [toast]);

  const notify = useCallback((title: string, options?: NotificationOptions) => {
    if (!('Notification' in window)) {
        return;
    }
    if (permission !== 'granted') {
      console.log('Notification permission not granted.');
      // Silently fail or queue the notification, for now, we just log.
      return;
    }
    new Notification(title, {
      ...options,
      icon: '/logo.png', // A default icon for notifications
      body: options?.body || '',
    });
  }, [permission]);

  const value = {
    permission,
    requestPermission,
    notify,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
