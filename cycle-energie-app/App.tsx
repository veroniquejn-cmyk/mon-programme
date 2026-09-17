import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { PaywallScreen } from './src/screens/PaywallScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { clearProfile, loadProfile, saveProfile, StoredProfile } from './src/storage/profile';
import { colors } from './src/theme/colors';

type Screen = 'home' | 'settings' | 'paywall';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<StoredProfile | null>(null);
  const [screen, setScreen] = useState<Screen>('home');

  useEffect(() => {
    loadProfile().then((p) => {
      setProfile(p);
      setLoading(false);
    });
  }, []);

  async function handleOnboardingComplete(p: StoredProfile) {
    await saveProfile(p);
    setProfile(p);
  }

  async function handleSaveSettings(p: StoredProfile) {
    await saveProfile(p);
    setProfile(p);
    setScreen('home');
  }

  async function handleResetProfile() {
    await clearProfile();
    setProfile(null);
    setScreen('home');
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.gold} size="large" />
        <StatusBar style="light" />
      </View>
    );
  }

  if (!profile) {
    return (
      <>
        <OnboardingScreen onComplete={handleOnboardingComplete} />
        <StatusBar style="light" />
      </>
    );
  }

  return (
    <>
      {screen === 'home' && (
        <HomeScreen
          profile={profile}
          onOpenSettings={() => setScreen('settings')}
          onOpenPremium={() => setScreen('paywall')}
        />
      )}
      {screen === 'settings' && (
        <SettingsScreen
          profile={profile}
          onSave={handleSaveSettings}
          onBack={() => setScreen('home')}
          onResetProfile={handleResetProfile}
        />
      )}
      {screen === 'paywall' && <PaywallScreen onBack={() => setScreen('home')} />}
      <StatusBar style="light" />
    </>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
});
