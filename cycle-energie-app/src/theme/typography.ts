import { Platform } from 'react-native';

// En attendant l'intégration des polices Cormorant Garamond / DM Sans
// (via expo-font, cf. README), on retombe sur les polices système
// les plus proches pour ne pas bloquer le développement.
export const fonts = {
  serif: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
  sans: Platform.select({ ios: 'System', android: 'sans-serif', default: 'sans-serif' }),
};

export const typography = {
  title: { fontFamily: fonts.serif, fontSize: 28, fontWeight: '300' as const },
  cardTitle: { fontFamily: fonts.serif, fontSize: 18, fontWeight: '400' as const },
  body: { fontFamily: fonts.sans, fontSize: 14, fontWeight: '300' as const },
  label: { fontFamily: fonts.sans, fontSize: 11, letterSpacing: 0.5, textTransform: 'uppercase' as const },
};
