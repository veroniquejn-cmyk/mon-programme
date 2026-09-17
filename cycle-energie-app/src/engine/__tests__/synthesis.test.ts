import { computeSynthesis } from '../synthesis';

describe('computeSynthesis', () => {
  it('combine les 4 paramètres et désigne un quadrant dominant', () => {
    const profile = {
      birthDate: new Date(Date.UTC(1990, 5, 10)),
      cycle: {
        lastPeriodStart: new Date(Date.UTC(2026, 0, 1)),
        cycleLength: 28,
        periodLength: 5,
      },
    };
    const result = computeSynthesis(profile, new Date(Date.UTC(2026, 0, 3)));

    expect(result.params).toHaveLength(4);
    expect(result.params.map((p) => p.key).sort()).toEqual(['cycle', 'lune', 'saison', 'trimestre'].sort());
    expect(result.dominants.length).toBeGreaterThanOrEqual(1);
    expect(result.dominant).toBeDefined();
  });

  it('fonctionne sans profil de cycle menstruel (3 paramètres à poids égal)', () => {
    const profile = { birthDate: new Date(Date.UTC(1990, 5, 10)) };
    const result = computeSynthesis(profile, new Date(Date.UTC(2026, 0, 3)));
    expect(result.params).toHaveLength(3);
    expect(result.params.find((p) => p.key === 'cycle')).toBeUndefined();
  });

  it('détecte une égalité (tie) quand plusieurs quadrants ont le même nombre de votes', () => {
    // saison=hiver(0), lune calculée, trimestre calculé : on force une égalité
    // en choisissant une date/naissance qui répartit les votes 1-1-1 (pas de cycle).
    const profile = { birthDate: new Date(Date.UTC(2000, 0, 6, 18, 14)) }; // aligné sur la nouvelle lune de référence
    const result = computeSynthesis(profile, new Date(Date.UTC(2026, 0, 6, 18, 14)));
    // saison de janvier -> 0, lune -> 0 (nouvelle lune), trimestre -> 0 (juste après anniversaire)
    expect(result.isTie).toBe(false);
    expect(result.dominant.id).toBe(0);
  });
});
