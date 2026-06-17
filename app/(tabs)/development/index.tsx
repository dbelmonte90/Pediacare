import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/shared/theme/colors';
import { Typography } from '@/shared/theme/typography';
import { Card } from '@/shared/ui/Card';
import { ProgressBar } from '@/shared/ui/ProgressBar';
import { useProfileStore } from '@/store/profileStore';

interface Milestone {
  id: string;
  category: 'motor' | 'cognitive' | 'language' | 'social';
  label: string;
  ageRange: string;
  achieved: boolean;
  overdue?: boolean;
}

const CATEGORY_CONFIG = {
  motor:     { label: 'Motor', color: Colors.skyBlue, emoji: '🏃' },
  cognitive: { label: 'Cognitivo', color: Colors.lavender, emoji: '🧠' },
  language:  { label: 'Lenguaje', color: Colors.coral, emoji: '💬' },
  social:    { label: 'Social', color: Colors.mint, emoji: '🤝' },
};

const MOCK_MILESTONES: Milestone[] = [
  { id: 'm1', category: 'motor', label: 'Se sienta sin apoyo', ageRange: '6-9 meses', achieved: true },
  { id: 'm2', category: 'motor', label: 'Gatea', ageRange: '7-10 meses', achieved: true },
  { id: 'm3', category: 'motor', label: 'Se pone de pie solo', ageRange: '9-12 meses', achieved: true },
  { id: 'm4', category: 'motor', label: 'Da sus primeros pasos', ageRange: '10-14 meses', achieved: false, overdue: true },
  { id: 'm5', category: 'cognitive', label: 'Busca objetos escondidos', ageRange: '8-12 meses', achieved: true },
  { id: 'm6', category: 'cognitive', label: 'Señala con el dedo', ageRange: '10-14 meses', achieved: false },
  { id: 'm7', category: 'language', label: 'Dice "mamá" y "papá"', ageRange: '9-12 meses', achieved: true },
  { id: 'm8', category: 'language', label: 'Dice 3 palabras', ageRange: '12-18 meses', achieved: false },
  { id: 'm9', category: 'social', label: 'Sonrisa social', ageRange: '2-3 meses', achieved: true },
  { id: 'm10', category: 'social', label: 'Juega con otros niños', ageRange: '24-36 meses', achieved: false },
];

export default function DevelopmentScreen() {
  const activeProfile = useProfileStore((s) => s.activeProfile());
  if (!activeProfile || activeProfile.type !== 'child') return null;

  const total = MOCK_MILESTONES.length;
  const achieved = MOCK_MILESTONES.filter((m) => m.achieved).length;
  const overdue = MOCK_MILESTONES.filter((m) => m.overdue && !m.achieved);
  const categories = (Object.keys(CATEGORY_CONFIG) as Array<keyof typeof CATEGORY_CONFIG>);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Desarrollo</Text>
          <Text style={styles.subtitle}>{activeProfile.name}</Text>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>{achieved} de {total} hitos alcanzados</Text>
            <Text style={styles.progressPct}>{Math.round((achieved / total) * 100)}%</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <ProgressBar progress={achieved / total} color="rgba(255,255,255,0.9)" />
          </View>
        </View>

        <View style={styles.cards}>
          {/* Overdue alert */}
          {overdue.length > 0 && (
            <View style={styles.overdueCard}>
              <Text style={styles.overdueIcon}>⚠️</Text>
              <View style={styles.overdueText}>
                <Text style={styles.overdueTitle}>Hitos pendientes de revisión</Text>
                {overdue.map((m) => (
                  <Text key={m.id} style={styles.overdueItem}>· {m.label}</Text>
                ))}
              </View>
            </View>
          )}

          {/* Milestones by category */}
          {categories.map((cat) => {
            const cfg = CATEGORY_CONFIG[cat];
            const items = MOCK_MILESTONES.filter((m) => m.category === cat);
            return (
              <Card key={cat} style={styles.card}>
                <View style={styles.catHeader}>
                  <Text style={styles.catEmoji}>{cfg.emoji}</Text>
                  <Text style={[styles.catLabel, { color: cfg.color }]}>{cfg.label}</Text>
                  <Text style={styles.catCount}>
                    {items.filter((m) => m.achieved).length}/{items.length}
                  </Text>
                </View>
                {items.map((milestone) => (
                  <TouchableOpacity key={milestone.id} style={styles.milestoneRow} activeOpacity={0.7}>
                    <Text style={styles.milestoneCheck}>
                      {milestone.achieved ? '✅' : milestone.overdue ? '⚠️' : '⬜'}
                    </Text>
                    <View style={styles.milestoneInfo}>
                      <Text style={[styles.milestoneName, milestone.achieved && styles.textDone]}>
                        {milestone.label}
                      </Text>
                      <Text style={styles.milestoneAge}>{milestone.ageRange}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </Card>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 32 },
  header: {
    backgroundColor: Colors.skyBlue,
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 16,
  },
  title: { ...Typography.displayBold, color: Colors.surface },
  subtitle: { ...Typography.bodyMedium, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, marginBottom: 8 },
  progressLabel: { ...Typography.bodyMedium, color: 'rgba(255,255,255,0.85)' },
  progressPct: { ...Typography.headingBold, color: Colors.surface },
  progressBarContainer: { opacity: 0.8 },
  cards: { paddingHorizontal: 16, gap: 12 },
  card: { padding: 16 },
  overdueCard: {
    flexDirection: 'row',
    backgroundColor: `${Colors.amber}15`,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: `${Colors.amber}30`,
  },
  overdueIcon: { fontSize: 24 },
  overdueText: { flex: 1 },
  overdueTitle: { ...Typography.bodyMedium, fontWeight: '700', color: Colors.amber, marginBottom: 6 },
  overdueItem: { ...Typography.bodyRegular, marginBottom: 2 },
  catHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  catEmoji: { fontSize: 20 },
  catLabel: { ...Typography.headingBold, flex: 1 },
  catCount: { ...Typography.labelUppercase, color: Colors.textSecondary },
  milestoneRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  milestoneCheck: { fontSize: 16, width: 24, marginTop: 1 },
  milestoneInfo: { flex: 1 },
  milestoneName: { ...Typography.bodyMedium },
  textDone: { color: Colors.textSecondary, textDecorationLine: 'line-through' },
  milestoneAge: { ...Typography.caption, marginTop: 2 },
});
