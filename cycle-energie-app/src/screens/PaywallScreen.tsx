import React from 'react';
import { Alert, ScrollView, StyleSheet, Text } from 'react-native';
import { Card, CardTitle, PrimaryButton, SecondaryButton } from '../components/ui';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface Props {
  onBack: () => void;
}

/**
 * Écran d'abonnement — pour l'instant un placeholder.
 *
 * L'achat réel (StoreKit sur iOS, Play Billing sur Android) n'est pas encore
 * branché : il faut d'abord un compte Apple Developer Program (99$/an) et un
 * compte Google Play Console (25$ une fois), puis créer les produits
 * d'abonnement dans App Store Connect / Play Console, et enfin les relier ici
 * via une librairie comme RevenueCat (react-native-purchases), qui gère les
 * deux plateformes avec une seule API. Voir le README pour le détail des
 * étapes.
 */
export function PaywallScreen({ onBack }: Props) {
  function handleSubscribe() {
    Alert.alert(
      "Abonnement bientôt disponible",
      "Le paiement n'est pas encore activé dans cette version de développement. Voir le README (section Abonnement) pour la mise en place.",
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Accès complet</Text>

      <Card>
        <CardTitle>✨ Ce que débloque l'abonnement</CardTitle>
        <Bullet text="Rituels et exercices détaillés pour chaque phase de la roue" />
        <Bullet text="Historique complet et évolution de ton énergie dans le temps" />
        <Bullet text="Notifications de changement de phase" />
        <Bullet text="Contenus additionnels ajoutés au fil des mises à jour" />
      </Card>

      <Card style={styles.priceCard}>
        <Text style={styles.price}>4,99 € / mois</Text>
        <Text style={styles.priceNote}>ou 39,99 € / an</Text>
        <PrimaryButton title="S'abonner" onPress={handleSubscribe} />
      </Card>

      <SecondaryButton title="← Retour" onPress={onBack} />
    </ScrollView>
  );
}

function Bullet({ text }: { text: string }) {
  return <Text style={styles.bullet}>• {text}</Text>;
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 60, paddingBottom: 40, backgroundColor: colors.bg, flexGrow: 1 },
  title: { ...typography.title, color: colors.goldLight, marginBottom: 16 },
  bullet: { ...typography.body, color: colors.text, marginBottom: 8, lineHeight: 20 },
  priceCard: { alignItems: 'center', borderColor: colors.gold },
  price: { ...typography.title, fontSize: 26, color: colors.goldLight, marginBottom: 2 },
  priceNote: { ...typography.body, color: colors.muted, marginBottom: 16 },
});
