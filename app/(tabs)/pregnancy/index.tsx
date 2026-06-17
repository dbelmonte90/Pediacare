import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/shared/theme/colors';
import { Typography } from '@/shared/theme/typography';
import { Card } from '@/shared/ui/Card';
import { ProgressBar } from '@/shared/ui/ProgressBar';
import { useProfileStore } from '@/store/profileStore';
import {
  getPregnancyWeek,
  getTrimester,
  getDaysUntilFPP,
} from '@/entities/profile/model/selectors';
import { getWeekData } from '@/shared/constants/weekData';
import type { PregnancyProfile } from '@/entities/profile/model/types';

const TRIMESTER_LABEL = { 1: '1er Trimestre', 2: '2º Trimestre', 3: '3er Trimestre' } as const;

export default function PregnancyScreen() {
  const activeProfile = useProfileStore((s) => s.activeProfile());

  if (!activeProfile || activeProfile.type !== 'pregnancy') return null;

  const profile = activeProfile as PregnancyProfile;
  const week = getPregnancyWeek(profile);
  const trimester = getTrimester(profile);
  const daysLeft = getDaysUntilFPP(profile);
  const weekData = getWeekData(week);
  const progress = Math.min(week / 40, 1);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.trimester}>{TRIMESTER_LABEL[trimester]}</Text>
          <Text style={styles.weekNumber}>{week}</Text>
          <Text style={styles.weekLabel}>semanas</Text>

          <View style={styles.progressContainer}>
            <ProgressBar
              progress={progress}
              color={Colors.lavender}
              label={`Semana ${week} de 40`}
              showPercent={false}
            />
          </View>
        </View>

        <View style={styles.cards}>
          {/* Baby size */}
          <Card style={styles.card}>
            <Text style={styles.cardLabel}>TU BEBÉ ESTA SEMANA</Text>
            <View style={styles.fruitRow}>
              <Text style={styles.fruitEmoji}>{weekData.fruitEmoji}</Text>
              <View style={styles.fruitText}>
                <Text style={styles.fruitName}>{weekData.babySize}</Text>
                <Text style={styles.fruitDesc}>{weekData.description}</Text>
              </View>
            </View>
          </Card>

          {/* Countdown */}
          <Card style={styles.card}>
            <Text style={styles.cardLabel}>CUENTA ATRÁS AL PARTO</Text>
            <Text style={styles.countdownNumber}>{daysLeft}</Text>
            <Text style={styles.countdownLabel}>días hasta la FPP</Text>
            <Text style={styles.fppDate}>📅 FPP: {new Date(profile.fpp).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
          </Card>

          {/* Checklist preview */}
          <Card style={styles.card}>
            <Text style={styles.cardLabel}>CHECKLIST PRENATAL</Text>
            {[
              { label: 'Analítica 1er trimestre', done: true },
              { label: 'Ecografía 12 semanas', done: true },
              { label: 'Suplemento ácido fólico', done: true },
              { label: 'Ecografía morfológica', done: false },
              { label: 'Plan de parto', done: false },
            ].map((item) => (
              <View key={item.label} style={styles.checkItem}>
                <Text style={[styles.checkDot, item.done && styles.checkDotDone]}>
                  {item.done ? '✅' : '⬜'}
                </Text>
                <Text style={[styles.checkLabel, item.done && styles.checkLabelDone]}>
                  {item.label}
                </Text>
              </View>
            ))}
          </Card>

          {/* Mother info */}
          <Card style={styles.card}>
            <Text style={styles.cardLabel}>DATOS</Text>
            <Text style={styles.infoRow}>👤 Madre: {profile.motherName}</Text>
            <Text style={styles.infoRow}>🩸 Grupo: {profile.bloodType}</Text>
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
    backgroundColor: Colors.lavender,
    paddingTop: 32,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 16,
  },
  trimester: {
    ...Typography.labelUppercase,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 8,
  },
  weekNumber: {
    fontSize: 80,
    fontWeight: '900',
    letterSpacing: -4,
    color: Colors.surface,
    lineHeight: 86,
  },
  weekLabel: {
    ...Typography.headingBold,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 20,
  },
  progressContainer: { width: '100%' },
  cards: { paddingHorizontal: 16, gap: 12 },
  card: { padding: 16 },
  cardLabel: { ...Typography.labelUppercase, marginBottom: 12 },
  fruitRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  fruitEmoji: { fontSize: 48 },
  fruitText: { flex: 1 },
  fruitName: { ...Typography.headingBold, color: Colors.textPrimary },
  fruitDesc: { ...Typography.bodyRegular, marginTop: 4 },
  countdownNumber: { fontSize: 56, fontWeight: '900', letterSpacing: -2, color: Colors.lavender },
  countdownLabel: { ...Typography.bodyRegular, marginBottom: 8 },
  fppDate: { ...Typography.bodyMedium, color: Colors.textPrimary },
  checkItem: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  checkDot: { fontSize: 16 },
  checkDotDone: { opacity: 0.6 },
  checkLabel: { ...Typography.bodyMedium, flex: 1 },
  checkLabelDone: { color: Colors.textSecondary, textDecorationLine: 'line-through' },
  infoRow: { ...Typography.bodyMedium, marginBottom: 6 },
});
