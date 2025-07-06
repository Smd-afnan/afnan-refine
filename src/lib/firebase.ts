
import { initializeApp, getApp, getApps } from "firebase/app";
import { getMessaging, getToken, onMessage, type MessagePayload } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const fcmMessaging = typeof window !== 'undefined' && firebaseConfig.apiKey ? getMessaging(app) : null;

export const registerServiceWorker = () => {
  if ('serviceWorker'in navigator && typeof window !== 'undefined' && firebaseConfig.apiKey) {
    const firebaseConfigParams = encodeURIComponent(JSON.stringify(firebaseConfig));
    navigator.serviceWorker
      .register(`/sw.js?firebaseConfig=${firebaseConfigParams}`)
      .then((registration) => {
        console.log('FCM Service Worker registration successful, scope is:', registration.scope);
      })
      .catch((err) => {
        console.log('FCM Service Worker registration failed:', err);
      });
  }
};

export const requestNotificationPermission = async () => {
  if (!fcmMessaging) {
      console.log("Firebase Messaging is not available. Have you configured your .env file?");
      return null;
  }
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

      if (!vapidKey) {
        console.error("VAPID key not found. Ensure NEXT_PUBLIC_FIREBASE_VAPID_KEY is in your .env file.");
        return null;
      }
      
      const fcmToken = await getToken(fcmMessaging, { vapidKey });

      if (fcmToken) {
        console.log('FCM Token:', fcmToken);
        // The token is now available on the client.
        // The now-removed server-side function would have saved this.
        // For local notifications, we don't need to send it anywhere.
        return fcmToken;
      } else {
        console.log('No registration token available. Request permission to generate one.');
        return null;
      }
    } else {
      console.log('Unable to get permission to notify.');
      return null;
    }
  } catch (error) {
    console.error('An error occurred while retrieving token. ', error);
    return null;
  }
};

// This function will listen for messages when the app is in the foreground
export const onMessageListener = () =>
  new Promise<MessagePayload>((resolve) => {
    if(fcmMessaging) {
        onMessage(fcmMessaging, (payload) => {
            resolve(payload);
        });
    }
  });

export { app };
