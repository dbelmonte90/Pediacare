import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '@/shared/theme/colors';
import { Typography } from '@/shared/theme/typography';
import { Shadows } from '@/shared/theme/shadows';
import { useProfileStore } from '@/store/profileStore';
import type { Profile, PregnancyProfile, ChildProfile } from '@/entities/profile/model/types';

// ─── types ────────────────────────────────────────────────────────────────────

type Step = 1 | 2;
type ProfileType = 'pregnancy' | 'child';
type Sex = 'male' | 'female';

// ─── helpers ──────────────────────────────────────────────────────────────────

function generateId() {
  return `profile-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function maskDate(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function isoFromMask(masked: string): string {
  const parts = masked.split('/');
  if (parts.length !== 3 || parts[2].length < 4) return '';
  const [dd, mm, aaaa] = parts;
  return `${aaaa}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
}

const BLOOD_TYPES = ['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−'];
const COMMON_ALLERGENS = ['Huevo', 'Leche', 'Gluten', 'Frutos secos', 'Mariscos', 'Látex'];

// ─── sub-components ───────────────────────────────────────────────────────────

function StepDots({ current }: { current: Step }) {
  return (
    <View style={styles.stepDots}>
      {([1, 2] as Step[]).map((n) => (
        <View
          key={n}
          style={[
            styles.dot,
            current === n && styles.dotActive,
            current > n && styles.dotDone,
          ]}
        />
      ))}
    </View>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
      {error ? <Text style={styles.fieldError}>{error}</Text> : null}
    </View>
  );
}

function DateField({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (masked: string) => void;
  error?: string;
}) {
  return (
    <Field label={label} error={error}>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        placeholder="DD/MM/AAAA"
        placeholderTextColor={Colors.textSecondary}
        value={value}
        onChangeText={(raw) => onChange(maskDate(raw))}
        keyboardType="number-pad"
        maxLength={10}
      />
    </Field>
  );
}

