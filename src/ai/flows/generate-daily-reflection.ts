'use server';

/**
 * @fileOverview AI flow for generating personalized daily reflections based on user data.
 *
 * - generateDailyReflection - Generates a daily reflection.
 * - GenerateDailyReflectionInput - Input type for the function.
 * - GenerateDailyReflectionOutput - Output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDailyReflectionInputSchema = z.object({
  habits: z.string().describe('A list of habits tracked by the user.'),
  mood: z.string().describe('The mood of the user for the day.'),
  journalEntries: z.string().describe('The journal entries of the user for the day.'),
});
export type GenerateDailyReflectionInput = z.infer<typeof GenerateDailyReflectionInputSchema>;

const GenerateDailyReflectionOutputSchema = z.object({
  reflection: z.string().describe('The generated daily reflection for the user.'),
});
export type GenerateDailyReflectionOutput = z.infer<typeof GenerateDailyReflectionOutputSchema>;

export async function generateDailyReflection(input: GenerateDailyReflectionInput): Promise<GenerateDailyReflectionOutput> {
  return generateDailyReflectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDailyReflectionPrompt',
  input: {schema: GenerateDailyReflectionInputSchema},
  output: {schema: GenerateDailyReflectionOutputSchema},
  prompt: `You are a personal AI reflection generator. You will generate a daily reflection for the user based on their tracked habits, mood, and journal entries.

Tracked Habits: {{{habits}}}
Mood: {{{mood}}}
Journal Entries: {{{journalEntries}}}

Reflection:`,
});

const generateDailyReflectionFlow = ai.defineFlow(
  {
    name: 'generateDailyReflectionFlow',
    inputSchema: GenerateDailyReflectionInputSchema,
    outputSchema: GenerateDailyReflectionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
