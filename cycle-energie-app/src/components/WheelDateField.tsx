import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { parseISODate, toISODate } from '../engine/dateUtils';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { isValidISODate } from '../utils/validateDate';
import { Label } from './ui';

interface Props {
  label: string;
  value: string;
  onChangeValue: (iso: string) => void;
  minimumDate?: Date;
  maximumDate?: Date;
}

/**
 * Sélecteur de date "en roue" (jour / mois / année défilants), pour éviter
 * la saisie manuelle au format AAAA-MM-JJ. Utilise le composant natif
 * (spinner sur iOS et Android), compatible avec Expo Go.
 */
export function WheelDateField({ label, value, onChangeValue, minimumDate, maximumDate }: Props) {
  const date = isValidISODate(value) ? parseISODate(value) : new Date();

  return (
    <View style={styles.fieldGroup}>
      <Label>{label}</Label>
      {Platform.OS === 'web' ? (
        // La roue native n'existe pas sur web : simple champ texte de repli
        // pour garder l'aperçu navigateur utilisable (l'app mobile réelle
        // utilise bien la roue ci-dessous).
        <TextInput
          style={styles.webFallbackInput}
          placeholder="AAAA-MM-JJ"
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
          autoCorrect={false}
          value={value}
          onChangeText={onChangeValue}
        />
      ) : (
        <View style={styles.wheelWrap}>
          <DateTimePicker
            value={date}
            mode="date"
            display="spinner"
            locale="fr-FR"
            themeVariant="dark"
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            onChange={(_event, selectedDate) => {
              if (selectedDate) onChangeValue(toISODate(selectedDate));
            }}
            style={styles.picker}
            textColor={colors.cream}
          />
        </View>
      )}
      {isValidISODate(value) && (
        <Text style={styles.selectedDate}>
          Sélectionné : {date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fieldGroup: { marginBottom: 12 },
  wheelWrap: {
    backgroundColor: colors.card2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: Platform.OS === 'ios' ? 160 : 100,
    width: '100%',
  },
  webFallbackInput: {
    backgroundColor: colors.card2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    color: colors.cream,
    fontSize: 14,
  },
  selectedDate: {
    ...typography.body,
    color: colors.gold,
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
  },
});
