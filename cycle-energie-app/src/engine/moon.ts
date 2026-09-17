import { QuadrantId } from './wheel';

// Nouvelle lune de référence connue : 6 janvier 2000, 18:14 UTC.
export const KNOWN_NEW_MOON_UTC = Date.UTC(2000, 0, 6, 18, 14, 0);
export const SYNODIC_MONTH_DAYS = 29.530588853;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Retourne l'avancement dans le cycle lunaire, entre 0 (nouvelle lune) et 1 (nouvelle lune suivante). */
export function getMoonPhaseFraction(date: Date): number {
  const daysSinceRef = (date.getTime() - KNOWN_NEW_MOON_UTC) / MS_PER_DAY;
  const phase = ((daysSinceRef % SYNODIC_MONTH_DAYS) + SYNODIC_MONTH_DAYS) % SYNODIC_MONTH_DAYS;
  return phase / SYNODIC_MONTH_DAYS;
}

/**
 * Associe la phase lunaire réelle à un quadrant de la roue, selon la
 * correspondance symbolique classique : nouvelle lune ~ menstruation,
 * lune montante ~ pré-ovulation, pleine lune ~ ovulation, lune descendante
 * ~ pré-menstruation (mêmes indices que wheel.ts).
 */
export function getMoonQuadrant(date: Date): QuadrantId {
  const f = getMoonPhaseFraction(date);
  if (f < 0.125 || f >= 0.875) return 0; // nouvelle lune
  if (f < 0.375) return 1; // premier quartier / lune montante
  if (f < 0.625) return 2; // pleine lune
  return 3; // dernier quartier / lune descendante
}
