import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ElementBadge } from '../components/ElementBadge';
import { Card, CardTitle, SecondaryButton } from '../components/ui';
import { toUserProfile } from '../engine/profileAdapter';
import { computeSynthesis, ParamKey, ParamResult } from '../engine/synthesis';
import { StoredProfile } from '../storage/profile';
import { colors, elementColor } from '../theme/colors';
import { energieIcon, energieLabel } from '../theme/icons';
import { typography } from '../theme/typography';

interface Props {
  profile: StoredProfile;
  onOpenSettings: () => void;
  onOpenPremium: () => void;
}

const PARAM_ICON: Record<ParamKey, string> = {
  cycle: '🩸',
  lune: '🌙',
  trimestre: '🌱',
  saison: '🍃',
};

export function HomeScreen({ profile, onOpenSettings, onOpenPremium }: Props) {
  const today = useMemo(() => new Date(), []);
  const userProfile = useMemo(() => toUserProfile(profile), [profile]);
  const synthesis = useMemo(() => computeSynthesis(userProfile, today), [userProfile, today]);
  const { dominant, params, isTie, tieBreakParam } = synthesis;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>
          Mon <Text style={styles.titleAccent}>énergie</Text>
        </Text>
        <SecondaryButton title="Réglages" onPress={onOpenSettings} />
      </View>
      <Text style={styles.dateText}>
        {today.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
      </Text>

      <Text style={styles.sectionTitle}>Le détail de tes 4 paramètres</Text>
      {params.map((p) => (
        <ParamCard key={p.key} param={p} />
      ))}

      <Text style={styles.sectionTitle}>Conclusion</Text>
      <Card style={[styles.heroCard, { borderColor: elementColor[dominant.element] }]}>
        <ElementBadge element={dominant.element} size={56} />
        <Text style={styles.heroPhase}>{dominant.phaseCycle}</Text>
        <Text style={styles.heroEnergie}>
          {energieIcon[dominant.energie]} {energieLabel[dominant.energie]} · {dominant.energieTitre}
        </Text>
        <Text style={styles.heroEmotion}>{dominant.emotion}</Text>
        {isTie && tieBreakParam && (
          <Text style={styles.tieNote}>
            Tes 4 paramètres étaient partagés aujourd'hui entre plusieurs énergies. En cas d'égalité, la
            priorité va au paramètre le plus personnel — ici : {paramFullLabel(tieBreakParam)}.
          </Text>
        )}
        <View style={styles.divider} />
        <Text style={styles.actionLabel}>Le bilan du jour, c'est plutôt le moment de :</Text>
        <Text style={styles.actionTitle}>{dominant.action}</Text>
        <Text style={styles.actionDetail}>{dominant.actionDetail}</Text>
      </Card>

      <Card style={styles.premiumCard}>
        <CardTitle>✨ Aller plus loin</CardTitle>
        <Text style={styles.helper}>
          Rituels, méditations et conseils détaillés pour chaque phase : débloque l'accès complet avec
          l'abonnement.
        </Text>
        <SecondaryButton title="Découvrir l'abonnement" onPress={onOpenPremium} />
      </Card>
    </ScrollView>
  );
}

function ParamCard({ param }: { param: ParamResult }) {
  const { info } = param;
  return (
    <Card style={[styles.paramCard, { borderColor: elementColor[info.element] }]}>
      <View style={styles.paramHeader}>
        <ElementBadge element={info.element} size={44} />
        <View style={{ flex: 1 }}>
          <Text style={styles.paramLabel}>
            {PARAM_ICON[param.key]} {param.label}
          </Text>
          <Text style={styles.paramPhase}>{paramPhaseLabel(param)}</Text>
          <Text style={styles.paramElement}>Élément {info.element}</Text>
        </View>
      </View>
      <Text style={styles.paramArchetype}>{info.archetype}</Text>
      <Text style={styles.paramEmotion}>{info.emotion}</Text>
      <Text style={styles.paramActionDetail}>{info.actionDetail}</Text>
    </Card>
  );
}

function paramPhaseLabel(param: ParamResult): string {
  switch (param.key) {
    case 'cycle':
      return param.info.phaseCycle;
    case 'saison':
      return `${param.info.saison} · ${param.info.saisonSlogan}`;
    case 'lune':
      return param.info.phaseLune;
    case 'trimestre':
      return param.info.phaseVie;
    default:
      return '';
  }
}

function paramFullLabel(key: ParamKey): string {
  switch (key) {
    case 'cycle':
      return 'ton cycle menstruel';
    case 'lune':
      return 'la phase lunaire';
    case 'trimestre':
      return 'ton trimestre de vie';
    case 'saison':
      return 'la saison';
  }
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 60, paddingBottom: 40, backgroundColor: colors.bg, flexGrow: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  title: { ...typography.title, color: colors.goldLight },
  titleAccent: { fontStyle: 'italic', color: colors.gold },
  dateText: { ...typography.body, color: colors.muted, marginBottom: 16, textTransform: 'capitalize' },
  sectionTitle: {
    ...typography.label,
    color: colors.gold,
    marginTop: 6,
    marginBottom: 10,
  },
  paramCard: { borderWidth: 1 },
  paramHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  paramLabel: { ...typography.label, color: colors.muted, marginBottom: 2 },
  paramPhase: { ...typography.title, fontSize: 18, color: colors.cream },
  paramElement: { ...typography.body, fontSize: 11, color: colors.muted, textTransform: 'capitalize', marginTop: 2 },
  paramArchetype: { ...typography.body, color: colors.gold, fontSize: 13, marginBottom: 2 },
  paramEmotion: { ...typography.body, fontStyle: 'italic', color: colors.muted, fontSize: 12, marginBottom: 8 },
  paramActionDetail: { ...typography.body, color: colors.text, fontSize: 13, lineHeight: 19 },
  heroCard: { alignItems: 'center', borderWidth: 1.5, paddingVertical: 24 },
  heroPhase: { ...typography.title, fontSize: 24, color: colors.cream, marginTop: 10, marginBottom: 4 },
  heroEnergie: { ...typography.body, color: colors.gold, marginBottom: 6 },
  heroEmotion: { ...typography.body, fontStyle: 'italic', color: colors.muted, fontSize: 12, textAlign: 'center' },
  tieNote: { ...typography.body, fontSize: 11, color: colors.muted, textAlign: 'center', marginTop: 10, paddingHorizontal: 8 },
  divider: { width: '60%', height: 1, backgroundColor: colors.border, marginVertical: 12 },
  actionLabel: { ...typography.label, color: colors.muted, marginBottom: 6 },
  actionTitle: { ...typography.title, fontSize: 20, color: colors.goldLight, marginBottom: 8 },
  actionDetail: { ...typography.body, color: colors.text, textAlign: 'center', lineHeight: 20, paddingHorizontal: 8 },
  premiumCard: { borderColor: colors.gold, borderStyle: 'dashed' },
  helper: { ...typography.body, color: colors.muted, fontSize: 12, lineHeight: 18, marginBottom: 12 },
});
