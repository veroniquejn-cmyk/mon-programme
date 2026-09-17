import { getBirthQuarterQuadrant } from './birthQuarter';
import { CycleProfile, getMenstrualQuadrant } from './menstrualCycle';
import { getMoonQuadrant } from './moon';
import { getSeasonQuadrant } from './season';
import { QUADRANT_IDS, QuadrantId, QuadrantInfo, WHEEL } from './wheel';

export type ParamKey = 'cycle' | 'saison' | 'lune' | 'trimestre';

export interface ParamResult {
  key: ParamKey;
  label: string;
  quadrant: QuadrantId;
  info: QuadrantInfo;
}

export interface SynthesisResult {
  /** Détail des paramètres pris en compte, dans l'ordre. */
  params: ParamResult[];
  /** Quadrant(s) arrivé(s) en tête du vote à poids égal. */
  dominants: QuadrantId[];
  /** Info du quadrant dominant (le premier en cas d'égalité). */
  dominant: QuadrantInfo;
  /** true si plusieurs quadrants sont ex æquo. */
  isTie: boolean;
}

export interface UserProfile {
  birthDate: Date;
  /** Optionnel : si la personne n'a pas de cycle menstruel régulier
   * (ménopause, grossesse, contraception hormonale continue, etc.),
   * ce paramètre est omis et la synthèse se fait sur les 3 autres,
   * toujours à poids égal. */
  cycle?: CycleProfile;
}

/**
 * Combine les 4 paramètres à poids égal : chacun "vote" pour un quadrant
 * de la roue, et le(s) quadrant(s) ayant le plus de voix l'emporte(nt).
 * En cas d'égalité, tous les quadrants ex æquo sont renvoyés pour que
 * l'écran puisse afficher une synthèse nuancée plutôt qu'un résultat
 * arbitraire.
 */
export function computeSynthesis(profile: UserProfile, today: Date): SynthesisResult {
  const params: ParamResult[] = [];

  params.push({
    key: 'saison',
    label: 'Saison',
    quadrant: getSeasonQuadrant(today),
    info: WHEEL[getSeasonQuadrant(today)],
  });
  params.push({
    key: 'lune',
    label: 'Phase lunaire',
    quadrant: getMoonQuadrant(today),
    info: WHEEL[getMoonQuadrant(today)],
  });
  params.push({
    key: 'trimestre',
    label: 'Trimestre de vie',
    quadrant: getBirthQuarterQuadrant(profile.birthDate, today),
    info: WHEEL[getBirthQuarterQuadrant(profile.birthDate, today)],
  });
  if (profile.cycle) {
    const q = getMenstrualQuadrant(profile.cycle, today);
    params.push({ key: 'cycle', label: 'Cycle menstruel', quadrant: q, info: WHEEL[q] });
  }

  const votes: Record<QuadrantId, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };
  for (const p of params) votes[p.quadrant] += 1;

  const maxVotes = Math.max(...QUADRANT_IDS.map((id) => votes[id]));
  const dominants = QUADRANT_IDS.filter((id) => votes[id] === maxVotes);

  return {
    params,
    dominants,
    dominant: WHEEL[dominants[0]],
    isTie: dominants.length > 1,
  };
}
