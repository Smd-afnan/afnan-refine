'use server';
/**
 * @fileOverview A flow to handle saving a user's habit to the backend database.
 * This is used to allow server-side processes (like scheduled notifications)
 * to access user habit data.
 *
 * - saveHabit - Saves the habit data.
 * - SaveHabitInput - The input type for the function.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// This flow uses the Firebase Admin SDK to interact with Firestore.
import {getFirestore} from 'firebase-admin/firestore';
import {initializeApp, getApps} from 'firebase-admin/app';

// Initialize Firebase Admin on the server side if not already done.
if (!getApps().length) {
    initializeApp();
}
const db = getFirestore();

const SaveHabitInputSchema = z.object({
  userId: z.string().describe("The unique identifier for the user."),
  habit: z.object({
      id: z.string(),
      title: z.string(),
      is_active: z.boolean(),
      category: z.string(),
      reminder_time: z.string().optional(),
  })
});
export type SaveHabitInput = z.infer<typeof SaveHabitInputSchema>;

export async function saveHabit(input: SaveHabitInput): Promise<{success: boolean}> {
  return saveHabitFlow(input);
}

const saveHabitFlow = ai.defineFlow(
  {
    name: 'saveHabitFlow',
    inputSchema: SaveHabitInputSchema,
    outputSchema: z.object({ success: z.boolean() }),
  },
  async ({ userId, habit }) => {
    try {
        const habitRef = db.collection('habits').doc(habit.id);
        
        // We only want to store data the server needs.
        const habitForBackend = {
            userId, // Store the userId with the habit for easy lookup
            title: habit.title,
            is_active: habit.is_active,
            reminder_time: habit.reminder_time || null, // Store null if undefined
        };
        
        await habitRef.set(habitForBackend, { merge: true });

        console.log(`[Backend Sync] Habit ${habit.id} for user ${userId} has been saved to Firestore.`);
        return { success: true };
    } catch (error) {
        console.error("Error saving habit to Firestore:", error);
        // It's important to handle this error, but for now we'll fail silently
        // so the frontend operation doesn't break.
        return { success: false };
    }
  }
);
