import React from 'react';
import { Alert, ScrollView, StyleSheet, Text } from 'react-native';
import { ProfileForm } from '../components/ProfileForm';
import { SecondaryButton } from '../components/ui';
import { StoredProfile } from '../storage/profile';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface Props {
  profile: StoredProfile;
  onSave: (profile: StoredProfile) => void;
  onBack: () => void;
  onResetProfile: () => void;
}

export function SettingsScreen({ profile, onSave, onBack, onResetProfile }: Props) {
  function confirmReset() {
    Alert.alert('Réinitialiser mon profil', 'Cela efface ta date de naissance et tes infos de cycle sur cet appareil.', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Réinitialiser', style: 'destructive', onPress: onResetProfile },
    ]);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Réglages</Text>
      <SecondaryButton title="← Retour" onPress={onBack} />
      <Text style={styles.spacer} />

      <ProfileForm initial={profile} submitLabel="Enregistrer" onSubmit={onSave} />

      <Text style={styles.dangerLink} onPress={confirmReset}>
        Réinitialiser mon profil
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 60, paddingBottom: 40, backgroundColor: colors.bg, flexGrow: 1 },
  title: { ...typography.title, color: colors.goldLight, marginBottom: 16 },
  spacer: { height: 16 },
  dangerLink: { ...typography.body, color: colors.red, textAlign: 'center', marginTop: 20, fontSize: 12 },
});
