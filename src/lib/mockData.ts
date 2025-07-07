
import { collection, query, where, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, setDoc, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';
import type { Habit, HabitLog, AIInsight, UserSettings, User, OpeningDua, IslamicWisdom, DignityDare, PrayerTime, DailyReflection, DailyPrayerLog, MuraqqabahReport } from '@/types';
import { format } from 'date-fns';

// --- User ---
export const getAppUser = async (userId: string): Promise<User | null> => {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } as User : null;
};
export const updateAppUser = async (userId: string, updates: Partial<User>): Promise<User> => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, updates);
    const updatedUser = await getAppUser(userId);
    if (!updatedUser) throw new Error("User not found after update");
    return updatedUser;
};

// --- UserSettings ---
export const getUserSettings = async (userId: string): Promise<UserSettings> => {
    const settingsDoc = await getDoc(doc(db, 'userSettings', userId));
    if (settingsDoc.exists()) {
        return { id: settingsDoc.id, ...settingsDoc.data() } as UserSettings;
    }
    // Create default settings if they don't exist
    const defaultSettings: Omit<UserSettings, 'id' | 'created_by'> = { 
        show_opening_dua: true, randomize_daily_dua: true, dua_audio_enabled: false, contextual_dua_mode: true, app_language: 'english', dark_mode: false, notifications_enabled: false, last_dua_shown_date: '', preferred_language: 'arabic_english',
    };
    const user = await getAppUser(userId);
    const newSettings = { ...defaultSettings, created_by: user?.email || '' };
    await setDoc(doc(db, 'userSettings', userId), newSettings);
    return { id: userId, ...newSettings };
}
export const updateUserSettings = async (userId: string, updates: Partial<UserSettings>): Promise<UserSettings> => {
    const settingsRef = doc(db, 'userSettings', userId);
    await updateDoc(settingsRef, updates);
    return getUserSettings(userId);
}
export const checkDuaSettings = async (userId: string): Promise<UserSettings> => getUserSettings(userId);


// --- Habits ---
export const getHabits = async (userId: string): Promise<Habit[]> => {
    const q = query(collection(db, 'habits'), where('created_by', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Habit));
}
export const updateHabit = async(habitId: string, updates: Partial<Habit>): Promise<Habit> => {
    const habitRef = doc(db, 'habits', habitId);
    await updateDoc(habitRef, updates);
    const updatedDoc = await getDoc(habitRef);
    return { id: updatedDoc.id, ...updatedDoc.data() } as Habit;
}
export const createHabit = async (userId: string, habitData: Omit<Habit, 'id' | 'streak_days' | 'best_streak' | 'created_by'>): Promise<Habit> => {
    const newHabitData = { ...habitData, streak_days: 0, best_streak: 0, created_by: userId };
    const docRef = await addDoc(collection(db, 'habits'), newHabitData);
    return { id: docRef.id, ...newHabitData };
}
export const deleteHabit = async (habitId: string): Promise<{ id: string }> => {
    // Also delete associated logs
    const logsQuery = query(collection(db, 'habitLogs'), where('habit_id', '==', habitId));
    const logsSnapshot = await getDocs(logsQuery);
    const deletePromises = logsSnapshot.docs.map(logDoc => deleteDoc(logDoc.ref));
    await Promise.all(deletePromises);

    await deleteDoc(doc(db, 'habits', habitId));
    return { id: habitId };
}

// --- HabitLogs ---
export const getHabitLogs = async (userId: string, date: string): Promise<HabitLog[]> => {
    const q = query(
        collection(db, 'habitLogs'), 
        where('created_by', '==', userId), 
        where('completion_date', '==', date)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HabitLog));
}
export const getAllHabitLogs = async (userId: string): Promise<HabitLog[]> => {
    const q = query(collection(db, 'habitLogs'), where('created_by', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HabitLog));
}
export const updateHabitLog = async (logId: string, updates: Partial<HabitLog>): Promise<HabitLog> => {
    const logRef = doc(db, 'habitLogs', logId);
    await updateDoc(logRef, updates);
    const updatedDoc = await getDoc(logRef);
    return { id: updatedDoc.id, ...updatedDoc.data() } as HabitLog;
}
export const createHabitLog = async (userId: string, newLogData: Omit<HabitLog, 'id' | 'created_by'>): Promise<HabitLog> => {
    const dataWithUser = { ...newLogData, created_by: userId };
    const docRef = await addDoc(collection(db, 'habitLogs'), dataWithUser);
    return { id: docRef.id, ...dataWithUser };
}


// --- Daily Reflections ---
export const getDailyReflections = async (userId: string): Promise<DailyReflection[]> => {
    const q = query(collection(db, 'dailyReflections'), where('created_by', '==', userId), orderBy('reflection_date', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DailyReflection));
};
export const createDailyReflection = async (userId: string, data: Omit<DailyReflection, 'id' | 'created_by'>): Promise<DailyReflection> => {
    const newReflectionData = { ...data, created_by: userId };
    const docRef = await addDoc(collection(db, 'dailyReflections'), newReflectionData);
    return { id: docRef.id, ...newReflectionData };
};
export const updateDailyReflection = async (id: string, updates: Partial<DailyReflection>): Promise<DailyReflection> => {
    const reflectionRef = doc(db, 'dailyReflections', id);
    await updateDoc(reflectionRef, updates);
    const updatedDoc = await getDoc(reflectionRef);
    return { id: updatedDoc.id, ...updatedDoc.data() } as DailyReflection;
};
export const deleteDailyReflection = async (id: string): Promise<{ id: string }> => {
    await deleteDoc(doc(db, 'dailyReflections', id));
    return { id };
}

// --- Daily Prayer Log ---
export const getDailyPrayerLogs = async (userId: string, date: string): Promise<DailyPrayerLog[]> => {
     const q = query(
        collection(db, 'dailyPrayerLogs'), 
        where('created_by', '==', userId), 
        where('completion_date', '==', date),
        limit(1)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DailyPrayerLog));
};

export const createDailyPrayerLog = async (userId: string, newLogData: Omit<DailyPrayerLog, 'id'|'created_by'>): Promise<DailyPrayerLog> => {
    const dataWithUser = { ...newLogData, created_by: userId };
    const docRef = await addDoc(collection(db, 'dailyPrayerLogs'), dataWithUser);
    return { id: docRef.id, ...dataWithUser };
};

export const updateDailyPrayerLog = async (id: string, updates: Partial<DailyPrayerLog>): Promise<DailyPrayerLog> => {
    const logRef = doc(db, 'dailyPrayerLogs', id);
    await updateDoc(logRef, updates);
    const updatedDoc = await getDoc(logRef);
    return { id: updatedDoc.id, ...updatedDoc.data() } as DailyPrayerLog;
}

// --- AI & Static Data (No change needed, these are universal) ---
export const getAIInsights = async (): Promise<AIInsight[]> => {
    return Promise.resolve([]); // Mocking empty for now
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
export const getDignityDare = async (level: number): Promise<DignityDare | null> => {
    const dares: DignityDare[] = [
        { id: 'dare-1', level: 1, title: 'Smile at a Stranger', text: 'Smile at a Stranger', description: 'Share a genuine smile with a stranger you pass by today. It\'s a form of charity.', category: 'connection' },
        { id: 'dare-2', level: 1, title: 'Secret Sadaqa', text: 'Secret Sadaqa', description: 'Give a small amount of charity secretly, where only Allah knows.', category: 'generosity' },
    ];
    return Promise.resolve(dares.find(d => d.level === level) || null);
}
