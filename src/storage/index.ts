import AsyncStorage from '@react-native-async-storage/async-storage';

export const Keys = {
  theme: '@reorbita/theme',
  fleetCache: '@reorbita/fleet',
  missions: '@reorbita/missions',
  watchlist: '@reorbita/watchlist',
};

interface CacheEnvelope<T> {
  ts: number;
  data: T;
}

export async function cached<T>(key: string, ttlMs: number, fetcher: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const env = await loadJSON<CacheEnvelope<T> | null>(key, null);
  if (env && now - env.ts < ttlMs) return env.data;
  try {
    const data = await fetcher();
    await saveJSON(key, { ts: now, data });
    return data;
  } catch (e) {
    if (env) return env.data;
    throw e;
  }
}

export const loadJSON = async <T,>(key: string, fallback: T): Promise<T> => {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

export const saveJSON = async (key: string, value: unknown) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const remove = (key: string) => AsyncStorage.removeItem(key);
