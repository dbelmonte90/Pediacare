import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/shared/theme/colors';
import { Typography } from '@/shared/theme/typography';
import { Card } from '@/shared/ui/Card';
import { DoctorBadge } from '@/shared/ui/DoctorBadge';
import { AllergyAlertBanner } from '@/shared/ui/AllergyAlertBanner';
import { useProfileStore } from '@/store/profileStore';
import { getAgeInMonths } from '@/entities/profile/model/selectors';
import type { ChildProfile } from '@/entities/profile/model/types';

export default function HomeScreen() {
  const activeProfile = useProfileStore((s) => s.activeProfile());

  if (!activeProfile || activeProfile.type !== 'child') return null;

  const child = activeProfile as ChildProfile;
  const ageMonths = getAgeInMonths(child);
  const ageYears = Math.floor(ageMonths / 12);
  const remainMonths = ageMonths % 12;

  const ageLabel =
    ageMonths < 24
      ? `${ageMonths} meses`
      : `${ageYears} año${ageYears !== 1 ? 's' : ''} ${remainMonths > 0 ? `y ${remainMonths} meses` : ''}`;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: activeProfile.color }]}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLetter}>{activeProfile.name[0]}</Text>
          </View>
          <Text style={styles.heroName}>{activeProfile.name}</Text>
          <Text style={styles.heroAge}>{ageLabel}</Text>
          <Text style={styles.heroGender}>
            {child.sex === 'female' ? '👧 Niña' : '👦 Niño'}
            {child.bloodType ? ` · ${child.bloodType}` : ''}
          </Text>
        </View>

        <AllergyAlertBanner />

        <View style={styles.cards}>
          <DoctorBadge />

          <Card style={styles.card}>
            <Text style={styles.cardLabel}>PRÓXIMA VACUNA</Text>
            <Text style={styles.cardValue}>Triple vírica</Text>
            <Text style={styles.cardSub}>En 12 días · 12 meses</Text>
          </Card>

          <Card style={styles.card}>
            <Text style={styles.cardLabel}>ÚLTIMO PESO REGISTRADO</Text>
            <Text style={styles.cardValue}>8,4 kg</Text>
            <Text style={styles.cardSub}>Percentil 50 · hace 2 semanas</Text>
          </Card>

          <Card style={styles.card}>
            <Text style={styles.cardLabel}>HITOS ALCANZADOS</Text>
            <Text style={styles.cardValue}>18 / 24</Text>
            <Text style={styles.cardSub}>75% completado</Text>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 32 },
  hero: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 16,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarLetter: { fontSize: 36, fontWeight: '800', color: Colors.surface },
  heroName: { ...Typography.titleBold, color: Colors.surface, marginBottom: 4 },
  heroAge: { ...Typography.bodyMedium, color: 'rgba(255,255,255,0.85)', marginBottom: 4 },
  heroGender: { ...Typography.caption, color: 'rgba(255,255,255,0.7)' },
  cards: { paddingHorizontal: 16, gap: 12 },
  card: { padding: 16 },
  cardLabel: { ...Typography.labelUppercase, marginBottom: 6 },
  cardValue: { ...Typography.titleBold, fontSize: 28 },
  cardSub: { ...Typography.caption, marginTop: 4 },
});
