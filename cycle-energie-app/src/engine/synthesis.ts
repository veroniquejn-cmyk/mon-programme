import { getBirthQuarterQuadrant } from './birthQuarter';
import { CycleProfile, getMenstrualQuadrant } from './menstrualCycle';
import { getMoonQuadrant } from './moon';
import { getSeasonQuadrant } from './season';
import { QUADRANT_IDS, QuadrantId, QuadrantInfo, WHEEL } from './wheel';

export type ParamKey = 'cycle' | 'lune' | 'trimestre' | 'saison';

export interface ParamResult {
  key: ParamKey;
  label: string;
  quadrant: QuadrantId;
  info: QuadrantInfo;
}

export interface SynthesisResult {
  /** Détail des paramètres pris en compte, du plus au moins prioritaire. */
  params: ParamResult[];
  /** Quadrant(s) arrivé(s) en tête du vote à poids égal. */
  dominants: QuadrantId[];
  /** Info du quadrant dominant, après résolution d'une éventuelle égalité. */
  dominant: QuadrantInfo;
  /** true si plusieurs quadrants étaient ex æquo avant résolution. */
  isTie: boolean;
  /** Paramètre dont le résultat a été retenu pour trancher l'égalité (si isTie). */
  tieBreakParam?: ParamKey;
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
 * Ordre de priorité utilisé uniquement pour départager une égalité entre
 * quadrants (vote à poids égal sinon) : du plus personnel/rapide au plus
 * large/lent. C'est aussi l'ordre d'affichage des 4 paramètres à l'écran.
 */
export const PARAM_PRIORITY: ParamKey[] = ['cycle', 'lune', 'trimestre', 'saison'];

/**
 * Combine les 4 paramètres à poids égal : chacun "vote" pour un quadrant
 * de la roue, et le(s) quadrant(s) ayant le plus de voix l'emporte(nt).
 * En cas d'égalité, on tranche selon PARAM_PRIORITY (cycle > lune >
 * trimestre > saison) plutôt que de choisir arbitrairement.
 */
export function computeSynthesis(profile: UserProfile, today: Date): SynthesisResult {
  const byKey: Partial<Record<ParamKey, ParamResult>> = {};

  const seasonQuadrant = getSeasonQuadrant(today);
  byKey.saison = { key: 'saison', label: 'Saison', quadrant: seasonQuadrant, info: WHEEL[seasonQuadrant] };

  const moonQuadrant = getMoonQuadrant(today);
  byKey.lune = { key: 'lune', label: 'Phase lunaire', quadrant: moonQuadrant, info: WHEEL[moonQuadrant] };

  const birthQuarterQuadrant = getBirthQuarterQuadrant(profile.birthDate, today);
  byKey.trimestre = {
    key: 'trimestre',
    label: 'Trimestre de vie',
    quadrant: birthQuarterQuadrant,
    info: WHEEL[birthQuarterQuadrant],
  };

  if (profile.cycle) {
    const cycleQuadrant = getMenstrualQuadrant(profile.cycle, today);
    byKey.cycle = { key: 'cycle', label: 'Cycle menstruel', quadrant: cycleQuadrant, info: WHEEL[cycleQuadrant] };
  }

  const params = PARAM_PRIORITY.map((key) => byKey[key]).filter((p): p is ParamResult => p !== undefined);

  const votes: Record<QuadrantId, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };
  for (const p of params) votes[p.quadrant] += 1;

  const maxVotes = Math.max(...QUADRANT_IDS.map((id) => votes[id]));
  const dominants = QUADRANT_IDS.filter((id) => votes[id] === maxVotes);
  const isTie = dominants.length > 1;

  let dominant: QuadrantInfo;
  let tieBreakParam: ParamKey | undefined;

  if (!isTie) {
    dominant = WHEEL[dominants[0]];
  } else {
    const tieBreaker = params.find((p) => dominants.includes(p.quadrant));
    dominant = tieBreaker ? tieBreaker.info : WHEEL[dominants[0]];
    tieBreakParam = tieBreaker?.key;
  }

  return { params, dominants, dominant, isTie, tieBreakParam };
}
