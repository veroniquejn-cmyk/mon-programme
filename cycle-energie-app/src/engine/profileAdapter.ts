import { parseISODate } from './dateUtils';
import { DEFAULT_CYCLE_LENGTH, DEFAULT_PERIOD_LENGTH } from './menstrualCycle';
import { UserProfile } from './synthesis';
import { StoredProfile } from '../storage/profile';

/** Convertit le profil stocké (dates en texte) en profil exploitable par le moteur de synthèse. */
export function toUserProfile(stored: StoredProfile): UserProfile {
  const profile: UserProfile = { birthDate: parseISODate(stored.birthDate) };
  if (stored.lastPeriodStart) {
    profile.cycle = {
      lastPeriodStart: parseISODate(stored.lastPeriodStart),
      cycleLength: stored.cycleLength ?? DEFAULT_CYCLE_LENGTH,
      periodLength: stored.periodLength ?? DEFAULT_PERIOD_LENGTH,
    };
  }
  return profile;
}
