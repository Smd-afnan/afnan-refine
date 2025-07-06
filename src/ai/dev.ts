import { config } from 'dotenv';
config();

import '@/ai/flows/generate-daily-reflection.ts';
import '@/ai/flows/generate-muraqqabah-report.ts';
import '@/ai/flows/generate-reflection-insights.ts';
import '@/ai/flows/generate-coaching-response.ts';
import '@/ai/flows/save-fcm-token.ts';
