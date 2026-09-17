import { ParamKey, ParamResult, resolveTier } from '../synthesis';
import { QUADRANT_IDS, QuadrantId, WHEEL } from '../wheel';

function param(key: ParamKey, quadrant: QuadrantId): ParamResult {
  return { key, label: key, quadrant, info: WHEEL[quadrant] };
}

describe('resolveTier — les 16 combinaisons brutes possibles pour chaque niveau', () => {
  describe('contexte de fond : trimestre de vie (prioritaire) × saison, 4×4 = 16 cas', () => {
    for (const trimestreQ of QUADRANT_IDS) {
      for (const saisonQ of QUADRANT_IDS) {
        it(`trimestre=${trimestreQ}, saison=${saisonQ}`, () => {
          const result = resolveTier([param('trimestre', trimestreQ), param('saison', saisonQ)]);
          if (trimestreQ === saisonQ) {
            expect(result.isTie).toBe(false);
            expect(result.tieBreakParam).toBeUndefined();
            expect(result.quadrant).toBe(trimestreQ);
          } else {
            expect(result.isTie).toBe(true);
            expect(result.tieBreakParam).toBe('trimestre');
            expect(result.quadrant).toBe(trimestreQ);
          }
        });
      }
    }
  });

  describe('nuance du jour : cycle menstruel (prioritaire) × phase lunaire, 4×4 = 16 cas', () => {
    for (const cycleQ of QUADRANT_IDS) {
      for (const luneQ of QUADRANT_IDS) {
        it(`cycle=${cycleQ}, lune=${luneQ}`, () => {
          const result = resolveTier([param('cycle', cycleQ), param('lune', luneQ)]);
          if (cycleQ === luneQ) {
            expect(result.isTie).toBe(false);
            expect(result.tieBreakParam).toBeUndefined();
            expect(result.quadrant).toBe(cycleQ);
          } else {
            expect(result.isTie).toBe(true);
            expect(result.tieBreakParam).toBe('cycle');
            expect(result.quadrant).toBe(cycleQ);
          }
        });
      }
    }
  });

  describe('nuance du jour sans cycle renseigné : phase lunaire seule, 4 cas', () => {
    for (const luneQ of QUADRANT_IDS) {
      it(`lune=${luneQ}`, () => {
        const result = resolveTier([param('lune', luneQ)]);
        expect(result.isTie).toBe(false);
        expect(result.tieBreakParam).toBeUndefined();
        expect(result.quadrant).toBe(luneQ);
      });
    }
  });

  it('couvre bien 16 + 16 + 4 = 36 cas bruts, qui se réduisent à 4×4 = 16 conclusions possibles', () => {
    expect(QUADRANT_IDS.length * QUADRANT_IDS.length * 2 + QUADRANT_IDS.length).toBe(36);
  });
});
