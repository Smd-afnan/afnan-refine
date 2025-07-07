
import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import type { Habit, User } from '@/types';
import { schedulePushNotification } from '@/lib/notifications';

// Safely initialize Firebase Admin SDK
// This check prevents the app from crashing if the environment variables are not set.
if (!admin.apps.length) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
      throw new Error('Firebase environment variables are not set.');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
    });
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
  }
}

const db = admin.firestore();

export async function GET(request: Request) {
  // 1. Authenticate the cron job request
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.warn('Cron job call failed: Invalid CRON_SECRET');
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  if (!admin.apps.length) {
    console.error('Cron job call failed: Firebase Admin not initialized.');
    return NextResponse.json({ success: false, message: 'Firebase Admin not initialized' }, { status: 500 });
  }

  // 2. Fetch all users who have notifications enabled and have an FCM token
  try {
    const usersQuery = query(
      collection(db, 'users'),
      where('fcmToken', '!=', null)
    );
    const usersSnapshot = await getDocs(usersQuery);
    const usersWithTokens: User[] = [];
    usersSnapshot.forEach(doc => {
        usersWithTokens.push({ id: doc.id, ...doc.data() } as User);
    });
    
    if (usersWithTokens.length === 0) {
      return NextResponse.json({ success: true, message: "No users with notification tokens found." });
    }

    // 3. For each user, check their habits and send reminders
    const allPromises = usersWithTokens.map(async (user) => {
      if (!user.fcmToken) return;
      
      const habitsQuery = query(
          collection(db, 'habits'), 
          where('created_by', '==', user.id), 
          where('is_active', '==', true),
          where('reminder_time', '!=', null)
      );
      const habitsSnapshot = await getDocs(habitsQuery);

      habitsSnapshot.forEach(habitDoc => {
        const habit = habitDoc.data() as Habit;
        // Basic check if reminder time is around the current time
        // A more robust solution would use a proper scheduler or check timezones
        const now = new Date();
        const [hour, minute] = habit.reminder_time!.split(':').map(Number);
        if (now.getHours() === hour && now.getMinutes() === minute) {
           schedulePushNotification(user.fcmToken!, 'Habit Reminder', `It's time for your habit: ${habit.title}`);
        }
      });
    });

    await Promise.all(allPromises);
    
    return NextResponse.json({ success: true, message: `Checked ${usersWithTokens.length} users for notifications.` });
  } catch (error) {
    console.error("Error processing cron job:", error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
