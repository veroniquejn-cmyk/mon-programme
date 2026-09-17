import { computeSynthesis } from '../synthesis';

describe('computeSynthesis', () => {
  it('calcule les 4 paramètres et les deux niveaux (contexte de fond / nuance du jour)', () => {
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
    expect(result.macro).toBeDefined();
    expect(result.micro).toBeDefined();
    expect(typeof result.aligned).toBe('boolean');
  });

  it('fonctionne sans profil de cycle menstruel (nuance du jour = phase lunaire seule)', () => {
    const profile = { birthDate: new Date(Date.UTC(1990, 5, 10)) };
    const result = computeSynthesis(profile, new Date(Date.UTC(2026, 0, 3)));
    expect(result.params).toHaveLength(3);
    expect(result.params.find((p) => p.key === 'cycle')).toBeUndefined();
    expect(result.micro.isTie).toBe(false);
    expect(result.micro.tieBreakParam).toBeUndefined();
  });

  it('contexte de fond : pas de conflit quand saison et trimestre de vie s\'accordent', () => {
    // À l'instant de la nouvelle lune de référence, en janvier : saison = 0 (Hiver).
    // Naissance le jour même -> 0 mois écoulé -> trimestre = 0 aussi.
    const today = new Date(Date.UTC(2000, 0, 6, 18, 14));
    const profile = { birthDate: new Date(Date.UTC(2000, 0, 6, 18, 14)) };
    const result = computeSynthesis(profile, today);

    expect(result.macro.isTie).toBe(false);
    expect(result.macro.quadrant).toBe(0);
    expect(result.macro.tieBreakParam).toBeUndefined();
  });

  it('contexte de fond : en cas de désaccord, le trimestre de vie prime sur la saison', () => {
    // saison(janvier) = 0. Naissance 3 mois avant -> trimestre = 1.
    const today = new Date(Date.UTC(2000, 0, 6, 18, 14));
    const profile = { birthDate: new Date(Date.UTC(1999, 9, 6, 18, 14)) };
    const result = computeSynthesis(profile, today);

    expect(result.macro.isTie).toBe(true);
    expect(result.macro.tieBreakParam).toBe('trimestre');
    expect(result.macro.quadrant).toBe(1);
  });

  it('nuance du jour : en cas de désaccord, le cycle menstruel prime sur la phase lunaire', () => {
    // À l'instant de référence : lune = 0 (nouvelle lune).
    // Cycle réglé pour tomber en ovulation (jour 14/28) -> cycle = 2.
    const today = new Date(Date.UTC(2000, 0, 6, 18, 14));
    const profile = {
      birthDate: new Date(Date.UTC(1990, 5, 10)),
      cycle: {
        lastPeriodStart: new Date(Date.UTC(1999, 11, 24, 18, 14)),
        cycleLength: 28,
        periodLength: 5,
      },
    };
    const result = computeSynthesis(profile, today);

    expect(result.micro.isTie).toBe(true);
    expect(result.micro.tieBreakParam).toBe('cycle');
    expect(result.micro.quadrant).toBe(2);
  });

  it('aligned = true quand le contexte de fond et la nuance du jour partagent la même énergie', () => {
    // saison=0, trimestre=2 (naissance 6 mois avant) -> macro tranché sur trimestre = quadrant 2 (masculine).
    // lune=0, cycle=2 (ovulation) -> micro tranché sur cycle = quadrant 2 (masculine).
    const today = new Date(Date.UTC(2000, 0, 6, 18, 14));
    const profile = {
      birthDate: new Date(Date.UTC(1999, 6, 6, 18, 14)),
      cycle: {
        lastPeriodStart: new Date(Date.UTC(1999, 11, 24, 18, 14)),
        cycleLength: 28,
        periodLength: 5,
      },
    };
    const result = computeSynthesis(profile, today);

    expect(result.macro.quadrant).toBe(2);
    expect(result.micro.quadrant).toBe(2);
    expect(result.aligned).toBe(true);
  });

  it('aligned = false quand le contexte de fond et la nuance du jour divergent', () => {
    // saison=0 (feminine), trimestre=1 (naissance 3 mois avant, masculine) -> macro = quadrant 1 (masculine).
    // Sans cycle renseigné -> micro = lune seule = quadrant 0 (feminine).
    const today = new Date(Date.UTC(2000, 0, 6, 18, 14));
    const profile = { birthDate: new Date(Date.UTC(1999, 9, 6, 18, 14)) };
    const result = computeSynthesis(profile, today);

    expect(result.macro.info.energie).toBe('masculine');
    expect(result.micro.info.energie).toBe('feminine');
    expect(result.aligned).toBe(false);
  });
});
