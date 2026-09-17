// Palette reprise de l'application "Mon Programme" existante (index.html)
// pour garder une identité visuelle cohérente entre les deux outils.
export const colors = {
  bg: '#0f0e0c',
  card: '#1a1916',
  card2: '#211f1b',
  border: '#2e2b25',
  gold: '#c9a96e',
  goldLight: '#e8d5aa',
  cream: '#f0e8d8',
  text: '#d4ccbe',
  muted: '#7a7367',
  green: '#6b8f6b',
  red: '#9b4a4a',
  orange: '#c97b3a',

  // Couleurs des 4 éléments, utilisées pour distinguer feu / air / terre / eau
  fire: '#c9603a',
  air: '#a9b98f',
  earth: '#8a7355',
  water: '#5c85a0',

  feminine: '#b97fa0',
  masculine: '#c9a96e',
};

export type ElementKey = 'feu' | 'air' | 'terre' | 'eau';

export const elementColor: Record<ElementKey, string> = {
  feu: colors.fire,
  air: colors.air,
  terre: colors.earth,
  eau: colors.water,
};
