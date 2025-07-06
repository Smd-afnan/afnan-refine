import type { Habit, HabitLog, AIInsight, UserSettings, User, OpeningDua, IslamicWisdom, DignityDare, PrayerTime, DailyReflection, DailyPrayerLog } from '@/types';
import { format, subDays } from 'date-fns';

// Mock User
let mockUser: User = {
  id: 'user-123',
  email: 'believer@soulrefine.app',
  name: 'Spiritual Seeker',
  full_name: 'Spiritual Seeker'
};

export const getMockUser = async (): Promise<User> => {
    return new Promise(resolve => setTimeout(() => resolve(mockUser), 100));
}

export const updateUser = async (updates: Partial<User>): Promise<User> => {
    mockUser = { ...mockUser, ...updates };
    return new Promise(resolve => setTimeout(() => resolve(mockUser), 100));
};


// Mock UserSettings
let mockUserSettings: UserSettings = {
  id: 'settings-123',
  created_by: 'believer@soulrefine.app',
  show_opening_dua: true,
  randomize_daily_dua: true,
  dua_audio_enabled: false,
  contextual_dua_mode: true,
  app_language: 'english',
  dark_mode: false,
  notifications_enabled: false,
  last_dua_shown_date: '',
  preferred_language: 'arabic_english',
};

export const getMockUserSettings = async (email: string): Promise<UserSettings> => {
    return new Promise(resolve => setTimeout(() => resolve(mockUserSettings), 100));
}

export const updateMockUserSettings = async (email: string, updates: Partial<UserSettings>): Promise<UserSettings> => {
    mockUserSettings = { ...mockUserSettings, ...updates };
    return new Promise(resolve => setTimeout(() => resolve(mockUserSettings), 100));
}

export const checkDuaSettings = async (email: string): Promise<UserSettings> => {
    // In a real app, this would fetch or create settings
    return getMockUserSettings(email);
}

// Mock Habits
let mockHabits: Habit[] = [
  { id: 'habit-1', title: '5 Daily Prayers', is_active: true, streak_days: 0, best_streak: 0, category: 'worship', created_by: 'user-123' },
  { id: 'habit-2', title: 'Read a page of Quran', is_active: true, streak_days: 0, best_streak: 0, category: 'learning', created_by: 'user-123' },
  { id: 'habit-3', title: 'Morning walk', is_active: true, streak_days: 0, best_streak: 0, category: 'health', created_by: 'user-123' },
  { id: 'habit-4', title: 'Call parents', is_active: true, streak_days: 0, best_streak: 0, category: 'community', created_by: 'user-123' },
  { id: 'habit-5', title: 'Journal before sleep', is_active: false, streak_days: 0, best_streak: 0, category: 'self_care', created_by: 'user-123' },
];

export const getHabits = async (): Promise<Habit[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockHabits), 300));
}

// Mock HabitLogs
let mockHabitLogs: HabitLog[] = [];

export const getHabitLogs = async (date: string): Promise<HabitLog[]> => {
    const logsForDate = mockHabitLogs.filter(log => log.completion_date === date);
    return new Promise(resolve => setTimeout(() => resolve(logsForDate), 200));
}

export const getAllHabitLogs = async (): Promise<HabitLog[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockHabitLogs), 200));
}

export const updateHabitLog = async (logId: string, updates: Partial<HabitLog>): Promise<HabitLog> => {
    let updatedLog: HabitLog | undefined;
    mockHabitLogs = mockHabitLogs.map(log => {
        if (log.id === logId) {
            updatedLog = { ...log, ...updates };
            return updatedLog;
        }
        return log;
    });
    return new Promise((resolve, reject) => {
        if (updatedLog) setTimeout(() => resolve(updatedLog!), 150);
        else reject(new Error("Log not found"));
    });
}

