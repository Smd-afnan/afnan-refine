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
    // This is where you would interact with your database.
    // In a real application, you would initialize the Firebase Admin SDK
    // and save the token to a user's document in Firestore.
    
    console.log(`Received token for user ${input.userId}: ${input.token}`);
    
    // =================================================================
    // Firestore Example:
    // This code would run on a server, not in the browser. You would need
    // to have the Firebase Admin SDK configured.
    //
    // import { getFirestore } from 'firebase-admin/firestore';
    // const db = getFirestore();
    //
    // // Save the token to a 'users' collection, identified by the user's ID.
    // await db.collection('users').doc(input.userId).set({
    //   fcmToken: input.token,
    // }, { merge: true }); // Use merge:true to avoid overwriting other user data
    //
    // =================================================================

    // For now, we'll just log that we "saved" it.
    console.log(`[Mock] FCM Token for user ${input.userId} has been "saved" to the database.`);
    
    return { success: true };
  }
);
