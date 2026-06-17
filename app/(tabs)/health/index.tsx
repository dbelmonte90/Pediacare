import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/shared/theme/colors';
import { Typography } from '@/shared/theme/typography';
import { Card } from '@/shared/ui/Card';
import { ProgressBar } from '@/shared/ui/ProgressBar';
import { useProfileStore } from '@/store/profileStore';

const MOCK_VACCINES = [
  { name: 'Hepatitis B (1ª dosis)', due: '0 meses', done: true },
  { name: 'Hexavalente (1ª dosis)', due: '2 meses', done: true },
  { name: 'Neumococo (1ª dosis)', due: '2 meses', done: true },
  { name: 'Triple vírica', due: '12 meses', done: false, upcoming: true },
  { name: 'Varicela (1ª dosis)', due: '15 meses', done: false },
];

const MOCK_SYMPTOMS = [
  { date: '12 jun', symptoms: ['Fiebre', 'Mocos'], resolved: true },
  { date: '3 may', symptoms: ['Tos'], resolved: true },
];

export default function HealthScreen() {
  const activeProfile = useProfileStore((s) => s.activeProfile());
  if (!activeProfile || activeProfile.type !== 'child') return null;

  const vaccinesDone = MOCK_VACCINES.filter((v) => v.done).length;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Salud</Text>
          <Text style={styles.subtitle}>{activeProfile.name}</Text>
        </View>

        <View style={styles.cards}>
          {/* Weight */}
          <Card style={styles.card}>
            <Text style={styles.cardLabel}>PESO Y TALLA</Text>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={[styles.statValue, { color: Colors.coral }]}>8,4 kg</Text>
                <Text style={styles.statLabel}>Peso</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.stat}>
                <Text style={[styles.statValue, { color: Colors.coral }]}>72 cm</Text>
                <Text style={styles.statLabel}>Talla</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.stat}>
                <Text style={[styles.statValue, { color: Colors.coral }]}>P50</Text>
                <Text style={styles.statLabel}>Percentil</Text>
              </View>
            </View>
            <ProgressBar progress={0.5} color={Colors.coral} label="Percentil OMS" showPercent />
          </Card>

          {/* Vaccines */}
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>CALENDARIO VACUNAL</Text>
              <Text style={styles.badgeText}>{vaccinesDone}/{MOCK_VACCINES.length}</Text>
            </View>
            {MOCK_VACCINES.map((v) => (
              <View key={v.name} style={styles.vaccineRow}>
                <Text style={styles.vaccineCheck}>
                  {v.done ? '✅' : v.upcoming ? '⚠️' : '⬜'}
                </Text>
                <View style={styles.vaccineInfo}>
                  <Text style={[styles.vaccineName, v.done && styles.textDone]}>{v.name}</Text>
                  <Text style={styles.vaccineDue}>{v.due}</Text>
                </View>
                {v.upcoming && (
                  <View style={styles.upcomingBadge}>
                    <Text style={styles.upcomingText}>Próxima</Text>
                  </View>
                )}
              </View>
            ))}
          </Card>

          {/* Symptoms */}
          <Card style={styles.card}>
            <Text style={styles.cardLabel}>HISTORIAL DE SÍNTOMAS</Text>
            {MOCK_SYMPTOMS.map((s) => (
              <View key={s.date} style={styles.symptomRow}>
                <Text style={styles.symptomDate}>{s.date}</Text>
                <Text style={styles.symptomList}>{s.symptoms.join(', ')}</Text>
                <Text style={styles.symptomResolved}>Resuelto</Text>
              </View>
            ))}
            <Text style={styles.preDiagLink}>🔍 Registrar síntomas →</Text>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 32 },
  header: {
    backgroundColor: Colors.coral,
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 16,
  },
  title: { ...Typography.displayBold, color: Colors.surface },
  subtitle: { ...Typography.bodyMedium, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  cards: { paddingHorizontal: 16, gap: 12 },
  card: { padding: 16 },
  cardLabel: { ...Typography.labelUppercase, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  badgeText: { ...Typography.labelUppercase, color: Colors.coral, fontWeight: '700' },
  statsRow: { flexDirection: 'row', marginBottom: 16 },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  statLabel: { ...Typography.caption, marginTop: 2 },
  divider: { width: 1, backgroundColor: Colors.border },
  vaccineRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  vaccineCheck: { fontSize: 16, width: 24 },
  vaccineInfo: { flex: 1 },
  vaccineName: { ...Typography.bodyMedium },
  textDone: { color: Colors.textSecondary, textDecorationLine: 'line-through' },
  vaccineDue: { ...Typography.caption, marginTop: 2 },
  upcomingBadge: { backgroundColor: `${Colors.amber}20`, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  upcomingText: { ...Typography.caption, color: Colors.amber, fontWeight: '700' },
  symptomRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  symptomDate: { ...Typography.caption, width: 48, color: Colors.textSecondary },
  symptomList: { ...Typography.bodyMedium, flex: 1 },
  symptomResolved: { ...Typography.caption, color: Colors.mint },
  preDiagLink: { ...Typography.bodyMedium, color: Colors.coral, marginTop: 8 },
});
