/**
 * Table de correspondance de la "roue cyclique" (cf. schémas fournis par Véronique).
 *
 * Les 4 paramètres de l'app (cycle menstruel, saison réelle, phase lunaire,
 * trimestre depuis la naissance) sont chacun ramenés à un indice de quadrant
 * 0-3, puis on lit ici les attributs (élément, énergie, archétype, action...)
 * associés à ce quadrant.
 *
 * Modèle des 4 archétypes du cycle féminin (confirmé par Véronique) :
 * Vierge = pré-ovulation/printemps, Femme/Mère = ovulation/été,
 * Femme sauvage = pré-menstruation/automne, Femme sage = menstruation/hiver.
 */

import { ElementKey } from '../theme/colors';

export type Energie = 'feminine' | 'masculine';

export type QuadrantId = 0 | 1 | 2 | 3;

export interface QuadrantInfo {
  id: QuadrantId;
  /** Nom de la phase du cycle menstruel associée */
  phaseCycle: string;
  /** Saison symbolique / réelle associée (hémisphère nord) */
  saison: string;
  saisonSlogan: string;
  element: ElementKey;
  energie: Energie;
  /** Nom de la phase "trimestre depuis la naissance" */
  phaseVie: string;
  /** Archétype associé */
  archetype: string;
  /** Phase lunaire associée */
  phaseLune: string;
  /** Titre court de l'énergie dominante */
  energieTitre: string;
  /** L'émotion à laquelle cette phase connecte, reprise des schémas d'origine */
  emotion: string;
  /** Recommandation d'action principale */
  action: string;
  /** Description plus longue de l'action recommandée */
  actionDetail: string;
}

export const WHEEL: Record<QuadrantId, QuadrantInfo> = {
  0: {
    id: 0,
    phaseCycle: 'Menstruation',
    saison: 'Hiver',
    saisonSlogan: 'Repos',
    element: 'terre',
    energie: 'feminine',
    phaseVie: 'Apprentissage',
    archetype: 'Femme sage',
    phaseLune: 'Nouvelle lune',
    energieTitre: 'Énergie réflective',
    emotion: 'Connectée aux émotions de la sagesse',
    action: 'Se reposer',
    actionDetail:
      "Ralentis, écoute-toi, retire-toi si besoin. C'est le moment d'observer, de faire le bilan et d'apprendre de ce qui vient de se passer plutôt que d'agir.",
  },
  1: {
    id: 1,
    phaseCycle: 'Pré-ovulation',
    saison: 'Printemps',
    saisonSlogan: 'Bourgeon',
    element: 'air',
    energie: 'masculine',
    phaseVie: 'Création',
    archetype: 'Vierge',
    phaseLune: 'Premier quartier',
    energieTitre: 'Énergie créative',
    emotion: 'Connectée aux émotions du jeu et des possibilités',
    action: 'Créer un projet',
    actionDetail:
      "Explore, imagine, lance de nouvelles idées. L'énergie monte : c'est le bon moment pour semer, initier, oser des choses nouvelles.",
  },
  2: {
    id: 2,
    phaseCycle: 'Ovulation',
    saison: 'Été',
    saisonSlogan: 'Fleuraison',
    element: 'feu',
    energie: 'masculine',
    phaseVie: 'Récolte',
    archetype: 'Femme / Mère',
    phaseLune: 'Pleine lune',
    energieTitre: 'Énergie action dynamique',
    emotion: "Connectée aux émotions de l'action",
    action: 'Agir',
    actionDetail:
      "Rayonne, communique, concrétise. C'est le pic d'énergie du cycle : le moment idéal pour te dépasser, présenter, décider, avancer.",
  },
  3: {
    id: 3,
    phaseCycle: 'Pré-menstruation',
    saison: 'Automne',
    saisonSlogan: 'Libération',
    element: 'eau',
    energie: 'feminine',
    phaseVie: 'Maîtrise',
    archetype: 'Femme sauvage',
    phaseLune: 'Dernier quartier',
    energieTitre: 'Énergie de transformation',
    emotion: 'Connectée aux émotions à être transmutées',
    action: 'Se libérer',
    actionDetail:
      "Trie, termine, transmets. C'est le moment de lâcher-prise sur ce qui ne sert plus, de transmuter et de refermer les boucles avant le repos.",
  },
};

export const QUADRANT_IDS: QuadrantId[] = [0, 1, 2, 3];
