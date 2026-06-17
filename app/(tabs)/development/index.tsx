import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView, View, Text, StyleSheet, TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/shared/theme/colors';
import { Typography } from '@/shared/theme/typography';
import { Card } from '@/shared/ui/Card';
import { ProgressBar } from '@/shared/ui/ProgressBar';
import { AppHeader } from '@/shared/ui/AppHeader';
import { SegmentedControl } from '@/shared/ui/SegmentedControl';
import { useProfileStore } from '@/store/profileStore';
import { useDevelopmentStore } from '@/store/developmentStore';
import { MILESTONES, AGE_GROUPS, CATEGORY_CONFIG } from '@/shared/constants/developmentData';
import type { Milestone, MilestoneCategory } from '@/entities/development/model/types';

// ─── helpers ─────────────────────────────────────────────────────────────────

function getAgeMonths(birthDate: string): number {
  const birth = new Date(birthDate);
  const now   = new Date();
  return (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
}

type MilestoneStatus = 'achieved' | 'overdue' | 'upcoming';

function getMilestoneStatus(
  m: Milestone,
  ageMonths: number,
  achievements: Record<string, string>
): MilestoneStatus {
  if (achievements[m.id]) return 'achieved';
  if (ageMonths > m.ageMonthsMax) return 'overdue';
  return 'upcoming';
}

// ─── Disclaimer ──────────────────────────────────────────────────────────────

function Disclaimer() {
  return (
    <View style={styles.disclaimer}>
      <Text style={styles.disclaimerText}>
        ℹ️ Los hitos son indicativos y no sustituyen la evaluación de un profesional sanitario.
        Cada niño tiene su propio ritmo de desarrollo.
      </Text>
    </View>
  );
}

// ─── Category progress bar ───────────────────────────────────────────────────

function CategoryRow({
  category, ageMonths, achievements,
}: {
  category: MilestoneCategory;
  ageMonths: number;
  achievements: Record<string, string>;
}) {
  const cfg      = CATEGORY_CONFIG[category];
  const relevant = MILESTONES.filter((m) => m.category === category && m.ageMonthsMin <= ageMonths + 12);
  const done     = relevant.filter((m) => achievements[m.id]).length;
  const progress = relevant.length > 0 ? done / relevant.length : 0;

  return (
    <View style={styles.categoryRow}>
      <View style={styles.categoryLabelRow}>
        <Text style={styles.categoryEmoji}>{cfg.emoji}</Text>
        <Text style={[styles.categoryLabel, { color: cfg.color }]}>{cfg.label}</Text>
        <Text style={styles.categoryCount}>{done}/{relevant.length}</Text>
      </View>
      <ProgressBar progress={progress} color={cfg.color} />
    </View>
  );
}

// ─── Overdue alert ────────────────────────────────────────────────────────────

function OverdueAlert({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <View style={styles.overdueAlert}>
      <Text style={styles.overdueAlertText}>
        ⚠️ {count} {count === 1 ? 'hito con retraso' : 'hitos con retraso'} —
        consulta con tu pediatra si alguno te preocupa.
      </Text>
    </View>
  );
}

// ─── Resumen tab ─────────────────────────────────────────────────────────────

function ResumenTab({
  ageMonths, achievements, onTabChange,
}: {
  ageMonths: number;
  achievements: Record<string, string>;
  onTabChange: (t: number) => void;
}) {
  const relevant  = MILESTONES.filter((m) => m.ageMonthsMin <= ageMonths + 12);
  const done      = relevant.filter((m) => achievements[m.id]).length;
  const overdueMs = relevant.filter((m) => getMilestoneStatus(m, ageMonths, achievements) === 'overdue');
  const upcoming  = relevant.filter((m) => getMilestoneStatus(m, ageMonths, achievements) === 'upcoming');

  const categories: MilestoneCategory[] = ['motor','cognitive','language','social','educational'];

  return (
    <ScrollView contentContainerStyle={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Disclaimer />

      {/* Stats row */}
      <Card style={styles.statsCard}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: Colors.indigo }]}>{done}</Text>
            <Text style={styles.statLabel}>Logrados</Text>
          </View>
          <View style={[styles.statDivider]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: Colors.skyBlue }]}>{upcoming.length}</Text>
            <Text style={styles.statLabel}>Próximos</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: Colors.rose }]}>{overdueMs.length}</Text>
            <Text style={styles.statLabel}>Vencidos</Text>
          </View>
        </View>
        <View style={styles.statsProgress}>
          <ProgressBar
            progress={relevant.length > 0 ? done / relevant.length : 0}
            color={Colors.indigo}
            label="Progreso total"
            showPercent
          />
        </View>
      </Card>

      <OverdueAlert count={overdueMs.length} />

      {/* Per-category bars */}
      <Card style={styles.sectionCard}>
        <Text style={[Typography.headingBold, styles.sectionTitle]}>Por categoría</Text>
        {categories.map((cat) => (
          <CategoryRow
            key={cat}
            category={cat}
            ageMonths={ageMonths}
            achievements={achievements}
          />
        ))}
      </Card>

      {/* Quick actions */}
      <View style={styles.quickRow}>
        <TouchableOpacity style={[styles.quickBtn, { borderColor: Colors.indigo }]} onPress={() => onTabChange(1)}>
          <Text style={[styles.quickBtnText, { color: Colors.indigo }]}>Ver todos los hitos →</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.quickBtn, { borderColor: Colors.mint }]} onPress={() => onTabChange(2)}>
          <Text style={[styles.quickBtnText, { color: Colors.mint }]}>Ver logros →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ─── Milestone row ────────────────────────────────────────────────────────────

