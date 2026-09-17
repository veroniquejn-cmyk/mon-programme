import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

export function Card({ children, style }: { children: React.ReactNode; style?: object }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.cardTitle}>{children}</Text>;
}

export function Label({ children }: { children: React.ReactNode }) {
  return <Text style={styles.label}>{children}</Text>;
}

export function DateField(props: TextInputProps & { label: string }) {
  const { label, ...rest } = props;
  return (
    <View style={styles.fieldGroup}>
      <Label>{label}</Label>
      <TextInput
        style={styles.input}
        placeholder="AAAA-MM-JJ"
        placeholderTextColor={colors.muted}
        autoCapitalize="none"
        autoCorrect={false}
        {...rest}
      />
    </View>
  );
}

export function NumberField(props: TextInputProps & { label: string }) {
  const { label, ...rest } = props;
  return (
    <View style={styles.fieldGroup}>
      <Label>{label}</Label>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        placeholderTextColor={colors.muted}
        {...rest}
      />
    </View>
  );
}

export function PrimaryButton({ title, onPress, disabled }: { title: string; onPress: () => void; disabled?: boolean }) {
  return (
    <TouchableOpacity
      style={[styles.primaryBtn, disabled && styles.btnDisabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
    >
      <Text style={styles.primaryBtnText}>{title}</Text>
    </TouchableOpacity>
  );
}

export function SecondaryButton({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.secondaryBtn} onPress={onPress} activeOpacity={0.85}>
      <Text style={styles.secondaryBtnText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 18,
    marginBottom: 14,
  },
  cardTitle: {
    ...typography.cardTitle,
    color: colors.goldLight,
    marginBottom: 14,
  },
  label: {
    ...typography.label,
    color: colors.muted,
    marginBottom: 5,
  },
  fieldGroup: { marginBottom: 12 },
  input: {
    backgroundColor: colors.card2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    color: colors.cream,
    fontSize: 14,
  },
  primaryBtn: {
    width: '100%',
    paddingVertical: 13,
    backgroundColor: colors.gold,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnDisabled: { opacity: 0.5 },
  primaryBtnText: { color: colors.bg, fontWeight: '600', fontSize: 13, letterSpacing: 0.5 },
  secondaryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryBtnText: { color: colors.gold, fontSize: 12, fontWeight: '500' },
});