export const createHabitLog = async (newLogData: Omit<HabitLog, 'id'>): Promise<HabitLog> => {
    const newLog: HabitLog = { ...newLogData, id: `log-${Date.now()}` };
    mockHabitLogs.push(newLog);
    return new Promise(resolve => setTimeout(() => resolve(newLog), 150));
}

export const updateHabit = async(habitId: string, updates: Partial<Habit>): Promise<Habit> => {
    let updatedHabit : Habit | undefined;
    const index = mockHabits.findIndex(h => h.id === habitId);
    if (index > -1) {
        mockHabits[index] = { ...mockHabits[index], ...updates };
        updatedHabit = mockHabits[index];
    }
     return new Promise((resolve, reject) => {
        if (updatedHabit) setTimeout(() => resolve(updatedHabit!), 150);
        else reject(new Error("Habit not found"));
    });
}

export const createHabit = async (habitData: Omit<Habit, 'id' | 'streak_days' | 'best_streak' | 'created_by'>): Promise<Habit> => {
    const newHabit: Habit = {
        id: `habit-${Date.now()}`,
        ...habitData,
        streak_days: 0,
        best_streak: 0,
        created_by: 'user-123'
    };
    mockHabits.unshift(newHabit);
    return new Promise(resolve => setTimeout(() => resolve(newHabit), 150));
}

export const deleteHabit = async (habitId: string): Promise<{ id: string }> => {
    mockHabits = mockHabits.filter(h => h.id !== habitId);
    mockHabitLogs = mockHabitLogs.filter(l => l.habit_id !== habitId);
    return new Promise(resolve => setTimeout(() => resolve({ id: habitId }), 150));
}


// Mock AIInsights
export const mockAIInsights: AIInsight[] = [];

export const getAIInsights = async (): Promise<AIInsight[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockAIInsights.filter(i => !i.is_read)), 400));
}

// Mock OpeningDuas
export const mockOpeningDuas: OpeningDua[] = [
    { id: 'dua-1', arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا, وَرِزْقًا طَيِّبًا, وَعَمَلًا مُتَقَبَّلًا', transliteration: 'Allahumma inni as\'aluka \'ilman nafi\'an, wa rizqan tayyiban, wa \'amalan mutaqabbalan', translation: 'O Allah, I ask You for knowledge that is of benefit, a good provision, and deeds that will be accepted.', spiritual_focus: 'Seeking a Blessed Day', context: 'morning' },
    { id: 'dua-2', arabic: 'بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ', transliteration: 'Bismika Rabbi wada\'tu janbi, wa bika arfa\'uhu', translation: 'In Your name my Lord, I lie down and in Your name I rise.', spiritual_focus: 'Trust in Allah for Rest', context: 'evening' },
    { id: 'dua-3', arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', transliteration: 'Rabbana atina fi dunya hasanah wa fil akhirati hasanah waqina \'adhaban naar', translation: 'Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.', spiritual_focus: 'Seeking Goodness in Both Worlds', context: 'general' },
];

export const getOpeningDuas = async (): Promise<OpeningDua[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockOpeningDuas), 100));
}

// Mock IslamicWisdom
export const islamicWisdoms: IslamicWisdom[] = [
  { id: 'wisdom-1', content: "The believer is not one who eats his fill while his neighbor goes hungry.", source: "Prophet Muhammad ﷺ" },
  { id: 'wisdom-2', content: "Verily, with hardship, there is relief.", source: "Quran, 94:6" },
  { id: 'wisdom-3', content: "The best of you are those who are best to their families.", source: "Prophet Muhammad ﷺ" },
];

export const getBarakahBoostWisdom = async (): Promise<IslamicWisdom> => {
    const randomWisdom = islamicWisdoms[Math.floor(Math.random() * islamicWisdoms.length)];
    return new Promise(resolve => setTimeout(() => resolve(randomWisdom), 200));
}