function MilestoneRow({
  milestone, status, onToggle,
}: {
  milestone: Milestone;
  status: MilestoneStatus;
  onToggle: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const cfg = CATEGORY_CONFIG[milestone.category];

  const accentColor =
    status === 'achieved' ? Colors.mint :
    status === 'overdue'  ? Colors.rose :
    Colors.skyBlue;

  const statusLabel =
    status === 'achieved' ? '✓ Logrado' :
    status === 'overdue'  ? '⚠ Vencido' :
    '• Pendiente';

  return (
    <TouchableOpacity onPress={() => setExpanded((e) => !e)} activeOpacity={0.7}>
      <View style={[styles.milestoneRow, { borderLeftColor: accentColor }]}>
        <View style={styles.milestoneMain}>
          <View style={styles.milestoneHeader}>
            <Text style={styles.milestoneTitle}>{milestone.title}</Text>
            <Text style={[styles.milestoneStatus, { color: accentColor }]}>{statusLabel}</Text>
          </View>
          <View style={styles.milestoneMeta}>
            <Text style={[styles.milestoneCat, { color: cfg.color }]}>{cfg.emoji} {cfg.label}</Text>
            <Text style={styles.milestoneAge}>{milestone.ageMonthsMin}-{milestone.ageMonthsMax} meses</Text>
          </View>
          {expanded && (
            <View style={styles.milestoneExpanded}>
              <Text style={styles.milestoneDesc}>{milestone.description}</Text>
              <TouchableOpacity
                style={[
                  styles.toggleBtn,
                  { backgroundColor: status === 'achieved' ? '#FEE2E2' : Colors.indigo },
                ]}
                onPress={onToggle}
              >
                <Text style={[
                  styles.toggleBtnText,
                  { color: status === 'achieved' ? Colors.rose : Colors.surface },
                ]}>
                  {status === 'achieved' ? 'Marcar como pendiente' : 'Marcar como logrado'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Hitos tab ────────────────────────────────────────────────────────────────

type FilterType = 'all' | 'upcoming' | 'overdue';

function HitosTab({
  ageMonths, achievements, onToggle,
}: {
  ageMonths: number;
  achievements: Record<string, string>;
  onToggle: (id: string) => void;
}) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [openGroup, setOpenGroup] = useState<string | null>(AGE_GROUPS[0]);

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all',      label: 'Todos' },
    { key: 'upcoming', label: 'Pendientes' },
    { key: 'overdue',  label: 'Vencidos' },
  ];

  function visibleMilestones(group: string): Milestone[] {
    const groupMs = MILESTONES.filter((m) => m.ageGroup === group);
    if (filter === 'all') return groupMs;
    return groupMs.filter((m) => getMilestoneStatus(m, ageMonths, achievements) === filter);
  }

  return (
    <ScrollView contentContainerStyle={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Filter chips */}
      <View style={styles.filterRow}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, filter === f.key && styles.filterChipActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterChipText, filter === f.key && styles.filterChipTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {AGE_GROUPS.map((group) => {
        const ms = visibleMilestones(group);
        if (ms.length === 0) return null;
        const isOpen = openGroup === group;
        return (
          <Card key={group} style={styles.groupCard}>
            <TouchableOpacity
              style={styles.groupHeader}
              onPress={() => setOpenGroup(isOpen ? null : group)}
              activeOpacity={0.7}
            >
              <Text style={[Typography.headingBold, styles.groupTitle]}>{group}</Text>
              <Text style={styles.groupCount}>{ms.length} hitos  {isOpen ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {isOpen && ms.map((m) => (
              <MilestoneRow
                key={m.id}
                milestone={m}
                status={getMilestoneStatus(m, ageMonths, achievements)}
                onToggle={() => onToggle(m.id)}
              />
            ))}
          </Card>
        );
      })}
    </ScrollView>
  );
}

// ─── Logros tab ───────────────────────────────────────────────────────────────

function LogrosTab({
  achievements, onToggle,
}: {
  achievements: Record<string, string>;
  onToggle: (id: string) => void;
}) {
  const achievedIds = Object.keys(achievements);
  const achieved    = MILESTONES.filter((m) => achievedIds.includes(m.id));

  const categories: MilestoneCategory[] = ['motor','cognitive','language','social','educational'];

  if (achieved.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>🌱</Text>
        <Text style={styles.emptyTitle}>Aún no hay logros registrados</Text>
        <Text style={styles.emptySubtitle}>
          Ve a la pestaña Hitos para marcar los que ya ha alcanzado tu hijo/a.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.tabContent} showsVerticalScrollIndicator={false}>
      {categories.map((cat) => {
        const catMs = achieved.filter((m) => m.category === cat);
        if (catMs.length === 0) return null;
        const cfg = CATEGORY_CONFIG[cat];
        return (
          <Card key={cat} style={styles.groupCard}>
            <View style={[styles.groupHeader, { paddingBottom: 4 }]}>
              <Text style={[Typography.headingBold, { color: cfg.color }]}>
                {cfg.emoji} {cfg.label}
              </Text>
              <Text style={styles.groupCount}>{catMs.length} logros</Text>
            </View>
            {catMs.map((m) => (
              <View key={m.id} style={[styles.achievedRow, { borderLeftColor: cfg.color }]}>
                <View style={styles.achievedInfo}>
                  <Text style={styles.achievedTitle}>{m.title}</Text>
                  <Text style={styles.achievedDate}>
                    Logrado el {achievements[m.id] ?? ''}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => onToggle(m.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={styles.undoBtn}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </Card>
        );
      })}
    </ScrollView>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────

const TAB_SEGMENTS = [
  { key: '0', label: '📊 Resumen' },
  { key: '1', label: '📅 Hitos' },
  { key: '2', label: '✅ Logros' },
];

export default function DevelopmentScreen() {
  const [activeTab, setActiveTab] = useState(0);
  const activeProfile = useProfileStore((s) => s.activeProfile());
  const { toggleMilestone, getAchievements, seedIfEmpty } = useDevelopmentStore();

  useEffect(() => {
    if (!activeProfile || activeProfile.type !== 'child') return;
    const mock = activeProfile.id === 'profile-sofia' ? 'sofia' : 'lucas';
    seedIfEmpty(activeProfile.id, mock);
  }, [activeProfile?.id]);

  if (!activeProfile || activeProfile.type !== 'child') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>👶</Text>
          <Text style={styles.emptyTitle}>Selecciona un perfil infantil</Text>
          <Text style={styles.emptySubtitle}>
            El módulo de desarrollo está disponible para perfiles de niño/a.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const ageMonths  = getAgeMonths(activeProfile.birthDate);
  const achievements = getAchievements(activeProfile.id);
  const relevant   = MILESTONES.filter((m) => m.ageMonthsMin <= ageMonths + 12);
  const done       = relevant.filter((m) => achievements[m.id]).length;
  const progress   = relevant.length > 0 ? done / relevant.length : 0;

  const handleToggle = useCallback((milestoneId: string) => {
    toggleMilestone(activeProfile.id, milestoneId);
  }, [activeProfile.id, toggleMilestone]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" />

      <AppHeader
        section="development"
        title="Desarrollo"
        subtitle={activeProfile.name}
        style={{ marginBottom: 0 }}
      >
        {/* Stats row */}
        <View style={styles.heroStats}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatNum}>{done}</Text>
            <Text style={styles.heroStatLabel}>logros</Text>
          </View>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatNum}>{relevant.length - done}</Text>
            <Text style={styles.heroStatLabel}>pendientes</Text>
          </View>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatNum}>{Math.round(progress * 100)}%</Text>
            <Text style={styles.heroStatLabel}>progreso</Text>
          </View>
        </View>
        {/* Progress bar */}
        <View style={styles.heroBar}>
          <View style={[styles.heroBarFill, { width: `${Math.round(progress * 100)}%` as any }]} />
        </View>
      </AppHeader>

      <SegmentedControl
        segments={TAB_SEGMENTS}
        value={String(activeTab)}
        onChange={(k) => setActiveTab(Number(k))}
        activeColor={Colors.indigo}
      />

      {/* Content */}
      {activeTab === 0 && (
        <ResumenTab
          ageMonths={ageMonths}
          achievements={achievements}
          onTabChange={setActiveTab}
        />
      )}
      {activeTab === 1 && (
        <HitosTab
          ageMonths={ageMonths}
          achievements={achievements}
          onToggle={handleToggle}
        />
      )}
      {activeTab === 2 && (
        <LogrosTab
          achievements={achievements}
          onToggle={handleToggle}
        />
      )}
    </SafeAreaView>
  );
}

// ─── styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  // Hero children
  heroStats: { flexDirection: 'row', gap: 24, marginBottom: 10, marginTop: 8 },
  heroStat:  { alignItems: 'center' },
  heroStatNum:   { ...Typography.titleBold,  color: Colors.surface, fontSize: 22 },
  heroStatLabel: { ...Typography.caption,    color: 'rgba(255,255,255,0.8)' },
  heroBar: {
    height: 6, backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3, overflow: 'hidden',
  },
  heroBarFill: {
    height: 6, backgroundColor: Colors.surface, borderRadius: 3,
  },

  // Tab content
  tabContent: { padding: 16, gap: 12, paddingBottom: 32 },

  // Disclaimer
  disclaimer: {
    backgroundColor: '#EEF2FF',
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.indigo,
  },
  disclaimerText: { ...Typography.caption, color: Colors.indigo, lineHeight: 18 },

  // Stats card
  statsCard: { padding: 16 },
  statsRow:  { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  statItem:  { alignItems: 'center' },
  statNum:   { ...Typography.displayBold, fontSize: 28 },
  statLabel: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: '#E5E7EB', marginVertical: 4 },
  statsProgress: { gap: 4 },

  // Overdue alert
  overdueAlert: {
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.amber,
  },
  overdueAlertText: { ...Typography.caption, color: '#92400E', lineHeight: 18 },

  // Section card
  sectionCard:  { padding: 16, gap: 12 },
  sectionTitle: { color: Colors.textPrimary, marginBottom: 4 },

  // Category row
  categoryRow:      { gap: 4 },
  categoryLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  categoryEmoji:    { fontSize: 14 },
  categoryLabel:    { ...Typography.bodyMedium, flex: 1 },
  categoryCount:    { ...Typography.caption, color: Colors.textSecondary },

  // Quick buttons
  quickRow: { flexDirection: 'row', gap: 10 },
  quickBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 10,
    borderWidth: 1.5, alignItems: 'center',
  },
  quickBtnText: { ...Typography.bodyMedium },

  // Group card (Hitos)
  groupCard:   { padding: 0, overflow: 'hidden' },
  groupHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 14, backgroundColor: Colors.surface,
  },
  groupTitle: { color: Colors.textPrimary },
  groupCount: { ...Typography.caption, color: Colors.textSecondary },

  // Milestone row
  milestoneRow: {
    flexDirection: 'row', borderLeftWidth: 3,
    marginHorizontal: 12, marginBottom: 8,
    backgroundColor: '#F9FAFB', borderRadius: 8,
  },
  milestoneMain:   { flex: 1, padding: 10 },
  milestoneHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  milestoneTitle:  { ...Typography.bodyMedium, color: Colors.textPrimary, flex: 1, marginRight: 8 },
  milestoneStatus: { ...Typography.caption, fontWeight: '600' },
  milestoneMeta:   { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  milestoneCat:    { ...Typography.caption },
  milestoneAge:    { ...Typography.caption, color: Colors.textSecondary },
  milestoneExpanded: { marginTop: 8, gap: 8 },
  milestoneDesc:   { ...Typography.bodyRegular, color: Colors.textSecondary, lineHeight: 20 },
  toggleBtn: {
    paddingVertical: 8, paddingHorizontal: 14,
    borderRadius: 8, alignSelf: 'flex-start',
  },
  toggleBtnText: { ...Typography.bodyMedium },

  // Filter row (Hitos)
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  filterChip: {
    paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: '#E5E7EB',
  },
  filterChipActive: { backgroundColor: Colors.indigo, borderColor: Colors.indigo },
  filterChipText:      { ...Typography.bodyRegular, color: Colors.textSecondary },
  filterChipTextActive: { color: Colors.surface, fontWeight: '600' },

  // Logros
  achievedRow: {
    flexDirection: 'row', alignItems: 'center',
    borderLeftWidth: 3, marginHorizontal: 12, marginBottom: 8,
    backgroundColor: '#F0FDF4', borderRadius: 8, padding: 10,
  },
  achievedInfo:  { flex: 1 },
  achievedTitle: { ...Typography.bodyMedium, color: Colors.textPrimary },
  achievedDate:  { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
  undoBtn: { ...Typography.bodyMedium, color: Colors.rose, paddingLeft: 8 },

  // Empty state
  emptyState: {
    flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32,
  },
  emptyIcon:     { fontSize: 56, marginBottom: 16 },
  emptyTitle:    { ...Typography.headingBold, color: Colors.textPrimary, textAlign: 'center', marginBottom: 8 },
  emptySubtitle: { ...Typography.bodyRegular, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
});
