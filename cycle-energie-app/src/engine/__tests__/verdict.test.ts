import { QUADRANT_IDS, WHEEL } from '../wheel';
import { TierResult } from '../synthesis';
import { getVerdictText } from '../verdict';

function tier(quadrant: (typeof QUADRANT_IDS)[number]): TierResult {
  return { quadrant, info: WHEEL[quadrant], isTie: false };
}

describe('getVerdictText — les 16 combinaisons possibles (4 contextes de fond × 4 nuances du jour)', () => {
  for (const macroQ of QUADRANT_IDS) {
    for (const microQ of QUADRANT_IDS) {
      it(`contexte de fond=${WHEEL[macroQ].phaseVie} (${WHEEL[macroQ].energie}) + nuance du jour=${WHEEL[microQ].phaseCycle} (${WHEEL[microQ].energie})`, () => {
        const macro = tier(macroQ);
        const micro = tier(microQ);
        const aligned = macro.info.energie === micro.info.energie;

        const text = getVerdictText(macro, micro, aligned);
        const lower = text.toLowerCase();

        // Les deux niveaux doivent toujours apparaître dans le texte : jamais l'un
        // ne doit faire disparaître silencieusement l'autre.
        expect(lower).toContain(macro.info.action.toLowerCase());
        expect(lower).toContain(micro.info.action.toLowerCase());

        if (aligned) {
          expect(lower).toContain('même sens');
        } else if (macro.info.energie === 'feminine' && micro.info.energie === 'masculine') {
          // Le cas qui posait problème initialement : le cycle du jour ne doit
          // jamais pousser à un grand lancement quand le contexte de fond est
          // introspectif — le texte doit explicitement tempérer.
          expect(lower).toContain('petite échelle');
        } else {
          expect(lower).toContain('à ton rythme');
        }
      });
    }
  }

  it('couvre bien 16 cas au total (4x4)', () => {
    expect(QUADRANT_IDS.length * QUADRANT_IDS.length).toBe(16);
  });
});
