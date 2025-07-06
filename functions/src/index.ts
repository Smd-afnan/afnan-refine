// This is the code for your Firebase Cloud Function.
// It runs on a server to send notifications at specific times.

import {onSchedule} from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";

// Initialize the Firebase Admin SDK so it can interact with Firestore and Messaging
admin.initializeApp();

/**
 * This scheduled function runs every minute to check for habit reminders.
 */
export const checkHabitReminders = onSchedule("every 1 minutes", async (_event) => {
  // Get the current time in HH:mm format (24-hour)
  const now = new Date();
  // This function will use the timezone of the server it runs on.
  // For production, you can set a specific timezone in the function definition.
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${
    String(now.getMinutes()).padStart(2, "0")
  }`;

  console.log(`Checking for habits with reminder time: ${currentTime}`);

  // 1. Find all active habits that are due for a reminder right now.
  const habitsDue = await admin
    .firestore()
    .collection("habits")
    .where("is_active", "==", true)
    .where("reminder_time", "==", currentTime)
    .get();

  if (habitsDue.empty) {
    console.log("No habits due for reminders at this time.");
    return; // Exit if there's nothing to do
  }

  const remindersToSend: Promise<string>[] = [];

  // 2. For each due habit, find the user's notification token.
  for (const habitDoc of habitsDue.docs) {
    const habit = habitDoc.data();
    const userId = habit.userId;

    if (!userId) continue;

    const userDoc = await admin.firestore().collection("users")
      .doc(userId).get();
    const fcmToken = userDoc.data()?.fcmToken;

    if (fcmToken) {
      // 3. Create the specific notification message for this habit.
      const message = {
        token: fcmToken,
        notification: {
          title: "Habit Reminder ✨",
          body: `Time for your habit: ${habit.title}`,
        },
        // You can add more data here to handle notification clicks, etc.
        data: {habitId: habitDoc.id},
      };

      const logMessage = `Sending reminder for "${habit.title}" ` +
        `to user ${userId}`;
      console.log(logMessage);

      // Add the send operation to our list of promises
      remindersToSend.push(admin.messaging().send(message));
    }
  }

  // 4. Wait for all the notification messages to be sent.
  await Promise.all(remindersToSend);
});
