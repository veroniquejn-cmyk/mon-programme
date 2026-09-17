import { getSeasonQuadrant } from '../season';

describe('getSeasonQuadrant', () => {
  it('reconnaît l\'hiver (déc/jan/fév) comme quadrant 0', () => {
    expect(getSeasonQuadrant(new Date(Date.UTC(2026, 0, 15)))).toBe(0);
    expect(getSeasonQuadrant(new Date(Date.UTC(2025, 11, 25)))).toBe(0);
    expect(getSeasonQuadrant(new Date(Date.UTC(2026, 1, 1)))).toBe(0);
  });

  it('reconnaît le printemps (mars/avr/mai) comme quadrant 1', () => {
    expect(getSeasonQuadrant(new Date(Date.UTC(2026, 2, 21)))).toBe(1);
    expect(getSeasonQuadrant(new Date(Date.UTC(2026, 4, 30)))).toBe(1);
  });

  it('reconnaît l\'été (juin/juil/août) comme quadrant 2', () => {
    expect(getSeasonQuadrant(new Date(Date.UTC(2026, 5, 21)))).toBe(2);
    expect(getSeasonQuadrant(new Date(Date.UTC(2026, 7, 15)))).toBe(2);
  });

  it('reconnaît l\'automne (sept/oct/nov) comme quadrant 3', () => {
    expect(getSeasonQuadrant(new Date(Date.UTC(2026, 8, 23)))).toBe(3);
    expect(getSeasonQuadrant(new Date(Date.UTC(2026, 10, 30)))).toBe(3);
  });
});
