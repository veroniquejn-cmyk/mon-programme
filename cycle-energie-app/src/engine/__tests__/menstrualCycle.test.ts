import { getCycleDay, getMenstrualQuadrant } from '../menstrualCycle';

describe('cycle menstruel (cycle de 28 jours, règles de 5 jours)', () => {
  const lastPeriodStart = new Date(Date.UTC(2026, 0, 1)); // 1er janvier
  const profile = { lastPeriodStart, cycleLength: 28, periodLength: 5 };

  it('jour 1 = premier jour des règles', () => {
    expect(getCycleDay(profile, new Date(Date.UTC(2026, 0, 1)))).toBe(1);
  });

  it('jours 1-5 -> menstruation (quadrant 0)', () => {
    expect(getMenstrualQuadrant(profile, new Date(Date.UTC(2026, 0, 3)))).toBe(0);
  });

  it('jours 6-12 -> pré-ovulation (quadrant 1)', () => {
    expect(getMenstrualQuadrant(profile, new Date(Date.UTC(2026, 0, 10)))).toBe(1);
  });

  it('autour du jour 14 (ovulation = cycleLength-14) -> ovulation (quadrant 2)', () => {
    expect(getMenstrualQuadrant(profile, new Date(Date.UTC(2026, 0, 14)))).toBe(2);
  });

  it('jours après l\'ovulation -> pré-menstruation (quadrant 3)', () => {
    expect(getMenstrualQuadrant(profile, new Date(Date.UTC(2026, 0, 25)))).toBe(3);
  });

  it('boucle correctement au cycle suivant', () => {
    expect(getMenstrualQuadrant(profile, new Date(Date.UTC(2026, 0, 29)))).toBe(0);
  });
});

describe('cycle menstruel avec longueur personnalisée (32 jours)', () => {
  const profile = { lastPeriodStart: new Date(Date.UTC(2026, 0, 1)), cycleLength: 32, periodLength: 6 };

  it("l'ovulation se recale à cycleLength-14 = jour 18", () => {
    expect(getMenstrualQuadrant(profile, new Date(Date.UTC(2026, 0, 18)))).toBe(2);
  });
});
