import React, { useEffect } from 'react';
import {
  ScrollView, View, Text, StyleSheet, TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '@/shared/theme/colors';
import { Typography } from '@/shared/theme/typography';
import { Card } from '@/shared/ui/Card';
import { ProgressBar } from '@/shared/ui/ProgressBar';
import { useProfileStore } from '@/store/profileStore';
import { useHealthStore } from '@/store/healthStore';
import { useNutritionStore } from '@/store/nutritionStore';
import { useDevelopmentStore } from '@/store/developmentStore';
import { getAgeInMonths } from '@/entities/profile/model/selectors';
import { VACCINE_CALENDAR, SYMPTOM_OPTIONS } from '@/shared/constants/healthData';
import { FOOD_CHECKLIST, MEAL_TYPE_LABELS } from '@/shared/constants/nutritionData';
import { MILESTONES } from '@/shared/constants/developmentData';
import type { ChildProfile } from '@/entities/profile/model/types';

// ─── tiny helpers ─────────────────────────────────────────────────────────────

function daysSince(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
}

function relativeDate(iso: string): string {
  const d = daysSince(iso);
  if (d === 0) return 'Hoy';
  if (d === 1) return 'Ayer';
  if (d < 7)   return `Hace ${d} días`;
  if (d < 30)  return `Hace ${Math.floor(d / 7)} semana${Math.floor(d / 7) > 1 ? 's' : ''}`;
  return `Hace ${Math.floor(d / 30)} mes${Math.floor(d / 30) > 1 ? 'es' : ''}`;
}

function symptomLabel(id: string): string {
  return SYMPTOM_OPTIONS.find((s) => s.id === id)?.label ?? id;
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({
  title, linkLabel = 'Ver todo', onPress,
}: { title: string; linkLabel?: string; onPress?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {onPress && (
        <TouchableOpacity onPress={onPress} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.sectionLink}>{linkLabel} →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────

function Divider() {
  return <View style={styles.divider} />;
}

// ─── Module card wrapper ──────────────────────────────────────────────────────

function ModuleCard({
  accentColor, children, onPress,
}: { accentColor: string; children: React.ReactNode; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.92}>
      <Card style={styles.moduleCard}>
        <View style={[styles.moduleAccent, { backgroundColor: accentColor }]} />
        <View style={styles.moduleCardBody}>{children}</View>
      </Card>
    </TouchableOpacity>
  );
}

function ModuleCardHeader({
  emoji, title, subtitle, accentColor,
}: { emoji: string; title: string; subtitle: string; accentColor: string }) {
  return (
    <View style={styles.moduleCardHeader}>
      <View style={[styles.moduleHeaderIcon, { backgroundColor: `${accentColor}18` }]}>
        <Text style={styles.moduleHeaderEmoji}>{emoji}</Text>
      </View>
      <View style={styles.moduleHeaderText}>
        <Text style={styles.moduleHeaderTitle}>{title}</Text>
        <Text style={styles.moduleHeaderSub}>{subtitle}</Text>
      </View>
      <Text style={[styles.moduleHeaderArrow, { color: accentColor }]}>›</Text>
    </View>
  );
}

// ─── 1. Health card ───────────────────────────────────────────────────────────

function HealthCard({ profileId, ageMonths }: { profileId: string; ageMonths: number }) {
  const router           = useRouter();
  const getGrowthRecords = useHealthStore((s) => s.getGrowthRecords);
  const isVaccineDone    = useHealthStore((s) => s.isVaccineDone);
  const getDoneCount     = useHealthStore((s) => s.getDoneCount);
  const getSymptomLogs   = useHealthStore((s) => s.getSymptomLogs);

  const records   = getGrowthRecords(profileId);
  const lastRec   = records.length > 0 ? records[records.length - 1] : null;
  const doneVax   = getDoneCount(profileId);
  const totalVax  = VACCINE_CALENDAR.length;
  const nextVax   = VACCINE_CALENDAR.find(
    (v) => v.ageMonths >= ageMonths && !isVaccineDone(profileId, v.id)
  ) ?? null;
  const mUntil    = nextVax ? Math.max(nextVax.ageMonths - ageMonths, 0) : 0;

  const logs      = getSymptomLogs(profileId);
  const active    = logs.filter((l) => !l.resolved);
  const recentLog = logs[0] ?? null;

  return (
    <ModuleCard accentColor={Colors.coral} onPress={() => router.push('/(tabs)/health')}>
      <ModuleCardHeader
        emoji="❤️"
        title="Salud"
        subtitle={active.length > 0
          ? `${active.length} síntoma${active.length > 1 ? 's' : ''} activo${active.length > 1 ? 's' : ''}`
          : 'Sin síntomas activos'}
        accentColor={Colors.coral}
      />

      <Divider />

      {/* Growth */}
      {lastRec ? (
        <View style={styles.growthPair}>
          <View style={styles.growthHalf}>
            <Text style={[styles.growthBigVal, { color: Colors.coral }]}>{lastRec.weight} kg</Text>
            <Text style={styles.growthBigLabel}>Peso</Text>
            {lastRec.weightPercentile !== undefined && (
              <View style={[styles.pctBadge, { backgroundColor: `${Colors.coral}15` }]}>
                <Text style={[styles.pctBadgeText, { color: Colors.coral }]}>P{lastRec.weightPercentile}</Text>
              </View>
            )}
          </View>
          <View style={styles.growthSep} />
          <View style={styles.growthHalf}>
            <Text style={[styles.growthBigVal, { color: Colors.skyBlue }]}>{lastRec.height} cm</Text>
            <Text style={styles.growthBigLabel}>Talla</Text>
            {lastRec.heightPercentile !== undefined && (
              <View style={[styles.pctBadge, { backgroundColor: `${Colors.skyBlue}15` }]}>
                <Text style={[styles.pctBadgeText, { color: Colors.skyBlue }]}>P{lastRec.heightPercentile}</Text>
              </View>
            )}
          </View>
          <View style={styles.growthHalf}>
            <Text style={[styles.growthBigVal, { color: Colors.textSecondary, fontSize: 14 }]}>
              {relativeDate(lastRec.date)}
            </Text>
            <Text style={styles.growthBigLabel}>Última medida</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.emptyHint}>Sin medidas registradas — añade la primera en Salud.</Text>
      )}

      <Divider />

      {/* Vaccines */}
      <View style={styles.vacRow}>
        <View style={styles.vacInfo}>
          <Text style={styles.vacLabel}>Vacunas</Text>
          <Text style={styles.vacCount}>{doneVax}/{totalVax} completadas</Text>
        </View>
        <View style={styles.vacBarWrap}>
          <ProgressBar progress={totalVax > 0 ? doneVax / totalVax : 0} color={Colors.coral} />
        </View>
      </View>
      {nextVax && (
        <View style={[styles.nextVaxChip, { backgroundColor: `${Colors.coral}10`, borderColor: `${Colors.coral}30` }]}>
          <Text style={styles.nextVaxEmoji}>💉</Text>
          <Text style={[styles.nextVaxText, { color: Colors.coral }]}>
            Próxima: <Text style={{ fontWeight: '700' }}>{nextVax.name}</Text>
            {mUntil === 0 ? ' · Este mes' : ` · En ${mUntil} mes${mUntil > 1 ? 'es' : ''}`}
          </Text>
        </View>
      )}

      {/* Recent symptom */}
      {recentLog && (
        <>
          <Divider />
          <View style={styles.symptomRow}>
            <Text style={styles.symptomDot}>
              {recentLog.resolved ? '✓' : '●'}
            </Text>
            <View style={styles.symptomBody}>
              <Text style={styles.symptomText}>
                {recentLog.symptoms.slice(0, 2).map(symptomLabel).join(', ')}
                {recentLog.symptoms.length > 2 ? ` +${recentLog.symptoms.length - 2}` : ''}
              </Text>
              <Text style={styles.symptomDate}>
                {relativeDate(recentLog.date)}
                {recentLog.fever ? ` · ${recentLog.fever}°C` : ''}
                {recentLog.resolved ? ' · Resuelto' : ' · Activo'}
              </Text>
            </View>
          </View>
        </>
      )}
    </ModuleCard>
  );
}

// ─── 2. Nutrition card ────────────────────────────────────────────────────────

function NutritionCard({ profileId, ageMonths }: { profileId: string; ageMonths: number }) {
  const router               = useRouter();
  const getFoodIntroductions = useNutritionStore((s) => s.getFoodIntroductions);
  const getDiaryEntries      = useNutritionStore((s) => s.getDiaryEntries);
  const seedIfEmpty          = useNutritionStore((s) => s.seedIfEmpty);

  useEffect(() => {
    seedIfEmpty(profileId, profileId === 'profile-sofia' ? 'sofia' : 'lucas');
  }, [profileId]);

  const foods      = getFoodIntroductions(profileId);
  const entries    = getDiaryEntries(profileId);
  const lastEntry  = entries[0] ?? null;

  const introduced = Object.values(foods).filter((f) => f.status === 'introduced').length;
  const tolerated  = Object.values(foods).filter((f) => f.status === 'tolerated').length;
  const reactions  = Object.values(foods).filter((f) => f.status === 'reaction');

  // foods not yet started but age-appropriate
  const pending = FOOD_CHECKLIST.filter(
    (f) => f.recommendedAgeMonths <= ageMonths && !foods[f.id]
  );

  // recent diary reactions
  const recentReactions = entries.filter((e) => e.hadReaction).slice(0, 2);

  const allergiesOnProfile = reactions.length;

  return (
    <ModuleCard accentColor={Colors.mint} onPress={() => router.push('/(tabs)/nutrition')}>
      <ModuleCardHeader
        emoji="🥦"
        title="Nutrición"
        subtitle={`${tolerated} alimentos tolerados · ${reactions.length} reacciones`}
        accentColor={Colors.mint}
      />

      {/* Allergy warning */}
      {allergiesOnProfile > 0 && (
        <View style={[styles.allergyChip, { backgroundColor: `${Colors.rose}12`, borderColor: `${Colors.rose}30` }]}>
          <Text style={styles.allergyChipEmoji}>⚠️</Text>
          <Text style={[styles.allergyChipText, { color: Colors.rose }]}>
            {reactions.map((r) => {
              const item = FOOD_CHECKLIST.find((f) => f.id === r.foodId);
              return item ? `${item.emoji} ${item.name}` : r.foodId;
            }).slice(0, 3).join(' · ')}
            {reactions.length > 3 ? ` +${reactions.length - 3}` : ''}
          </Text>
        </View>
      )}

      <Divider />

      {/* Stats row */}
      <View style={styles.nutritionStats}>
        <View style={styles.nutritionStat}>
          <Text style={[styles.nutritionStatVal, { color: Colors.mint }]}>{tolerated}</Text>
          <Text style={styles.nutritionStatLabel}>Tolerados</Text>
        </View>
        <View style={styles.nutritionSep} />
        <View style={styles.nutritionStat}>
          <Text style={[styles.nutritionStatVal, { color: Colors.amber }]}>{introduced}</Text>
          <Text style={styles.nutritionStatLabel}>En prueba</Text>
        </View>
        <View style={styles.nutritionSep} />
        <View style={styles.nutritionStat}>
          <Text style={[styles.nutritionStatVal, { color: Colors.rose }]}>{reactions.length}</Text>
          <Text style={styles.nutritionStatLabel}>Reacciones</Text>
        </View>
      </View>

      {/* Pending introductions */}
      {pending.length > 0 && (
        <>
          <Divider />
          <View style={styles.pendingRow}>
            <Text style={styles.pendingLabel}>Pendientes de introducir</Text>
            <View style={styles.pendingChips}>
              {pending.slice(0, 4).map((f) => (
                <View key={f.id} style={[styles.pendingChip, { backgroundColor: `${Colors.amber}15` }]}>
                  <Text style={styles.pendingChipText}>{f.emoji} {f.name}</Text>
                </View>
              ))}
              {pending.length > 4 && (
                <View style={[styles.pendingChip, { backgroundColor: '#F3F4F6' }]}>
                  <Text style={[styles.pendingChipText, { color: Colors.textSecondary }]}>+{pending.length - 4} más</Text>
                </View>
              )}
            </View>
          </View>
        </>
      )}

      {/* Latest diary entry */}
      {lastEntry && (
        <>
          <Divider />
          <View style={styles.diaryRow}>
            <Text style={styles.diaryIcon}>
              {lastEntry.hadReaction ? '⚠️' : '🍽️'}
            </Text>
            <View style={styles.diaryBody}>
              <Text style={styles.diaryTitle}>
                {MEAL_TYPE_LABELS[lastEntry.mealType] ?? lastEntry.mealType}
              </Text>
              <Text style={styles.diaryFoods} numberOfLines={1}>
                {lastEntry.foods.join(', ')}
              </Text>
              <Text style={styles.diaryDate}>{relativeDate(lastEntry.date)}</Text>
            </View>
            {lastEntry.hadReaction && (
              <View style={[styles.reactionBadge, { backgroundColor: `${Colors.rose}15` }]}>
                <Text style={[styles.reactionBadgeText, { color: Colors.rose }]}>Reacción</Text>
              </View>
            )}
          </View>
        </>
      )}

      {/* Recent diary reactions */}
      {recentReactions.length > 0 && !lastEntry?.hadReaction && (
        <>
          <Divider />
          <View style={styles.recentReactRow}>
            <Text style={[styles.pendingLabel, { color: Colors.rose }]}>Últimas reacciones del diario</Text>
            {recentReactions.map((e) => (
              <Text key={e.id} style={styles.recentReactItem}>
                • {relativeDate(e.date)} — {e.foods.join(', ').slice(0, 40)}
              </Text>
            ))}
          </View>
        </>
      )}
    </ModuleCard>
  );
}

// ─── 3. Development card ──────────────────────────────────────────────────────

function DevelopmentCard({ profileId, ageMonths }: { profileId: string; ageMonths: number }) {
  const router          = useRouter();
  const getAchievements = useDevelopmentStore((s) => s.getAchievements);
  const seedIfEmpty     = useDevelopmentStore((s) => s.seedIfEmpty);

  useEffect(() => {
    seedIfEmpty(profileId, profileId === 'profile-sofia' ? 'sofia' : 'lucas');
  }, [profileId]);

  const achievements = getAchievements(profileId);
  const relevant     = MILESTONES.filter((m) => m.ageMonthsMin <= ageMonths + 12);
  const done         = relevant.filter((m) => achievements[m.id]).length;
  const overdueMilestones = relevant.filter(
    (m) => !achievements[m.id] && ageMonths > m.ageMonthsMax
  );
  const upcoming = relevant
    .filter((m) => !achievements[m.id] && ageMonths <= m.ageMonthsMax)
    .sort((a, b) => a.ageMonthsMax - b.ageMonthsMax)
    .slice(0, 3);
  const progress = relevant.length > 0 ? done / relevant.length : 0;

  return (
    <ModuleCard accentColor={Colors.indigo} onPress={() => router.push('/(tabs)/development')}>
      <ModuleCardHeader
        emoji="⭐"
        title="Desarrollo"
        subtitle={`${done}/${relevant.length} hitos · ${Math.round(progress * 100)}% completado`}
        accentColor={Colors.indigo}
      />

      <Divider />

      {/* Progress bar */}
      <View style={styles.devProgressWrap}>
        <View style={styles.devProgressRow}>
          <Text style={[styles.devProgressPct, { color: Colors.indigo }]}>
            {Math.round(progress * 100)}%
          </Text>
          <Text style={styles.devProgressCount}>{done} de {relevant.length}</Text>
        </View>
        <ProgressBar progress={progress} color={Colors.indigo} />
      </View>

      {/* Overdue alert */}
      {overdueMilestones.length > 0 && (
        <View style={[styles.overdueChip, { backgroundColor: `${Colors.rose}12`, borderColor: `${Colors.rose}30` }]}>
          <Text style={styles.overdueChipEmoji}>⚠️</Text>
          <Text style={[styles.overdueChipText, { color: Colors.rose }]}>
            {overdueMilestones.length} hito{overdueMilestones.length > 1 ? 's' : ''} con retraso
            {overdueMilestones.length <= 2
              ? ': ' + overdueMilestones.map((m) => m.title).join(', ')
              : ''}
          </Text>
        </View>
      )}

      {/* Upcoming milestones */}
      {upcoming.length > 0 && (
        <>
          <Divider />
          <Text style={styles.upcomingLabel}>Próximos hitos</Text>
          {upcoming.map((m, i) => {
            const mLeft = Math.max(m.ageMonthsMax - ageMonths, 0);
            const isNear = mLeft <= 2;
            return (
              <View key={m.id} style={[
                styles.upcomingRow,
                i < upcoming.length - 1 && styles.upcomingRowBorder,
              ]}>
                <View style={[
                  styles.upcomingDot,
                  { backgroundColor: isNear ? Colors.amber : Colors.indigo },
                ]} />
                <View style={styles.upcomingBody}>
                  <Text style={styles.upcomingTitle}>{m.title}</Text>
                  <Text style={styles.upcomingAge}>
                    {m.ageMonthsMin}–{m.ageMonthsMax} meses
                    {isNear ? ' · Pronto' : ''}
                  </Text>
                </View>
                {isNear && (
                  <View style={[styles.nearBadge, { backgroundColor: `${Colors.amber}20` }]}>
                    <Text style={[styles.nearBadgeText, { color: Colors.amber }]}>Pronto</Text>
                  </View>
                )}
              </View>
            );
          })}
        </>
      )}
    </ModuleCard>
  );
}

// ─── 4. Quick actions ────────────────────────────────────────────────────────

function QuickActions({ profileId }: { profileId: string }) {
  const router = useRouter();

  const actions = [
    { emoji: '🤒', label: 'Síntoma',      color: Colors.coral,  route: '/(tabs)/health'      },
    { emoji: '⚖️',  label: 'Peso/Talla',   color: Colors.skyBlue, route: '/(tabs)/health'     },
    { emoji: '🍽️', label: 'Comida',        color: Colors.mint,   route: '/(tabs)/nutrition'   },
    { emoji: '🏆',  label: 'Hito',          color: Colors.indigo, route: '/(tabs)/development' },
  ] as const;

  return (
    <View style={styles.quickGrid}>
      {actions.map((a) => (
        <TouchableOpacity
          key={a.label}
          style={[styles.quickTile, { borderColor: `${a.color}35` }]}
          onPress={() => router.push(a.route)}
          activeOpacity={0.75}
        >
          <View style={[styles.quickTileIcon, { backgroundColor: `${a.color}15` }]}>
            <Text style={styles.quickTileEmoji}>{a.emoji}</Text>
          </View>
          <Text style={[styles.quickTileLabel, { color: a.color }]}>{a.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ─── Medical validation badge ────────────────────────────────────────────────

function MedicalBadge() {
  return (
    <View style={styles.medBadge}>
      <View style={styles.medBadgeDot} />
      <View style={styles.medBadgeText}>
        <Text style={styles.medBadgeName}>Dra. Saray Mesonero</Text>
        <Text style={styles.medBadgeRole}>
          Contenido validado · Pediatra colegiada
        </Text>
      </View>
    </View>
  );
}

// ─── Profile hero ─────────────────────────────────────────────────────────────

function ProfileHero({ child, ageMonths }: { child: ChildProfile; ageMonths: number }) {
  const ageYears  = Math.floor(ageMonths / 12);
  const remMonths = ageMonths % 12;
  const ageLabel  =
    ageMonths < 24
      ? `${ageMonths} meses`
      : `${ageYears} año${ageYears > 1 ? 's' : ''}${remMonths > 0 ? ` y ${remMonths} m.` : ''}`;

  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long',
  });
  const todayStr = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <View style={styles.hero}>
      {/* gradient layers */}
      <View style={[StyleSheet.absoluteFill, styles.heroGrad1]} />
      <View style={[StyleSheet.absoluteFill, styles.heroGrad2]} />

      <View style={styles.heroInner}>
        <View style={styles.heroLeft}>
          <Text style={styles.heroDate}>{todayStr}</Text>
          <Text style={styles.heroName}>{child.name}</Text>
          <Text style={styles.heroAge}>{ageLabel}</Text>

          {/* pills */}
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
            {child.allergies.map((a) => (
              <View key={a} style={[styles.heroPill, styles.heroPillDanger]}>
                <Text style={[styles.heroPillText, { color: '#92400E' }]}>⚠️ {a}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.heroAvatar}>
          <Text style={styles.heroAvatarLetter}>{child.name[0]}</Text>
        </View>
      </View>
    </View>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function HomeScreen() {
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

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHero child={child} ageMonths={ageMonths} />

        {/* quick actions */}
        <View style={styles.section}>
          <SectionHeader title="Acciones rápidas" />
          <QuickActions profileId={activeProfile.id} />
        </View>

        {/* health */}
        <View style={styles.section}>
          <SectionHeader title="Salud" onPress={undefined} />
          <HealthCard profileId={activeProfile.id} ageMonths={ageMonths} />
        </View>

        {/* nutrition */}
        <View style={styles.section}>
          <SectionHeader title="Nutrición" onPress={undefined} />
          <NutritionCard profileId={activeProfile.id} ageMonths={ageMonths} />
        </View>

        {/* development */}
        <View style={styles.section}>
          <SectionHeader title="Desarrollo" onPress={undefined} />
          <DevelopmentCard profileId={activeProfile.id} ageMonths={ageMonths} />
        </View>

        {/* medical badge */}
        <View style={[styles.section, { marginBottom: 8 }]}>
          <MedicalBadge />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── styles ───────────────────────────────────────────────────────────────────

const HERO_COLOR_START = Colors.gradients.home[0]; // #8B5CF6
const HERO_COLOR_END   = Colors.gradients.home[1]; // #6366f1

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 40 },

  // ── Hero ──────────────────────────────────────────────────────────────────
  hero: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 4,
    overflow: 'hidden',
  },
  heroGrad1: {
    backgroundColor: HERO_COLOR_START,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroGrad2: {
    backgroundColor: HERO_COLOR_END,
    opacity: 0.55,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 28,
  },
  heroLeft:       { flex: 1, paddingRight: 12 },
  heroDate:       { ...Typography.caption,     color: 'rgba(255,255,255,0.65)', marginBottom: 4 },
  heroName:       { ...Typography.displayBold, color: Colors.surface, fontSize: 30, marginBottom: 3 },
  heroAge:        { ...Typography.bodyMedium,  color: 'rgba(255,255,255,0.85)', marginBottom: 12 },
  heroPills:      { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  heroPill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20, paddingVertical: 4, paddingHorizontal: 10,
  },
  heroPillDanger: { backgroundColor: '#FEF3C7' },
  heroPillText:   { ...Typography.caption, color: 'rgba(255,255,255,0.95)', fontWeight: '600' },
  heroAvatar: {
    width: 76, height: 76, borderRadius: 38,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 2.5, borderColor: 'rgba(255,255,255,0.45)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroAvatarLetter: { fontSize: 34, fontWeight: '900', color: Colors.surface },

  // ── Section ───────────────────────────────────────────────────────────────
  section:       { paddingHorizontal: 16, gap: 10, marginTop: 18 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  sectionTitle:  { ...Typography.headingBold, color: Colors.textPrimary },
  sectionLink:   { ...Typography.caption,     color: Colors.indigo, fontWeight: '700' },

  // ── Quick actions ─────────────────────────────────────────────────────────
  quickGrid: { flexDirection: 'row', gap: 10 },
  quickTile: {
    flex: 1, alignItems: 'center', paddingVertical: 14,
    borderRadius: 16, backgroundColor: Colors.surface,
    borderWidth: 1.5, gap: 6,
    shadowColor: '#00000012',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 6, elevation: 3,
  },
  quickTileIcon:  { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  quickTileEmoji: { fontSize: 20 },
  quickTileLabel: { ...Typography.caption, fontWeight: '700', fontSize: 11 },

  // ── Module cards ──────────────────────────────────────────────────────────
  moduleCard: {
    padding: 0, overflow: 'hidden',
    flexDirection: 'row',
    shadowColor: '#00000010',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1, shadowRadius: 8, elevation: 3,
  },
  moduleAccent:    { width: 4, borderRadius: 2, alignSelf: 'stretch' },
  moduleCardBody:  { flex: 1, padding: 16, gap: 10 },
  moduleCardHeader:{ flexDirection: 'row', alignItems: 'center', gap: 10 },
  moduleHeaderIcon: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  moduleHeaderEmoji:{ fontSize: 21 },
  moduleHeaderText: { flex: 1 },
  moduleHeaderTitle:{ ...Typography.bodyMedium, color: Colors.textPrimary, fontWeight: '800' },
  moduleHeaderSub:  { ...Typography.caption, color: Colors.textSecondary, marginTop: 1 },
  moduleHeaderArrow:{ fontSize: 24, fontWeight: '300' },

  // ── Divider ───────────────────────────────────────────────────────────────
  divider: { height: 1, backgroundColor: '#F0E8E4', marginVertical: 2 },

  // ── Growth ────────────────────────────────────────────────────────────────
  growthPair: { flexDirection: 'row', gap: 0 },
  growthHalf: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  growthBigVal:  { ...Typography.titleBold, fontSize: 20 },
  growthBigLabel:{ ...Typography.caption,   color: Colors.textSecondary, marginTop: 1 },
  growthSep: { width: 1, backgroundColor: Colors.border, marginVertical: 4 },
  pctBadge:  { borderRadius: 8, paddingVertical: 2, paddingHorizontal: 6, marginTop: 4 },
  pctBadgeText: { ...Typography.caption, fontWeight: '700' },
  emptyHint:    { ...Typography.caption, color: Colors.textSecondary, textAlign: 'center', paddingVertical: 6 },

  // ── Vaccines ──────────────────────────────────────────────────────────────
  vacRow:    { gap: 6 },
  vacInfo:   { flexDirection: 'row', justifyContent: 'space-between' },
  vacLabel:  { ...Typography.bodyMedium, color: Colors.textPrimary },
  vacCount:  { ...Typography.caption,    color: Colors.textSecondary },
  vacBarWrap:{ },
  nextVaxChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: 10, paddingVertical: 7, paddingHorizontal: 10,
    borderWidth: 1, marginTop: 2,
  },
  nextVaxEmoji: { fontSize: 14 },
  nextVaxText:  { ...Typography.caption, flex: 1 },

  // ── Symptom ───────────────────────────────────────────────────────────────
  symptomRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  symptomDot:  { ...Typography.caption, fontWeight: '700', color: Colors.textSecondary, paddingTop: 1 },
  symptomBody: { flex: 1 },
  symptomText: { ...Typography.bodyMedium, color: Colors.textPrimary },
  symptomDate: { ...Typography.caption,    color: Colors.textSecondary, marginTop: 2 },

  // ── Nutrition ─────────────────────────────────────────────────────────────
  allergyChip: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 6,
    borderRadius: 10, paddingVertical: 8, paddingHorizontal: 10, borderWidth: 1,
  },
  allergyChipEmoji: { fontSize: 15 },
  allergyChipText:  { ...Typography.caption, flex: 1, lineHeight: 17 },

  nutritionStats: { flexDirection: 'row', alignItems: 'center' },
  nutritionStat:  { flex: 1, alignItems: 'center', paddingVertical: 4 },
  nutritionStatVal:  { ...Typography.titleBold, fontSize: 24 },
  nutritionStatLabel:{ ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
  nutritionSep: { width: 1, height: 36, backgroundColor: Colors.border },

  pendingRow:  { gap: 6 },
  pendingLabel:{ ...Typography.caption, color: Colors.textSecondary, fontWeight: '600' },
  pendingChips:{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  pendingChip: { borderRadius: 8, paddingVertical: 4, paddingHorizontal: 8 },
  pendingChipText: { ...Typography.caption, color: Colors.textPrimary },

  diaryRow:   { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  diaryIcon:  { fontSize: 22, marginTop: 1 },
  diaryBody:  { flex: 1 },
  diaryTitle: { ...Typography.bodyMedium, color: Colors.textPrimary, fontWeight: '700' },
  diaryFoods: { ...Typography.caption,    color: Colors.textSecondary, marginTop: 2 },
  diaryDate:  { ...Typography.caption,    color: Colors.textSecondary, marginTop: 1 },

  reactionBadge:    { borderRadius: 8, paddingVertical: 3, paddingHorizontal: 7, alignSelf: 'center' },
  reactionBadgeText:{ ...Typography.caption, fontWeight: '700' },

  recentReactRow:  { gap: 4 },
  recentReactItem: { ...Typography.caption, color: Colors.textSecondary, paddingLeft: 4 },

  // ── Development ───────────────────────────────────────────────────────────
  devProgressWrap: { gap: 6 },
  devProgressRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  devProgressPct:  { ...Typography.titleBold, fontSize: 26 },
  devProgressCount:{ ...Typography.caption, color: Colors.textSecondary },

  overdueChip: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 6,
    borderRadius: 10, paddingVertical: 8, paddingHorizontal: 10, borderWidth: 1,
  },
  overdueChipEmoji:{ fontSize: 15 },
  overdueChipText: { ...Typography.caption, flex: 1, lineHeight: 17 },

  upcomingLabel: { ...Typography.caption, color: Colors.textSecondary, fontWeight: '600', marginBottom: 4 },
  upcomingRow:   { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 7 },
  upcomingRowBorder: { borderBottomWidth: 1, borderBottomColor: '#F0E8E4' },
  upcomingDot:   { width: 8, height: 8, borderRadius: 4 },
  upcomingBody:  { flex: 1 },
  upcomingTitle: { ...Typography.bodyMedium, color: Colors.textPrimary },
  upcomingAge:   { ...Typography.caption,    color: Colors.textSecondary, marginTop: 1 },
  nearBadge:     { borderRadius: 8, paddingVertical: 3, paddingHorizontal: 7 },
  nearBadgeText: { ...Typography.caption, fontWeight: '700' },

  // ── Medical badge ─────────────────────────────────────────────────────────
  medBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: `${Colors.mint}12`,
    borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: `${Colors.mint}30`,
  },
  medBadgeDot: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.mint,
  },
  medBadgeText:  { flex: 1 },
  medBadgeName:  { ...Typography.bodyMedium, color: Colors.textPrimary, fontWeight: '700' },
  medBadgeRole:  { ...Typography.caption,    color: Colors.mint, marginTop: 2 },
});
