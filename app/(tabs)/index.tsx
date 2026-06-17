import React, { useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '@/shared/theme/colors';
import { Typography } from '@/shared/theme/typography';
import { Card } from '@/shared/ui/Card';
import { DoctorBadge } from '@/shared/ui/DoctorBadge';
import { AllergyAlertBanner } from '@/shared/ui/AllergyAlertBanner';
import { ProgressBar } from '@/shared/ui/ProgressBar';
import { useProfileStore } from '@/store/profileStore';
import { useHealthStore } from '@/store/healthStore';
import { useNutritionStore } from '@/store/nutritionStore';
import { useDevelopmentStore } from '@/store/developmentStore';
import { getAgeInMonths } from '@/entities/profile/model/selectors';
import { VACCINE_CALENDAR } from '@/shared/constants/healthData';
import { MILESTONES } from '@/shared/constants/developmentData';
import type { ChildProfile } from '@/entities/profile/model/types';

// ─── helper ─────────────────────────────────────────────────────────────────

function daysSince(isoDate: string): number {
  return Math.floor((Date.now() - new Date(isoDate).getTime()) / 86_400_000);
}

// ─── Section header ────────────────────────────────────────────────────────────

function SectionHeader({ title, onPress }: { title: string; onPress?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {onPress && (
        <TouchableOpacity onPress={onPress} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.sectionLink}>Ver todo →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Stat chip ────────────────────────────────────────────────────────────────

function StatChip({
  emoji, label, value, color,
}: { emoji: string; label: string; value: string; color: string }) {
  return (
    <View style={[styles.statChip, { borderLeftColor: color }]}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <View>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );
}

// ─── Next vaccine card ───────────────────────────────────────────────────────────

function NextVaccineCard({
  profileId, ageMonths,
}: { profileId: string; ageMonths: number }) {
  const isVaccineDone = useHealthStore((s) => s.isVaccineDone);
  const getDoneCount  = useHealthStore((s) => s.getDoneCount);

  const doneCount = getDoneCount(profileId);
  const total     = VACCINE_CALENDAR.length;

  const next = VACCINE_CALENDAR.find(
    (v) => v.ageMonths >= ageMonths && !isVaccineDone(profileId, v.id)
  ) ?? null;

  const monthsUntil = next ? Math.max(next.ageMonths - ageMonths, 0) : null;

  return (
    <Card style={styles.moduleCard}>
      <View style={styles.moduleCardHeader}>
        <View style={[styles.moduleIcon, { backgroundColor: `${Colors.coral}18` }]}>
          <Text style={styles.moduleIconText}>💉</Text>
        </View>
        <View style={styles.moduleCardTitles}>
          <Text style={styles.moduleCardTitle}>Vacunas</Text>
          <Text style={styles.moduleCardSub}>{doneCount}/{total} completadas</Text>
        </View>
      </View>
      <ProgressBar
        progress={total > 0 ? doneCount / total : 0}
        color={Colors.coral}
      />
      {next && (
        <View style={[styles.nextTag, { backgroundColor: `${Colors.coral}12` }]}>
          <Text style={[styles.nextTagText, { color: Colors.coral }]}>
            Próxima: {next.name} {next.doseLabel}
            {monthsUntil === 0 ? ' · Este mes' : ` · En ${monthsUntil} mes${monthsUntil !== 1 ? 'es' : ''}`}
          </Text>
        </View>
      )}
    </Card>
  );
}

// ─── Growth card ───────────────────────────────────────────────────────────────

function GrowthCard({ profileId }: { profileId: string }) {
  const getGrowthRecords = useHealthStore((s) => s.getGrowthRecords);
  const records = getGrowthRecords(profileId);
  const last    = records.length > 0 ? records[records.length - 1] : null;
  const prev    = records.length > 1 ? records[records.length - 2] : null;

  if (!last) {
    return (
      <Card style={styles.moduleCard}>
        <View style={styles.moduleCardHeader}>
          <View style={[styles.moduleIcon, { backgroundColor: `${Colors.mint}18` }]}>
            <Text style={styles.moduleIconText}>📏</Text>
          </View>
          <View style={styles.moduleCardTitles}>
            <Text style={styles.moduleCardTitle}>Crecimiento</Text>
            <Text style={styles.moduleCardSub}>Sin registros</Text>
          </View>
        </View>
      </Card>
    );
  }

  const wDiff = prev ? (last.weight - prev.weight) : null;
  const hDiff = prev ? (last.height - prev.height) : null;
  const days  = daysSince(last.date);
  const since = days === 0 ? 'Hoy' : days === 1 ? 'Ayer' : `Hace ${days} días`;

  return (
    <Card style={styles.moduleCard}>
      <View style={styles.moduleCardHeader}>
        <View style={[styles.moduleIcon, { backgroundColor: `${Colors.mint}18` }]}>
          <Text style={styles.moduleIconText}>📏</Text>
        </View>
        <View style={styles.moduleCardTitles}>
          <Text style={styles.moduleCardTitle}>Crecimiento</Text>
          <Text style={styles.moduleCardSub}>{since} · {last.ageMonths} meses</Text>
        </View>
      </View>
      <View style={styles.growthRow}>
        <View style={styles.growthStat}>
          <Text style={[styles.growthVal, { color: Colors.mint }]}>{last.weight} kg</Text>
          {wDiff !== null && (
            <Text style={styles.growthDiff}>
              {wDiff >= 0 ? '+' : ''}{wDiff.toFixed(1)} kg
            </Text>
          )}
          <Text style={styles.growthUnit}>Peso</Text>
          {last.weightPercentile !== undefined && (
            <Text style={styles.growthPct}>P{last.weightPercentile}</Text>
          )}
        </View>
        <View style={styles.growthDivider} />
        <View style={styles.growthStat}>
          <Text style={[styles.growthVal, { color: Colors.skyBlue }]}>{last.height} cm</Text>
          {hDiff !== null && (
            <Text style={styles.growthDiff}>
              {hDiff >= 0 ? '+' : ''}{hDiff.toFixed(1)} cm
            </Text>
          )}
          <Text style={styles.growthUnit}>Talla</Text>
          {last.heightPercentile !== undefined && (
            <Text style={styles.growthPct}>P{last.heightPercentile}</Text>
          )}
        </View>
      </View>
    </Card>
  );
}

// ─── Development card ───────────────────────────────────────────────────────────

function DevelopmentCard({
  profileId, ageMonths,
}: { profileId: string; ageMonths: number }) {
  const getAchievements = useDevelopmentStore((s) => s.getAchievements);
  const seedIfEmpty     = useDevelopmentStore((s) => s.seedIfEmpty);

  useEffect(() => {
    const mock = profileId === 'profile-sofia' ? 'sofia' : 'lucas';
    seedIfEmpty(profileId, mock);
  }, [profileId]);

  const achievements = getAchievements(profileId);
  const relevant     = MILESTONES.filter((m) => m.ageMonthsMin <= ageMonths + 12);
  const done         = relevant.filter((m) => achievements[m.id]).length;
  const overdue      = relevant.filter(
    (m) => !achievements[m.id] && ageMonths > m.ageMonthsMax
  ).length;
  const progress     = relevant.length > 0 ? done / relevant.length : 0;

  return (
    <Card style={styles.moduleCard}>
      <View style={styles.moduleCardHeader}>
        <View style={[styles.moduleIcon, { backgroundColor: `${Colors.indigo}18` }]}>
          <Text style={styles.moduleIconText}>⭐</Text>
        </View>
        <View style={styles.moduleCardTitles}>
          <Text style={styles.moduleCardTitle}>Desarrollo</Text>
          <Text style={styles.moduleCardSub}>{done}/{relevant.length} hitos logrados</Text>
        </View>
        {overdue > 0 && (
          <View style={styles.overdueBadge}>
            <Text style={styles.overdueBadgeText}>{overdue} vencido{overdue > 1 ? 's' : ''}</Text>
          </View>
        )}
      </View>
      <ProgressBar progress={progress} color={Colors.indigo} showPercent />
    </Card>
  );
}

// ─── Nutrition card ─────────────────────────────────────────────────────────────

function NutritionCard({ profileId }: { profileId: string }) {
  const getDiaryEntries      = useNutritionStore((s) => s.getDiaryEntries);
  const getFoodIntroductions = useNutritionStore((s) => s.getFoodIntroductions);
  const seedIfEmpty          = useNutritionStore((s) => s.seedIfEmpty);

  useEffect(() => {
    const mock = profileId === 'profile-sofia' ? 'sofia' : 'lucas';
    seedIfEmpty(profileId, mock);
  }, [profileId]);

  const entries        = getDiaryEntries(profileId);
  const foods          = getFoodIntroductions(profileId);
  const reactionCount  = Object.values(foods).filter((f) => f.status === 'reaction').length;
  const toleratedCount = Object.values(foods).filter((f) => f.status === 'tolerated').length;
  const lastEntry      = entries[0] ?? null;
  const days           = lastEntry ? daysSince(lastEntry.date) : null;

  return (
    <Card style={styles.moduleCard}>
      <View style={styles.moduleCardHeader}>
        <View style={[styles.moduleIcon, { backgroundColor: `${Colors.mint}18` }]}>
          <Text style={styles.moduleIconText}>🥦</Text>
        </View>
        <View style={styles.moduleCardTitles}>
          <Text style={styles.moduleCardTitle}>Nutrición</Text>
          <Text style={styles.moduleCardSub}>
            {lastEntry
              ? `Última comida: ${days === 0 ? 'hoy' : days === 1 ? 'ayer' : `hace ${days} días`}`
              : 'Sin entradas en el diario'}
          </Text>
        </View>
      </View>
      <View style={styles.nutritionRow}>
        <StatChip emoji="✅" label="Tolerados"  value={String(toleratedCount)} color={Colors.mint} />
        {reactionCount > 0 && (
          <StatChip emoji="⚠️" label="Reacciones" value={String(reactionCount)} color={Colors.rose} />
        )}
      </View>
    </Card>
  );
}

// ─── Active symptoms banner ─────────────────────────────────────────────────────────

function ActiveSymptomsBanner({ profileId }: { profileId: string }) {
  const getSymptomLogs = useHealthStore((s) => s.getSymptomLogs);
  const logs           = getSymptomLogs(profileId);
  const active         = logs.filter((l) => !l.resolved);

  if (active.length === 0) return null;

  const hasHighFever = active.some((l) => l.fever !== undefined && l.fever >= 38.5);

  return (
    <View style={[styles.symptomsBanner, hasHighFever && styles.symptomsBannerUrgent]}>
      <Text style={styles.symptomsIcon}>
        {hasHighFever ? '🌡️' : '🤧'}
      </Text>
      <View style={styles.symptomsText}>
        <Text style={[styles.symptomsTitle, hasHighFever && { color: Colors.rose }]}>
          {active.length} síntoma{active.length > 1 ? 's' : ''} activo{active.length > 1 ? 's' : ''}
        </Text>
        <Text style={styles.symptomsSub}>
          {hasHighFever
            ? 'Fiebre alta registrada — consulta con tu pediatra'
            : 'Registrados en Salud'}
        </Text>
      </View>
    </View>
  );
}

// ─── Quick actions ──────────────────────────────────────────────────────────────

function QuickAction({
  emoji, label, color, onPress,
}: { emoji: string; label: string; color: string; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.quickAction, { borderColor: `${color}40` }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: `${color}15` }]}>
        <Text style={styles.quickActionEmoji}>{emoji}</Text>
      </View>
      <Text style={[styles.quickActionLabel, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router           = useRouter();
  const getActiveProfile = useProfileStore((s) => s.activeProfile);
  const activeProfile    = getActiveProfile();
  const healthSeed       = useHealthStore((s) => s.seedIfEmpty);

  useEffect(() => {
    if (!activeProfile || activeProfile.type !== 'child') return;
    const mock = activeProfile.id === 'profile-sofia' ? 'sofia' : 'lucas';
    healthSeed(activeProfile.id, mock);
  }, [activeProfile?.id]);

  if (!activeProfile || activeProfile.type !== 'child') return null;

  const child     = activeProfile as ChildProfile;
  const ageMonths = getAgeInMonths(child);
  const ageYears  = Math.floor(ageMonths / 12);
  const remMonths = ageMonths % 12;

  const ageLabel =
    ageMonths < 24
      ? `${ageMonths} meses`
      : `${ageYears} año${ageYears !== 1 ? 's' : ''}${remMonths > 0 ? ` y ${remMonths} meses` : ''}`;

  const today    = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  const todayStr = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Hero ──────────────────────────────────────────────────── */}
        <View style={[styles.hero, { backgroundColor: activeProfile.color }]}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroDate}>{todayStr}</Text>
              <Text style={styles.heroName}>{activeProfile.name}</Text>
              <Text style={styles.heroAge}>{ageLabel}</Text>
            </View>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarLetter}>{activeProfile.name[0]}</Text>
            </View>
          </View>
          <View style={styles.heroPills}>
            <View style={styles.heroPill}>
              <Text style={styles.heroPillText}>
                {child.sex === 'female' ? '👧 Niña' : '👦 Niño'}
              </Text>
            </View>
            {child.bloodType && (
              <View style={styles.heroPill}>
                <Text style={styles.heroPillText}>🩸 {child.bloodType}</Text>
              </View>
            )}
            {child.allergies.length > 0 && (
              <View style={[styles.heroPill, styles.heroPillAlert]}>
                <Text style={[styles.heroPillText, { color: '#92400E' }]}>
                  ⚠️ {child.allergies.length} alergia{child.allergies.length > 1 ? 's' : ''}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* ── Allergy banner ─────────────────────────────────────────── */}
        <AllergyAlertBanner />

        {/* ── Active symptoms ────────────────────────────────────────── */}
        <View style={styles.section}>
          <ActiveSymptomsBanner profileId={activeProfile.id} />
        </View>

        {/* ── Quick actions ────────────────────────────────────────── */}
        <View style={styles.section}>
          <SectionHeader title="Acciones rápidas" />
          <View style={styles.quickActions}>
            <QuickAction emoji="❤️" label="Salud"      color={Colors.coral}  onPress={() => router.push('/(tabs)/health')} />
            <QuickAction emoji="🥦" label="Nutrición" color={Colors.mint}   onPress={() => router.push('/(tabs)/nutrition')} />
            <QuickAction emoji="⭐" label="Desarrollo" color={Colors.indigo} onPress={() => router.push('/(tabs)/development')} />
          </View>
        </View>

        {/* ── Module cards ────────────────────────────────────────── */}
        <View style={styles.section}>
          <SectionHeader title="Resumen de salud" onPress={() => router.push('/(tabs)/health')} />
          <NextVaccineCard profileId={activeProfile.id} ageMonths={ageMonths} />
          <GrowthCard profileId={activeProfile.id} />
        </View>

        <View style={styles.section}>
          <SectionHeader title="Desarrollo" onPress={() => router.push('/(tabs)/development')} />
          <DevelopmentCard profileId={activeProfile.id} ageMonths={ageMonths} />
        </View>

        <View style={styles.section}>
          <SectionHeader title="Nutrición" onPress={() => router.push('/(tabs)/nutrition')} />
          <NutritionCard profileId={activeProfile.id} />
        </View>

        {/* ── Doctor badge ────────────────────────────────────────── */}
        <View style={[styles.section, { marginBottom: 8 }]}>
          <DoctorBadge />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 32 },

  // Hero
  hero: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    marginBottom: 8,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  heroDate: { ...Typography.caption,    color: 'rgba(255,255,255,0.65)', marginBottom: 4 },
  heroName: { ...Typography.displayBold, color: Colors.surface, fontSize: 28, marginBottom: 2 },
  heroAge:  { ...Typography.bodyMedium,  color: 'rgba(255,255,255,0.85)' },
  avatarLarge: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarLetter: { fontSize: 32, fontWeight: '800', color: Colors.surface },
  heroPills:    { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  heroPill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20, paddingVertical: 4, paddingHorizontal: 10,
  },
  heroPillAlert: { backgroundColor: '#FEF3C7' },
  heroPillText:  { ...Typography.caption, color: 'rgba(255,255,255,0.9)', fontWeight: '600' },

  // Section
  section: { paddingHorizontal: 16, gap: 10, marginTop: 14 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2,
  },
  sectionTitle: { ...Typography.headingBold, color: Colors.textPrimary },
  sectionLink:  { ...Typography.caption,     color: Colors.indigo, fontWeight: '600' },

  // Quick actions
  quickActions: { flexDirection: 'row', gap: 10 },
  quickAction: {
    flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: 14,
    backgroundColor: Colors.surface, borderWidth: 1.5, gap: 6,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon:  { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  quickActionEmoji: { fontSize: 20 },
  quickActionLabel: { ...Typography.caption, fontWeight: '700' },

  // Module cards
  moduleCard:       { padding: 14, gap: 10 },
  moduleCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  moduleIcon: {
    width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
  },
  moduleIconText:   { fontSize: 20 },
  moduleCardTitles: { flex: 1 },
  moduleCardTitle:  { ...Typography.bodyMedium, color: Colors.textPrimary, fontWeight: '700' },
  moduleCardSub:    { ...Typography.caption,    color: Colors.textSecondary, marginTop: 1 },

  // Next vaccine
  nextTag: { borderRadius: 8, paddingVertical: 6, paddingHorizontal: 10, marginTop: 2 },
  nextTagText: { ...Typography.caption, fontWeight: '600' },

  // Growth
  growthRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F9FAFB', borderRadius: 10, padding: 12,
  },
  growthStat:    { flex: 1, alignItems: 'center', gap: 2 },
  growthVal:     { ...Typography.titleBold, fontSize: 22 },
  growthDiff:    { ...Typography.caption, color: Colors.textSecondary },
  growthUnit:    { ...Typography.caption, color: Colors.textSecondary },
  growthPct:     { ...Typography.caption, fontWeight: '700', color: Colors.textSecondary },
  growthDivider: { width: 1, height: 48, backgroundColor: Colors.border, marginHorizontal: 12 },

  // Overdue badge
  overdueBadge: {
    backgroundColor: `${Colors.rose}15`, borderRadius: 20,
    paddingVertical: 3, paddingHorizontal: 8,
  },
  overdueBadgeText: { ...Typography.caption, color: Colors.rose, fontWeight: '700' },

  // Nutrition
  nutritionRow: { flexDirection: 'row', gap: 10 },
  statChip: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#F9FAFB', borderRadius: 10, padding: 10, borderLeftWidth: 3,
  },
  statEmoji: { fontSize: 18 },
  statValue: { ...Typography.bodyMedium, fontWeight: '700' },
  statLabel: { ...Typography.caption, color: Colors.textSecondary },

  // Symptoms banner
  symptomsBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: `${Colors.amber}18`, borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: `${Colors.amber}40`,
  },
  symptomsBannerUrgent: {
    backgroundColor: `${Colors.rose}12`,
    borderColor:     `${Colors.rose}40`,
  },
  symptomsIcon:  { fontSize: 24 },
  symptomsText:  { flex: 1 },
  symptomsTitle: { ...Typography.bodyMedium, color: Colors.amber, fontWeight: '700' },
  symptomsSub:   { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
});
