import React, { useState } from 'react';
import { Alert, StyleSheet, Switch, Text, View } from 'react-native';
import { DEFAULT_CYCLE_LENGTH, DEFAULT_PERIOD_LENGTH } from '../engine/menstrualCycle';
import { StoredProfile } from '../storage/profile';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { isValidISODate } from '../utils/validateDate';
import { Card, CardTitle, DateField, NumberField, PrimaryButton } from './ui';

interface Props {
  initial?: StoredProfile;
  submitLabel: string;
  onSubmit: (profile: StoredProfile) => void;
}

export function ProfileForm({ initial, submitLabel, onSubmit }: Props) {
  const [birthDate, setBirthDate] = useState(initial?.birthDate ?? '');
  const [hasCycle, setHasCycle] = useState(initial ? Boolean(initial.lastPeriodStart) : true);
  const [lastPeriodStart, setLastPeriodStart] = useState(initial?.lastPeriodStart ?? '');
  const [cycleLength, setCycleLength] = useState(String(initial?.cycleLength ?? DEFAULT_CYCLE_LENGTH));
  const [periodLength, setPeriodLength] = useState(String(initial?.periodLength ?? DEFAULT_PERIOD_LENGTH));

  function handleSubmit() {
    if (!isValidISODate(birthDate)) {
      Alert.alert('Date de naissance invalide', 'Utilise le format AAAA-MM-JJ, par exemple 1990-06-10.');
      return;
    }
    if (hasCycle && !isValidISODate(lastPeriodStart)) {
      Alert.alert('Date invalide', 'Indique la date de début de tes dernières règles au format AAAA-MM-JJ.');
      return;
    }

    const profile: StoredProfile = { birthDate };
    if (hasCycle) {
      profile.lastPeriodStart = lastPeriodStart;
      profile.cycleLength = parseInt(cycleLength, 10) || DEFAULT_CYCLE_LENGTH;
      profile.periodLength = parseInt(periodLength, 10) || DEFAULT_PERIOD_LENGTH;
    }
    onSubmit(profile);
  }

  return (
    <>
      <Card>
        <CardTitle>🌙 Ta date de naissance</CardTitle>
        <DateField label="Date de naissance" value={birthDate} onChangeText={setBirthDate} />
      </Card>

      <Card>
        <View style={styles.switchRow}>
          <CardTitle>🩸 Cycle menstruel</CardTitle>
          <Switch
            value={hasCycle}
            onValueChange={setHasCycle}
            trackColor={{ false: colors.border, true: colors.gold }}
            thumbColor={colors.cream}
          />
        </View>
        {hasCycle ? (
          <>
            <DateField
              label="Début des dernières règles"
              value={lastPeriodStart}
              onChangeText={setLastPeriodStart}
            />
            <View style={styles.row}>
              <View style={styles.half}>
                <NumberField label="Durée du cycle (jours)" value={cycleLength} onChangeText={setCycleLength} />
              </View>
              <View style={styles.half}>
                <NumberField label="Durée des règles (jours)" value={periodLength} onChangeText={setPeriodLength} />
              </View>
            </View>
          </>
        ) : (
          <Text style={styles.helper}>
            Pas de cycle régulier (ménopause, grossesse, etc.) ? Pas de souci, la synthèse se fera sur les 3 autres
            paramètres, toujours à poids égal.
          </Text>
        )}
      </Card>

      <PrimaryButton title={submitLabel} onPress={handleSubmit} />
    </>
  );
}

const styles = StyleSheet.create({
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  row: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },
  helper: { ...typography.body, color: colors.muted, fontSize: 12, lineHeight: 18 },
});
