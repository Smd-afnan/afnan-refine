'use server';

/**
 * @fileOverview AI flow for generating insights from user reflections.
 *
 * - generateReflectionInsights - Generates insights based on user journal entries.
 * - GenerateReflectionInsightsInput - Input type for the function.
 * - GenerateReflectionInsightsOutput - Output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReflectionInsightsInputSchema = z.object({
  reflections: z.array(z.object({
    date: z.string(),
    gratitude: z.string().optional(),
    challenges: z.string().optional(),
    lessons: z.string().optional(),
    mood_morning: z.number().optional(),
    mood_evening: z.number().optional(),
    spiritual_connection: z.number().optional(),
  })).describe("An array of user's daily reflections.")
});
export type GenerateReflectionInsightsInput = z.infer<typeof GenerateReflectionInsightsInputSchema>;

const GenerateReflectionInsightsOutputSchema = z.object({
  soul_reflection: z.string().describe("Analyze patterns in their emotions and spiritual state."),
  inner_meaning: z.string().describe("Explain what these patterns reveal about their nafs (self/ego)."),
  todays_mujahadah: z.string().describe("Give one small, actionable step based on the insights."),
  barakah_boost: z.string().describe("Provide an uplifting Islamic reminder, quote, or ayah."),
});
export type GenerateReflectionInsightsOutput = z.infer<typeof GenerateReflectionInsightsOutputSchema>;


export async function generateReflectionInsights(input: GenerateReflectionInsightsInput): Promise<GenerateReflectionInsightsOutput> {
  return reflectionInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'reflectionInsightsPrompt',
  input: {schema: GenerateReflectionInsightsInputSchema},
  output: {schema: GenerateReflectionInsightsOutputSchema},
  prompt: `You are "The Inner Guide", a wise Muslim life mentor. Analyze the user's reflections and provide compassionate guidance based on Islamic principles and tarbiyyah (soul-training). Be sharp and straight to the point. Use emojis to make it appealing.

REFLECTIONS TO ANALYZE:
{{#each reflections}}
Date: {{this.date}}
Gratitude: {{this.gratitude}}
Challenges: {{this.challenges}}
Lessons: {{this.lessons}}
Morning Mood: {{this.mood_morning}}/5, Evening Mood: {{this.mood_evening}}/5
Spiritual Connection: {{this.spiritual_connection}}/5
---
{{/each}}

GENERATE A MURAQQABAH REPORT with the structure defined in the output schema.
`,
});

const reflectionInsightsFlow = ai.defineFlow(
  {
    name: 'reflectionInsightsFlow',
    inputSchema: GenerateReflectionInsightsInputSchema,
    outputSchema: GenerateReflectionInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
