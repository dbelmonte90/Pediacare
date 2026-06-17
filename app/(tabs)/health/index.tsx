import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView, View, Text, StyleSheet, TouchableOpacity, TextInput,
  Modal, Pressable, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { differenceInMonths, differenceInYears, parseISO, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Colors } from '@/shared/theme/colors';
import { Typography } from '@/shared/theme/typography';
import { Card } from '@/shared/ui/Card';
import { useProfileStore } from '@/store/profileStore';
import { useHealthStore } from '@/store/healthStore';
import {
  VACCINE_CALENDAR,
  SYMPTOM_OPTIONS,
  DIAGNOSIS_RULES,
  calcPercentile,
} from '@/shared/constants/healthData';
import type { ChildProfile } from '@/entities/profile/model/types';
import type { GrowthRecord, SymptomLog, DiagnosisResult } from '@/entities/health/model/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateId() {
  return `h-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function formatAge(birthDate: string): string {
  const birth = parseISO(birthDate);
  const years = differenceInYears(new Date(), birth);
  const months = differenceInMonths(new Date(), birth) % 12;
  if (years === 0) return `${differenceInMonths(new Date(), birth)} meses`;
  if (months === 0) return `${years} año${years !== 1 ? 's' : ''}`;
  return `${years} año${years !== 1 ? 's' : ''} y ${months} mes${months !== 1 ? 'es' : ''}`;
}

function ageMonthsFromBirth(birthDate: string): number {
  return differenceInMonths(new Date(), parseISO(birthDate));
}

function runDiagnosis(symptoms: string[]): DiagnosisResult[] {
  if (symptoms.length === 0) return [];
  const results: DiagnosisResult[] = [];
  const seen = new Set<string>();
  for (const rule of DIAGNOSIS_RULES) {
    const matches = rule.matchSymptoms.filter((s) => symptoms.includes(s)).length;
    if (matches >= rule.minMatch && !seen.has(rule.condition)) {
      seen.add(rule.condition);
      results.push({
        condition: rule.condition,
        description: rule.description,
        urgency: rule.urgency,
        advice: rule.advice,
      });
    }
  }
  // Sort urgent first
  return results.sort((a, b) => {
    const order = { urgent: 0, soon: 1, routine: 2 };
    return order[a.urgency] - order[b.urgency];
  });
}

// ─── Percentile Gauge ─────────────────────────────────────────────────────────

function PercentileGauge({ percentile }: { percentile: number }) {
  const clampedPct = Math.min(Math.max(percentile, 1), 99);
  // Map percentile to position (0–100%)
  const markerPos = clampedPct;
  const zone =
    percentile < 3  ? 'bajo'          :
    percentile < 15 ? 'bajo-normal'   :
    percentile < 85 ? 'normal'        :
    percentile < 97 ? 'alto-normal'   : 'alto';
  const zoneColor =
    zone === 'normal'       ? Colors.mint  :
    zone === 'bajo-normal' || zone === 'alto-normal' ? Colors.amber :
    Colors.coral;

  return (
    <View style={gaugeStyles.container}>
      {/* Track with colored zones */}
      <View style={gaugeStyles.track}>
        {/* Zone: <P3 (0-3%) */}
        <View style={[gaugeStyles.zone, { flex: 3, backgroundColor: `${Colors.coral}35` }]} />
        {/* Zone: P3-P15 (3-15%) */}
        <View style={[gaugeStyles.zone, { flex: 12, backgroundColor: `${Colors.amber}35` }]} />
        {/* Zone: P15-P85 (15-85%) */}
        <View style={[gaugeStyles.zone, { flex: 70, backgroundColor: `${Colors.mint}30` }]} />
        {/* Zone: P85-P97 (85-97%) */}
        <View style={[gaugeStyles.zone, { flex: 12, backgroundColor: `${Colors.amber}35` }]} />
        {/* Zone: >P97 (97-100%) */}
        <View style={[gaugeStyles.zone, { flex: 3, backgroundColor: `${Colors.coral}35` }]} />
      </View>

      {/* Marker */}
      <View style={[gaugeStyles.markerContainer, { left: `${markerPos}%` }]}>
        <View style={[gaugeStyles.marker, { backgroundColor: zoneColor }]} />
        <Text style={[gaugeStyles.markerLabel, { color: zoneColor }]}>P{Math.round(percentile)}</Text>
      </View>

      {/* Labels */}
      <View style={gaugeStyles.labels}>
        <Text style={gaugeStyles.labelText}>P3</Text>
        <Text style={gaugeStyles.labelText}>P15</Text>
        <Text style={gaugeStyles.labelText}>P50</Text>
        <Text style={gaugeStyles.labelText}>P85</Text>
        <Text style={gaugeStyles.labelText}>P97</Text>
      </View>
    </View>
  );
}

const gaugeStyles = StyleSheet.create({
  container: { marginTop: 8, marginBottom: 4 },
  track: { flexDirection: 'row', height: 14, borderRadius: 7, overflow: 'hidden' },
  zone: { height: '100%' },
  markerContainer: {
    position: 'absolute',
    top: -2,
    alignItems: 'center',
    transform: [{ translateX: -8 }],
  },
  marker: {
    width: 16, height: 18, borderRadius: 4,
    borderWidth: 2, borderColor: Colors.surface,
  },
  markerLabel: { fontSize: 10, fontWeight: '700', marginTop: 2 },
  labels: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginTop: 18, paddingHorizontal: 0,
  },
  labelText: { ...Typography.caption, fontSize: 10 },
});

// ─── Growth Mini Chart (bar chart) ────────────────────────────────────────────

function GrowthBarChart({
  records,
  metric,
}: {
  records: GrowthRecord[];
  metric: 'weight' | 'height';
}) {
  if (records.length === 0) return null;
  const last7 = records.slice(-7);
  const vals = last7.map((r) => (metric === 'weight' ? r.weight : r.height));
  const minV = Math.min(...vals) * 0.95;
  const maxV = Math.max(...vals) * 1.02;
  const range = maxV - minV || 1;

  return (
    <View style={bcStyles.container}>
      {last7.map((record, i) => {
        const val = metric === 'weight' ? record.weight : record.height;
        const barH = Math.max(((val - minV) / range) * 70, 6);
        const isLast = i === last7.length - 1;
        const label = `${record.ageMonths}m`;
        return (
          <View key={record.id} style={bcStyles.col}>
            <Text style={bcStyles.val}>{val}</Text>
            <View style={bcStyles.barTrack}>
              <View style={[bcStyles.bar, { height: barH }, isLast && bcStyles.barActive]} />
            </View>
            <Text style={bcStyles.label}>{label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const bcStyles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 110, marginTop: 8 },
  col: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  val: { fontSize: 9, fontWeight: '600', color: Colors.textSecondary, marginBottom: 2 },
  barTrack: { width: '100%', height: 70, justifyContent: 'flex-end' },
  bar: { width: '100%', backgroundColor: `${Colors.coral}45`, borderRadius: 4 },
  barActive: { backgroundColor: Colors.coral },
  label: { fontSize: 8, color: Colors.textSecondary, marginTop: 3 },
});

// ─── Add Growth Record Modal ──────────────────────────────────────────────────

function AddGrowthModal({
  visible, onClose, onAdd, ageMonths,
}: {
  visible: boolean;
  onClose: () => void;
  onAdd: (r: Omit<GrowthRecord, 'id' | 'weightPercentile' | 'heightPercentile'>) => void;
  ageMonths: number;
}) {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  const handleAdd = () => {
    const w = parseFloat(weight.replace(',', '.'));
    const h = parseFloat(height.replace(',', '.'));
    if (isNaN(w) || w < 1 || w > 100) {
      Alert.alert('Peso inválido', 'Introduce un peso entre 1 y 100 kg.'); return;
    }
    if (isNaN(h) || h < 30 || h > 220) {
      Alert.alert('Talla inválida', 'Introduce una talla entre 30 y 220 cm.'); return;
    }
    onAdd({ date: new Date().toISOString().slice(0, 10), ageMonths, weight: w, height: h });
    setWeight(''); setHeight(''); onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={modalStyles.overlay} onPress={onClose}>
        <Pressable style={modalStyles.box} onPress={() => {}}>
          <Text style={modalStyles.title}>Registrar medida</Text>
          <Text style={modalStyles.subtitle}>Hoy · {ageMonths} meses</Text>
          <View style={modalStyles.row}>
            <View style={modalStyles.field}>
              <Text style={modalStyles.fieldLabel}>PESO</Text>
              <View style={modalStyles.inputRow}>
                <TextInput
                  style={modalStyles.input} placeholder="—" keyboardType="decimal-pad"
                  value={weight} onChangeText={setWeight}
                />
                <Text style={modalStyles.unit}>kg</Text>
              </View>
            </View>
            <View style={modalStyles.field}>
              <Text style={modalStyles.fieldLabel}>TALLA</Text>
              <View style={modalStyles.inputRow}>
                <TextInput
                  style={modalStyles.input} placeholder="—" keyboardType="decimal-pad"
                  value={height} onChangeText={setHeight}
                />
                <Text style={modalStyles.unit}>cm</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={[modalStyles.btn, (!weight || !height) && modalStyles.btnDisabled]}
            onPress={handleAdd} disabled={!weight || !height}
          >
            <Text style={modalStyles.btnText}>Guardar</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'center', alignItems: 'center' },
  box: { backgroundColor: Colors.surface, borderRadius: 20, padding: 24, width: 320, gap: 12 },
  title: { ...Typography.headingBold, textAlign: 'center' },
  subtitle: { ...Typography.bodyRegular, textAlign: 'center' },
  row: { flexDirection: 'row', gap: 16 },
  field: { flex: 1 },
  fieldLabel: { ...Typography.labelUppercase, marginBottom: 6 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  input: {
    flex: 1, borderWidth: 1.5, borderColor: Colors.coral, borderRadius: 10,
    padding: 10, fontSize: 20, fontWeight: '700', textAlign: 'center', color: Colors.textPrimary,
  },
  unit: { ...Typography.bodyMedium, color: Colors.textSecondary },
  btn: {
    backgroundColor: Colors.coral, borderRadius: 12, paddingVertical: 14, alignItems: 'center',
  },
  btnDisabled: { opacity: 0.4 },
  btnText: { ...Typography.bodyMedium, color: '#fff', fontWeight: '700' },
});

// ─── Growth Tab ───────────────────────────────────────────────────────────────

function GrowthTab({
  profile,
  ageMonths,
}: {
  profile: ChildProfile;
  ageMonths: number;
}) {
  const [chartMetric, setChartMetric] = useState<'weight' | 'height'>('weight');
  const [addOpen, setAddOpen] = useState(false);
  const getGrowthRecords = useHealthStore((s) => s.getGrowthRecords);
  const addGrowthRecord  = useHealthStore((s) => s.addGrowthRecord);
  const removeGrowthRecord = useHealthStore((s) => s.removeGrowthRecord);
  const records = getGrowthRecords(profile.id);
  const latest = records.length > 0 ? records[records.length - 1] : null;

  const currentWeightPct = latest
    ? calcPercentile(latest.weight, ageMonths, profile.sex, 'weight')
    : null;
  const currentHeightPct = latest
    ? calcPercentile(latest.height, ageMonths, profile.sex, 'height')
    : null;

  const handleAdd = (data: Omit<GrowthRecord, 'id' | 'weightPercentile' | 'heightPercentile'>) => {
    const wPct = calcPercentile(data.weight, ageMonths, profile.sex, 'weight');
    const hPct = calcPercentile(data.height, ageMonths, profile.sex, 'height');
    addGrowthRecord(profile.id, {
      ...data,
      id: generateId(),
      weightPercentile: wPct,
      heightPercentile: hPct,
    });
  };

  const confirmRemove = (id: string) => {
    Alert.alert('Eliminar medida', '¿Eliminar este registro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => removeGrowthRecord(profile.id, id) },
    ]);
  };

  return (
    <View style={{ gap: 12 }}>
      {/* Current stats */}
      <Card padding={16}>
        <View style={growthStyles.headerRow}>
          <Text style={growthStyles.cardLabel}>PESO Y TALLA ACTUALES</Text>
          <TouchableOpacity style={growthStyles.addBtn} onPress={() => setAddOpen(true)}>
            <Text style={growthStyles.addBtnText}>+ Registrar</Text>
          </TouchableOpacity>
        </View>
        {latest ? (
          <>
            <View style={growthStyles.statsRow}>
              <View style={growthStyles.stat}>
                <Text style={growthStyles.statValue}>{latest.weight}</Text>
                <Text style={growthStyles.statUnit}>kg</Text>
                <Text style={growthStyles.statLabel}>Peso</Text>
              </View>
              <View style={growthStyles.divider} />
              <View style={growthStyles.stat}>
                <Text style={growthStyles.statValue}>{latest.height}</Text>
                <Text style={growthStyles.statUnit}>cm</Text>
                <Text style={growthStyles.statLabel}>Talla</Text>
              </View>
              <View style={growthStyles.divider} />
              <View style={growthStyles.stat}>
                <Text style={growthStyles.statValue}>P{currentWeightPct}</Text>
                <Text style={growthStyles.statUnit}> </Text>
                <Text style={growthStyles.statLabel}>Percentil peso</Text>
              </View>
            </View>
            {currentWeightPct !== null && (
              <>
                <Text style={growthStyles.gaugeTitle}>Peso vs. OMS ({profile.sex === 'female' ? 'niñas' : 'niños'})</Text>
                <PercentileGauge percentile={currentWeightPct} />
              </>
            )}
            {currentHeightPct !== null && (
              <>
                <Text style={[growthStyles.gaugeTitle, { marginTop: 16 }]}>Talla vs. OMS</Text>
                <PercentileGauge percentile={currentHeightPct} />
              </>
            )}
            <Text style={growthStyles.lastUpdate}>
              Última medida: {format(parseISO(latest.date), "d 'de' MMMM yyyy", { locale: es })}
            </Text>
          </>
        ) : (
          <Text style={growthStyles.emptyText}>Sin registros. Pulsa "+ Registrar" para añadir el primero.</Text>
        )}
      </Card>

      {/* History chart */}
      {records.length > 1 && (
        <Card padding={16}>
          <View style={growthStyles.headerRow}>
            <Text style={growthStyles.cardLabel}>EVOLUCIÓN</Text>
            <View style={growthStyles.metricTabs}>
              {(['weight', 'height'] as const).map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[growthStyles.metricTab, chartMetric === m && growthStyles.metricTabActive]}
                  onPress={() => setChartMetric(m)}
                >
                  <Text style={[growthStyles.metricTabText, chartMetric === m && growthStyles.metricTabTextActive]}>
                    {m === 'weight' ? '⚖️ Peso' : '📏 Talla'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <GrowthBarChart records={records} metric={chartMetric} />
        </Card>
      )}

      {/* Records list */}
      {records.length > 0 && (
        <Card padding={0} style={{ overflow: 'hidden' }}>
          <View style={growthStyles.listHeader}>
            <Text style={growthStyles.cardLabel}>HISTORIAL</Text>
          </View>
          {[...records].reverse().map((r, i) => (
            <TouchableOpacity
              key={r.id}
              style={[growthStyles.recordRow, i > 0 && growthStyles.recordBorder]}
              onLongPress={() => confirmRemove(r.id)}
            >
              <View style={growthStyles.recordAge}>
                <Text style={growthStyles.recordAgeNum}>{r.ageMonths}m</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={growthStyles.recordValues}>{r.weight} kg · {r.height} cm</Text>
                <Text style={growthStyles.recordDate}>
                  {format(parseISO(r.date), "d MMM yyyy", { locale: es })}
                </Text>
              </View>
              {r.weightPercentile != null && (
                <View style={growthStyles.pctBadge}>
                  <Text style={growthStyles.pctBadgeText}>P{r.weightPercentile}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
          <Text style={growthStyles.hint}>Mantén pulsado para eliminar</Text>
        </Card>
      )}

      <AddGrowthModal
        visible={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={handleAdd}
        ageMonths={ageMonths}
      />
    </View>
  );
}

const growthStyles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  cardLabel: { ...Typography.labelUppercase },
  addBtn: {
    backgroundColor: `${Colors.coral}18`, borderRadius: 20, borderWidth: 1,
    borderColor: `${Colors.coral}40`, paddingHorizontal: 12, paddingVertical: 5,
  },
  addBtnText: { ...Typography.caption, color: Colors.coral, fontWeight: '600' },
  statsRow: { flexDirection: 'row', marginBottom: 16 },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 26, fontWeight: '900', color: Colors.coral, letterSpacing: -0.5 },
  statUnit: { ...Typography.caption, color: Colors.textSecondary },
  statLabel: { ...Typography.caption, marginTop: 2, textAlign: 'center' },
  divider: { width: 1, backgroundColor: Colors.border },
  gaugeTitle: { ...Typography.caption, color: Colors.textSecondary, marginBottom: 2 },
  lastUpdate: { ...Typography.caption, textAlign: 'center', marginTop: 14, fontStyle: 'italic' },
  emptyText: { ...Typography.bodyRegular, textAlign: 'center', paddingVertical: 12 },
  metricTabs: { flexDirection: 'row', gap: 6 },
  metricTab: {
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8,
    backgroundColor: Colors.border,
  },
  metricTabActive: { backgroundColor: Colors.coral },
  metricTabText: { ...Typography.caption, fontWeight: '600', color: Colors.textSecondary },
  metricTabTextActive: { color: '#fff' },
  listHeader: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 },
  recordRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12 },
  recordBorder: { borderTopWidth: 1, borderTopColor: Colors.border },
  recordAge: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: `${Colors.coral}14`, alignItems: 'center', justifyContent: 'center',
  },
  recordAgeNum: { fontSize: 11, fontWeight: '700', color: Colors.coral },
  recordValues: { ...Typography.bodyMedium },
  recordDate: { ...Typography.caption, marginTop: 2 },
  pctBadge: {
    backgroundColor: `${Colors.mint}18`, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3,
  },
  pctBadgeText: { ...Typography.caption, color: Colors.mint, fontWeight: '700' },
  hint: { ...Typography.caption, textAlign: 'center', paddingVertical: 8, color: Colors.textSecondary, fontStyle: 'italic' },
});

// ─── Vaccines Tab ─────────────────────────────────────────────────────────────

function VaccinesTab({ profile, ageMonths }: { profile: ChildProfile; ageMonths: number }) {
  const toggleVaccine  = useHealthStore((s) => s.toggleVaccine);
  const isVaccineDone  = useHealthStore((s) => s.isVaccineDone);
  const getDoneCount   = useHealthStore((s) => s.getDoneCount);

  const doneCount = getDoneCount(profile.id);
  const total = VACCINE_CALENDAR.length;

  // Group by group label
  const groups = VACCINE_CALENDAR.reduce<Record<string, typeof VACCINE_CALENDAR>>((acc, v) => {
    if (!acc[v.group]) acc[v.group] = [];
    acc[v.group].push(v);
    return acc;
  }, {});

  // Find upcoming vaccines (due in next 3 months, not done)
  const upcoming = VACCINE_CALENDAR.filter(
    (v) => !isVaccineDone(profile.id, v.id) && v.ageMonths <= ageMonths + 3
  );

  return (
    <View style={{ gap: 12 }}>
      {/* Progress card */}
      <Card padding={16}>
        <Text style={vacStyles.cardLabel}>PROGRESO VACUNAL</Text>
        <View style={vacStyles.progressRow}>
          <View>
            <Text style={vacStyles.bigNum}>{doneCount}</Text>
            <Text style={vacStyles.bigLabel}>administradas</Text>
          </View>
          <View style={vacStyles.progressRight}>
            <Text style={vacStyles.totalText}>{total - doneCount} pendientes</Text>
            <View style={vacStyles.progressTrack}>
              <View style={[vacStyles.progressFill, { width: `${(doneCount / total) * 100}%` }]} />
            </View>
            <Text style={vacStyles.totalSmall}>Total: {total} vacunas</Text>
          </View>
        </View>
      </Card>

      {/* Upcoming alert */}
      {upcoming.length > 0 && (
        <View style={vacStyles.alertBanner}>
          <Text style={vacStyles.alertIcon}>📅</Text>
          <View style={{ flex: 1 }}>
            <Text style={vacStyles.alertTitle}>Próximas vacunas</Text>
            {upcoming.slice(0, 3).map((v) => (
              <Text key={v.id} style={vacStyles.alertItem}>
                · {v.name} ({v.doseLabel}) — {v.group}
              </Text>
            ))}
            {upcoming.length > 3 && (
              <Text style={vacStyles.alertMore}>+{upcoming.length - 3} más</Text>
            )}
          </View>
        </View>
      )}

      {/* Calendar grouped */}
      {Object.entries(groups).map(([groupName, vaccines]) => {
        const groupDone = vaccines.filter((v) => isVaccineDone(profile.id, v.id)).length;
        const groupDue  = vaccines.some((v) => !isVaccineDone(profile.id, v.id) && v.ageMonths <= ageMonths + 3);
        return (
          <Card key={groupName} padding={0} style={{ overflow: 'hidden' }}>
            <View style={vacStyles.groupHeader}>
              <View style={vacStyles.groupTitleRow}>
                <Text style={vacStyles.groupAge}>{groupName}</Text>
                {groupDue && (
                  <View style={vacStyles.dueBadge}>
                    <Text style={vacStyles.dueBadgeText}>Próximas</Text>
                  </View>
                )}
              </View>
              <Text style={vacStyles.groupProgress}>{groupDone}/{vaccines.length}</Text>
            </View>
            <View style={vacStyles.groupProgressTrack}>
              <View style={[vacStyles.groupProgressFill, {
                width: `${(groupDone / vaccines.length) * 100}%`,
                backgroundColor: groupDone === vaccines.length ? Colors.mint : Colors.coral,
              }]} />
            </View>
            {vaccines.map((v, i) => {
              const done = isVaccineDone(profile.id, v.id);
              const isOverdue = !done && v.ageMonths <= ageMonths;
              const isUpcoming = !done && v.ageMonths > ageMonths && v.ageMonths <= ageMonths + 3;
              return (
                <TouchableOpacity
                  key={v.id}
                  style={[vacStyles.vaccineRow, i > 0 && vacStyles.vaccineBorder]}
                  onPress={() => toggleVaccine(profile.id, v.id)}
                  activeOpacity={0.7}
                >
                  <View style={[vacStyles.checkbox, done && vacStyles.checkboxDone]}>
                    {done && <Text style={vacStyles.checkmark}>✓</Text>}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[vacStyles.vaccineName, done && vacStyles.vaccineNameDone]}>
                      {v.name}
                    </Text>
                    <Text style={vacStyles.vaccineDose}>{v.doseLabel}</Text>
                  </View>
                  {isOverdue && !done && (
                    <View style={vacStyles.overdueBadge}>
                      <Text style={vacStyles.overdueBadgeText}>Pendiente</Text>
                    </View>
                  )}
                  {isUpcoming && (
                    <View style={vacStyles.upcomingBadge}>
                      <Text style={vacStyles.upcomingBadgeText}>Próxima</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </Card>
        );
      })}
    </View>
  );
}

const vacStyles = StyleSheet.create({
  cardLabel: { ...Typography.labelUppercase, marginBottom: 12 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  bigNum: { fontSize: 48, fontWeight: '900', color: Colors.coral, letterSpacing: -2, lineHeight: 52 },
  bigLabel: { ...Typography.caption, color: Colors.textSecondary },
  progressRight: { flex: 1, gap: 4 },
  totalText: { ...Typography.bodyMedium },
  totalSmall: { ...Typography.caption },
  progressTrack: { height: 6, backgroundColor: Colors.border, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: 6, backgroundColor: Colors.coral, borderRadius: 3 },
  alertBanner: {
    flexDirection: 'row', gap: 12, alignItems: 'flex-start',
    backgroundColor: `${Colors.amber}14`, borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: `${Colors.amber}35`,
  },
  alertIcon: { fontSize: 20, marginTop: 2 },
  alertTitle: { ...Typography.bodyMedium, fontWeight: '700', color: Colors.amber, marginBottom: 4 },
  alertItem: { ...Typography.bodyRegular, marginBottom: 2 },
  alertMore: { ...Typography.caption, color: Colors.amber, marginTop: 2 },
  groupHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 6,
  },
  groupTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  groupAge: { ...Typography.bodyMedium, fontWeight: '700' },
  groupProgress: { ...Typography.caption, color: Colors.textSecondary },
  groupProgressTrack: { height: 3, backgroundColor: Colors.border },
  groupProgressFill: { height: 3 },
  dueBadge: {
    backgroundColor: `${Colors.amber}20`, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2,
  },
  dueBadgeText: { fontSize: 10, fontWeight: '700', color: Colors.amber },
  vaccineRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12 },
  vaccineBorder: { borderTopWidth: 1, borderTopColor: Colors.border },
  checkbox: {
    width: 22, height: 22, borderRadius: 6, borderWidth: 2,
    borderColor: Colors.coral, alignItems: 'center', justifyContent: 'center',
  },
  checkboxDone: { backgroundColor: Colors.coral, borderColor: Colors.coral },
  checkmark: { color: '#fff', fontSize: 13, fontWeight: '700' },
  vaccineName: { ...Typography.bodyMedium },
  vaccineNameDone: { color: Colors.textSecondary, textDecorationLine: 'line-through' },
  vaccineDose: { ...Typography.caption, marginTop: 1 },
  overdueBadge: {
    backgroundColor: `${Colors.coral}18`, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2,
  },
  overdueBadgeText: { fontSize: 10, fontWeight: '700', color: Colors.coral },
  upcomingBadge: {
    backgroundColor: `${Colors.amber}18`, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2,
  },
  upcomingBadgeText: { fontSize: 10, fontWeight: '700', color: Colors.amber },
});

// ─── Symptoms Tab ─────────────────────────────────────────────────────────────

function SymptomsTab({ profile }: { profile: ChildProfile }) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [feverInput, setFeverInput] = useState('');
  const [notes, setNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult[] | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const addSymptomLog  = useHealthStore((s) => s.addSymptomLog);
  const resolveLog     = useHealthStore((s) => s.resolveSymptomLog);
  const getSymptomLogs = useHealthStore((s) => s.getSymptomLogs);
  const logs = getSymptomLogs(profile.id);

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
    setDiagnosis(null); // Reset on change
  };

  const handleAnalyze = () => {
    const results = runDiagnosis(selectedSymptoms);
    setDiagnosis(results.length > 0 ? results : []);
  };

  const handleSaveLog = () => {
    if (selectedSymptoms.length === 0) {
      Alert.alert('Sin síntomas', 'Selecciona al menos un síntoma.'); return;
    }
    const fever = feverInput ? parseFloat(feverInput.replace(',', '.')) : undefined;
    addSymptomLog(profile.id, {
      id: generateId(),
      date: new Date().toISOString().slice(0, 10),
      symptoms: selectedSymptoms,
      fever: fever && !isNaN(fever) && fever > 35 && fever < 43 ? fever : undefined,
      notes: notes.trim() || undefined,
      resolved: false,
    });
    setSelectedSymptoms([]);
    setFeverInput('');
    setNotes('');
    setDiagnosis(null);
    setFormOpen(false);
  };

  const URGENCY_COLOR = { routine: Colors.mint, soon: Colors.amber, urgent: Colors.coral };
  const URGENCY_LABEL = { routine: 'Consulta rutinaria', soon: 'Consultar pronto', urgent: '🚨 Urgente' };

  const symptomLabel = (id: string) =>
    SYMPTOM_OPTIONS.find((s) => s.id === id)?.label ?? id;

  return (
    <View style={{ gap: 12 }}>
      {/* Add symptom button */}
      {!formOpen && (
        <TouchableOpacity style={sympStyles.openFormBtn} onPress={() => setFormOpen(true)}>
          <Text style={sympStyles.openFormText}>+ Registrar síntomas ahora</Text>
        </TouchableOpacity>
      )}

      {/* Form */}
      {formOpen && (
        <Card padding={16}>
          <View style={sympStyles.formHeaderRow}>
            <Text style={sympStyles.cardLabel}>SÍNTOMAS ACTUALES</Text>
            <TouchableOpacity onPress={() => { setFormOpen(false); setSelectedSymptoms([]); setDiagnosis(null); }}>
              <Text style={sympStyles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Symptom grid */}
          <View style={sympStyles.symptomGrid}>
            {SYMPTOM_OPTIONS.map((opt) => {
              const active = selectedSymptoms.includes(opt.id);
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[sympStyles.symptomChip, active && sympStyles.symptomChipActive]}
                  onPress={() => toggleSymptom(opt.id)}
                >
                  <Text style={sympStyles.symptomEmoji}>{opt.emoji}</Text>
                  <Text style={[sympStyles.symptomChipText, active && sympStyles.symptomChipTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Fever input */}
          {selectedSymptoms.includes('fever') && (
            <View style={sympStyles.feverRow}>
              <Text style={sympStyles.feverLabel}>🌡️ Temperatura:</Text>
              <TextInput
                style={sympStyles.feverInput}
                placeholder="38.0"
                keyboardType="decimal-pad"
                value={feverInput}
                onChangeText={setFeverInput}
              />
              <Text style={sympStyles.feverUnit}>°C</Text>
            </View>
          )}

          {/* Notes */}
          <TextInput
            style={sympStyles.notesInput}
            placeholder="Observaciones (opcional)"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={2}
          />

          {/* Actions */}
          <View style={sympStyles.formActions}>
            <TouchableOpacity
              style={[sympStyles.analyzeBtn, selectedSymptoms.length === 0 && sympStyles.btnDisabled]}
              onPress={handleAnalyze}
              disabled={selectedSymptoms.length === 0}
            >
              <Text style={sympStyles.analyzeBtnText}>🔍 Orientación</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[sympStyles.saveBtn, selectedSymptoms.length === 0 && sympStyles.btnDisabled]}
              onPress={handleSaveLog}
              disabled={selectedSymptoms.length === 0}
            >
              <Text style={sympStyles.saveBtnText}>Guardar registro</Text>
            </TouchableOpacity>
          </View>
        </Card>
      )}

      {/* Pre-diagnosis results */}
      {diagnosis !== null && (
        <Card padding={16}>
          {/* DISCLAIMER */}
          <View style={sympStyles.disclaimer}>
            <Text style={sympStyles.disclaimerIcon}>⚕️</Text>
            <Text style={sympStyles.disclaimerText}>
              Esta orientación es <Text style={{ fontWeight: '700' }}>meramente informativa</Text>,
              no vinculante y <Text style={{ fontWeight: '700' }}>no sustituye la consulta pediátrica</Text>.
              Ante cualquier duda, consulta siempre a tu pediatra.
            </Text>
          </View>

          {diagnosis.length === 0 ? (
            <Text style={sympStyles.noResults}>
              No se encontró orientación específica para esta combinación de síntomas.
              Consulta a tu pediatra si persisten.
            </Text>
          ) : (
            <>
              <Text style={sympStyles.diagLabel}>POSIBLES CAUSAS ORIENTATIVAS</Text>
              <View style={{ gap: 10, marginTop: 8 }}>
                {diagnosis.map((d, i) => (
                  <View key={i} style={[sympStyles.diagCard, { borderColor: `${URGENCY_COLOR[d.urgency]}35` }]}>
                    <View style={sympStyles.diagHeader}>
                      <Text style={[sympStyles.diagCondition, { color: URGENCY_COLOR[d.urgency] }]}>
                        {d.condition}
                      </Text>
                      <View style={[sympStyles.urgencyBadge, { backgroundColor: `${URGENCY_COLOR[d.urgency]}18` }]}>
                        <Text style={[sympStyles.urgencyText, { color: URGENCY_COLOR[d.urgency] }]}>
                          {URGENCY_LABEL[d.urgency]}
                        </Text>
                      </View>
                    </View>
                    <Text style={sympStyles.diagDesc}>{d.description}</Text>
                    <Text style={sympStyles.diagAdvice}>{d.advice}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </Card>
      )}

      {/* Log history */}
      {logs.length > 0 && (
        <Card padding={0} style={{ overflow: 'hidden' }}>
          <View style={sympStyles.listHeader}>
            <Text style={sympStyles.cardLabel}>HISTORIAL DE SÍNTOMAS</Text>
          </View>
          {logs.map((log, i) => (
            <View key={log.id} style={[sympStyles.logRow, i > 0 && sympStyles.logBorder]}>
              <View style={sympStyles.logDate}>
                <Text style={sympStyles.logDateText}>
                  {format(parseISO(log.date), "d MMM", { locale: es })}
                </Text>
                <Text style={sympStyles.logDateYear}>
                  {format(parseISO(log.date), "yyyy")}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={sympStyles.logSymptoms}>
                  {log.symptoms.map(symptomLabel).join(' · ')}
                </Text>
                {log.fever && (
                  <Text style={sympStyles.logFever}>🌡️ {log.fever}°C</Text>
                )}
                {log.notes && (
                  <Text style={sympStyles.logNotes}>{log.notes}</Text>
                )}
              </View>
              <View style={sympStyles.logStatus}>
                {log.resolved ? (
                  <Text style={sympStyles.logResolved}>✓ Resuelto</Text>
                ) : (
                  <TouchableOpacity
                    style={sympStyles.resolveBtn}
                    onPress={() => resolveLog(profile.id, log.id)}
                  >
                    <Text style={sympStyles.resolveBtnText}>Resolver</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </Card>
      )}

      {logs.length === 0 && !formOpen && (
        <Card padding={20}>
          <Text style={sympStyles.emptyText}>
            Sin registros de síntomas. Pulsa el botón de arriba para añadir el primer registro.
          </Text>
        </Card>
      )}
    </View>
  );
}

const sympStyles = StyleSheet.create({
  cardLabel: { ...Typography.labelUppercase },
  openFormBtn: {
    backgroundColor: Colors.coral, borderRadius: 14, paddingVertical: 14,
    alignItems: 'center',
  },
  openFormText: { ...Typography.bodyMedium, color: '#fff', fontWeight: '700' },
  formHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  closeBtn: { fontSize: 18, color: Colors.textSecondary, padding: 4 },
  symptomGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  symptomChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.background, borderRadius: 20, borderWidth: 1,
    borderColor: Colors.border, paddingHorizontal: 10, paddingVertical: 7,
  },
  symptomChipActive: { backgroundColor: `${Colors.coral}14`, borderColor: Colors.coral },
  symptomEmoji: { fontSize: 14 },
  symptomChipText: { ...Typography.caption, color: Colors.textSecondary },
  symptomChipTextActive: { color: Colors.coral, fontWeight: '600' },
  feverRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  feverLabel: { ...Typography.bodyMedium, flex: 1 },
  feverInput: {
    width: 72, borderWidth: 1.5, borderColor: Colors.coral, borderRadius: 8,
    padding: 8, fontSize: 18, fontWeight: '700', textAlign: 'center', color: Colors.textPrimary,
  },
  feverUnit: { ...Typography.bodyMedium, color: Colors.textSecondary },
  notesInput: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: 10,
    padding: 10, ...Typography.bodyRegular, marginBottom: 12, minHeight: 60,
  },
  formActions: { flexDirection: 'row', gap: 10 },
  analyzeBtn: {
    flex: 1, borderRadius: 10, paddingVertical: 12, alignItems: 'center',
    backgroundColor: `${Colors.lavender}14`, borderWidth: 1, borderColor: `${Colors.lavender}35`,
  },
  analyzeBtnText: { ...Typography.bodyMedium, color: Colors.lavender, fontWeight: '700' },
  saveBtn: {
    flex: 1, borderRadius: 10, paddingVertical: 12, alignItems: 'center',
    backgroundColor: Colors.coral,
  },
  saveBtnText: { ...Typography.bodyMedium, color: '#fff', fontWeight: '700' },
  btnDisabled: { opacity: 0.4 },
  disclaimer: {
    flexDirection: 'row', gap: 10, backgroundColor: `${Colors.amber}10`,
    borderRadius: 10, padding: 12, marginBottom: 14,
    borderWidth: 1, borderColor: `${Colors.amber}25`,
  },
  disclaimerIcon: { fontSize: 18 },
  disclaimerText: { ...Typography.caption, flex: 1, lineHeight: 18 },
  noResults: { ...Typography.bodyRegular, textAlign: 'center', paddingVertical: 8, lineHeight: 22 },
  diagLabel: { ...Typography.labelUppercase },
  diagCard: {
    borderRadius: 10, borderWidth: 1, padding: 12, gap: 6,
  },
  diagHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 },
  diagCondition: { ...Typography.bodyMedium, fontWeight: '700', flex: 1 },
  urgencyBadge: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 },
  urgencyText: { fontSize: 10, fontWeight: '700' },
  diagDesc: { ...Typography.bodyRegular, lineHeight: 20 },
  diagAdvice: { ...Typography.caption, fontStyle: 'italic', lineHeight: 17 },
  listHeader: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 6 },
  logRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingHorizontal: 16, paddingVertical: 12 },
  logBorder: { borderTopWidth: 1, borderTopColor: Colors.border },
  logDate: {
    width: 40, alignItems: 'center',
    backgroundColor: `${Colors.coral}10`, borderRadius: 10, paddingVertical: 6,
  },
  logDateText: { fontSize: 12, fontWeight: '700', color: Colors.coral },
  logDateYear: { fontSize: 9, color: Colors.textSecondary },
  logSymptoms: { ...Typography.bodyMedium },
  logFever: { ...Typography.caption, color: Colors.coral, marginTop: 2 },
  logNotes: { ...Typography.caption, marginTop: 2, fontStyle: 'italic' },
  logStatus: { alignItems: 'flex-end', justifyContent: 'center' },
  logResolved: { ...Typography.caption, color: Colors.mint, fontWeight: '600' },
  resolveBtn: {
    backgroundColor: `${Colors.coral}14`, borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  resolveBtnText: { ...Typography.caption, color: Colors.coral, fontWeight: '600' },
  emptyText: { ...Typography.bodyRegular, textAlign: 'center', lineHeight: 22 },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

const NAV_SECTIONS = [
  { key: 'growth',   label: 'Crecimiento', emoji: '📈' },
  { key: 'vaccines', label: 'Vacunas',     emoji: '💉' },
  { key: 'symptoms', label: 'Síntomas',    emoji: '🩺' },
] as const;

type Section = typeof NAV_SECTIONS[number]['key'];

export default function HealthScreen() {
  const activeProfile  = useProfileStore((s) => s.activeProfile());
  const [section, setSection] = useState<Section>('growth');
  const seedIfEmpty = useHealthStore((s) => s.seedIfEmpty);

  useEffect(() => {
    if (!activeProfile || activeProfile.type !== 'child') return;
    const mock = activeProfile.id === 'profile-sofia' ? 'sofia'
               : activeProfile.id === 'profile-lucas' ? 'lucas'
               : null;
    if (mock) seedIfEmpty(activeProfile.id, mock);
  }, [activeProfile?.id]);

  if (!activeProfile || activeProfile.type !== 'child') return null;

  const profile   = activeProfile as ChildProfile;
  const ageMonths = ageMonthsFromBirth(profile.birthDate);
  const ageText   = formatAge(profile.birthDate);

  return (
    <SafeAreaView style={screenStyles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={screenStyles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Hero ── */}
        <View style={screenStyles.hero}>
          <View style={screenStyles.heroTop}>
            <View>
              <Text style={screenStyles.heroTitle}>Salud</Text>
              <Text style={screenStyles.heroName}>{profile.name}</Text>
            </View>
            <View style={screenStyles.heroStats}>
              <View style={screenStyles.heroStat}>
                <Text style={screenStyles.heroStatVal}>{ageText}</Text>
                <Text style={screenStyles.heroStatLabel}>edad</Text>
              </View>
              {profile.bloodType && (
                <View style={screenStyles.bloodBadge}>
                  <Text style={screenStyles.bloodText}>🩸 {profile.bloodType}</Text>
                </View>
              )}
            </View>
          </View>
          {profile.allergies.length > 0 && (
            <View style={screenStyles.allergyRow}>
              <Text style={screenStyles.allergyLabel}>⚠️ ALERGIAS: </Text>
              <Text style={screenStyles.allergyList}>{profile.allergies.join(' · ')}</Text>
            </View>
          )}
        </View>

        {/* ── Section Nav ── */}
        <View style={screenStyles.navSection}>
          <View style={screenStyles.navTabs}>
            {NAV_SECTIONS.map((s) => (
              <TouchableOpacity
                key={s.key}
                style={[screenStyles.navTab, section === s.key && screenStyles.navTabActive]}
                onPress={() => setSection(s.key)}
              >
                <Text style={screenStyles.navTabEmoji}>{s.emoji}</Text>
                <Text style={[screenStyles.navTabLabel, section === s.key && screenStyles.navTabLabelActive]}>
                  {s.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Sections ── */}
        <View style={screenStyles.content}>
          {section === 'growth'   && <GrowthTab   profile={profile} ageMonths={ageMonths} />}
          {section === 'vaccines' && <VaccinesTab profile={profile} ageMonths={ageMonths} />}
          {section === 'symptoms' && <SymptomsTab profile={profile} />}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const screenStyles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 32 },

  hero: {
    backgroundColor: Colors.gradients.health[0],
    paddingTop: 28, paddingBottom: 28, paddingHorizontal: 20,
    borderBottomLeftRadius: 32, borderBottomRightRadius: 32,
    marginBottom: 16,
  },
  heroTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  heroTitle: { fontSize: 34, fontWeight: '900', color: '#fff', letterSpacing: -1 },
  heroName: { ...Typography.headingBold, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  heroStats: { alignItems: 'flex-end', gap: 8 },
  heroStat: { alignItems: 'flex-end' },
  heroStatVal: { fontSize: 18, fontWeight: '800', color: '#fff' },
  heroStatLabel: { fontSize: 10, color: 'rgba(255,255,255,0.75)' },
  bloodBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  bloodText: { ...Typography.caption, color: '#fff', fontWeight: '700' },
  allergyRow: {
    flexDirection: 'row', alignItems: 'center', marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: 8,
  },
  allergyLabel: { fontSize: 10, fontWeight: '700', color: '#fff' },
  allergyList: { ...Typography.caption, color: 'rgba(255,255,255,0.9)', flex: 1 },

  navSection: { paddingHorizontal: 16, marginBottom: 12 },
  navTabs: {
    flexDirection: 'row', backgroundColor: Colors.surface,
    borderRadius: 16, padding: 4, gap: 4,
    shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 8, elevation: 3,
  },
  navTab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 5, paddingVertical: 10, borderRadius: 12,
  },
  navTabActive: { backgroundColor: Colors.coral },
  navTabEmoji: { fontSize: 15 },
  navTabLabel: { ...Typography.caption, fontWeight: '600', color: Colors.textSecondary },
  navTabLabelActive: { color: '#fff' },

  content: { paddingHorizontal: 16, gap: 12 },
});
