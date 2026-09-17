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

  it("sans égalité, le quadrant majoritaire l'emporte directement (pas de tieBreakParam)", () => {
    // saison de janvier -> 0, lune -> 0 (nouvelle lune), trimestre -> 0 (juste après anniversaire)
    const profile = { birthDate: new Date(Date.UTC(2000, 0, 6, 18, 14)) }; // aligné sur la nouvelle lune de référence
    const result = computeSynthesis(profile, new Date(Date.UTC(2026, 0, 6, 18, 14)));
    expect(result.isTie).toBe(false);
    expect(result.dominant.id).toBe(0);
    expect(result.tieBreakParam).toBeUndefined();
  });

  it('en cas d\'égalité, priorise le cycle menstruel sur les autres paramètres', () => {
    // À l'instant de la nouvelle lune de référence : saison(janvier)=0, lune=0.
    // Naissance 6 mois avant -> trimestre de vie = 2. Cycle réglé pour tomber
    // en ovulation (jour 14/28) -> cycle = 2. Résultat : 2 voix pour le
    // quadrant 0 (saison+lune), 2 voix pour le quadrant 2 (trimestre+cycle).
    const today = new Date(Date.UTC(2000, 0, 6, 18, 14));
    const profile = {
      birthDate: new Date(Date.UTC(1999, 6, 6, 18, 14)), // 6 mois avant -> trimestre = 2
      cycle: {
        lastPeriodStart: new Date(Date.UTC(1999, 11, 24, 18, 14)), // 13 jours avant -> jour de cycle 14 -> ovulation
        cycleLength: 28,
        periodLength: 5,
      },
    };
    const result = computeSynthesis(profile, today);

    expect(result.isTie).toBe(true);
    expect(result.dominants.sort()).toEqual([0, 2]);
    // Le cycle est prioritaire (1er de PARAM_PRIORITY) et vote pour le quadrant 2.
    expect(result.tieBreakParam).toBe('cycle');
    expect(result.dominant.id).toBe(2);
  });

  it("sans cycle renseigné, priorise la phase lunaire en cas d'égalité", () => {
    // Combinaison vérifiée : saison=0, lune=3, trimestre=1 (naissance 3 mois avant) -> 3 voix distinctes, 1 chacune.
    const today = new Date(Date.UTC(2024, 0, 1, 12, 0));
    const profile = { birthDate: new Date(Date.UTC(2023, 9, 1)) };
    const result = computeSynthesis(profile, today);

    expect(result.isTie).toBe(true);
    expect(result.dominants.sort()).toEqual([0, 1, 3]);
    expect(result.tieBreakParam).toBe('lune');
    expect(result.dominant.id).toBe(3);
  });
});
