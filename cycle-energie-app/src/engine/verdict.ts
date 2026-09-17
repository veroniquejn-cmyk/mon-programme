import { TierResult } from './synthesis';

/**
 * Texte de synthèse qui articule le contexte de fond et la nuance du jour,
 * sans jamais laisser la nuance du jour contredire le contexte de fond sur
 * les grandes décisions (ex. lancer un projet en pleine saison de repos).
 *
 * Générique : ne dépend pas du quadrant précis, seulement de l'énergie
 * (féminine/masculine) de chaque niveau, donc couvre par construction les
 * 4×4 = 16 combinaisons possibles entre contexte de fond et nuance du jour
 * (voir __tests__/verdict.test.ts qui les vérifie toutes).
 */
export function getVerdictText(macro: TierResult, micro: TierResult, aligned: boolean): string {
  const macroAction = macro.info.action.toLowerCase();
  const microAction = micro.info.action.toLowerCase();

  if (aligned) {
    return `Le contexte de fond et ta nuance du jour vont dans le même sens aujourd'hui : tout t'invite à ${macroAction}, avec en plus la couleur du moment présent (${microAction}). C'est le bon jour pour suivre cet élan sans retenue.`;
  }

  if (macro.info.energie === 'feminine' && micro.info.energie === 'masculine') {
    return `Le contexte plus large (saison + trimestre de vie) invite plutôt à ${macroAction} : ${macro.info.actionDetail} Ta nuance du jour est plus motivante (${microAction}) — vis cet élan à petite échelle, en interne, plutôt que de te lancer aujourd'hui dans quelque chose de grand ou de visible.`;
  }

  return `Le contexte plus large (saison + trimestre de vie) est plutôt favorable à ${macroAction} : ${macro.info.actionDetail} Ta nuance du jour est plus intérieure (${microAction}) — avance à ton rythme, sans te forcer, en respectant ce besoin de douceur aujourd'hui.`;
}
