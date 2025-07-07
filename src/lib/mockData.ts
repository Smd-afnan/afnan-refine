
import type { Habit, HabitLog, AIInsight, UserSettings, User, OpeningDua, IslamicWisdom, DignityDare, PrayerTime, DailyReflection, DailyPrayerLog } from '@/types';

// --- Default Data ---
const defaultHabits: Habit[] = [
  { id: 'habit-1', title: '5 Daily Prayers', is_active: true, streak_days: 0, best_streak: 0, category: 'worship', created_by: 'user-123' },
  { id: 'habit-2', title: 'Read a page of Quran', is_active: true, streak_days: 0, best_streak: 0, category: 'learning', created_by: 'user-123', reminder_time: '06:30' },
  { id: 'habit-3', title: 'Morning walk', is_active: true, streak_days: 0, best_streak: 0, category: 'health', created_by: 'user-123', reminder_time: '07:00' },
  { id: 'habit-4', title: 'Call parents', is_active: true, streak_days: 0, best_streak: 0, category: 'community', created_by: 'user-123' },
  { id: 'habit-5', title: 'Journal before sleep', is_active: false, streak_days: 0, best_streak: 0, category: 'self_care', created_by: 'user-123', reminder_time: '22:00' },
];

const defaultUserSettings: UserSettings = {
  id: 'settings-123', created_by: 'believer@soulrefine.app', show_opening_dua: true, randomize_daily_dua: true, dua_audio_enabled: false, contextual_dua_mode: true, app_language: 'english', dark_mode: false, notifications_enabled: false, last_dua_shown_date: '', preferred_language: 'arabic_english',
};

// --- In-Memory Data Store ---
// This will act as our "database" while the app is running. It resets on page refresh.
let habitsStore: Habit[] = JSON.parse(JSON.stringify(defaultHabits));
let habitLogsStore: HabitLog[] = [];
let dailyReflectionsStore: DailyReflection[] = [];
let dailyPrayerLogsStore: DailyPrayerLog[] = [];
let userSettingsStore: UserSettings = JSON.parse(JSON.stringify(defaultUserSettings));


// --- Mock User (Static) ---
const mockUser: User = {
  id: 'user-123', email: 'believer@soulrefine.app', name: 'Spiritual Seeker', full_name: 'Spiritual Seeker'
};
export const getMockUser = async (): Promise<User> => Promise.resolve(mockUser);
export const updateMockUser = async (updates: Partial<User>): Promise<User> => {
    return Promise.resolve({ ...mockUser, ...updates });
};

// --- UserSettings ---
export const getMockUserSettings = async (): Promise<UserSettings> => {
    return Promise.resolve(userSettingsStore);
}
export const updateMockUserSettings = async (updates: Partial<UserSettings>): Promise<UserSettings> => {
    userSettingsStore = { ...userSettingsStore, ...updates };
    return Promise.resolve(userSettingsStore);
}
export const checkDuaSettings = async (): Promise<UserSettings> => getMockUserSettings();

// --- Habits ---
export const getHabits = async (): Promise<Habit[]> => {
    return Promise.resolve(habitsStore);
}
export const updateHabit = async(habitId: string, updates: Partial<Habit>): Promise<Habit> => {
    let updatedHabit: Habit | undefined;
    const index = habitsStore.findIndex(h => h.id === habitId);
    if (index > -1) {
        habitsStore[index] = { ...habitsStore[index], ...updates };
        updatedHabit = habitsStore[index];
    }
    if (updatedHabit) return Promise.resolve(updatedHabit);
    return Promise.reject(new Error("Habit not found"));
}
export const createHabit = async (habitData: Omit<Habit, 'id' | 'streak_days' | 'best_streak' | 'created_by'>): Promise<Habit> => {
    const newHabit: Habit = {
        id: `habit-${Date.now()}`, ...habitData, streak_days: 0, best_streak: 0, created_by: 'user-123'
    };
    habitsStore.unshift(newHabit);
    return Promise.resolve(newHabit);
}
export const deleteHabit = async (habitId: string): Promise<{ id: string }> => {
    habitsStore = habitsStore.filter(h => h.id !== habitId);
    habitLogsStore = habitLogsStore.filter(l => l.habit_id !== habitId);
    return Promise.resolve({ id: habitId });
}

// --- HabitLogs ---
export const getHabitLogs = async (date: string): Promise<HabitLog[]> => {
    const logsForDate = habitLogsStore.filter(log => log.completion_date === date);
    return Promise.resolve(logsForDate);
}
export const getAllHabitLogs = async (): Promise<HabitLog[]> => {
    return Promise.resolve(habitLogsStore);
}
export const updateHabitLog = async (logId: string, updates: Partial<HabitLog>): Promise<HabitLog> => {
    let updatedLog: HabitLog | undefined;
    habitLogsStore = habitLogsStore.map(log => {
        if (log.id === logId) {
            updatedLog = { ...log, ...updates };
            return updatedLog;
        }
        return log;
    });
    if (updatedLog) {
        return Promise.resolve(updatedLog);
    }
    return Promise.reject(new Error("Log not found"));
}
export const createHabitLog = async (newLogData: Omit<HabitLog, 'id'>): Promise<HabitLog> => {
    const newLog: HabitLog = { ...newLogData, id: `log-${Date.now()}` };
    habitLogsStore.push(newLog);
    return Promise.resolve(newLog);
}

