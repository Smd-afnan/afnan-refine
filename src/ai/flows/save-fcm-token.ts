'use server';
/**
 * @fileOverview A flow to handle saving a user's Firebase Cloud Messaging (FCM) token.
 *
 * - saveFcmToken - Saves the token for push notifications.
 * - SaveFcmTokenInput - The input type for the function.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SaveFcmTokenInputSchema = z.object({
  userId: z.string().describe("The unique identifier for the user."),
  token: z.string().describe("The Firebase Cloud Messaging (FCM) token for the user's device."),
});
export type SaveFcmTokenInput = z.infer<typeof SaveFcmTokenInputSchema>;

export async function saveFcmToken(input: SaveFcmTokenInput): Promise<{success: boolean}> {
  return saveFcmTokenFlow(input);
}

const saveFcmTokenFlow = ai.defineFlow(
  {
    name: 'saveFcmTokenFlow',
    inputSchema: SaveFcmTokenInputSchema,
    outputSchema: z.object({ success: z.boolean() }),
  },
  async (input) => {
    console.log(`Received token for user ${input.userId}: ${input.token}`);
    
    // =================================================================
    // IMPORTANT: In a real application with a database (like Firestore),
    // you would save the token here.
    //
    // Example using Firestore:
    //
    // import { getFirestore } from 'firebase-admin/firestore';
    // const db = getFirestore();
    // await db.collection('users').doc(input.userId).set({
    //   fcmToken: input.token,
    // }, { merge: true });
    //
    // =================================================================

    console.log(`[Mock] FCM Token for user ${input.userId} has been "saved".`);
    
    return { success: true };
  }
);
