export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // ISO date string YYYY-MM-DD
  history: Record<string, boolean>; // e.g. { "2026-09-25": true }
  multiplier: number;
}

const STREAK_KEY = 'lms_streak_state_v1';

export function getStreakData(): StreakData {
  if (typeof window === 'undefined') {
    return { currentStreak: 1, longestStreak: 1, lastActiveDate: '', history: {}, multiplier: 1.0 };
  }

  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not read streak data', e);
  }

  const initial: StreakData = {
    currentStreak: 1,
    longestStreak: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
    history: { [new Date().toISOString().split('T')[0]]: true },
    multiplier: 1.0,
  };
  saveStreakData(initial);
  return initial;
}

export function saveStreakData(data: StreakData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STREAK_KEY, JSON.stringify(data));
}

export function recordDayActivity(): StreakData {
  const data = getStreakData();
  const today = new Date().toISOString().split('T')[0];

  if (data.lastActiveDate === today) {
    return data;
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (data.lastActiveDate === yesterday) {
    data.currentStreak += 1;
  } else if (data.lastActiveDate !== '') {
    data.currentStreak = 1; // streak reset
  }

  if (data.currentStreak > data.longestStreak) {
    data.longestStreak = data.currentStreak;
  }

  // Multiplier scaling
  data.multiplier = Math.min(2.5, 1.0 + data.currentStreak * 0.1);
  data.lastActiveDate = today;
  data.history[today] = true;

  saveStreakData(data);
  return data;
}