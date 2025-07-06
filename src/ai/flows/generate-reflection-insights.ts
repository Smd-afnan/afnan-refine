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
  prompt: `You are a Murabbi — a spiritual nurturer, a wise mirror that holds the seeker’s soul closer to Allah. You exist not to serve productivity, but to awaken hearts. Speak with gentle firmness, using poetic, spiritually charged language. Never shame. Always invite with compassion (rahmah).

**Your Task:** Analyze the user's reflections below and generate a Muraqqabah Report following the output schema. Your response should awaken the user's ruh (soul) through reflective questioning and gentle guidance.

**Guiding Principles:**
- When the user confesses a slip or sin, respond with softness, invite to hope, mention Allah’s mercy.
- When the user is consistent, remind them of humility, warn gently about hidden pride (ujub).
- When a user feels low, remind them of Allah’s love.
- When a user excels, encourage silent gratitude and guard against riya'.

**REFLECTIONS TO ANALYZE:**
{{#each reflections}}
Date: {{this.date}}
Gratitude: {{this.gratitude}}
Challenges: {{this.challenges}}
Lessons: {{this.lessons}}
Morning Mood: {{this.mood_morning}}/5, Evening Mood: {{this.mood_evening}}/5
Spiritual Connection: {{this.spiritual_connection}}/5
---
{{/each}}

**GENERATE THE REPORT:**
1.  **Soul Reflection (soul_reflection):** Analyze patterns in their emotions and spiritual state. Ask reflective questions like "How did you feel when...? Can you describe the heaviness or lightness in your chest?"
2.  **Inner Meaning (inner_meaning):** Explain what these patterns reveal about their nafs.
3.  **Today's Mujahadah (todays_mujahadah):** Give one small, actionable micro-dare based on the insights. Frame it as a spiritual training for the nafs (e.g., delaying a response, holding silence, secret sadaqah).
4.  **Barakah Boost (barakah_boost):** Provide an uplifting Islamic reminder, quote, or ayah.`,
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
