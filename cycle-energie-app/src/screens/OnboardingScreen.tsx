import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { ProfileForm } from '../components/ProfileForm';
import { StoredProfile } from '../storage/profile';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface Props {
  onComplete: (profile: StoredProfile) => void;
}

export function OnboardingScreen({ onComplete }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        Bienvenue <Text style={styles.titleAccent}>en toi</Text>
      </Text>
      <Text style={styles.subtitle}>
        Quelques informations pour calculer ta roue d'énergie du jour : saison, lune, cycle de vie et cycle
        menstruel.
      </Text>

      <ProfileForm submitLabel="Découvrir mon énergie du jour" onSubmit={onComplete} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 60, paddingBottom: 40, backgroundColor: colors.bg, flexGrow: 1 },
  title: { ...typography.title, color: colors.goldLight, marginBottom: 8 },
  titleAccent: { fontStyle: 'italic', color: colors.gold },
  subtitle: { ...typography.body, color: colors.text, marginBottom: 20, lineHeight: 20 },
});
