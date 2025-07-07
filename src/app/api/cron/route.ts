
// This route MUST run in the Node.js runtime because it uses the Firebase Admin SDK.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // ensure the function is not cached

import {NextResponse} from 'next/server';
import * as admin from 'firebase-admin';
import { type Habit } from '@/types';

// Initialize Firebase Admin SDK
// This must be done only once, so we check if it's already initialized.
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    if (error instanceof Error) {
        console.error('Firebase admin initialization error', error.stack);
    } else {
        console.error('An unknown error occurred during Firebase admin initialization', error);
    }
  }
}


export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  const secret = searchParams.get('secret');

  // 1. Authenticate the request
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({message: 'Unauthorized'}, {status: 401});
  }

  // 2. Get the current time in HH:mm format (24-hour)
  const now = new Date();
  // IMPORTANT: Adjust for your target timezone if needed.
  // Vercel servers run in UTC. If users are in a different timezone,
  // you'll need to handle the offset. For simplicity, we assume UTC here.
  const currentTime = `${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}`;

  console.log(`Checking for habits with reminder time: ${currentTime}`);

  try {
    // 3. Find all active habits that are due for a reminder right now.
    const habitsDueSnapshot = await admin.firestore().collection('habits')
      .where('is_active', '==', true)
      .where('reminder_time', '==', currentTime)
      .get();

    if (habitsDueSnapshot.empty) {
      return NextResponse.json({message: 'No habits due for reminders.'});
    }

    const remindersToSend: Promise<string>[] = [];

    // 4. For each due habit, find the user's notification token and queue a message.
    for (const habitDoc of habitsDueSnapshot.docs) {
      const habit = habitDoc.data() as Habit;
      const userId = habit.created_by;

      if (!userId) continue;
      
      const userDoc = await admin.firestore().collection('users').doc(userId).get();
      const fcmToken = userDoc.data()?.fcmToken;

      if (fcmToken) {
        const message = {
          token: fcmToken,
          notification: {
            title: 'Habit Reminder ✨',
            body: `Time for your habit: ${habit.title}`,
          },
          data: {
            habitId: habitDoc.id,
            url: '/habits' // A deep link to open in the app
          }
        };

        console.log(`Sending reminder for "${habit.title}" to user ${userId}`);
        remindersToSend.push(admin.messaging().send(message));
      }
    }
    
    // 5. Send all queued messages.
    await Promise.all(remindersToSend);

    return NextResponse.json({message: `Sent ${remindersToSend.length} reminders.`});

  } catch (error) {
    console.error('Error in cron job:', error);
    return NextResponse.json({message: 'Internal Server Error'}, {status: 500});
  }
}
