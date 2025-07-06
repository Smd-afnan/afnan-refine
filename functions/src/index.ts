// Copy this entire code block into functions/src/index.ts

import {onSchedule} from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";

// Initialize the Firebase Admin SDK so we can talk to Firestore and Messaging
admin.initializeApp();

/*
 * This scheduled function runs every minute to check for habit reminders.
 */
export const checkHabitReminders = onSchedule("every 1 minutes", async (event) => {
    // Get the current time in HH:mm format (24-hour)
    const now = new Date();
    // Adjust for your specific timezone if needed when creating the date
    // For this example, we assume the server runs in the user's effective
    // timezone
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${
      String(now.getMinutes()).padStart(2, "0")}`;

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
      return;
    }

    const remindersToSend: Promise<string>[] = [];

    // 2. For each habit, find the user's notification token.
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
          }, // You can add more data to handle clicks, etc.
          // data: { habitId: habitDoc.id }
        };

        const logMessage = `Sending reminder for "${habit.title}" ` +
          `to user ${userId}`;
        console.log(logMessage);
        remindersToSend.push(admin.messaging().send(message));
      }
    }

    // 4. Wait for all messages to be sent.
    await Promise.all(remindersToSend);
  });