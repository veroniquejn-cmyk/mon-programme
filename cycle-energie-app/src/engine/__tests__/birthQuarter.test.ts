import { getBirthQuarterQuadrant } from '../birthQuarter';

describe('getBirthQuarterQuadrant', () => {
  const birth = new Date(Date.UTC(1990, 5, 10)); // 10 juin 1990

  it('quadrant 0 (Apprentissage) juste après l\'anniversaire', () => {
    expect(getBirthQuarterQuadrant(birth, new Date(Date.UTC(2025, 5, 15)))).toBe(0);
  });

  it('quadrant 1 (Création) après le 1er trimestre', () => {
    expect(getBirthQuarterQuadrant(birth, new Date(Date.UTC(2025, 8, 15)))).toBe(1);
  });

  it('quadrant 2 (Récolte) après le 2e trimestre', () => {
    expect(getBirthQuarterQuadrant(birth, new Date(Date.UTC(2025, 11, 15)))).toBe(2);
  });

  it('quadrant 3 (Maîtrise) après le 3e trimestre', () => {
    expect(getBirthQuarterQuadrant(birth, new Date(Date.UTC(2026, 2, 15)))).toBe(3);
  });

  it('reboucle en quadrant 0 après 4 trimestres (retour proche de l\'anniversaire)', () => {
    expect(getBirthQuarterQuadrant(birth, new Date(Date.UTC(2026, 5, 15)))).toBe(0);
  });
});
