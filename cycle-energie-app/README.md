# Cycle Énergie — roue cyclique féminine

Application mobile (Expo / React Native / TypeScript) qui calcule, chaque
jour, la phase d'énergie de l'utilisatrice à partir de 4 paramètres :

1. **Cycle menstruel** (jour du cycle, ou absent si non renseigné)
2. **Saison réelle** (météorologique, hémisphère nord)
3. **Phase lunaire réelle** (calcul astronomique)
4. **Trimestre depuis la naissance** (cycle perpétuel de 4 phases de 3 mois,
   ancré sur la date de naissance)

Chacun de ces paramètres pointe vers l'un des 4 quadrants d'une roue
cyclique (Menstruation/Hiver/Apprentissage, Pré-ovulation/Printemps/Création,
Ovulation/Été/Récolte, Pré-menstruation/Automne/Maîtrise), qui donne
l'énergie (féminine/masculine), l'élément (feu/air/terre/eau), l'archétype,
l'émotion associée et l'action recommandée.

Plutôt qu'un simple vote à 4, la synthèse (`src/engine/synthesis.ts`)
distingue deux niveaux, pour que le cycle du jour ne puisse jamais faire
oublier la tendance de fond :

- **Contexte de fond** (saison + trimestre de vie) : la tendance lente,
  toujours affichée en premier.
- **Nuance du jour** (cycle menstruel + phase lunaire) : la coloration du
  moment présent, qui vient nuancer le contexte de fond sans jamais le
  contredire sur les grandes décisions.

Le bilan du jour (`src/engine/verdict.ts`) articule les deux et les
classe en **harmonieuse** / **équilibrée** / **disharmonieuse** selon
qu'ils s'accordent pleinement, partiellement, ou pas du tout. La table
`src/engine/wheel.ts` (libellés, archétypes, émotions, actions) a été
relue et corrigée avec Véronique.

## Structure du projet

```
src/
  engine/       Logique pure (aucune dépendance React Native) :
                calcul de saison, lune, trimestre de naissance, cycle
                menstruel, et synthèse à poids égal. Testée (voir plus bas).
  theme/        Palette de couleurs et typographie, reprises de l'app
                "Mon Programme" existante pour une identité visuelle cohérente.
  components/   Composants UI réutilisables (champs, boutons, formulaire de profil).
  screens/      Onboarding, Accueil (résultat du jour), Réglages, Abonnement.
  storage/      Persistance locale du profil (AsyncStorage).
App.tsx         Navigation simple à état (pas de librairie de nav, volontairement).
```

## Lancer le projet en développement

```bash
cd cycle-energie-app
npm install
npm run web       # aperçu rapide dans le navigateur
npm run ios       # nécessite un Mac + Xcode, ou l'app Expo Go sur un iPhone
npm run android   # nécessite Android Studio, ou l'app Expo Go sur un Android
```

Le moyen le plus simple de tester sur son propre téléphone sans rien
installer : `npx expo start`, puis scanner le QR code avec l'app **Expo Go**
(disponible gratuitement sur l'App Store / Google Play).

## Tests

La logique de calcul (`src/engine`) est testée avec Jest, indépendamment de
React Native :

```bash
npm test
```

## Publier l'application (App Store & Google Play)

Cette app est construite avec **Expo**, ce qui permet de publier sur les
deux stores sans avoir besoin d'un Mac grâce à **EAS Build** (service de
build dans le cloud d'Expo).

Grandes étapes (à faire quand tu seras prête à publier) :

1. Créer un compte [Expo (EAS)](https://expo.dev) (gratuit pour commencer).
2. Créer un compte développeur Apple ([Apple Developer Program](https://developer.apple.com/programs/), 99 $/an) et un compte [Google Play Console](https://play.google.com/console/) (25 $, paiement unique).
3. `npm install -g eas-cli`, puis `eas login` et `eas build:configure`.
4. `eas build --platform ios` et `eas build --platform android` pour générer les binaires.
5. `eas submit` pour envoyer les binaires vers App Store Connect / Google Play Console.

Documentation complète : https://docs.expo.dev/deploy/submit-to-app-stores/

## Abonnement payant (in-app purchase)

Comme décidé, le paiement se fera via les achats intégrés natifs
(**StoreKit** sur iOS, **Play Billing** sur Android), obligatoires sur iOS
pour ce type de contenu. Pour l'instant, l'écran `PaywallScreen` est un
placeholder qui explique l'offre mais ne débite personne.

Étapes pour l'activer réellement :

1. Créer les produits d'abonnement dans **App Store Connect** et **Google
   Play Console** (mêmes identifiants de produit des deux côtés, ex.
   `abonnement_mensuel`, `abonnement_annuel`).
2. Créer un compte [RevenueCat](https://www.revenuecat.com/) (gratuit
   jusqu'à un certain volume de revenus) : il unifie StoreKit et Play
   Billing derrière une seule API, gère les reçus, les renouvellements, les
   remboursements, etc. — bien plus simple que d'intégrer les deux SDK natifs
   séparément.
3. `npx expo install react-native-purchases` puis suivre le guide
   d'intégration Expo de RevenueCat : https://www.revenuecat.com/docs/getting-started/installation/expo
4. Remplacer le contenu de `PaywallScreen.tsx` par l'appel réel à
   `Purchases.purchasePackage(...)`, et vérifier le statut d'abonnement au
   démarrage de l'app pour débloquer le contenu premium.

Ces comptes développeur (Apple/Google/RevenueCat) doivent être créés par
toi directement (ils nécessitent une identité/facturation réelle) — le code
est prêt à les recevoir dès que c'est fait.

## Prochaines étapes possibles

- Ajouter une icône et un splash screen personnalisés dans `assets/`.
- Intégrer les polices Cormorant Garamond / DM Sans via `expo-font`, pour
  retrouver exactement l'identité visuelle de l'app "Mon Programme".
- Notifications de changement de phase, contenu détaillé par phase
  (rituels, méditations...).

### Journal quotidien (en attente d'une décision sur les comptes)

Idée retenue avec Véronique : permettre à l'utilisatrice de noter comment
elle se sent / ce qu'elle a vécu chaque jour, en lien avec son énergie du
jour calculée par l'app. Volontairement **pas encore construit**, en
attente d'une décision sur l'architecture de compte (nécessaire de toute
façon pour restaurer un abonnement sur un nouvel appareil) :

- **Sans compte (aujourd'hui)** : les entrées pourraient être stockées en
  local (AsyncStorage, comme le profil), perdues si l'app est désinstallée
  ou si on change de téléphone.
- **Avec compte (à concevoir)** : nécessite de choisir une authentification
  (email/mot de passe, ou Sign in with Apple/Google — souvent exigé par
  Apple si l'app propose une connexion par compte) et un service de
  stockage cloud pour synchroniser le journal (et potentiellement le
  profil) entre appareils. Options courantes avec Expo : Supabase ou
  Firebase, tous deux avec un plan gratuit suffisant pour démarrer.
- Ce choix de compte a aussi un impact sur l'abonnement : un compte permet
  de retrouver son abonnement premium sur un nouvel appareil (sinon,
  StoreKit/Play Billing seuls permettent une restauration basique liée à
  l'identifiant Apple/Google, mais sans synchroniser les données comme le
  journal).

À trancher ensemble avant de coder cette partie : quelle authentification,
quel service de stockage, et si le journal doit être une fonctionnalité
gratuite ou réservée à l'abonnement.
