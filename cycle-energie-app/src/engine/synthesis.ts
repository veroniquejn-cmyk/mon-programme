import { getBirthQuarterQuadrant } from './birthQuarter';
import { CycleProfile, getMenstrualQuadrant } from './menstrualCycle';
import { getMoonQuadrant } from './moon';
import { getSeasonQuadrant } from './season';
import { QuadrantId, QuadrantInfo, WHEEL } from './wheel';

export type ParamKey = 'cycle' | 'lune' | 'trimestre' | 'saison';

export interface ParamResult {
  key: ParamKey;
  label: string;
  quadrant: QuadrantId;
  info: QuadrantInfo;
}

/**
 * Résultat d'un "niveau" de la synthèse (contexte de fond ou nuance du
 * jour) : le quadrant retenu, et si les paramètres de ce niveau étaient en
 * désaccord, lequel a été retenu en priorité.
 */
export interface TierResult {
  quadrant: QuadrantId;
  info: QuadrantInfo;
  /** true si les paramètres de ce niveau ne pointaient pas vers le même quadrant. */
  isTie: boolean;
  tieBreakParam?: ParamKey;
}

export interface SynthesisResult {
  /** Détail des 4 paramètres, du plus au moins personnel, pour l'affichage détaillé. */
  params: ParamResult[];
  /**
   * "Contexte de fond" : la tendance de fond, lente, donnée par la saison et
   * le trimestre de vie. Ne doit jamais être éclipsée par le cycle du jour.
   */
  macro: TierResult;
  /**
   * "Nuance du jour" : la coloration plus rapide, personnelle, donnée par
   * le cycle menstruel (si renseigné) et la phase lunaire.
   */
  micro: TierResult;
  /** true si le contexte de fond et la nuance du jour vont dans le même sens (même énergie). */
  aligned: boolean;
}

export interface UserProfile {
  birthDate: Date;
  /** Optionnel : si la personne n'a pas de cycle menstruel régulier
   * (ménopause, grossesse, contraception hormonale continue, etc.),
   * ce paramètre est omis et la nuance du jour repose sur la seule phase
   * lunaire. */
  cycle?: CycleProfile;
}

/** Ordre d'affichage des 4 paramètres, du plus personnel/rapide au plus large/lent. */
export const PARAM_PRIORITY: ParamKey[] = ['cycle', 'lune', 'trimestre', 'saison'];

/**
 * Résout un niveau (1 ou 2 paramètres, déjà triés par priorité) : si les
 * paramètres pointent vers le même quadrant, pas de conflit. Sinon, le
 * premier de la liste (le plus prioritaire) tranche.
 */
function resolveTier(itemsByPriority: ParamResult[]): TierResult {
  const [primary, secondary] = itemsByPriority;
  if (!secondary || primary.quadrant === secondary.quadrant) {
    return { quadrant: primary.quadrant, info: primary.info, isTie: false };
  }
  return { quadrant: primary.quadrant, info: primary.info, isTie: true, tieBreakParam: primary.key };
}

/**
 * Calcule la synthèse du jour en deux niveaux plutôt qu'un vote unique à 4 :
 * - le "contexte de fond" (saison + trimestre de vie) porte la tendance
 *   lente et n'est jamais réduit au silence par le cycle du jour ;
 * - la "nuance du jour" (cycle menstruel + phase lunaire) vient colorer ce
 *   contexte sans jamais le contredire sur les grandes décisions.
 * `aligned` indique si les deux niveaux vont dans le même sens (même
 * énergie féminine/masculine), pour permettre à l'écran de nuancer le
 * conseil plutôt que de trancher arbitrairement en cas de désaccord.
 */
export function computeSynthesis(profile: UserProfile, today: Date): SynthesisResult {
  const seasonQuadrant = getSeasonQuadrant(today);
  const saisonParam: ParamResult = { key: 'saison', label: 'Saison', quadrant: seasonQuadrant, info: WHEEL[seasonQuadrant] };

  const moonQuadrant = getMoonQuadrant(today);
  const luneParam: ParamResult = { key: 'lune', label: 'Phase lunaire', quadrant: moonQuadrant, info: WHEEL[moonQuadrant] };

  const birthQuarterQuadrant = getBirthQuarterQuadrant(profile.birthDate, today);
  const trimestreParam: ParamResult = {
    key: 'trimestre',
    label: 'Trimestre de vie',
    quadrant: birthQuarterQuadrant,
    info: WHEEL[birthQuarterQuadrant],
  };

  let cycleParam: ParamResult | undefined;
  if (profile.cycle) {
    const cycleQuadrant = getMenstrualQuadrant(profile.cycle, today);
    cycleParam = { key: 'cycle', label: 'Cycle menstruel', quadrant: cycleQuadrant, info: WHEEL[cycleQuadrant] };
  }

  const byKey: Record<ParamKey, ParamResult | undefined> = {
    cycle: cycleParam,
    lune: luneParam,
    trimestre: trimestreParam,
    saison: saisonParam,
  };
  const params = PARAM_PRIORITY.map((key) => byKey[key]).filter((p): p is ParamResult => p !== undefined);

  const macro = resolveTier([trimestreParam, saisonParam]);
  const micro = resolveTier(cycleParam ? [cycleParam, luneParam] : [luneParam]);
  const aligned = macro.info.energie === micro.info.energie;

  return { params, macro, micro, aligned };
}
