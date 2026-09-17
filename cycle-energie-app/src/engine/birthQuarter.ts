import { fullMonthsBetween, mod } from './dateUtils';
import { QuadrantId } from './wheel';

/**
 * Phase "trimestre depuis la naissance" : une nouvelle phase tous les 3 mois
 * (trimestre), ancrée sur la date de naissance, qui boucle tous les ans sur
 * les 4 mêmes phases : Apprentissage -> Création -> Récolte -> Maîtrise.
 * Mêmes indices de quadrant que le reste de la roue (cf. wheel.ts).
 */
export function getBirthQuarterQuadrant(birthDate: Date, today: Date): QuadrantId {
  const monthsElapsed = fullMonthsBetween(birthDate, today);
  const quarterCount = Math.floor(monthsElapsed / 3);
  return mod(quarterCount, 4) as QuadrantId;
}
