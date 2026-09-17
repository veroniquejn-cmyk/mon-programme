import { QuadrantId } from './wheel';

/**
 * Saison météorologique (hémisphère nord) pour une date donnée.
 * Découpage par mois complet, plus simple et prévisible qu'un calcul
 * d'équinoxes/solstices précis au jour près, largement suffisant ici.
 *
 * Hiver -> quadrant 0, Printemps -> 1, Été -> 2, Automne -> 3
 * (mêmes indices que le cycle menstruel, cf. wheel.ts)
 */
export function getSeasonQuadrant(date: Date): QuadrantId {
  const month = date.getUTCMonth(); // 0 = janvier
  if (month === 11 || month === 0 || month === 1) return 0; // déc, jan, fév -> hiver
  if (month >= 2 && month <= 4) return 1; // mars, avr, mai -> printemps
  if (month >= 5 && month <= 7) return 2; // juin, juil, août -> été
  return 3; // sept, oct, nov -> automne
}