function BloodTypeSelector({
  value,
  onSelect,
}: {
  value: string;
  onSelect: (t: string) => void;
}) {
  return (
    <View style={styles.chipGrid}>
      {BLOOD_TYPES.map((bt) => {
        const active = value === bt;
        return (
          <TouchableOpacity
            key={bt}
            style={[styles.chip, active && styles.chipActiveBlood]}
            onPress={() => onSelect(active ? '' : bt)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, active && styles.chipTextActiveBlood]}>{bt}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function SexSelector({ value, onChange }: { value: Sex; onChange: (s: Sex) => void }) {
  const options: { key: Sex; emoji: string; label: string; color: string }[] = [
    { key: 'female', emoji: '👧', label: 'Niña', color: Colors.rose },
    { key: 'male', emoji: '👦', label: 'Niño', color: Colors.skyBlue },
  ];
  return (
    <View style={styles.sexRow}>
      {options.map((opt) => {
        const active = value === opt.key;
        return (
          <TouchableOpacity
            key={opt.key}
            style={[
              styles.sexCard,
              active && { borderColor: opt.color, backgroundColor: `${opt.color}12` },
            ]}
            onPress={() => onChange(opt.key)}
            activeOpacity={0.8}
          >
            <Text style={styles.sexEmoji}>{opt.emoji}</Text>
            <Text style={[styles.sexLabel, active && { color: opt.color }]}>{opt.label}</Text>
            {active && (
              <View style={[styles.sexCheck, { backgroundColor: opt.color }]}>
                <Text style={styles.sexCheckMark}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function AllergyInput({
  values,
  onChange,
}: {
  values: string[];
  onChange: (v: string[]) => void;
}) {
  const [inputText, setInputText] = useState('');

  const add = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    const capitalised = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    if (values.includes(capitalised)) { setInputText(''); return; }
    onChange([...values, capitalised]);
    setInputText('');
  };

  const remove = (v: string) => onChange(values.filter((a) => a !== v));

  const quickAvailable = COMMON_ALLERGENS.filter((q) => !values.includes(q));

  return (
    <View style={styles.allergyWrapper}>
      {values.length > 0 && (
        <View style={styles.tagList}>
          {values.map((a) => (
            <TouchableOpacity
              key={a}
              style={styles.allergyTag}
              onPress={() => remove(a)}
              activeOpacity={0.75}
            >
              <Text style={styles.allergyTagText}>{a}</Text>
              <Text style={styles.allergyTagRemove}>×</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.allergyInputRow}>
        <TextInput
          style={styles.allergyInput}
          placeholder="Escribe una alergia..."
          placeholderTextColor={Colors.textSecondary}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={() => add(inputText)}
          returnKeyType="done"
          autoCapitalize="words"
        />
        <TouchableOpacity
          style={[styles.allergyAddBtn, !inputText.trim() && styles.allergyAddBtnDisabled]}
          onPress={() => add(inputText)}
          disabled={!inputText.trim()}
          activeOpacity={0.8}
        >
          <Text style={styles.allergyAddBtnText}>Añadir</Text>
        </TouchableOpacity>
      </View>

      {quickAvailable.length > 0 && (
        <View style={styles.quickSection}>
          <Text style={styles.quickLabel}>ALERGIAS COMUNES</Text>
          <View style={styles.chipGrid}>
            {quickAvailable.map((q) => (
              <TouchableOpacity
                key={q}
                style={styles.quickChip}
                onPress={() => add(q)}
                activeOpacity={0.7}
              >
                <Text style={styles.quickChipText}>+ {q}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

function ProfilePreview({
  type,
  name,
  keyData,
  color,
  typeEmoji,
}: {
  type: ProfileType;
  name: string;
  keyData: string;
  color: string;
  typeEmoji: string;
}) {
  if (!name.trim()) return null;
  return (
    <View style={styles.previewCard}>
      <Text style={styles.fieldLabel}>VISTA PREVIA</Text>
      <View style={styles.previewRow}>
        <View style={[styles.previewAvatar, { backgroundColor: color }]}>
          <Text style={styles.previewLetter}>{name[0].toUpperCase()}</Text>
          <View style={styles.previewBadge}>
            <Text style={styles.previewBadgeEmoji}>{typeEmoji}</Text>
          </View>
        </View>
        <View>
          <Text style={styles.previewName}>{name}</Text>
          <Text style={styles.previewMeta}>
            {type === 'pregnancy' ? 'Embarazo' : 'Niño/a'} · {keyData}
          </Text>
        </View>
      </View>
    </View>
  );
}

// ─── main screen ──────────────────────────────────────────────────────────────

export default function AddProfileModal() {
  const router = useRouter();
  const addProfile = useProfileStore((s) => s.addProfile);

  const [step, setStep] = useState<Step>(1);
  const [profileType, setProfileType] = useState<ProfileType | null>(null);

  const [motherName, setMotherName] = useState('');
  const [furMasked, setFurMasked] = useState('');
  const [fppMasked, setFppMasked] = useState('');
  const [bloodType, setBloodType] = useState('');

  const [childName, setChildName] = useState('');
  const [birthDateMasked, setBirthDateMasked] = useState('');
  const [sex, setSex] = useState<Sex>('female');
  const [childBloodType, setChildBloodType] = useState('');
  const [allergies, setAllergies] = useState<string[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleTypeSelect = (t: ProfileType) => {
    setProfileType(t);
    setErrors({});
    setStep(2);
  };

  const validate = useCallback((): boolean => {
    const next: Record<string, string> = {};
    if (profileType === 'pregnancy') {
      if (!motherName.trim()) next.motherName = 'El nombre es obligatorio';
      if (!isoFromMask(furMasked)) next.fur = 'Fecha no válida — usa DD/MM/AAAA';
      if (!isoFromMask(fppMasked)) next.fpp = 'Fecha no válida — usa DD/MM/AAAA';
    } else {
      if (!childName.trim()) next.childName = 'El nombre es obligatorio';
      if (!isoFromMask(birthDateMasked)) next.birthDate = 'Fecha no válida — usa DD/MM/AAAA';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [profileType, motherName, furMasked, fppMasked, childName, birthDateMasked]);

  const handleCreate = () => {
    if (!profileType || !validate()) return;
    let profile: Profile;

    if (profileType === 'pregnancy') {
      const p: PregnancyProfile = {
        id: generateId(),
        type: 'pregnancy',
        name: motherName.trim(),
        color: Colors.lavender,
        createdAt: new Date().toISOString(),
        motherName: motherName.trim(),
        fur: isoFromMask(furMasked),
        fpp: isoFromMask(fppMasked),
        bloodType: bloodType || '—',
      };
      profile = p;
    } else {
      const c: ChildProfile = {
        id: generateId(),
        type: 'child',
        name: childName.trim(),
        color: sex === 'female' ? Colors.rose : Colors.skyBlue,
        createdAt: new Date().toISOString(),
        birthDate: isoFromMask(birthDateMasked),
        sex,
        bloodType: childBloodType || undefined,
        allergies,
      };
      profile = c;
    }

    addProfile(profile);
    router.back();
  };

  const handleBack = () => {
    if (step === 2) { setStep(1); setErrors({}); }
    else router.back();
  };

  const previewName = profileType === 'pregnancy' ? motherName : childName;
  const previewColor = profileType === 'pregnancy' ? Colors.lavender : (sex === 'female' ? Colors.rose : Colors.skyBlue);
  const previewEmoji = profileType === 'pregnancy' ? '🤰' : (sex === 'female' ? '👧' : '👦');
  const previewKeyData = profileType === 'pregnancy'
    ? (fppMasked.length === 10 ? `FPP: ${fppMasked}` : 'FPP pendiente')
    : (birthDateMasked.length === 10 ? `Nac. ${birthDateMasked}` : 'Fecha pendiente');

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      >
        <View style={styles.topBar}>
          <TouchableOpacity onPress={handleBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.backBtn}>{step === 2 ? '← Atrás' : '✕ Cancelar'}</Text>
          </TouchableOpacity>
          <StepDots current={step} />
          <Text style={styles.stepLabel}>Paso {step}/2</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {step === 1 && (
            <>
              <Text style={styles.title}>Nuevo perfil</Text>
              <Text style={styles.subtitle}>¿De qué tipo quieres crear el perfil?</Text>

              <TouchableOpacity
                style={[styles.typeCard, { borderColor: Colors.lavender }]}
                onPress={() => handleTypeSelect('pregnancy')}
                activeOpacity={0.8}
              >
                <Text style={styles.typeEmoji}>🤰</Text>
                <View style={styles.typeBody}>
                  <Text style={styles.typeTitle}>Estoy embarazada</Text>
                  <Text style={styles.typeDesc}>Seguimiento semanal, checklist prenatal y síntomas</Text>
                </View>
                <Text style={styles.typeArrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.typeCard, { borderColor: Colors.coral }]}
                onPress={() => handleTypeSelect('child')}
                activeOpacity={0.8}
              >
                <Text style={styles.typeEmoji}>👶</Text>
                <View style={styles.typeBody}>
                  <Text style={styles.typeTitle}>Mi hijo/a ya nació</Text>
                  <Text style={styles.typeDesc}>Salud, vacunas, nutrición y desarrollo</Text>
                </View>
                <Text style={styles.typeArrow}>›</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 2 && profileType === 'pregnancy' && (
            <>
              <Text style={styles.title}>Datos del embarazo</Text>

              <Field label="NOMBRE DE LA MADRE" error={errors.motherName}>
                <TextInput
                  style={[styles.input, errors.motherName && styles.inputError]}
                  placeholder="Ej: Ana"
                  placeholderTextColor={Colors.textSecondary}
                  value={motherName}
                  onChangeText={(v) => { setMotherName(v); if (errors.motherName) setErrors((e) => ({ ...e, motherName: '' })); }}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </Field>

              <DateField
                label="FECHA DE ÚLTIMA REGLA (FUR)"
                value={furMasked}
                onChange={(v) => { setFurMasked(v); if (errors.fur) setErrors((e) => ({ ...e, fur: '' })); }}
                error={errors.fur}
              />

              <DateField
                label="FECHA PROBABLE DE PARTO (FPP)"
                value={fppMasked}
                onChange={(v) => { setFppMasked(v); if (errors.fpp) setErrors((e) => ({ ...e, fpp: '' })); }}
                error={errors.fpp}
              />

              <Field label="GRUPO SANGUÍNEO (opcional)">
                <BloodTypeSelector value={bloodType} onSelect={setBloodType} />
              </Field>

              <ProfilePreview type="pregnancy" name={motherName} keyData={previewKeyData} color={previewColor} typeEmoji={previewEmoji} />

              <TouchableOpacity style={[styles.cta, { backgroundColor: Colors.lavender }]} onPress={handleCreate} activeOpacity={0.85}>
                <Text style={styles.ctaText}>Crear perfil de embarazo</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 2 && profileType === 'child' && (
            <>
              <Text style={styles.title}>Datos del niño/a</Text>

              <Field label="NOMBRE" error={errors.childName}>
                <TextInput
                  style={[styles.input, errors.childName && styles.inputError]}
                  placeholder="Ej: Sofía"
                  placeholderTextColor={Colors.textSecondary}
                  value={childName}
                  onChangeText={(v) => { setChildName(v); if (errors.childName) setErrors((e) => ({ ...e, childName: '' })); }}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </Field>

              <Field label="SEXO">
                <SexSelector value={sex} onChange={setSex} />
              </Field>

              <DateField
                label="FECHA DE NACIMIENTO"
                value={birthDateMasked}
                onChange={(v) => { setBirthDateMasked(v); if (errors.birthDate) setErrors((e) => ({ ...e, birthDate: '' })); }}
                error={errors.birthDate}
              />

              <Field label="GRUPO SANGUÍNEO (opcional)">
                <BloodTypeSelector value={childBloodType} onSelect={setChildBloodType} />
              </Field>

              <Field label="ALERGIAS E INTOLERANCIAS (opcional)">
                <AllergyInput values={allergies} onChange={setAllergies} />
              </Field>

              <ProfilePreview type="child" name={childName} keyData={previewKeyData} color={previewColor} typeEmoji={previewEmoji} />

              <TouchableOpacity
                style={[styles.cta, { backgroundColor: sex === 'female' ? Colors.rose : Colors.skyBlue }]}
                onPress={handleCreate}
                activeOpacity={0.85}
              >
                <Text style={styles.ctaText}>
                  Crear perfil de {sex === 'female' ? 'niña' : 'niño'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backBtn: {
    ...Typography.bodyMedium,
    color: Colors.lavender,
    fontWeight: '700',
    minWidth: 80,
  },
  stepDots: { flexDirection: 'row', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.border },
  dotActive: { backgroundColor: Colors.lavender, width: 20 },
  dotDone: { backgroundColor: `${Colors.lavender}60` },
  stepLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    minWidth: 80,
    textAlign: 'right',
  },

  scroll: { paddingHorizontal: 20, paddingBottom: 52 },
  title: { ...Typography.titleBold, marginTop: 12, marginBottom: 6 },
  subtitle: { ...Typography.bodyRegular, marginBottom: 28 },

  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    gap: 14,
    marginBottom: 14,
    borderWidth: 2,
    ...Shadows.card,
  },
  typeEmoji: { fontSize: 38, width: 44, textAlign: 'center' },
  typeBody: { flex: 1, gap: 4 },
  typeTitle: { ...Typography.headingBold, fontSize: 17 },
  typeDesc: { ...Typography.bodyRegular, lineHeight: 18 },
  typeArrow: { fontSize: 26, color: Colors.textSecondary, fontWeight: '300' },

  field: { gap: 8, marginBottom: 20 },
  fieldLabel: { ...Typography.labelUppercase },
  fieldError: { ...Typography.caption, color: Colors.rose, marginTop: 2 },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textPrimary,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  inputError: { borderColor: Colors.rose },

  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    minWidth: 50,
    alignItems: 'center',
  },
  chipActiveBlood: { backgroundColor: `${Colors.coral}15`, borderColor: Colors.coral },
  chipText: { ...Typography.bodyMedium, fontWeight: '700', color: Colors.textSecondary },
  chipTextActiveBlood: { color: Colors.coral },

  sexRow: { flexDirection: 'row', gap: 12 },
  sexCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    gap: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    position: 'relative',
  },
  sexEmoji: { fontSize: 34 },
  sexLabel: { ...Typography.bodyMedium, fontWeight: '700', color: Colors.textSecondary },
  sexCheck: {
    position: 'absolute', top: 8, right: 8,
    width: 20, height: 20, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  sexCheckMark: { color: Colors.surface, fontSize: 11, fontWeight: '800' },

  allergyWrapper: { gap: 12 },
  tagList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  allergyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: `${Colors.rose}15`,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: `${Colors.rose}30`,
  },
  allergyTagText: { ...Typography.bodyMedium, color: Colors.rose, fontWeight: '600' },
  allergyTagRemove: { fontSize: 16, color: Colors.rose, lineHeight: 18, marginTop: -1 },
  allergyInputRow: { flexDirection: 'row', gap: 8 },
  allergyInput: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    height: 46,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textPrimary,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  allergyAddBtn: {
    height: 46, paddingHorizontal: 18, borderRadius: 12,
    backgroundColor: Colors.rose, alignItems: 'center', justifyContent: 'center',
  },
  allergyAddBtnDisabled: { backgroundColor: Colors.border },
  allergyAddBtnText: { ...Typography.bodyMedium, fontWeight: '700', color: Colors.surface },
  quickSection: { gap: 8 },
  quickLabel: { ...Typography.labelUppercase, fontSize: 10 },
  quickChip: {
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10,
    backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: `${Colors.rose}40`,
  },
  quickChipText: { ...Typography.bodyMedium, color: Colors.rose, fontWeight: '600', fontSize: 13 },

  previewCard: {
    backgroundColor: Colors.surface, borderRadius: 16, padding: 16,
    marginBottom: 20, marginTop: 4, borderWidth: 1, borderColor: Colors.border,
    gap: 12, ...Shadows.card,
  },
  previewRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  previewAvatar: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  previewLetter: { fontSize: 22, fontWeight: '800', color: Colors.surface },
  previewBadge: {
    position: 'absolute', bottom: -2, right: -4,
    backgroundColor: Colors.surface, borderRadius: 10,
    width: 20, height: 20, alignItems: 'center', justifyContent: 'center',
  },
  previewBadgeEmoji: { fontSize: 12, lineHeight: 14 },
  previewName: { ...Typography.headingBold, fontSize: 17 },
  previewMeta: { ...Typography.caption, marginTop: 2 },

  cta: { height: 54, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  ctaText: { fontSize: 16, fontWeight: '700', color: Colors.surface, letterSpacing: 0.2 },
});
