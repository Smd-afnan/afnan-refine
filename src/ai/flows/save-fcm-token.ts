'use server';
/**
 * @fileOverview A flow to handle saving a user's Firebase Cloud Messaging (FCM) token.
 *
 * - saveFcmToken - Saves the token for push notifications.
 * - SaveFcmTokenInput - The input type for the function.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps } from 'firebase-admin/app';

if (!getApps().length) {
    initializeApp();
}
const db = getFirestore();


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
    // This is the logic you would use in a real server environment.
    // It assumes you have a 'users' collection where each document ID is the user's ID.
    try {
        const userRef = db.collection('users').doc(input.userId);
        
        // Save the token to a user's document in Firestore.
        await userRef.set({
            fcmToken: input.token,
            // You might want to save other user info too, like their email
            // email: user.email 
        }, { merge: true }); // Use merge:true to avoid overwriting other user data
        
        console.log(`[Firestore] FCM Token for user ${input.userId} has been saved to the database.`);
        return { success: true };
    } catch (error) {
        console.error("Error writing FCM token to Firestore:", error);
        return { success: false };
    }
    // =================================================================
  }
);
