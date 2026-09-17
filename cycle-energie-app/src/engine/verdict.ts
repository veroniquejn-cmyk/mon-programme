import { TierResult } from './synthesis';

export type VerdictCategory = 'harmonieuse' | 'equilibree' | 'disharmonieuse';

export interface Verdict {
  category: VerdictCategory;
  text: string;
}

/**
 * Bilan du jour qui articule le contexte de fond et la nuance du jour, sans
 * jamais laisser la nuance du jour contredire le contexte de fond sur les
 * grandes décisions (ex. lancer un projet en pleine saison de repos), et
 * sans répéter les phrases déjà affichées dans les cartes "Contexte de
 * fond" / "Nuance du jour" juste au-dessus.
 *
 * Trois catégories :
 * - harmonieuse : les deux niveaux vont dans le même sens, et chacun est
 *   lui-même sans tension interne (saison/trimestre d'accord, cycle/lune
 *   d'accord) -> confirmation nette.
 * - équilibrée : les deux niveaux vont globalement dans le même sens, mais
 *   l'un des deux est un point d'équilibre entre deux influences internes
 *   qui ne s'accordaient pas parfaitement -> nuance légère.
 * - disharmonieuse : les deux niveaux tirent dans des sens opposés
 *   (énergie féminine vs masculine) -> nuance plus marquée, sans jamais
 *   pousser à l'action si le contexte de fond invite au repli.
 *
 * Générique : ne dépend pas du quadrant précis, seulement de l'énergie et
 * de l'éventuelle tension interne de chaque niveau, donc couvre par
 * construction les 4×4 = 16 combinaisons résolues possibles (voir
 * __tests__/verdict.test.ts) — elles-mêmes issues des 256 combinaisons
 * brutes couvertes par __tests__/resolveTier.test.ts.
 */
export function getVerdict(macro: TierResult, micro: TierResult, aligned: boolean): Verdict {
  const macroAction = macro.info.action.toLowerCase();
  const microAction = micro.info.action.toLowerCase();
  const hasInternalTension = macro.isTie || micro.isTie;

  if (aligned && !hasInternalTension) {
    return {
      category: 'harmonieuse',
      text: `Tout est aligné aujourd'hui : le contexte de fond (${macroAction}) et ta nuance du jour (${microAction}) vont dans le même sens. C'est une journée limpide pour conjuguer les deux et t'y consacrer pleinement.`,
    };
  }

  if (aligned) {
    const tierName = macro.isTie
      ? 'ton contexte de fond (saison et trimestre de vie)'
      : 'ta nuance du jour (cycle menstruel et phase lunaire)';
    return {
      category: 'equilibree',
      text: `Dans l'ensemble, tout t'invite à ${macroAction} aujourd'hui, en écho avec ta nuance du jour (${microAction}). Mais ${tierName} est lui-même un point d'équilibre entre deux influences qui ne s'accordent pas totalement — une petite tension à observer, sans remettre en cause la direction générale.`,
    };
  }

  if (macro.info.energie === 'feminine' && micro.info.energie === 'masculine') {
    return {
      category: 'disharmonieuse',
      text: `Le contexte de fond invite au repli (${macroAction}) alors que ta nuance du jour est motivante (${microAction}). Vis cet élan à petite échelle, en interne, plutôt que de te lancer aujourd'hui dans quelque chose de grand ou de visible.`,
    };
  }

  return {
    category: 'disharmonieuse',
    text: `Le contexte de fond est porteur (${macroAction}) alors que ta nuance du jour est plus intérieure (${microAction}). Avance à ton rythme, sans te forcer, en respectant ce besoin de douceur aujourd'hui.`,
  };
}
