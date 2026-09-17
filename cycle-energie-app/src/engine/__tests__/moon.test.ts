import { getMoonPhaseFraction, getMoonQuadrant, KNOWN_NEW_MOON_UTC, SYNODIC_MONTH_DAYS } from '../moon';

const MS_PER_DAY = 24 * 60 * 60 * 1000;
function atOffsetDays(days: number): Date {
  return new Date(KNOWN_NEW_MOON_UTC + days * MS_PER_DAY);
}

describe('getMoonPhaseFraction', () => {
  it('vaut ~0 exactement à la nouvelle lune de référence', () => {
    expect(getMoonPhaseFraction(atOffsetDays(0))).toBeCloseTo(0, 5);
  });

  it('vaut ~0.5 à la pleine lune (moitié du mois synodique)', () => {
    expect(getMoonPhaseFraction(atOffsetDays(SYNODIC_MONTH_DAYS / 2))).toBeCloseTo(0.5, 5);
  });

  it('boucle correctement après un mois synodique complet', () => {
    // Un tour complet ramène tout près de 0 (ou 1, selon les arrondis flottants).
    const phase = getMoonPhaseFraction(atOffsetDays(SYNODIC_MONTH_DAYS));
    expect(Math.min(phase, 1 - phase)).toBeLessThan(1e-6);
  });
});

describe('getMoonQuadrant', () => {
  it('nouvelle lune -> quadrant 0', () => {
    expect(getMoonQuadrant(atOffsetDays(0))).toBe(0);
  });
  it('premier quartier (~1/4 du mois) -> quadrant 1', () => {
    expect(getMoonQuadrant(atOffsetDays(SYNODIC_MONTH_DAYS * 0.25))).toBe(1);
  });
  it('pleine lune (~1/2 du mois) -> quadrant 2', () => {
    expect(getMoonQuadrant(atOffsetDays(SYNODIC_MONTH_DAYS * 0.5))).toBe(2);
  });
  it('dernier quartier (~3/4 du mois) -> quadrant 3', () => {
    expect(getMoonQuadrant(atOffsetDays(SYNODIC_MONTH_DAYS * 0.75))).toBe(3);
  });
});
