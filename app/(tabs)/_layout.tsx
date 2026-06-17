import { Tabs, useRouter } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useRef } from 'react';
import { Colors } from '@/shared/theme/colors';
import { Typography } from '@/shared/theme/typography';
import { useProfileStore } from '@/store/profileStore';
import { ProfilePill } from '@/shared/ui/ProfilePill';

interface TabIconProps {
  emoji: string;
  label: string;
  focused: boolean;
  color: string;
}

function TabIcon({ emoji, label, focused, color }: TabIconProps) {
  return (
    <View style={[styles.tabItem, focused && { backgroundColor: `${color}18` }]}>
      <Text style={[styles.emoji, focused && styles.emojiFocused]}>{emoji}</Text>
      <Text style={[styles.tabLabel, focused && { color, fontWeight: '700' }]}>{label}</Text>
      {focused && <View style={[styles.accent, { backgroundColor: color }]} />}
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const activeProfile = useProfileStore((s) => s.activeProfile());
  const isPregnancy = activeProfile?.type === 'pregnancy';

  // Redirect to the correct home tab whenever the profile type changes
  const prevIsPregnancy = useRef<boolean | null>(null);
  useEffect(() => {
    // Skip the very first render (no profile switch happened)
    if (prevIsPregnancy.current === null) {
      prevIsPregnancy.current = isPregnancy;
      return;
    }
    if (prevIsPregnancy.current === isPregnancy) return;

    prevIsPregnancy.current = isPregnancy;
    router.replace(isPregnancy ? '/pregnancy' : '/');
  }, [isPregnancy]);

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background, elevation: 0, shadowOpacity: 0 },
        headerTitleContainerStyle: { flex: 1, alignItems: 'center' },
        headerLeft: () => null,
        headerTitle: () => <ProfilePill />,
        tabBarStyle: {
          backgroundColor: `${Colors.surface}EE`,
          borderTopColor: Colors.border,
          height: 64 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarShowLabel: false,
      }}
    >
      {/* Home — child profiles only */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          href: isPregnancy ? null : '/',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏠" label="Inicio" focused={focused} color={Colors.lavender} />
          ),
        }}
      />

      {/* Pregnancy — pregnancy profiles only */}
      <Tabs.Screen
        name="pregnancy/index"
        options={{
          title: 'Embarazo',
          href: isPregnancy ? '/pregnancy' : null,
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🤰" label="Embarazo" focused={focused} color={Colors.lavender} />
          ),
        }}
      />

      {/* Health — child profiles only */}
      <Tabs.Screen
        name="health/index"
        options={{
          title: 'Salud',
          href: isPregnancy ? null : '/health',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="❤️" label="Salud" focused={focused} color={Colors.coral} />
          ),
        }}
      />

      {/* Nutrition — child profiles only */}
      <Tabs.Screen
        name="nutrition/index"
        options={{
          title: 'Nutrición',
          href: isPregnancy ? null : '/nutrition',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🥦" label="Nutrición" focused={focused} color={Colors.mint} />
          ),
        }}
      />

      {/* Development — child profiles only */}
      <Tabs.Screen
        name="development/index"
        options={{
          title: 'Desarrollo',
          href: isPregnancy ? null : '/development',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="⭐" label="Desarrollo" focused={focused} color={Colors.skyBlue} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 2,
    minWidth: 60,
  },
  emoji: { fontSize: 20 },
  emojiFocused: { transform: [{ scale: 1.1 }] },
  tabLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  accent: {
    width: 16,
    height: 3,
    borderRadius: 2,
    marginTop: 2,
  },
});
