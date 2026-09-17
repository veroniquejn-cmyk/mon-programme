/** Utilitaires de dates en UTC pour des calculs de cycle déterministes,
 * indépendants du fuseau horaire de l'appareil. */

export type ISODate = string; // format 'YYYY-MM-DD'

export function parseISODate(iso: ISODate): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function toISODate(date: Date): ISODate {
  return date.toISOString().split('T')[0];
}

export function daysBetween(from: Date, to: Date): number {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  return Math.floor((to.getTime() - from.getTime()) / MS_PER_DAY);
}

export function fullMonthsBetween(from: Date, to: Date): number {
  let months = (to.getUTCFullYear() - from.getUTCFullYear()) * 12 + (to.getUTCMonth() - from.getUTCMonth());
  if (to.getUTCDate() < from.getUTCDate()) months -= 1;
  return Math.max(0, months);
}

/** Modulo qui reste positif même pour des valeurs négatives. */
export function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}
