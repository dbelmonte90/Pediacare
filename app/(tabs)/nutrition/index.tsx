import React, { useState, useEffect } from 'react';
import {
  ScrollView, View, Text, StyleSheet, TouchableOpacity,
  TextInput, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Colors } from '@/shared/theme/colors';
import { Typography } from '@/shared/theme/typography';
import { Card } from '@/shared/ui/Card';
import { useProfileStore } from '@/store/profileStore';
import { useNutritionStore } from '@/store/nutritionStore';
import { FOOD_CHECKLIST, MEAL_TYPE_LABELS } from '@/shared/constants/nutritionData';
import type { ChildProfile } from '@/entities/profile/model/types';
import type { FoodStatus, MealType, DiaryEntry } from '@/entities/nutrition/model/types';

// ─── Constants ────────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<FoodStatus, { label: string; color: string; icon: string }> = {
  not_started: { label: 'Sin iniciar',       color: Colors.textSecondary, icon: '⬜' },
  introduced:  { label: 'Introducido',        color: Colors.skyBlue,       icon: '🔵' },
  tolerated:   { label: 'Tolerado ✓',        color: Colors.mint,          icon: '✅' },
  reaction:    { label: 'Reacción',          color: Colors.rose,          icon: '🚫' },
};

const FOOD_AGE_GROUPS = ['4-6 meses', '6-8 meses', '8-10 meses', '10-12 meses', '12+ meses'];

const MEAL_TYPE_OPTIONS: MealType[] = ['desayuno', 'almuerzo', 'merienda', 'cena', 'otro'];

