import { QUADRANT_IDS, WHEEL } from '../wheel';
import { TierResult } from '../synthesis';
import { getVerdict, VerdictCategory } from '../verdict';

function tier(quadrant: (typeof QUADRANT_IDS)[number], isTie = false): TierResult {
  return { quadrant, info: WHEEL[quadrant], isTie };
}

function expectedCategory(aligned: boolean, macroTie: boolean, microTie: boolean): VerdictCategory {
  if (!aligned) return 'disharmonieuse';
  return macroTie || microTie ? 'equilibree' : 'harmonieuse';
}

describe('getVerdict — les 16 combinaisons résolues (contexte de fond × nuance du jour), tension interne comprise', () => {
  for (const macroQ of QUADRANT_IDS) {
    for (const microQ of QUADRANT_IDS) {
      for (const macroTie of [false, true]) {
        for (const microTie of [false, true]) {
          it(`fond=${WHEEL[macroQ].phaseVie}(${WHEEL[macroQ].energie}${macroTie ? ',tendu' : ''}) + jour=${WHEEL[microQ].phaseCycle}(${WHEEL[microQ].energie}${microTie ? ',tendu' : ''})`, () => {
            const macro = tier(macroQ, macroTie);
            const micro = tier(microQ, microTie);
            const aligned = macro.info.energie === micro.info.energie;

            const verdict = getVerdict(macro, micro, aligned);
            const lower = verdict.text.toLowerCase();

            expect(verdict.category).toBe(expectedCategory(aligned, macroTie, microTie));

            // Les deux niveaux doivent toujours apparaître : jamais l'un ne fait
            // disparaître silencieusement l'autre.
            expect(lower).toContain(macro.info.action.toLowerCase());
            expect(lower).toContain(micro.info.action.toLowerCase());

            // Jamais de répétition mot pour mot des phrases déjà affichées
            // dans les cartes "Contexte de fond" / "Nuance du jour".
            expect(verdict.text).not.toContain(macro.info.actionDetail);
            expect(verdict.text).not.toContain(micro.info.actionDetail);

            if (!aligned && macro.info.energie === 'feminine') {
              expect(lower).toContain('petite échelle');
            } else if (!aligned) {
              expect(lower).toContain('à ton rythme');
            }
          });
        }
      }
    }
  }

  it('couvre bien 16 × 4 = 64 cas (résolu × tension interne de chaque niveau)', () => {
    expect(QUADRANT_IDS.length * QUADRANT_IDS.length * 4).toBe(64);
  });
});