// Mock DignityDares
export const mockDignityDares: DignityDare[] = [
    { id: 'dare-1', level: 1, title: 'Smile at a Stranger', description: 'Share a genuine smile with a stranger you pass by today. It\'s a form of charity.', category: 'connection' },
    { id: 'dare-2', level: 1, title: 'Secret Sadaqa', description: 'Give a small amount of charity secretly, where only Allah knows.', category: 'generosity' },
];

export const getDignityDare = async (level: number): Promise<DignityDare | null> => {
    const dare = mockDignityDares.find(d => d.level === level) || null;
    return new Promise(resolve => setTimeout(() => resolve(dare), 100));
}

// Mock Prayer Times
export const mockPrayerTimes: PrayerTime[] = [
    { name: 'Fajr', time: '5:30 AM', isCompleted: false },
    { name: 'Dhuhr', time: '1:15 PM', isCompleted: false },
    { name: 'Asr', time: '4:45 PM', isCompleted: false },
    { name: 'Maghrib', time: '7:00 PM', isCompleted: false },
    { name: 'Isha', time: '8:30 PM', isCompleted: false },
];

export const getPrayerTimes = async (): Promise<PrayerTime[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockPrayerTimes), 250));
}

// Mock Daily Reflections
let mockDailyReflections: DailyReflection[] = [];

export const getDailyReflections = async (): Promise<DailyReflection[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockDailyReflections), 300));
};

export const createDailyReflection = async (data: Omit<DailyReflection, 'id' | 'created_by'>): Promise<DailyReflection> => {
    const newReflection: DailyReflection = {
        id: `ref-${Date.now()}`,
        ...data,
        created_by: 'user-123'
    };
    mockDailyReflections.unshift(newReflection);
    return new Promise(resolve => setTimeout(() => resolve(newReflection), 150));
};

export const updateDailyReflection = async (id: string, updates: Partial<DailyReflection>): Promise<DailyReflection> => {
    let updatedReflection: DailyReflection | undefined;
    mockDailyReflections = mockDailyReflections.map(r => {
        if (r.id === id) {
            updatedReflection = { ...r, ...updates };
            return updatedReflection;
        }
        return r;
    });
    return new Promise((resolve, reject) => {
        if (updatedReflection) setTimeout(() => resolve(updatedReflection!), 150);
        else reject(new Error("Reflection not found"));
    });
};

export const deleteDailyReflection = async (id: string): Promise<{ id: string }> => {
    mockDailyReflections = mockDailyReflections.filter(r => r.id !== id);
    return new Promise(resolve => setTimeout(() => resolve({ id }), 150));
}

// Mock Daily Prayer Log
let mockDailyPrayerLogs: DailyPrayerLog[] = [];

export const getDailyPrayerLogs = async (date?: string): Promise<DailyPrayerLog[]> => {
    if (date) {
        return new Promise(resolve => setTimeout(() => resolve(mockDailyPrayerLogs.filter(log => log.completion_date === date)), 100));
    }
    return new Promise(resolve => setTimeout(() => resolve(mockDailyPrayerLogs), 100));
};

export const updateDailyPrayerLog = async (id: string, updates: Partial<DailyPrayerLog>): Promise<DailyPrayerLog> => {
    let updatedLog: DailyPrayerLog | undefined;
    mockDailyPrayerLogs = mockDailyPrayerLogs.map(log => {
        if (log.id === id) {
            updatedLog = { ...log, ...updates };
            return updatedLog;
        }
        return log;
    });
     return new Promise((resolve, reject) => {
        if (updatedLog) setTimeout(() => resolve(updatedLog), 150);
        else reject(new Error("Prayer log not found"));
    });
}

export const createDailyPrayerLog = async (newLogData: Omit<DailyPrayerLog, 'id'|'created_by'>): Promise<DailyPrayerLog> => {
    const newLog: DailyPrayerLog = { ...newLogData, id: `dpl-${Date.now()}`, created_by: 'user-123' };
    mockDailyPrayerLogs.push(newLog);
    return new Promise(resolve => setTimeout(() => resolve(newLog), 150));
}