function generateId() {
  return `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Allergies Card ─────────────────────────────────────────────────────────────────

function AllergiesCard({ profile }: { profile: ChildProfile }) {
  const [addingAllergy, setAddingAllergy] = useState(false);
  const [allergyInput, setAllergyInput] = useState('');
  const updateProfile = useProfileStore((s) => s.updateProfile);

  const addAllergy = () => {
    const trimmed = allergyInput.trim();
    if (!trimmed) return;
    if (profile.allergies.map((a) => a.toLowerCase()).includes(trimmed.toLowerCase())) {
      Alert.alert('Alergia duplicada', 'Esta alergia ya está registrada.');
      return;
    }
    updateProfile(profile.id, { allergies: [...profile.allergies, trimmed] });
    setAllergyInput('');
    setAddingAllergy(false);
  };

  const removeAllergy = (allergy: string) => {
    Alert.alert('Eliminar alergia', `¿Eliminar "${allergy}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive',
        onPress: () =>
          updateProfile(profile.id, {
            allergies: profile.allergies.filter((a) => a !== allergy),
          }),
      },
    ]);
  };

  return (
    <Card padding={16}>
      <View style={allergyStyles.headerRow}>
        <Text style={allergyStyles.cardLabel}>ALERGIAS E INTOLERANCIAS</Text>
        {!addingAllergy && (
          <TouchableOpacity style={allergyStyles.addBtn} onPress={() => setAddingAllergy(true)}>
            <Text style={allergyStyles.addBtnText}>+ Añadir</Text>
          </TouchableOpacity>
        )}
      </View>

      {profile.allergies.length === 0 && !addingAllergy && (
        <Text style={allergyStyles.emptyText}>Sin alergias registradas</Text>
      )}

      {profile.allergies.length > 0 && (
        <View style={allergyStyles.chipRow}>
          {profile.allergies.map((allergy) => (
            <TouchableOpacity
              key={allergy}
              style={allergyStyles.chip}
              onLongPress={() => removeAllergy(allergy)}
            >
              <Text style={allergyStyles.chipIcon}>⚠️</Text>
              <Text style={allergyStyles.chipText}>{allergy}</Text>
              <TouchableOpacity
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                onPress={() => removeAllergy(allergy)}
              >
                <Text style={allergyStyles.chipRemove}>✕</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {addingAllergy && (
        <View style={allergyStyles.inputRow}>
          <TextInput
            style={allergyStyles.input}
            placeholder="Ej: Huevo, Gluten, Látex…"
            value={allergyInput}
            onChangeText={setAllergyInput}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={addAllergy}
          />
          <TouchableOpacity
            style={[allergyStyles.confirmBtn, !allergyInput.trim() && allergyStyles.confirmBtnDisabled]}
            onPress={addAllergy}
            disabled={!allergyInput.trim()}
          >
            <Text style={allergyStyles.confirmBtnText}>Añadir</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={allergyStyles.cancelBtn}
            onPress={() => { setAddingAllergy(false); setAllergyInput(''); }}
          >
            <Text style={allergyStyles.cancelBtnText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {profile.allergies.length > 0 && (
        <Text style={allergyStyles.hint}>Mantén pulsado para eliminar</Text>
      )}
    </Card>
  );
}

const allergyStyles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  cardLabel: { ...Typography.labelUppercase },
  addBtn: {
    backgroundColor: `${Colors.mint}15`, borderRadius: 20, borderWidth: 1,
    borderColor: `${Colors.mint}35`, paddingHorizontal: 12, paddingVertical: 5,
  },
  addBtnText: { ...Typography.caption, color: Colors.mint, fontWeight: '600' },
  emptyText: { ...Typography.bodyRegular, color: Colors.textSecondary, fontStyle: 'italic' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: `${Colors.rose}12`, borderRadius: 20, borderWidth: 1,
    borderColor: `${Colors.rose}30`, paddingHorizontal: 12, paddingVertical: 7,
  },
  chipIcon: { fontSize: 13 },
  chipText: { ...Typography.bodyMedium, color: Colors.rose, fontWeight: '700' },
  chipRemove: { fontSize: 12, color: Colors.rose, fontWeight: '700', marginLeft: 2 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  input: {
    flex: 1, borderWidth: 1.5, borderColor: Colors.mint, borderRadius: 10,
    padding: 10, ...Typography.bodyRegular, color: Colors.textPrimary,
  },
  confirmBtn: {
    backgroundColor: Colors.mint, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 10,
  },
  confirmBtnDisabled: { opacity: 0.4 },
  confirmBtnText: { ...Typography.caption, color: '#fff', fontWeight: '700' },
  cancelBtn: {
    backgroundColor: Colors.border, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10,
  },
  cancelBtnText: { ...Typography.caption, color: Colors.textSecondary, fontWeight: '700' },
  hint: { ...Typography.caption, color: Colors.textSecondary, fontStyle: 'italic', marginTop: 4 },
});

// ─── Food Row ──────────────────────────────────────────────────────────────────────

function FoodRow({
  food,
  status,
  onChangeStatus,
}: {
  food: (typeof FOOD_CHECKLIST)[number];
  status: FoodStatus;
  onChangeStatus: (s: FoodStatus) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[status];
  const STATUS_ORDER: FoodStatus[] = ['not_started', 'introduced', 'tolerated', 'reaction'];

  return (
    <View>
      <TouchableOpacity
        style={foodStyles.row}
        onPress={() => setExpanded((v) => !v)}
        activeOpacity={0.7}
      >
        <Text style={foodStyles.emoji}>{food.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={foodStyles.name}>{food.name}</Text>
          {food.allergenRisk && (
            <Text style={foodStyles.allergen}>⚠️ Alérgeno potencial</Text>
          )}
        </View>
        <View style={[foodStyles.badge, { backgroundColor: `${cfg.color}15` }]}>
          <Text style={[foodStyles.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
        </View>
        <Text style={foodStyles.chevron}>{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={foodStyles.statusPicker}>
          {STATUS_ORDER.map((s) => {
            const c = STATUS_CONFIG[s];
            const active = status === s;
            return (
              <TouchableOpacity
                key={s}
                style={[
                  foodStyles.statusOption,
                  active && { backgroundColor: `${c.color}18`, borderColor: `${c.color}50` },
                ]}
                onPress={() => { onChangeStatus(s); setExpanded(false); }}
              >
                <Text style={foodStyles.statusOptionIcon}>{c.icon}</Text>
                <Text style={[foodStyles.statusOptionText, active && { color: c.color, fontWeight: '700' }]}>
                  {c.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

const foodStyles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 10, paddingHorizontal: 2,
  },
  emoji: { fontSize: 22, width: 32, textAlign: 'center' },
  name: { ...Typography.bodyMedium },
  allergen: { fontSize: 10, color: Colors.amber, marginTop: 1 },
  badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { ...Typography.caption, fontWeight: '600' },
  chevron: { fontSize: 10, color: Colors.textSecondary, marginLeft: 4 },
  statusPicker: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 6,
    paddingHorizontal: 6, paddingVertical: 8,
    backgroundColor: Colors.background, borderRadius: 10, marginBottom: 4,
  },
  statusOption: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderRadius: 8, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 10, paddingVertical: 6,
    backgroundColor: Colors.surface,
  },
  statusOptionIcon: { fontSize: 14 },
  statusOptionText: { ...Typography.caption, color: Colors.textSecondary },
});

// ─── Alimentos Tab ──────────────────────────────────────────────────────────────

function AlimentosTab({ profile }: { profile: ChildProfile }) {
  const setFoodStatus    = useNutritionStore((s) => s.setFoodStatus);
  const getFoodIntros    = useNutritionStore((s) => s.getFoodIntroductions);
  const introductions    = getFoodIntros(profile.id);

  const foodsByGroup = FOOD_AGE_GROUPS.reduce<Record<string, typeof FOOD_CHECKLIST>>(
    (acc, group) => {
      acc[group] = FOOD_CHECKLIST.filter((f) => f.ageGroup === group);
      return acc;
    }, {}
  );

  const totalTolerated = FOOD_CHECKLIST.filter(
    (f) => introductions[f.id]?.status === 'tolerated'
  ).length;
  const totalReactions = FOOD_CHECKLIST.filter(
    (f) => introductions[f.id]?.status === 'reaction'
  ).length;

  return (
    <View style={{ gap: 12 }}>
      <AllergiesCard profile={profile} />

      {/* Summary stats */}
      <Card padding={16}>
        <Text style={alimStyles.cardLabel}>PROGRESO DE INTRODUCCIÓN</Text>
        <View style={alimStyles.statsRow}>
          <View style={alimStyles.stat}>
            <Text style={alimStyles.statNum}>{totalTolerated}</Text>
            <Text style={alimStyles.statLabel}>tolerados</Text>
          </View>
          <View style={alimStyles.statDiv} />
          <View style={alimStyles.stat}>
            <Text style={[alimStyles.statNum, { color: Colors.skyBlue }]}>
              {FOOD_CHECKLIST.filter((f) => introductions[f.id]?.status === 'introduced').length}
            </Text>
            <Text style={alimStyles.statLabel}>introducidos</Text>
          </View>
          <View style={alimStyles.statDiv} />
          <View style={alimStyles.stat}>
            <Text style={[alimStyles.statNum, { color: Colors.rose }]}>{totalReactions}</Text>
            <Text style={alimStyles.statLabel}>reacciones</Text>
          </View>
          <View style={alimStyles.statDiv} />
          <View style={alimStyles.stat}>
            <Text style={alimStyles.statNum}>
              {FOOD_CHECKLIST.filter((f) => !introductions[f.id] || introductions[f.id].status === 'not_started').length}
            </Text>
            <Text style={alimStyles.statLabel}>pendientes</Text>
          </View>
        </View>
        <View style={alimStyles.progressTrack}>
          <View style={[alimStyles.progressFill, {
            width: `${(totalTolerated / FOOD_CHECKLIST.length) * 100}%`,
          }]} />
        </View>
        <Text style={alimStyles.progressCaption}>
          {totalTolerated} / {FOOD_CHECKLIST.length} alimentos tolerados
        </Text>
      </Card>

      {/* Grouped food lists */}
      {FOOD_AGE_GROUPS.map((group) => {
        const foods = foodsByGroup[group];
        const doneCnt = foods.filter(
          (f) => introductions[f.id]?.status === 'tolerated'
        ).length;
        return (
          <Card key={group} padding={0} style={{ overflow: 'hidden' }}>
            <View style={alimStyles.groupHeader}>
              <Text style={alimStyles.groupTitle}>{group}</Text>
              <Text style={alimStyles.groupCount}>
                {doneCnt}/{foods.length} tolerados
              </Text>
            </View>
            <View style={alimStyles.groupProgressTrack}>
              <View style={[alimStyles.groupProgressFill, {
                width: `${foods.length ? (doneCnt / foods.length) * 100 : 0}%`,
                backgroundColor: doneCnt === foods.length ? Colors.mint : `${Colors.mint}80`,
              }]} />
            </View>
            <View style={{ paddingHorizontal: 14, paddingBottom: 4 }}>
              {foods.map((food, i) => (
                <View key={food.id}>
                  {i > 0 && <View style={alimStyles.separator} />}
                  <FoodRow
                    food={food}
                    status={introductions[food.id]?.status ?? 'not_started'}
                    onChangeStatus={(s) => setFoodStatus(profile.id, food.id, s)}
                  />
                </View>
              ))}
            </View>
          </Card>
        );
      })}
    </View>
  );
}

const alimStyles = StyleSheet.create({
  cardLabel: { ...Typography.labelUppercase, marginBottom: 12 },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  stat: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 24, fontWeight: '900', color: Colors.mint, letterSpacing: -0.5 },
  statLabel: { ...Typography.caption, marginTop: 1, textAlign: 'center' },
  statDiv: { width: 1, height: 32, backgroundColor: Colors.border },
  progressTrack: {
    height: 6, backgroundColor: Colors.border, borderRadius: 3, overflow: 'hidden',
  },
  progressFill: { height: 6, backgroundColor: Colors.mint, borderRadius: 3 },
  progressCaption: { ...Typography.caption, textAlign: 'center', marginTop: 6, fontStyle: 'italic' },
  groupHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 14, paddingTop: 12, paddingBottom: 6,
  },
  groupTitle: { ...Typography.bodyMedium, fontWeight: '700' },
  groupCount: { ...Typography.caption, color: Colors.textSecondary },
  groupProgressTrack: { height: 3, backgroundColor: Colors.border },
  groupProgressFill: { height: 3 },
  separator: { height: 1, backgroundColor: Colors.border },
});

// ─── Add Diary Entry Form ───────────────────────────────────────────────────────────

function AddDiaryForm({
  profileId,
  onClose,
}: {
  profileId: string;
  onClose: () => void;
}) {
  const [mealType, setMealType]     = useState<MealType>('almuerzo');
  const [foodInput, setFoodInput]   = useState('');
  const [foods, setFoods]           = useState<string[]>([]);
  const [notes, setNotes]           = useState('');
  const [hadReaction, setHadReaction] = useState(false);
  const [reactionDesc, setReactionDesc] = useState('');
  const addEntry = useNutritionStore((s) => s.addDiaryEntry);

  const addFoodChip = () => {
    const trimmed = foodInput.trim();
    if (trimmed && !foods.includes(trimmed)) setFoods((prev) => [...prev, trimmed]);
    setFoodInput('');
  };

  const handleSave = () => {
    if (foods.length === 0) {
      Alert.alert('Sin alimentos', 'Añade al menos un alimento.'); return;
    }
    addEntry(profileId, {
      id: generateId(),
      date: new Date().toISOString().slice(0, 10),
      mealType,
      foods,
      notes: notes.trim() || undefined,
      hadReaction,
      reactionDescription: hadReaction && reactionDesc.trim() ? reactionDesc.trim() : undefined,
    });
    onClose();
  };

  return (
    <Card padding={16}>
      <View style={diaryStyles.formHeaderRow}>
        <Text style={diaryStyles.cardLabel}>NUEVA ENTRADA</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={diaryStyles.closeBtn}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Meal type */}
      <Text style={diaryStyles.fieldLabel}>MOMENTO DEL DÍA</Text>
      <View style={diaryStyles.mealTypeRow}>
        {MEAL_TYPE_OPTIONS.map((mt) => (
          <TouchableOpacity
            key={mt}
            style={[diaryStyles.mealChip, mealType === mt && diaryStyles.mealChipActive]}
            onPress={() => setMealType(mt)}
          >
            <Text style={[diaryStyles.mealChipText, mealType === mt && diaryStyles.mealChipTextActive]}>
              {MEAL_TYPE_LABELS[mt]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Food chips */}
      <Text style={[diaryStyles.fieldLabel, { marginTop: 12 }]}>ALIMENTOS</Text>
      {foods.length > 0 && (
        <View style={diaryStyles.chipRow}>
          {foods.map((f) => (
            <TouchableOpacity
              key={f} style={diaryStyles.foodChip}
              onPress={() => setFoods((prev) => prev.filter((x) => x !== f))}
            >
              <Text style={diaryStyles.foodChipText}>{f}</Text>
              <Text style={diaryStyles.foodChipRemove}>✕</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <View style={diaryStyles.foodInputRow}>
        <TextInput
          style={diaryStyles.foodInput}
          placeholder="Ej: Puré de zanahoria…"
          value={foodInput}
          onChangeText={setFoodInput}
          returnKeyType="done"
          onSubmitEditing={addFoodChip}
        />
        <TouchableOpacity
          style={[diaryStyles.addFoodBtn, !foodInput.trim() && diaryStyles.addFoodBtnDisabled]}
          onPress={addFoodChip}
          disabled={!foodInput.trim()}
        >
          <Text style={diaryStyles.addFoodBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Notes */}
      <Text style={[diaryStyles.fieldLabel, { marginTop: 12 }]}>OBSERVACIONES</Text>
      <TextInput
        style={diaryStyles.notesInput}
        placeholder="Notas opcionales…"
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={2}
      />

      {/* Reaction toggle */}
      <TouchableOpacity
        style={[diaryStyles.reactionToggle, hadReaction && diaryStyles.reactionToggleActive]}
        onPress={() => setHadReaction((v) => !v)}
      >
        <Text style={diaryStyles.reactionToggleIcon}>{hadReaction ? '🚫' : '✅'}</Text>
        <Text style={[diaryStyles.reactionToggleText, hadReaction && { color: Colors.rose }]}>
          {hadReaction ? 'Se detectó reacción' : 'Sin reacción adversa'}
        </Text>
      </TouchableOpacity>

      {hadReaction && (
        <TextInput
          style={[diaryStyles.notesInput, { borderColor: `${Colors.rose}60`, marginTop: 8 }]}
          placeholder="Describe la reacción (urticaria, vómito, etc.)…"
          value={reactionDesc}
          onChangeText={setReactionDesc}
          multiline
          numberOfLines={2}
        />
      )}

      <TouchableOpacity
        style={[diaryStyles.saveBtn, foods.length === 0 && diaryStyles.saveBtnDisabled]}
        onPress={handleSave}
        disabled={foods.length === 0}
      >
        <Text style={diaryStyles.saveBtnText}>Guardar entrada</Text>
      </TouchableOpacity>
    </Card>
  );
}

// ─── Diario Tab ───────────────────────────────────────────────────────────────

function DiarioTab({ profile }: { profile: ChildProfile }) {
  const [formOpen, setFormOpen] = useState(false);
  const getDiaryEntries  = useNutritionStore((s) => s.getDiaryEntries);
  const removeDiaryEntry = useNutritionStore((s) => s.removeDiaryEntry);
  const entries = getDiaryEntries(profile.id);

  const confirmRemove = (id: string) => {
    Alert.alert('Eliminar entrada', '¿Eliminar este registro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => removeDiaryEntry(profile.id, id) },
    ]);
  };

  const grouped = entries.reduce<Record<string, DiaryEntry[]>>((acc, e) => {
    if (!acc[e.date]) acc[e.date] = [];
    acc[e.date].push(e);
    return acc;
  }, {});

  return (
    <View style={{ gap: 12 }}>
      {!formOpen && (
        <TouchableOpacity style={diaryStyles.openFormBtn} onPress={() => setFormOpen(true)}>
          <Text style={diaryStyles.openFormText}>+ Registrar comida</Text>
        </TouchableOpacity>
      )}

      {formOpen && (
        <AddDiaryForm profileId={profile.id} onClose={() => setFormOpen(false)} />
      )}

      {entries.length === 0 && !formOpen && (
        <Card padding={20}>
          <View style={{ alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 36 }}>🍽️</Text>
            <Text style={diaryStyles.emptyText}>
              Sin entradas en el diario. Pulsa el botón para añadir la primera comida.
            </Text>
          </View>
        </Card>
      )}

      {Object.entries(grouped).map(([date, dayEntries]) => (
        <Card key={date} padding={0} style={{ overflow: 'hidden' }}>
          <View style={diaryStyles.dateHeader}>
            <Text style={diaryStyles.dateLabel}>
              {format(parseISO(date), "EEEE, d 'de' MMMM", { locale: es })}
            </Text>
            <Text style={diaryStyles.dateYear}>{format(parseISO(date), 'yyyy')}</Text>
          </View>
          {dayEntries.map((entry, i) => (
            <TouchableOpacity
              key={entry.id}
              style={[diaryStyles.entryRow, i > 0 && diaryStyles.entryBorder]}
              onLongPress={() => confirmRemove(entry.id)}
              activeOpacity={0.75}
            >
              <View style={diaryStyles.entryLeft}>
                <Text style={diaryStyles.entryMealType}>
                  {MEAL_TYPE_LABELS[entry.mealType]}
                </Text>
                <Text style={diaryStyles.entryFoods}>
                  {entry.foods.join(' · ')}
                </Text>
                {entry.notes ? (
                  <Text style={diaryStyles.entryNotes}>{entry.notes}</Text>
                ) : null}
              </View>
              <View style={diaryStyles.entryRight}>
                {entry.hadReaction ? (
                  <View style={diaryStyles.reactionBadge}>
                    <Text style={diaryStyles.reactionBadgeText}>🚫 Reacción</Text>
                  </View>
                ) : (
                  <View style={diaryStyles.okBadge}>
                    <Text style={diaryStyles.okBadgeText}>✓ OK</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </Card>
      ))}

      {entries.length > 0 && (
        <Text style={diaryStyles.hint}>Mantén pulsado para eliminar</Text>
      )}
    </View>
  );
}

const diaryStyles = StyleSheet.create({
  openFormBtn: {
    backgroundColor: Colors.mint, borderRadius: 14, paddingVertical: 14, alignItems: 'center',
  },
  openFormText: { ...Typography.bodyMedium, color: '#fff', fontWeight: '700' },
  formHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  cardLabel: { ...Typography.labelUppercase },
  closeBtn: { fontSize: 18, color: Colors.textSecondary, padding: 4 },
  fieldLabel: { ...Typography.labelUppercase, marginBottom: 6 },
  mealTypeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  mealChip: {
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10,
    backgroundColor: Colors.border, borderWidth: 1, borderColor: 'transparent',
  },
  mealChipActive: { backgroundColor: `${Colors.mint}15`, borderColor: Colors.mint },
  mealChipText: { ...Typography.caption, color: Colors.textSecondary },
  mealChipTextActive: { color: Colors.mint, fontWeight: '700' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  foodChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: `${Colors.mint}12`, borderRadius: 16, borderWidth: 1,
    borderColor: `${Colors.mint}30`, paddingHorizontal: 10, paddingVertical: 5,
  },
  foodChipText: { ...Typography.caption, color: Colors.mint, fontWeight: '600' },
  foodChipRemove: { fontSize: 10, color: Colors.mint, fontWeight: '700' },
  foodInputRow: { flexDirection: 'row', gap: 8 },
  foodInput: {
    flex: 1, borderWidth: 1.5, borderColor: Colors.mint, borderRadius: 10,
    padding: 10, ...Typography.bodyRegular, color: Colors.textPrimary,
  },
  addFoodBtn: {
    width: 42, height: 42, borderRadius: 10, backgroundColor: Colors.mint,
    alignItems: 'center', justifyContent: 'center',
  },
  addFoodBtnDisabled: { opacity: 0.4 },
  addFoodBtnText: { fontSize: 22, color: '#fff', fontWeight: '700', lineHeight: 24 },
  notesInput: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: 10,
    padding: 10, ...Typography.bodyRegular, minHeight: 56,
  },
  reactionToggle: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10,
    backgroundColor: `${Colors.mint}12`, borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: `${Colors.mint}25`,
  },
  reactionToggleActive: {
    backgroundColor: `${Colors.rose}10`, borderColor: `${Colors.rose}30`,
  },
  reactionToggleIcon: { fontSize: 18 },
  reactionToggleText: { ...Typography.bodyMedium, color: Colors.mint, fontWeight: '600' },
  saveBtn: {
    backgroundColor: Colors.mint, borderRadius: 12, paddingVertical: 14,
    alignItems: 'center', marginTop: 12,
  },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: { ...Typography.bodyMedium, color: '#fff', fontWeight: '700' },
  dateHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8,
    backgroundColor: `${Colors.mint}08`,
  },
  dateLabel: { ...Typography.bodyMedium, fontWeight: '700', textTransform: 'capitalize' },
  dateYear: { ...Typography.caption },
  entryRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingHorizontal: 16, paddingVertical: 12 },
  entryBorder: { borderTopWidth: 1, borderTopColor: Colors.border },
  entryLeft: { flex: 1, gap: 2 },
  entryMealType: { ...Typography.caption, color: Colors.mint, fontWeight: '700' },
  entryFoods: { ...Typography.bodyMedium },
  entryNotes: { ...Typography.caption, fontStyle: 'italic', marginTop: 2 },
  entryRight: { alignItems: 'flex-end', justifyContent: 'center', paddingTop: 2 },
  reactionBadge: {
    backgroundColor: `${Colors.rose}12`, borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3,
  },
  reactionBadgeText: { fontSize: 10, fontWeight: '700', color: Colors.rose },
  okBadge: {
    backgroundColor: `${Colors.mint}12`, borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3,
  },
  okBadgeText: { fontSize: 10, fontWeight: '700', color: Colors.mint },
  emptyText: { ...Typography.bodyRegular, textAlign: 'center', lineHeight: 22 },
  hint: { ...Typography.caption, textAlign: 'center', color: Colors.textSecondary, fontStyle: 'italic' },
});

// ─── Reacciones Tab ─────────────────────────────────────────────────────────────

function ReaccionesTab({ profile }: { profile: ChildProfile }) {
  const getFoodIntros   = useNutritionStore((s) => s.getFoodIntroductions);
  const getDiaryEntries = useNutritionStore((s) => s.getDiaryEntries);

  const introductions = getFoodIntros(profile.id);
  const entries       = getDiaryEntries(profile.id);

  const foodReactions = FOOD_CHECKLIST.filter(
    (f) => introductions[f.id]?.status === 'reaction'
  );

  const diaryReactions = entries.filter((e) => e.hadReaction);

  const totalReactions = foodReactions.length + diaryReactions.length;

  return (
    <View style={{ gap: 12 }}>
      {/* Disclaimer */}
      <View style={reacStyles.disclaimer}>
        <Text style={reacStyles.disclaimerIcon}>⚕️</Text>
        <Text style={reacStyles.disclaimerText}>
          Este historial es <Text style={{ fontWeight: '700' }}>meramente informativo</Text> y no sustituye
          la evaluación por un{' '}
          <Text style={{ fontWeight: '700' }}>aler gólogo o pediatra</Text>.
          Ante cualquier reacción grave, acude a urgencias inmediatamente.
        </Text>
      </View>

      {/* Allergy badge summary */}
      {profile.allergies.length > 0 && (
        <Card padding={14}>
          <Text style={reacStyles.cardLabel}>ALERGIAS CONOCIDAS</Text>
          <View style={reacStyles.allergyRow}>
            {profile.allergies.map((a) => (
              <View key={a} style={reacStyles.allergyChip}>
                <Text style={reacStyles.allergyChipText}>⚠️ {a}</Text>
              </View>
            ))}
          </View>
        </Card>
      )}

      {totalReactions === 0 && (
        <Card padding={20}>
          <View style={{ alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 36 }}>✅</Text>
            <Text style={reacStyles.emptyText}>
              Sin reacciones registradas. ¡Excelente!
            </Text>
          </View>
        </Card>
      )}

      {/* Food checklist reactions */}
      {foodReactions.length > 0 && (
        <Card padding={0} style={{ overflow: 'hidden' }}>
          <View style={reacStyles.sectionHeader}>
            <Text style={reacStyles.sectionTitle}>🚫 REACCIONES EN INTRODUCCIÓN</Text>
          </View>
          {foodReactions.map((food, i) => {
            const intro = introductions[food.id];
            return (
              <View key={food.id} style={[reacStyles.eventRow, i > 0 && reacStyles.eventBorder]}>
                <Text style={reacStyles.eventEmoji}>{food.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={reacStyles.eventFood}>{food.name}</Text>
                  {intro?.dateIntroduced && (
                    <Text style={reacStyles.eventDate}>
                      {format(parseISO(intro.dateIntroduced), "d MMM yyyy", { locale: es })}
                    </Text>
                  )}
                  {intro?.notes && (
                    <Text style={reacStyles.eventNotes}>{intro.notes}</Text>
                  )}
                </View>
                {food.allergenRisk && (
                  <View style={reacStyles.allergenBadge}>
                    <Text style={reacStyles.allergenBadgeText}>Alérgeno</Text>
                  </View>
                )}
              </View>
            );
          })}
        </Card>
      )}

      {/* Diary reactions */}
      {diaryReactions.length > 0 && (
        <Card padding={0} style={{ overflow: 'hidden' }}>
          <View style={reacStyles.sectionHeader}>
            <Text style={reacStyles.sectionTitle}>📔 REACCIONES EN DIARIO</Text>
          </View>
          {diaryReactions.map((entry, i) => (
            <View key={entry.id} style={[reacStyles.eventRow, i > 0 && reacStyles.eventBorder]}>
              <View style={reacStyles.eventDateBox}>
                <Text style={reacStyles.eventDateBoxText}>
                  {format(parseISO(entry.date), 'd MMM', { locale: es })}
                </Text>
                <Text style={reacStyles.eventDateBoxYear}>
                  {format(parseISO(entry.date), 'yyyy')}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={reacStyles.eventMeal}>{MEAL_TYPE_LABELS[entry.mealType]}</Text>
                <Text style={reacStyles.eventFood}>{entry.foods.join(' · ')}</Text>
                {entry.reactionDescription && (
                  <Text style={reacStyles.eventNotes}>{entry.reactionDescription}</Text>
                )}
              </View>
            </View>
          ))}
        </Card>
      )}
    </View>
  );
}

const reacStyles = StyleSheet.create({
  disclaimer: {
    flexDirection: 'row', gap: 10, backgroundColor: `${Colors.amber}10`,
    borderRadius: 12, padding: 12, borderWidth: 1, borderColor: `${Colors.amber}25`,
  },
  disclaimerIcon: { fontSize: 18 },
  disclaimerText: { ...Typography.caption, flex: 1, lineHeight: 18 },
  cardLabel: { ...Typography.labelUppercase, marginBottom: 8 },
  allergyRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  allergyChip: {
    backgroundColor: `${Colors.rose}12`, borderRadius: 16, borderWidth: 1,
    borderColor: `${Colors.rose}30`, paddingHorizontal: 12, paddingVertical: 6,
  },
  allergyChipText: { ...Typography.bodyMedium, color: Colors.rose, fontWeight: '700' },
  emptyText: { ...Typography.bodyRegular, textAlign: 'center', lineHeight: 22 },
  sectionHeader: {
    paddingHorizontal: 14, paddingTop: 12, paddingBottom: 6,
    backgroundColor: `${Colors.rose}06`,
  },
  sectionTitle: { ...Typography.labelUppercase, color: Colors.rose, fontSize: 10 },
  eventRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingHorizontal: 14, paddingVertical: 12 },
  eventBorder: { borderTopWidth: 1, borderTopColor: Colors.border },
  eventEmoji: { fontSize: 22, width: 30, textAlign: 'center', marginTop: 2 },
  eventDateBox: {
    width: 42, alignItems: 'center',
    backgroundColor: `${Colors.rose}10`, borderRadius: 10, paddingVertical: 6,
  },
  eventDateBoxText: { fontSize: 11, fontWeight: '700', color: Colors.rose },
  eventDateBoxYear: { fontSize: 9, color: Colors.textSecondary },
  eventMeal: { ...Typography.caption, color: Colors.mint, fontWeight: '700', marginBottom: 2 },
  eventFood: { ...Typography.bodyMedium },
  eventDate: { ...Typography.caption, marginTop: 1 },
  eventNotes: { ...Typography.caption, fontStyle: 'italic', marginTop: 3, color: Colors.textSecondary },
  allergenBadge: {
    backgroundColor: `${Colors.amber}15`, borderRadius: 6,
    paddingHorizontal: 7, paddingVertical: 3,
  },
  allergenBadgeText: { fontSize: 10, fontWeight: '700', color: Colors.amber },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

const NAV_SECTIONS = [
  { key: 'alimentos', label: 'Alimentos', emoji: '🥦' },
  { key: 'diario',    label: 'Diario',    emoji: '📔' },
  { key: 'reacciones',label: 'Reacciones',emoji: '⚠️' },
] as const;

type Section = typeof NAV_SECTIONS[number]['key'];

export default function NutritionScreen() {
  const activeProfile = useProfileStore((s) => s.activeProfile());
  const [section, setSection] = useState<Section>('alimentos');
  const seedIfEmpty = useNutritionStore((s) => s.seedIfEmpty);

  useEffect(() => {
    if (!activeProfile || activeProfile.type !== 'child') return;
    const mock = activeProfile.id === 'profile-sofia' ? 'sofia'
               : activeProfile.id === 'profile-lucas' ? 'lucas'
               : null;
    if (mock) seedIfEmpty(activeProfile.id, mock);
  }, [activeProfile?.id]);

  if (!activeProfile || activeProfile.type !== 'child') return null;

  const profile = activeProfile as ChildProfile;

  const reactionCount =
    useNutritionStore.getState().getDiaryEntries(profile.id).filter((e) => e.hadReaction).length +
    FOOD_CHECKLIST.filter(
      (f) => useNutritionStore.getState().getFoodIntroductions(profile.id)[f.id]?.status === 'reaction'
    ).length;

  return (
    <SafeAreaView style={screenStyles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={screenStyles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Hero ── */}
        <View style={screenStyles.hero}>
          <View style={screenStyles.heroTop}>
            <View>
              <Text style={screenStyles.heroTitle}>Nutrición</Text>
              <Text style={screenStyles.heroName}>{profile.name}</Text>
            </View>
            <View style={screenStyles.heroRight}>
              {profile.allergies.length > 0 && (
                <View style={screenStyles.allergyWarning}>
                  <Text style={screenStyles.allergyWarningIcon}>⚠️</Text>
                  <Text style={screenStyles.allergyWarningText}>
                    {profile.allergies.length} alergia{profile.allergies.length !== 1 ? 's' : ''}
                  </Text>
                </View>
              )}
              {reactionCount > 0 && (
                <View style={screenStyles.reactionBadge}>
                  <Text style={screenStyles.reactionBadgeText}>
                    🚫 {reactionCount} reacción{reactionCount !== 1 ? 'es' : ''}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Permanent allergy banner when allergies exist */}
        {profile.allergies.length > 0 && (
          <View style={screenStyles.allergyBanner}>
            <Text style={screenStyles.allergyBannerIcon}>⚠️</Text>
            <View style={{ flex: 1 }}>
              <Text style={screenStyles.allergyBannerLabel}>ALERGIAS REGISTRADAS</Text>
              <Text style={screenStyles.allergyBannerList}>
                {profile.allergies.join(' · ')}
              </Text>
            </View>
          </View>
        )}

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
          {section === 'alimentos'  && <AlimentosTab  profile={profile} />}
          {section === 'diario'     && <DiarioTab     profile={profile} />}
          {section === 'reacciones' && <ReaccionesTab profile={profile} />}
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
    backgroundColor: Colors.gradients.nutrition[0],
    paddingTop: 28, paddingBottom: 28, paddingHorizontal: 20,
    borderBottomLeftRadius: 32, borderBottomRightRadius: 32,
    marginBottom: 8,
  },
  heroTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  heroTitle: { fontSize: 34, fontWeight: '900', color: '#fff', letterSpacing: -1 },
  heroName: { ...Typography.headingBold, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  heroRight: { alignItems: 'flex-end', gap: 8 },
  allergyWarning: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  allergyWarningIcon: { fontSize: 13 },
  allergyWarningText: { ...Typography.caption, color: '#fff', fontWeight: '700' },
  reactionBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  reactionBadgeText: { ...Typography.caption, color: '#fff', fontWeight: '700' },

  allergyBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: `${Colors.amber}15`, borderRadius: 12, padding: 12,
    marginHorizontal: 16, marginTop: 10,
    borderWidth: 1, borderColor: `${Colors.amber}35`,
  },
  allergyBannerIcon: { fontSize: 20 },
  allergyBannerLabel: { ...Typography.labelUppercase, color: Colors.amber, fontSize: 9 },
  allergyBannerList: { ...Typography.bodyMedium, marginTop: 1 },

  navSection: { paddingHorizontal: 16, marginTop: 12, marginBottom: 12 },
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
  navTabActive: { backgroundColor: Colors.mint },
  navTabEmoji: { fontSize: 15 },
  navTabLabel: { ...Typography.caption, fontWeight: '600', color: Colors.textSecondary },
  navTabLabelActive: { color: '#fff' },

  content: { paddingHorizontal: 16, gap: 12 },
});
