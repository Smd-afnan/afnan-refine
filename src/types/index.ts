export interface Habit {
  id: string;
  title: string;
  is_active: boolean;
  streak_days: number;
  best_streak: number;
  category: 'worship' | 'health' | 'learning' | 'self_care' | 'community' | 'personal';
  created_by: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  completion_date: string; // YYYY-MM-DD
  status: 'completed' | 'skipped' | 'pending';
  completed_at?: string; // ISO string
}

export interface AIInsight {
  id: string;
  title: string;
  message: string;
  insight_type: 'daily_reflection' | 'pattern_analysis' | 'encouragement' | 'warning' | 'celebration';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  is_read: boolean;
  action_suggestion?: string;
  created_date: string; // ISO string
}

export interface UserSettings {
  id: string;
  created_by: string; // user email
  show_opening_dua: boolean;
  randomize_daily_dua: boolean;
  dua_audio_enabled: boolean;
  contextual_dua_mode: boolean;
  app_language: 'english' | 'telugu';
  dark_mode: boolean;
  notifications_enabled: boolean;
  last_dua_shown_date?: string; // YYYY-MM-DD
  preferred_language?: 'arabic_english' | 'arabic_only' | 'translation_only';
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface OpeningDua {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  spiritual_focus: string;
  context: 'morning' | 'evening' | 'general';
}

export interface IslamicWisdom {
  id: string;
  content: string;
  source: string;
}

export interface DignityDare {
  id: string;
  level: number;
  title: string;
  description: string;
  category: 'connection' | 'generosity' | 'reflection' | 'self-discipline';
}

export interface PrayerTime {
  name: string;
  time: string;
  isCompleted: boolean;
}
