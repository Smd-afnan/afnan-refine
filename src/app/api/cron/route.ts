
// This route MUST run in the Node.js runtime because it uses the Firebase Admin SDK.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // ensure the function is not cached

import {NextResponse} from 'next/server';
import * as admin from 'firebase-admin';
import { type Habit, type User } from '@/types';

// --- Robust Initialization of Firebase Admin SDK ---

// List all required environment variables for the Admin SDK
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY',
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

// Only initialize if all variables are present and it hasn't been initialized before
if (missingEnvVars.length > 0) {
  console.error(`CRITICAL: Firebase Admin initialization skipped. Missing environment variables: ${missingEnvVars.join(', ')}. Please set these in your Vercel project settings.`);
} else if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      }),
    });
    console.log("Firebase Admin SDK initialized successfully.");
  } catch (error) {
    if (error instanceof Error) {
        console.error('CRITICAL: Firebase admin initialization error', error.stack);
    } else {
        console.error('CRITICAL: An unknown error occurred during Firebase admin initialization', error);
    }
  }
}


export async function GET(request: Request) {
  // Check if admin was initialized. If not, exit gracefully.
  if (admin.apps.length === 0) {
    return NextResponse.json({ message: 'Server configuration error: Firebase Admin not initialized.' }, { status: 500 });
  }

  const {searchParams} = new URL(request.url);
  const secret = searchParams.get('secret');

  // 1. Authenticate the request
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({message: 'Unauthorized'}, {status: 401});
  }

  try {
    const remindersToSend: Promise<string>[] = [];
    const usersSnapshot = await admin.firestore().collection('users').get();

    for (const userDoc of usersSnapshot.docs) {
        const user = userDoc.data() as User;
        const userId = userDoc.id;
        if (!user.fcmToken) continue;

        const now = new Date();
        const currentTime = `${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}`;
        
        console.log(`Checking for habits for user ${userId} with reminder time: ${currentTime}`);

        const habitsDueSnapshot = await admin.firestore().collection('habits')
          .where('created_by', '==', userId)
          .where('is_active', '==', true)
          .where('reminder_time', '==', currentTime)
          .get();

        if (habitsDueSnapshot.empty) {
          continue;
        }

        for (const habitDoc of habitsDueSnapshot.docs) {
            const habit = habitDoc.data() as Habit;
            const message = {
                token: user.fcmToken,
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
    
    await Promise.all(remindersToSend);

    return NextResponse.json({message: `Sent ${remindersToSend.length} reminders.`});

  } catch (error) {
    console.error('Error in cron job:', error);
    return NextResponse.json({message: 'Internal Server Error'}, {status: 500});
  }
}
