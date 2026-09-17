import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ElementBadge } from '../components/ElementBadge';
import { Card, CardTitle, SecondaryButton } from '../components/ui';
import { toUserProfile } from '../engine/profileAdapter';
import { computeSynthesis, ParamKey, ParamResult, TierResult } from '../engine/synthesis';
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
  const { macro, micro, aligned, params } = synthesis;

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

      <Card style={[styles.tierCard, { borderColor: elementColor[macro.info.element] }]}>
        <Text style={styles.tierLabel}>🌍 Contexte de fond</Text>
        <Text style={styles.tierSub}>Saison + trimestre de vie — la tendance lente, à respecter</Text>
        <View style={styles.tierHeader}>
          <ElementBadge element={macro.info.element} size={44} />
          <View style={{ flex: 1 }}>
            <Text style={styles.tierPhase}>
              {macro.info.saison} · {macro.info.phaseVie}
            </Text>
            <Text style={styles.tierEnergie}>
              {energieIcon[macro.info.energie]} {energieLabel[macro.info.energie]}
            </Text>
          </View>
        </View>
        {macro.isTie && macro.tieBreakParam && (
          <Text style={styles.tieNote}>
            Saison et trimestre de vie ne s'accordent pas totalement aujourd'hui — {paramFullLabel(macro.tieBreakParam)}{' '}
            prime, car c'est le paramètre le plus personnel des deux.
          </Text>
        )}
        <Text style={styles.tierAction}>{macro.info.action} : {macro.info.actionDetail}</Text>
      </Card>

      <Card style={[styles.tierCard, { borderColor: elementColor[micro.info.element] }]}>
        <Text style={styles.tierLabel}>🌙 Nuance du jour</Text>
        <Text style={styles.tierSub}>Cycle menstruel + phase lunaire — la coloration du moment présent</Text>
        <View style={styles.tierHeader}>
          <ElementBadge element={micro.info.element} size={44} />
          <View style={{ flex: 1 }}>
            <Text style={styles.tierPhase}>
              {micro.info.phaseCycle} · {micro.info.phaseLune}
            </Text>
            <Text style={styles.tierEnergie}>
              {energieIcon[micro.info.energie]} {energieLabel[micro.info.energie]}
            </Text>
          </View>
        </View>
        {micro.isTie && micro.tieBreakParam && (
          <Text style={styles.tieNote}>
            Cycle menstruel et phase lunaire ne s'accordent pas totalement aujourd'hui —{' '}
            {paramFullLabel(micro.tieBreakParam)} prime.
          </Text>
        )}
        <Text style={styles.tierAction}>{micro.info.action} : {micro.info.actionDetail}</Text>
      </Card>

      <Card style={styles.verdictCard}>
        <CardTitle>✨ Le bilan du jour</CardTitle>
        <Text style={styles.verdictText}>{getVerdictText(macro, micro, aligned)}</Text>
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
          <Text style={styles.paramElement}>
            Élément {info.element} · {energieIcon[info.energie]} {energieLabel[info.energie]}
          </Text>
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

/**
 * Texte de synthèse qui articule le contexte de fond et la nuance du jour,
 * sans jamais laisser la nuance du jour contredire le contexte de fond sur
 * les grandes décisions (ex. lancer un projet en pleine saison de repos).
 */
function getVerdictText(macro: TierResult, micro: TierResult, aligned: boolean): string {
  const macroAction = macro.info.action.toLowerCase();
  const microAction = micro.info.action.toLowerCase();

  if (aligned) {
    return `Le contexte de fond et ta nuance du jour vont dans le même sens aujourd'hui : tout t'invite à ${macroAction}, avec en plus la couleur du moment présent (${microAction}). C'est le bon jour pour suivre cet élan sans retenue.`;
  }

  if (macro.info.energie === 'feminine' && micro.info.energie === 'masculine') {
    return `Le contexte plus large (saison + trimestre de vie) invite plutôt à ${macroAction} : ${macro.info.actionDetail} Ta nuance du jour est plus motivante (${microAction}) — vis cet élan à petite échelle, en interne, plutôt que de te lancer aujourd'hui dans quelque chose de grand ou de visible.`;
  }

  return `Le contexte plus large (saison + trimestre de vie) est plutôt favorable à ${macroAction} : ${macro.info.actionDetail} Ta nuance du jour est plus intérieure (${microAction}) — avance à ton rythme, sans te forcer, en respectant ce besoin de douceur aujourd'hui.`;
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
  tierCard: { borderWidth: 1 },
  tierLabel: { ...typography.title, fontSize: 16, color: colors.goldLight, marginBottom: 2 },
  tierSub: { ...typography.body, fontSize: 11, color: colors.muted, marginBottom: 12 },
  tierHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  tierPhase: { ...typography.title, fontSize: 17, color: colors.cream },
  tierEnergie: { ...typography.body, fontSize: 12, color: colors.gold, marginTop: 2 },
  tierAction: { ...typography.body, color: colors.text, fontSize: 13, lineHeight: 19 },
  tieNote: { ...typography.body, fontSize: 11, color: colors.muted, marginBottom: 8, lineHeight: 16 },
  verdictCard: { borderColor: colors.gold, borderWidth: 1.5 },
  verdictText: { ...typography.body, color: colors.text, fontSize: 14, lineHeight: 21 },
  premiumCard: { borderColor: colors.gold, borderStyle: 'dashed' },
  helper: { ...typography.body, color: colors.muted, fontSize: 12, lineHeight: 18, marginBottom: 12 },
});
