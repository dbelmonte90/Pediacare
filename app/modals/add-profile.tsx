import React, { useState } from 'react';
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
import { Button } from '@/shared/ui/Button';
import { useProfileStore } from '@/store/profileStore';
import type { Profile } from '@/entities/profile/model/types';

type ProfileType = 'pregnancy' | 'child' | null;
type Sex = 'male' | 'female';

function generateId() {
  return `profile-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function AddProfileModal() {
  const router = useRouter();
  const addProfile = useProfileStore((s) => s.addProfile);

  const [step, setStep] = useState<1 | 2>(1);
  const [type, setType] = useState<ProfileType>(null);

  // Pregnancy fields
  const [motherName, setMotherName] = useState('');
  const [fur, setFur] = useState('');
  const [fpp, setFpp] = useState('');
  const [bloodType, setBloodType] = useState('');

  // Child fields
  const [childName, setChildName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [sex, setSex] = useState<Sex>('female');

  const handleTypeSelect = (t: ProfileType) => {
    setType(t);
    setStep(2);
  };

  const handleCreate = () => {
    if (!type) return;

    let profile: Profile;

    if (type === 'pregnancy') {
      profile = {
        id: generateId(),
        type: 'pregnancy',
        name: motherName || 'Embarazo',
        color: '#8B5CF6',
        createdAt: new Date().toISOString(),
        motherName: motherName || 'Mamá',
        fur: fur || new Date().toISOString().split('T')[0],
        fpp: fpp || new Date(Date.now() + 280 * 86400000).toISOString().split('T')[0],
        bloodType: bloodType || '—',
      };
    } else {
      profile = {
        id: generateId(),
        type: 'child',
        name: childName || 'Mi hijo/a',
        color: sex === 'female' ? Colors.rose : Colors.skyBlue,
        createdAt: new Date().toISOString(),
        birthDate: birthDate || new Date().toISOString().split('T')[0],
        sex,
      };
    }

    addProfile(profile);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => (step === 2 ? setStep(1) : router.back())}>
              <Text style={styles.backButton}>{step === 2 ? '← Atrás' : 'Cancelar'}</Text>
            </TouchableOpacity>
            <Text style={styles.stepIndicator}>Paso {step} de 2</Text>
          </View>

          <Text style={styles.title}>
            {step === 1 ? 'Nuevo perfil' : type === 'pregnancy' ? 'Datos del embarazo' : 'Datos del niño/a'}
          </Text>

          {/* Step 1 — type selector */}
          {step === 1 && (
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[styles.typeCard, { borderColor: Colors.lavender }]}
                onPress={() => handleTypeSelect('pregnancy')}
                activeOpacity={0.8}
              >
                <Text style={styles.typeEmoji}>🤰</Text>
                <Text style={styles.typeLabel}>Estoy embarazada</Text>
                <Text style={styles.typeDesc}>Seguimiento semana a semana del embarazo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.typeCard, { borderColor: Colors.coral }]}
                onPress={() => handleTypeSelect('child')}
                activeOpacity={0.8}
              >
                <Text style={styles.typeEmoji}>👶</Text>
                <Text style={styles.typeLabel}>Mi hijo/a ya nació</Text>
                <Text style={styles.typeDesc}>Salud, nutrición y desarrollo del niño</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Step 2 — pregnancy form */}
          {step === 2 && type === 'pregnancy' && (
            <View style={styles.form}>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>NOMBRE DE LA MADRE</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ana"
                  placeholderTextColor={Colors.textSecondary}
                  value={motherName}
                  onChangeText={setMotherName}
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>FECHA ÚLTIMA REGLA (FUR)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="AAAA-MM-DD"
                  placeholderTextColor={Colors.textSecondary}
                  value={fur}
                  onChangeText={setFur}
                  keyboardType="numbers-and-punctuation"
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>FECHA PROBABLE DE PARTO (FPP)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="AAAA-MM-DD"
                  placeholderTextColor={Colors.textSecondary}
                  value={fpp}
                  onChangeText={setFpp}
                  keyboardType="numbers-and-punctuation"
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>GRUPO SANGUÍNEO</Text>
                <TextInput
                  style={styles.input}
                  placeholder="A+"
                  placeholderTextColor={Colors.textSecondary}
                  value={bloodType}
                  onChangeText={setBloodType}
                />
              </View>
              <Button label="Crear perfil" section="home" onPress={handleCreate} style={styles.cta} />
            </View>
          )}

          {/* Step 2 — child form */}
          {step === 2 && type === 'child' && (
            <View style={styles.form}>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>NOMBRE</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Sofía"
                  placeholderTextColor={Colors.textSecondary}
                  value={childName}
                  onChangeText={setChildName}
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>FECHA DE NACIMIENTO</Text>
                <TextInput
                  style={styles.input}
                  placeholder="AAAA-MM-DD"
                  placeholderTextColor={Colors.textSecondary}
                  value={birthDate}
                  onChangeText={setBirthDate}
                  keyboardType="numbers-and-punctuation"
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>SEXO</Text>
                <View style={styles.sexSelector}>
                  {(['female', 'male'] as Sex[]).map((s) => (
                    <TouchableOpacity
                      key={s}
                      style={[
                        styles.sexOption,
                        sex === s && { backgroundColor: s === 'female' ? `${Colors.rose}20` : `${Colors.skyBlue}20`, borderColor: s === 'female' ? Colors.rose : Colors.skyBlue },
                      ]}
                      onPress={() => setSex(s)}
                    >
                      <Text style={styles.sexEmoji}>{s === 'female' ? '👧' : '👦'}</Text>
                      <Text style={styles.sexLabel}>{s === 'female' ? 'Niña' : 'Niño'}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <Button label="Crear perfil" section="health" onPress={handleCreate} style={styles.cta} />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 40 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  backButton: { ...Typography.bodyMedium, color: Colors.lavender, fontWeight: '700' },
  stepIndicator: { ...Typography.caption, color: Colors.textSecondary },
  title: { ...Typography.titleBold, marginBottom: 24 },
  typeSelector: { gap: 16 },
  typeCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    gap: 8,
  },
  typeEmoji: { fontSize: 40 },
  typeLabel: { ...Typography.headingBold },
  typeDesc: { ...Typography.bodyRegular },
  form: { gap: 20 },
  field: { gap: 8 },
  fieldLabel: { ...Typography.labelUppercase },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 16,
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sexSelector: { flexDirection: 'row', gap: 12 },
  sexOption: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  sexEmoji: { fontSize: 28 },
  sexLabel: { ...Typography.bodyMedium, fontWeight: '700' },
  cta: { marginTop: 8 },
});
