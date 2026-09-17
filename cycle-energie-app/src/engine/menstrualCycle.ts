import { daysBetween, mod } from './dateUtils';
import { QuadrantId } from './wheel';

export interface CycleProfile {
  /** Date de début des dernières règles connues. */
  lastPeriodStart: Date;
  /** Durée moyenne du cycle, en jours (défaut : 28). */
  cycleLength: number;
  /** Durée moyenne des règles, en jours (défaut : 5). */
  periodLength: number;
}

export const DEFAULT_CYCLE_LENGTH = 28;
export const DEFAULT_PERIOD_LENGTH = 5;

/** Jour du cycle (1 = premier jour des règles), pour une date donnée. */
export function getCycleDay(profile: CycleProfile, date: Date): number {
  const elapsed = daysBetween(profile.lastPeriodStart, date);
  return mod(elapsed, profile.cycleLength) + 1;
}

/**
 * Associe le jour du cycle à un quadrant de la roue.
 * L'ovulation est calée 14 jours avant les règles suivantes (phase lutéale
 * fixe à ~14 jours), quelle que soit la longueur totale du cycle.
 */
export function getMenstrualQuadrant(profile: CycleProfile, date: Date): QuadrantId {
  const day = getCycleDay(profile, date);
  const { cycleLength, periodLength } = profile;

  const ovulationDay = cycleLength - 14;
  const ovulationWindowStart = Math.max(periodLength + 1, ovulationDay - 1);
  const ovulationWindowEnd = Math.max(ovulationWindowStart, ovulationDay + 1);

  if (day <= periodLength) return 0; // menstruation
  if (day < ovulationWindowStart) return 1; // pré-ovulation
  if (day <= ovulationWindowEnd) return 2; // ovulation
  return 3; // pré-menstruation
}
