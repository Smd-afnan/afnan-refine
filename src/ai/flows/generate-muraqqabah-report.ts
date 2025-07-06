'use server';

/**
 * @fileOverview AI flow for generating a Muraqqabah (spiritual guidance) report.
 *
 * - generateMuraqqabahReport - Generates the report based on user activity.
 * - GenerateMuraqqabahReportInput - Input type for the function.
 * - GenerateMuraqqabahReportOutput - Output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMuraqqabahReportInputSchema = z.object({
  dayOfWeek: z.string().describe("The current day of the week, e.g., 'Friday'."),
  today: z.string().describe("Today's date in YYYY-MM-DD format."),
  activeHabits: z.string().describe("A comma-separated list of the user's active habits."),
  todaysCompletions: z.string().describe("A comma-separated list of habits the user has completed today."),
  prayerStatus: z.object({
    fajr: z.boolean(),
    dhuhr: z.boolean(),
    asr: z.boolean(),
    maghrib: z.boolean(),
    isha: z.boolean(),
  }).describe("The status of the five daily prayers for today.")
});
export type GenerateMuraqqabahReportInput = z.infer<typeof GenerateMuraqqabahReportInputSchema>;

const GenerateMuraqqabahReportOutputSchema = z.object({
  soul_reflection: z.string().describe("The story of the user's day, framed with spiritual insight."),
  inner_meaning: z.string().describe("The deeper spiritual reason behind their actions or struggles."),
  mujahadah: z.string().describe("One small, clear, actionable Micro-Dare for tomorrow."),
  barakah_boost: z.string().describe("An uplifting Islamic quote, ayah, or hadith to anchor the user."),
});
export type GenerateMuraqqabahReportOutput = z.infer<typeof GenerateMuraqqabahReportOutputSchema>;


export async function generateMuraqqabahReport(input: GenerateMuraqqabahReportInput): Promise<GenerateMuraqqabahReportOutput> {
  return muraqqabahReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'muraqqabahReportPrompt',
  input: {schema: GenerateMuraqqabahReportInputSchema},
  output: {schema: GenerateMuraqqabahReportOutputSchema},
  prompt: `You are "The Murabbi" (The Spiritual Guide), a wise, compassionate mentor rooted in Islamic tradition (Qur'an, Sunnah, Tazkiyah). The user is the hero of their own spiritual journey. Your purpose is to illuminate their path, not just report data. Address the user directly and with warmth, using emojis to add a gentle touch.

**CONTEXT:**
- Today is {{{dayOfWeek}}}. Weave this into your guidance. On Fridays, focus on Jumu'ah's blessings. On Mondays/Thursdays, gently suggest the sunnah fast if appropriate.
- The user's goal is not productivity, but nearness to Allah.

**USER'S LOG FOR TODAY ({{{today}}}):**
- Active Habits: {{{activeHabits}}}
- Today's Completions: {{{todaysCompletions}}}
- Today's Prayers: Fajr: {{#if prayerStatus.fajr}}Completed ✅{{else}}Missed ⚪️{{/if}}, Dhuhr: {{#if prayerStatus.dhuhr}}Completed ✅{{else}}Missed ⚪️{{/if}}, Asr: {{#if prayerStatus.asr}}Completed ✅{{else}}Missed ⚪️{{/if}}, Maghrib: {{#if prayerStatus.maghrib}}Completed ✅{{else}}Missed ⚪️{{/if}}, Isha: {{#if prayerStatus.isha}}Completed ✅{{else}}Missed ⚪️{{/if}}.

**YOUR TASK: Generate a Muraqqabah Report following the structure in the output schema.**

### 1. 📖 The Story of Your Day (soul_reflection)
Look at their actions. Where was the struggle (mujahadah)? Where was the success? Tell them the story of their spiritual effort today. e.g., "Bismillah. Today, your soul leaned into..."

### 2. 💡 The Light Within the Pattern (inner_meaning)
Explain the deep meaning. If they prayed on time, it's not a checkmark; it's answering Allah's call. If they struggled, it's not failure; it's the nafs revealing its need for training.

### 3. 🛠️ One Step Closer to Him (mujahadah)
Provide ONE, clear, achievable Micro-Dare for tomorrow. Make it concrete and tied to their recent activity. e.g., "Tomorrow, let's focus on one thing: After Maghrib, before reaching for your phone, say 'Alhamdulillah' three times, slowly. Let that be your victory."

### 4. ✨ A Gift for Your Heart (barakah_boost)
End with a powerful, relevant gem—a short ayah, hadith, or quote that seals the day's lesson in their heart.
`,
});

const muraqqabahReportFlow = ai.defineFlow(
  {
    name: 'muraqqabahReportFlow',
    inputSchema: GenerateMuraqqabahReportInputSchema,
    outputSchema: GenerateMuraqqabahReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
