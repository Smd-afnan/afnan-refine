
/**
 * @fileoverview This script handles the scheduling of local notifications THAT ONLY RUN
 * WHEN THE APP IS OPEN IN A BROWSER TAB. It uses the browser's internal timers (setTimeout)
 * to trigger reminders for prayers and habits during an active session.
 */

import type { NotificationContextType } from '@/components/notifications/NotificationProvider';
import type { DailyPrayerLog } from '@/types';
import { getHabits, getHabitLogs, getDailyPrayerLogs, islamicWisdoms } from '@/lib/mockData';
import { format, differenceInMilliseconds } from 'date-fns';

const prayerTimes = [
    { name: 'Fajr', time: '05:30' },
    { name: 'Dhuhr', time: '13:15' },
    { name: 'Asr', time: '16:45' },
    { name: 'Maghrib', time: '19:00' },
    { name: 'Isha', time: '20:30' },
];

let hasScheduledToday = false;
let timeoutIds: NodeJS.Timeout[] = [];

const getTodaysDateForTime = (time: string): Date => {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

/**
 * Schedules notifications that only trigger while the app is open in a browser tab.
 * This does NOT handle background notifications for when the app is closed.
 * @param notifier The notification context from the NotificationProvider.
 * @param userId The ID of the currently logged-in user.
 */
export const scheduleDailyNotifications = async (notifier: NotificationContextType, userId: string) => {
    if (!notifier || notifier.permission !== 'granted' || hasScheduledToday) {
        return;
    }
    
    timeoutIds.forEach(clearTimeout);
    timeoutIds = [];
    hasScheduledToday = true;
    const now = new Date();
    const todayStr = format(now, 'yyyy-MM-dd');
    
    const wisdomTime = getTodaysDateForTime('09:00'); // 9 AM
    if (wisdomTime > now) {
        const delay = differenceInMilliseconds(wisdomTime, now);
        const id = setTimeout(() => {
            const randomWisdom = islamicWisdoms[Math.floor(Math.random() * islamicWisdoms.length)];
            notifier.notify('✨ Daily Wisdom', { body: `"${randomWisdom.content}" - ${randomWisdom.source}`, tag: `wisdom-${todayStr}` });
        }, delay);
        timeoutIds.push(id);
    }

    prayerTimes.forEach(prayer => {
        const prayerTime = getTodaysDateForTime(prayer.time);
        const reminderTime = new Date(prayerTime.getTime() - 5 * 60 * 1000); // 5 mins before
        const dbKey = `${prayer.name.toLowerCase()}_completed` as keyof Omit<DailyPrayerLog, 'id'|'completion_date'|'created_by'>;
        if (reminderTime > now) {
             const delay = differenceInMilliseconds(reminderTime, now);
             const id = setTimeout(async () => {
                 const [currentLogs] = await getDailyPrayerLogs(userId, todayStr);
                 if (currentLogs && !currentLogs[dbKey]) {
                    notifier.notify('🕌 Prayer Reminder', { body: `It's almost time for ${prayer.name} prayer.`, tag: `prayer-${prayer.name}-${todayStr}` });
                 }
             }, delay);
             timeoutIds.push(id);
        }
    });

    const incompleteReminderTime = getTodaysDateForTime('20:00'); // 8 PM
    if (incompleteReminderTime > now) {
        const delay = differenceInMilliseconds(incompleteReminderTime, now);
        const id = setTimeout(async () => {
            const habits = await getHabits(userId);
            const activeHabits = habits.filter(h => h.is_active);
            if (activeHabits.length === 0) return;
            const todayLogs = await getHabitLogs(userId, todayStr);
            const completedHabitIds = new Set(todayLogs.filter(log => log.status === 'completed').map(l => l.habit_id));
            const incompleteCount = activeHabits.filter(h => !completedHabitIds.has(h.id)).length;
            if (incompleteCount > 0) {
                notifier.notify('🌙 Evening Reminder', { body: `You still have ${incompleteCount} habit${incompleteCount > 1 ? 's' : ''} to complete today. Keep going!`, tag: `incomplete-tasks-${todayStr}` });
            }
        }, delay);
        timeoutIds.push(id);
    }

    const midnight = new Date();
    midnight.setHours(24, 0, 1, 0); // Start of tomorrow + 1 second
    const timeToMidnight = differenceInMilliseconds(midnight, now);
    const id = setTimeout(() => {
        hasScheduledToday = false;
        scheduleDailyNotifications(notifier, userId);
    }, timeToMidnight);
    timeoutIds.push(id);
};