// --- Daily Reflections ---
export const getDailyReflections = async (): Promise<DailyReflection[]> => {
    return Promise.resolve(dailyReflectionsStore.sort((a,b) => b.reflection_date.localeCompare(a.reflection_date)));
};
export const createDailyReflection = async (data: Omit<DailyReflection, 'id' | 'created_by'>): Promise<DailyReflection> => {
    const newReflection: DailyReflection = {
        id: `ref-${Date.now()}`, ...data, created_by: 'user-123'
    };
    dailyReflectionsStore.unshift(newReflection);
    return Promise.resolve(newReflection);
};
export const updateDailyReflection = async (id: string, updates: Partial<DailyReflection>): Promise<DailyReflection> => {
    let updatedReflection: DailyReflection | undefined;
    dailyReflectionsStore = dailyReflectionsStore.map(r => {
        if (r.id === id) {
            updatedReflection = { ...r, ...updates };
            return updatedReflection;
        }
        return r;
    });
    if (updatedReflection) {
        return Promise.resolve(updatedReflection);
    }
    return Promise.reject(new Error("Reflection not found"));
};
export const deleteDailyReflection = async (id: string): Promise<{ id: string }> => {
    dailyReflectionsStore = dailyReflectionsStore.filter(r => r.id !== id);
    return Promise.resolve({ id });
}

// --- Daily Prayer Log ---
export const getDailyPrayerLogs = async (date?: string): Promise<DailyPrayerLog[]> => {
    if (date) {
        return Promise.resolve(dailyPrayerLogsStore.filter(log => log.completion_date === date));
    }
    return Promise.resolve(dailyPrayerLogsStore);
};
export const createDailyPrayerLog = async (newLogData: Omit<DailyPrayerLog, 'id'|'created_by'>): Promise<DailyPrayerLog> => {
    const newLog: DailyPrayerLog = { ...newLogData, id: `dpl-${Date.now()}`, created_by: 'user-123' };
    dailyPrayerLogsStore.push(newLog);
    return Promise.resolve(newLog);
};
export const updateDailyPrayerLog = async (id: string, updates: Partial<DailyPrayerLog>): Promise<DailyPrayerLog> => {
    let updatedLog: DailyPrayerLog | undefined;
    dailyPrayerLogsStore = dailyPrayerLogsStore.map(log => {
        if (log.id === id) {
            updatedLog = { ...log, ...updates };
            return updatedLog;
        }
        return log;
    });
    if (updatedLog) {
        return Promise.resolve(updatedLog);
    }
    return Promise.reject(new Error("Prayer log not found"));
}

// --- Static Mock Data (No localStorage needed) ---
export const mockAIInsights: AIInsight[] = [];
export const getAIInsights = async (): Promise<AIInsight[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockAIInsights.filter(i => !i.is_read)), 400));
}

export const mockOpeningDuas: OpeningDua[] = [
    { id: 'dua-1', arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا, وَرِزْقًا طَيِّبًا, وَعَمَلًا مُتَقَبَّلًا', transliteration: 'Allahumma inni as\'aluka \'ilman nafi\'an, wa rizqan tayyiban, wa \'amalan mutaqabbalan', translation: 'O Allah, I ask You for knowledge that is of benefit, a good provision, and deeds that will be accepted.', spiritual_focus: 'Seeking a Blessed Day', context: 'morning' },
    { id: 'dua-2', arabic: 'بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ', transliteration: 'Bismika Rabbi wada\'tu janbi, wa bika arfa\'uhu', translation: 'In Your name my Lord, I lie down and in Your name I rise.', spiritual_focus: 'Trust in Allah for Rest', context: 'evening' },
    { id: 'dua-3', arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', transliteration: 'Rabbana atina fi dunya hasanah wa fil akhirati hasanah waqina \'adhaban naar', translation: 'Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.', spiritual_focus: 'Seeking Goodness in Both Worlds', context: 'general' },
];
export const getOpeningDuas = async (): Promise<OpeningDua[]> => Promise.resolve(mockOpeningDuas);

export const islamicWisdoms: IslamicWisdom[] = [
  { id: 'wisdom-1', content: "The believer is not one who eats his fill while his neighbor goes hungry.", source: "Prophet Muhammad ﷺ" },
  { id: 'wisdom-2', content: "Verily, with hardship, there is relief.", source: "Quran, 94:6" },
  { id: 'wisdom-3', content: "The best of you are those who are best to their families.", source: "Prophet Muhammad ﷺ" },
];
export const getBarakahBoostWisdom = async (): Promise<IslamicWisdom> => {
    const randomWisdom = islamicWisdoms[Math.floor(Math.random() * islamicWisdoms.length)];
    return Promise.resolve(randomWisdom);
}

export const mockDignityDares: DignityDare[] = [
    { id: 'dare-1', level: 1, title: 'Smile at a Stranger', description: 'Share a genuine smile with a stranger you pass by today. It\'s a form of charity.', category: 'connection' },
    { id: 'dare-2', level: 1, title: 'Secret Sadaqa', description: 'Give a small amount of charity secretly, where only Allah knows.', category: 'generosity', text: 'Secret Sadaqa' },
];
export const getDignityDare = async (level: number): Promise<DignityDare | null> => {
    const dare = mockDignityDares.find(d => d.level === level) || null;
    return Promise.resolve(dare);
}

export const mockPrayerTimes: PrayerTime[] = [
    { name: 'Fajr', time: '5:30 AM', isCompleted: false },
    { name: 'Dhuhr', time: '1:15 PM', isCompleted: false },
    { name: 'Asr', time: '4:45 PM', isCompleted: false },
    { name: 'Maghrib', time: '7:00 PM', isCompleted: false },
    { name: 'Isha', time: '8:30 PM', isCompleted: false },
];
export const getPrayerTimes = async (): Promise<PrayerTime[]> => Promise.resolve(mockPrayerTimes);

    