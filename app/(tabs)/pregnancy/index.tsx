import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView, View, Text, StyleSheet, TouchableOpacity, TextInput,
  Modal, Pressable, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/shared/theme/colors';
import { Typography } from '@/shared/theme/typography';
import { Card } from '@/shared/ui/Card';
import { useProfileStore } from '@/store/profileStore';
import { usePregnancyStore } from '@/store/pregnancyStore';
import {
  getPregnancyWeek,
  getTrimester,
  getDaysUntilFPP,
} from '@/entities/profile/model/selectors';
import {
  getWeekData,
  PRENATAL_CHECKLIST,
  PREGNANCY_SYMPTOMS,
  PREGNANCY_FAQ,
} from '@/shared/constants/pregnancyData';
import type { PregnancyProfile } from '@/entities/profile/model/types';
import type { ChecklistCategory } from '@/entities/pregnancy/model/types';
import type { WeightEntry } from '@/entities/pregnancy/model/types';

// ─── Constants ────────────────────────────────────────────────────────────────

const TRIMESTER_LABELS = { 1: '1er Trimestre', 2: '2º Trimestre', 3: '3er Trimestre' } as const;

const CATEGORY_META: Record<ChecklistCategory, { emoji: string; label: string }> = {
  blood_tests:  { emoji: '🩸', label: 'Analíticas' },
  ultrasounds:  { emoji: '📡', label: 'Ecografías' },
  vaccines:     { emoji: '💉', label: 'Vacunas' },
  supplements:  { emoji: '💊', label: 'Suplementos' },
  birth_plan:   { emoji: '📋', label: 'Plan de Parto' },
  hospital_bag: { emoji: '🧳', label: 'Bolsa Hospital' },
};

const CHECKLIST_CATEGORIES: ChecklistCategory[] = [
  'blood_tests', 'ultrasounds', 'vaccines', 'supplements', 'birth_plan', 'hospital_bag',
];

const URGENCY_META = {
  info:    { color: Colors.skyBlue,  bg: `${Colors.skyBlue}14`,  icon: 'ℹ️' },
  warning: { color: Colors.amber,    bg: `${Colors.amber}14`,    icon: '⚠️' },
  urgent:  { color: Colors.coral,    bg: `${Colors.coral}14`,    icon: '🚨' },
};

// ─── Week Progress Dots ───────────────────────────────────────────────────────

function WeekDots({ week }: { week: number }) {
  return (
    <View style={dotStyles.container}>
      {Array.from({ length: 40 }, (_, i) => {
        const w = i + 1;
        const filled = w <= week;
        const current = w === week;
        return (
          <View
            key={w}
            style={[
              dotStyles.dot,
              filled && dotStyles.dotFilled,
              current && dotStyles.dotCurrent,
            ]}
          />
        );
      })}
    </View>
  );
}

const dotStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    justifyContent: 'center',
    marginTop: 16,
    paddingHorizontal: 8,
  },
  dot: {
    width: 10,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  dotFilled: {
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  dotCurrent: {
    backgroundColor: '#FFFFFF',
    width: 18,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
});

// ─── Weight Chart ─────────────────────────────────────────────────────────────

function WeightChart({ entries }: { entries: WeightEntry[] }) {
  if (entries.length === 0) return null;
  const last8 = entries.slice(-8);
  const weights = last8.map((e) => e.weight);
  const min = Math.floor(Math.min(...weights)) - 1;
  const max = Math.ceil(Math.max(...weights)) + 1;
  const range = max - min || 1;

  return (
    <View style={chartStyles.container}>
      {last8.map((entry, i) => {
        const barHeight = Math.max(((entry.weight - min) / range) * 80, 6);
        const label = entry.date.slice(5).replace('-', '/');
        const isLast = i === last8.length - 1;
        return (
          <View key={entry.date} style={chartStyles.col}>
            <Text style={chartStyles.val}>{entry.weight}</Text>
            <View style={chartStyles.barTrack}>
              <View
                style={[
                  chartStyles.bar,
                  { height: barHeight },
                  isLast && chartStyles.barActive,
                ]}
              />
            </View>
            <Text style={chartStyles.date}>{label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const chartStyles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginTop: 8, height: 120 },
  col: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  val: { fontSize: 9, fontWeight: '600', color: Colors.textSecondary, marginBottom: 2 },
  barTrack: { width: '100%', height: 80, justifyContent: 'flex-end' },
  bar: {
    width: '100%',
    backgroundColor: `${Colors.lavender}50`,
    borderRadius: 4,
  },
  barActive: {
    backgroundColor: Colors.lavender,
  },
  date: { fontSize: 8, color: Colors.textSecondary, marginTop: 4, textAlign: 'center' },
});

// ─── Add Weight Modal ─────────────────────────────────────────────────────────

function AddWeightModal({ visible, onClose, onAdd }: {
  visible: boolean;
  onClose: () => void;
  onAdd: (entry: WeightEntry) => void;
}) {
  const [value, setValue] = useState('');
  const today = new Date().toISOString().slice(0, 10);

  const handleAdd = () => {
    const num = parseFloat(value.replace(',', '.'));
    if (isNaN(num) || num < 30 || num > 200) {
      Alert.alert('Peso inválido', 'Introduce un peso entre 30 y 200 kg.');
      return;
    }
    onAdd({ date: today, weight: Math.round(num * 10) / 10 });
    setValue('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={wModalStyles.overlay} onPress={onClose}>
        <Pressable style={wModalStyles.box} onPress={() => {}}>
          <Text style={wModalStyles.title}>Registrar peso</Text>
          <Text style={wModalStyles.subtitle}>
            {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
          </Text>
          <View style={wModalStyles.inputRow}>
            <TextInput
              style={wModalStyles.input}
              placeholder="Ej: 65.4"
              keyboardType="decimal-pad"
              value={value}
              onChangeText={setValue}
              autoFocus
            />
            <Text style={wModalStyles.unit}>kg</Text>
          </View>
          <TouchableOpacity
            style={[wModalStyles.btn, !value && wModalStyles.btnDisabled]}
            onPress={handleAdd}
            disabled={!value}
          >
            <Text style={wModalStyles.btnText}>Guardar</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const wModalStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'center', alignItems: 'center' },
  box: { backgroundColor: Colors.surface, borderRadius: 20, padding: 24, width: 300, gap: 12 },
  title: { ...Typography.headingBold, textAlign: 'center' },
  subtitle: { ...Typography.bodyRegular, textAlign: 'center' },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: {
    flex: 1, borderWidth: 1.5, borderColor: Colors.lavender, borderRadius: 12,
    padding: 12, fontSize: 22, fontWeight: '700', textAlign: 'center', color: Colors.textPrimary,
  },
  unit: { ...Typography.headingBold, color: Colors.textSecondary },
  btn: {
    backgroundColor: Colors.lavender, borderRadius: 12, paddingVertical: 14,
    alignItems: 'center',
  },
  btnDisabled: { opacity: 0.4 },
  btnText: { ...Typography.bodyMedium, color: '#fff', fontWeight: '700' },
});

// ─── Checklist Section ────────────────────────────────────────────────────────

function ChecklistSection({ profileId }: { profileId: string }) {
  const [openCategory, setOpenCategory] = useState<ChecklistCategory | null>('blood_tests');
  const getChecklist = usePregnancyStore((s) => s.getChecklist);
  const toggle = usePregnancyStore((s) => s.toggleChecklistItem);
  const items = getChecklist(profileId);

  const toggle2 = useCallback(
    (itemId: string) => toggle(profileId, itemId),
    [profileId, toggle]
  );

  return (
    <View style={{ gap: 8 }}>
      {CHECKLIST_CATEGORIES.map((cat) => {
        const catItems = items.filter((i) => i.category === cat);
        const doneCount = catItems.filter((i) => i.done).length;
        const isOpen = openCategory === cat;
        const meta = CATEGORY_META[cat];
        const allDone = doneCount === catItems.length;

        return (
          <Card key={cat} padding={0} style={checkStyles.card}>
            <TouchableOpacity
              style={checkStyles.header}
              onPress={() => setOpenCategory(isOpen ? null : cat)}
              activeOpacity={0.7}
            >
              <View style={checkStyles.headerLeft}>
                <Text style={checkStyles.catEmoji}>{meta.emoji}</Text>
                <View>
                  <Text style={checkStyles.catLabel}>{meta.label}</Text>
                  <Text style={checkStyles.catProgress}>
                    {doneCount}/{catItems.length} completados
                  </Text>
                </View>
              </View>
              <View style={checkStyles.headerRight}>
                {allDone && <Text style={checkStyles.allDone}>✓</Text>}
                <Text style={checkStyles.chevron}>{isOpen ? '▲' : '▼'}</Text>
              </View>
            </TouchableOpacity>

            {/* Progress bar inside header */}
            <View style={checkStyles.progressTrack}>
              <View
                style={[
                  checkStyles.progressFill,
                  { width: `${(doneCount / catItems.length) * 100}%` },
                  allDone && checkStyles.progressFillDone,
                ]}
              />
            </View>

            {isOpen && (
              <View style={checkStyles.items}>
                {catItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={checkStyles.item}
                    onPress={() => toggle2(item.id)}
                    activeOpacity={0.6}
                  >
                    <View style={[checkStyles.checkbox, item.done && checkStyles.checkboxDone]}>
                      {item.done && <Text style={checkStyles.checkmark}>✓</Text>}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[checkStyles.itemLabel, item.done && checkStyles.itemLabelDone]}>
                        {item.label}
                      </Text>
                      {item.weekRange && (
                        <Text style={checkStyles.itemWeek}>{item.weekRange}</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </Card>
        );
      })}
    </View>
  );
}

const checkStyles = StyleSheet.create({
  card: { overflow: 'hidden' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  catEmoji: { fontSize: 24 },
  catLabel: { ...Typography.bodyMedium },
  catProgress: { ...Typography.caption, marginTop: 1 },
  chevron: { color: Colors.textSecondary, fontSize: 11 },
  allDone: { color: Colors.mint, fontWeight: '700', fontSize: 16 },
  progressTrack: { height: 3, backgroundColor: Colors.border, marginHorizontal: 0 },
  progressFill: {
    height: 3, backgroundColor: Colors.lavender, borderRadius: 2,
  },
  progressFillDone: { backgroundColor: Colors.mint },
  items: { paddingHorizontal: 16, paddingBottom: 12, gap: 0 },
  item: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    paddingVertical: 10, borderTopWidth: 1, borderTopColor: Colors.border,
  },
  checkbox: {
    width: 22, height: 22, borderRadius: 6, borderWidth: 2,
    borderColor: Colors.lavender, alignItems: 'center', justifyContent: 'center',
    marginTop: 1,
  },
  checkboxDone: { backgroundColor: Colors.lavender, borderColor: Colors.lavender },
  checkmark: { color: '#fff', fontSize: 13, fontWeight: '700' },
  itemLabel: { ...Typography.bodyRegular, color: Colors.textPrimary },
  itemLabelDone: { color: Colors.textSecondary, textDecorationLine: 'line-through' },
  itemWeek: { ...Typography.caption, marginTop: 2, color: Colors.lavender },
});

// ─── Symptoms Section ─────────────────────────────────────────────────────────

function SymptomsSection({ trimester }: { trimester: 1 | 2 | 3 }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const symptoms = PREGNANCY_SYMPTOMS.filter((s) => s.trimester === trimester);

  return (
    <View style={{ gap: 8 }}>
      {symptoms.map((symptom) => {
        const meta = URGENCY_META[symptom.urgency];
        const isOpen = expanded === symptom.id;
        return (
          <TouchableOpacity
            key={symptom.id}
            onPress={() => setExpanded(isOpen ? null : symptom.id)}
            activeOpacity={0.7}
          >
            <View style={[sympStyles.row, { backgroundColor: meta.bg, borderColor: `${meta.color}35` }]}>
              <Text style={sympStyles.icon}>{meta.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[sympStyles.label, { color: meta.color }]}>{symptom.label}</Text>
                {isOpen && (
                  <Text style={sympStyles.advice}>{symptom.advice}</Text>
                )}
              </View>
              <Text style={[sympStyles.chevron, { color: meta.color }]}>{isOpen ? '▲' : '▼'}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const sympStyles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    borderRadius: 12, padding: 14, borderWidth: 1,
  },
  icon: { fontSize: 18, marginTop: 1 },
  label: { ...Typography.bodyMedium, fontWeight: '600' },
  advice: { ...Typography.bodyRegular, marginTop: 6, lineHeight: 20 },
  chevron: { fontSize: 10, marginTop: 4 },
});

// ─── FAQ Section ──────────────────────────────────────────────────────────────

function FAQSection() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <View style={{ gap: 8 }}>
      {PREGNANCY_FAQ.map((item) => {
        const isOpen = expanded === item.id;
        return (
          <Card key={item.id} padding={0} style={{ overflow: 'hidden' }}>
            <TouchableOpacity
              style={faqStyles.header}
              onPress={() => setExpanded(isOpen ? null : item.id)}
              activeOpacity={0.7}
            >
              <Text style={faqStyles.question}>{item.question}</Text>
              <Text style={faqStyles.chevron}>{isOpen ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {isOpen && (
              <View style={faqStyles.answer}>
                <Text style={faqStyles.answerText}>{item.answer}</Text>
              </View>
            )}
          </Card>
        );
      })}
    </View>
  );
}

const faqStyles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    padding: 16, gap: 12,
  },
  question: { ...Typography.bodyMedium, flex: 1 },
  chevron: { color: Colors.textSecondary, fontSize: 11, marginTop: 3 },
  answer: { paddingHorizontal: 16, paddingBottom: 16, borderTopWidth: 1, borderTopColor: Colors.border },
  answerText: { ...Typography.bodyRegular, lineHeight: 22, marginTop: 12 },
});

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: string }) {
  return <Text style={secStyles.title}>{children}</Text>;
}

const secStyles = StyleSheet.create({
  title: {
    ...Typography.headingBold,
    marginBottom: 4,
    marginTop: 8,
    paddingHorizontal: 4,
  },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function PregnancyScreen() {
  const activeProfile = useProfileStore((s) => s.activeProfile());
  const [symptomTrimester, setSymptomTrimester] = useState<1 | 2 | 3>(1);
  const [weightModalOpen, setWeightModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'checklist' | 'symptoms' | 'faq'>('checklist');

  const seedWeightIfEmpty = usePregnancyStore((s) => s.seedWeightIfEmpty);
  const addWeightEntry = usePregnancyStore((s) => s.addWeightEntry);
  const getWeightEntries = usePregnancyStore((s) => s.getWeightEntries);

  useEffect(() => {
    if (activeProfile?.type === 'pregnancy') {
      seedWeightIfEmpty(activeProfile.id);
    }
  }, [activeProfile?.id]);

  if (!activeProfile || activeProfile.type !== 'pregnancy') return null;

  const profile = activeProfile as PregnancyProfile;
  const week = getPregnancyWeek(profile);
  const trimester = getTrimester(profile);
  const daysLeft = getDaysUntilFPP(profile);
  const weekData = getWeekData(week);
  const progress = Math.min(week / 40, 1);
  const weightEntries = getWeightEntries(profile.id);
  const latestWeight = weightEntries.length > 0 ? weightEntries[weightEntries.length - 1] : null;
  const firstWeight = weightEntries.length > 0 ? weightEntries[0] : null;
  const weightGain = latestWeight && firstWeight
    ? Math.round((latestWeight.weight - firstWeight.weight) * 10) / 10
    : null;

  const fppFormatted = new Date(profile.fpp).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const NAV_SECTIONS = [
    { key: 'checklist', label: 'Checklist', emoji: '✅' },
    { key: 'symptoms', label: 'Síntomas', emoji: '💬' },
    { key: 'faq', label: 'FAQ', emoji: '❓' },
  ] as const;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Hero ── */}
        <View style={styles.hero}>
          <Text style={styles.trimesterBadge}>{TRIMESTER_LABELS[trimester]}</Text>
          <Text style={styles.weekNumber}>{week}</Text>
          <Text style={styles.weekLabel}>semanas de embarazo</Text>

          <WeekDots week={week} />

          <View style={styles.progressRow}>
            <Text style={styles.progressText}>Semana {week} de 40</Text>
            <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{daysLeft}</Text>
              <Text style={styles.statLabel}>días para parto</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{weekData.length}</Text>
              <Text style={styles.statLabel}>longitud bebé</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{weekData.weight}</Text>
              <Text style={styles.statLabel}>peso bebé</Text>
            </View>
          </View>
        </View>

        {/* ── Cards row: Baby size + Countdown ── */}
        <View style={styles.cards}>
          <Card style={styles.halfCard} padding={14}>
            <Text style={styles.cardLabel}>TU BEBÉ</Text>
            <Text style={styles.babySizeEmoji}>{weekData.fruitEmoji}</Text>
            <Text style={styles.babySizeName}>{weekData.babySize}</Text>
            <Text style={styles.babySizeDesc} numberOfLines={2}>{weekData.description}</Text>
          </Card>

          <Card style={styles.halfCard} padding={14}>
            <Text style={styles.cardLabel}>CUENTA ATRÁS</Text>
            <Text style={styles.countdownNum}>{daysLeft}</Text>
            <Text style={styles.countdownUnit}>días</Text>
            <Text style={styles.countdownFPP}>📅 {fppFormatted}</Text>
          </Card>
        </View>

        {/* ── Maternal weight ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <SectionTitle>⚖️ Peso maternal</SectionTitle>
            <TouchableOpacity
              style={styles.addWeightBtn}
              onPress={() => setWeightModalOpen(true)}
            >
              <Text style={styles.addWeightText}>+ Registrar</Text>
            </TouchableOpacity>
          </View>

          <Card padding={16}>
            {latestWeight && (
              <View style={styles.weightSummary}>
                <View style={styles.weightMain}>
                  <Text style={styles.weightValue}>{latestWeight.weight}</Text>
                  <Text style={styles.weightUnit}>kg</Text>
                </View>
                <View>
                  {weightGain !== null && (
                    <View style={styles.weightGainPill}>
                      <Text style={styles.weightGainText}>
                        {weightGain >= 0 ? '+' : ''}{weightGain} kg total
                      </Text>
                    </View>
                  )}
                  <Text style={styles.weightDate}>
                    {new Date(latestWeight.date).toLocaleDateString('es-ES', {
                      day: 'numeric', month: 'short',
                    })}
                  </Text>
                </View>
              </View>
            )}
            <WeightChart entries={weightEntries} />
            <Text style={styles.weightHint}>
              Ganancia recomendada para normopeso: 11.5–16 kg
            </Text>
          </Card>
        </View>

        {/* ── Section navigator ── */}
        <View style={styles.section}>
          <View style={styles.navTabs}>
            {NAV_SECTIONS.map((s) => (
              <TouchableOpacity
                key={s.key}
                style={[styles.navTab, activeSection === s.key && styles.navTabActive]}
                onPress={() => setActiveSection(s.key)}
              >
                <Text style={styles.navTabEmoji}>{s.emoji}</Text>
                <Text style={[styles.navTabLabel, activeSection === s.key && styles.navTabLabelActive]}>
                  {s.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Checklist ── */}
        {activeSection === 'checklist' && (
          <View style={styles.section}>
            <SectionTitle>✅ Checklist Prenatal</SectionTitle>
            <ChecklistSection profileId={profile.id} />
          </View>
        )}

        {/* ── Symptoms ── */}
        {activeSection === 'symptoms' && (
          <View style={styles.section}>
            <SectionTitle>💬 Síntomas por trimestre</SectionTitle>
            <View style={styles.trimesterTabs}>
              {([1, 2, 3] as const).map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.trimTab, symptomTrimester === t && styles.trimTabActive]}
                  onPress={() => setSymptomTrimester(t)}
                >
                  <Text style={[styles.trimTabText, symptomTrimester === t && styles.trimTabTextActive]}>
                    {TRIMESTER_LABELS[t]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.urgencyLegend}>
              {(['info', 'warning', 'urgent'] as const).map((u) => (
                <View key={u} style={styles.legendItem}>
                  <Text style={styles.legendIcon}>{URGENCY_META[u].icon}</Text>
                  <Text style={[styles.legendText, { color: URGENCY_META[u].color }]}>
                    {u === 'info' ? 'Informativo' : u === 'warning' ? 'Avisar médico' : 'Urgente'}
                  </Text>
                </View>
              ))}
            </View>
            <SymptomsSection trimester={symptomTrimester} />
          </View>
        )}

        {/* ── FAQ ── */}
        {activeSection === 'faq' && (
          <View style={styles.section}>
            <SectionTitle>❓ Preguntas frecuentes</SectionTitle>
            <FAQSection />
            {/* Doctor badge */}
            <View style={styles.doctorBadge}>
              <Text style={styles.doctorEmoji}>👩‍⚕️</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.doctorName}>Dra. Saray Mesonero</Text>
                <Text style={styles.doctorRole}>Contenido médicamente validado</Text>
              </View>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓ Verificado</Text>
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>

      <AddWeightModal
        visible={weightModalOpen}
        onClose={() => setWeightModalOpen(false)}
        onAdd={(entry) => addWeightEntry(profile.id, entry)}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 32 },

  // Hero
  hero: {
    backgroundColor: Colors.gradients.pregnancy[0],
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 16,
    alignItems: 'center',
  },
  trimesterBadge: {
    ...Typography.labelUppercase,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    overflow: 'hidden',
  },
  weekNumber: {
    fontSize: 88,
    fontWeight: '900',
    letterSpacing: -4,
    color: '#FFFFFF',
    lineHeight: 92,
    marginTop: 4,
  },
  weekLabel: {
    ...Typography.headingBold,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
    marginBottom: 6,
  },
  progressText: {
    ...Typography.caption,
    color: 'rgba(255,255,255,0.8)',
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 0,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  statLabel: { fontSize: 10, color: 'rgba(255,255,255,0.75)', marginTop: 2, textAlign: 'center' },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.3)', marginVertical: 4 },

  // Cards
  cards: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, marginBottom: 8 },
  halfCard: { flex: 1 },
  cardLabel: { ...Typography.labelUppercase, marginBottom: 8 },
  babySizeEmoji: { fontSize: 36, marginBottom: 6 },
  babySizeName: { ...Typography.bodyMedium, fontWeight: '700' },
  babySizeDesc: { ...Typography.bodyRegular, marginTop: 4, lineHeight: 18 },
  countdownNum: {
    fontSize: 52, fontWeight: '900', letterSpacing: -2,
    color: Colors.lavender, lineHeight: 56,
  },
  countdownUnit: { ...Typography.bodyRegular, marginBottom: 4 },
  countdownFPP: { ...Typography.caption, color: Colors.textPrimary, lineHeight: 16 },

  // Weight
  section: { paddingHorizontal: 16, gap: 12, marginBottom: 8 },
  sectionHeaderRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  addWeightBtn: {
    backgroundColor: `${Colors.lavender}18`, borderRadius: 20, borderWidth: 1,
    borderColor: `${Colors.lavender}40`, paddingHorizontal: 14, paddingVertical: 6,
  },
  addWeightText: { ...Typography.caption, color: Colors.lavender, fontWeight: '600' },
  weightSummary: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4,
  },
  weightMain: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  weightValue: { fontSize: 40, fontWeight: '900', color: Colors.lavender, letterSpacing: -1 },
  weightUnit: { ...Typography.headingBold, color: Colors.textSecondary },
  weightGainPill: {
    backgroundColor: `${Colors.mint}18`, borderRadius: 12, paddingHorizontal: 10,
    paddingVertical: 4, alignSelf: 'flex-end', marginBottom: 4,
  },
  weightGainText: { ...Typography.caption, color: Colors.mint, fontWeight: '700' },
  weightDate: { ...Typography.caption, textAlign: 'right' },
  weightHint: {
    ...Typography.caption, textAlign: 'center', marginTop: 12,
    color: Colors.textSecondary, fontStyle: 'italic',
  },

  // Nav tabs
  navTabs: {
    flexDirection: 'row', backgroundColor: Colors.surface,
    borderRadius: 16, padding: 4, gap: 4,
    shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 8, elevation: 3,
  },
  navTab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 10, borderRadius: 12,
  },
  navTabActive: { backgroundColor: Colors.lavender },
  navTabEmoji: { fontSize: 16 },
  navTabLabel: { ...Typography.caption, fontWeight: '600', color: Colors.textSecondary },
  navTabLabelActive: { color: '#fff' },

  // Trimester tabs (symptoms)
  trimesterTabs: { flexDirection: 'row', gap: 8 },
  trimTab: {
    flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center',
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
  },
  trimTabActive: { borderColor: Colors.lavender, backgroundColor: `${Colors.lavender}14` },
  trimTabText: { ...Typography.caption, fontWeight: '600', color: Colors.textSecondary },
  trimTabTextActive: { color: Colors.lavender },

  // Urgency legend
  urgencyLegend: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendIcon: { fontSize: 13 },
  legendText: { fontSize: 11, fontWeight: '600' },

  // Doctor badge
  doctorBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: `${Colors.lavender}10`,
    borderRadius: 14, padding: 14, marginTop: 4,
    borderWidth: 1, borderColor: `${Colors.lavender}25`,
  },
  doctorEmoji: { fontSize: 32 },
  doctorName: { ...Typography.bodyMedium, fontWeight: '700' },
  doctorRole: { ...Typography.caption, marginTop: 1 },
  verifiedBadge: {
    backgroundColor: `${Colors.mint}20`, borderRadius: 8, borderWidth: 1,
    borderColor: `${Colors.mint}40`, paddingHorizontal: 8, paddingVertical: 4,
  },
  verifiedText: { fontSize: 11, fontWeight: '700', color: Colors.mint },
});
