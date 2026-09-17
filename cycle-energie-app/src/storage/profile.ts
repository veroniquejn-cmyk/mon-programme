import AsyncStorage from '@react-native-async-storage/async-storage';
import { ISODate } from '../engine/dateUtils';

const STORAGE_KEY = 'cycle_energie_profile_v1';

export interface StoredProfile {
  birthDate: ISODate;
  /** Si absent : pas de cycle menstruel régulier renseigné. */
  lastPeriodStart?: ISODate;
  cycleLength?: number;
  periodLength?: number;
}

export async function loadProfile(): Promise<StoredProfile | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredProfile) : null;
  } catch {
    return null;
  }
}

export async function saveProfile(profile: StoredProfile): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export async function clearProfile(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
