import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { Colors } from '@/shared/theme/colors';
import { ProfileDrawer } from '@/shared/ui/ProfileDrawer';
import { useProfileStore } from '@/store/profileStore';
import { useHealthStore } from '@/store/healthStore';
import { useNutritionStore } from '@/store/nutritionStore';
import { usePregnancyStore } from '@/store/pregnancyStore';
import { useDevelopmentStore } from '@/store/developmentStore';

function HydrationGate({ children }: { children: React.ReactNode }) {
  const profileReady     = useProfileStore((s) => s._hasHydrated);
  const healthReady      = useHealthStore((s) => s._hasHydrated);
  const nutritionReady   = useNutritionStore((s) => s._hasHydrated);
  const pregnancyReady   = usePregnancyStore((s) => s._hasHydrated);
  const developmentReady = useDevelopmentStore((s) => s._hasHydrated);

  const allReady = profileReady && healthReady && nutritionReady && pregnancyReady && developmentReady;

  if (!allReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.coral} />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="dark" />
      <HydrationGate>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="modals/add-profile" options={{ presentation: 'modal' }} />
        </Stack>
        <ProfileDrawer />
      </HydrationGate>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
});
