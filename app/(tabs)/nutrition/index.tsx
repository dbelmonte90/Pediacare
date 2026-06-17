import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/shared/theme/colors';
import { Typography } from '@/shared/theme/typography';
import { Card } from '@/shared/ui/Card';
import { AllergyAlertBanner } from '@/shared/ui/AllergyAlertBanner';
import { useProfileStore } from '@/store/profileStore';

const MOCK_FOODS = [
  { name: 'Puré de zanahoria', status: 'introduced', emoji: '🥕' },
  { name: 'Pollo triturado', status: 'introduced', emoji: '🍗' },
  { name: 'Patata', status: 'introduced', emoji: '🥔' },
  { name: 'Pescado blanco', status: 'introduced', emoji: '🐟' },
  { name: 'Huevo (yema)', status: 'allergic', emoji: '🥚' },
  { name: 'Brócoli', status: 'pending', emoji: '🥦' },
  { name: 'Legumbres', status: 'pending', emoji: '🫘' },
];

const STATUS_CONFIG = {
  introduced: { label: 'Introducido', color: Colors.mint, icon: '✅' },
  allergic:   { label: 'Alérgico', color: Colors.rose, icon: '🚫' },
  rejected:   { label: 'Rechazado', color: Colors.amber, icon: '⚠️' },
  pending:    { label: 'Pendiente', color: Colors.textSecondary, icon: '⬜' },
};

export default function NutritionScreen() {
  const activeProfile = useProfileStore((s) => s.activeProfile());
  if (!activeProfile || activeProfile.type !== 'child') return null;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Nutrición</Text>
          <Text style={styles.subtitle}>{activeProfile.name}</Text>
        </View>

        <AllergyAlertBanner />

        <View style={styles.cards}>
          {/* Allergy summary */}
          <Card style={styles.card}>
            <Text style={styles.cardLabel}>INTOLERANCIAS Y ALERGIAS</Text>
            <View style={styles.allergyList}>
              {['Huevo', 'Látex'].map((a) => (
                <View key={a} style={styles.allergyChip}>
                  <Text style={styles.allergyText}>{a}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.link}>+ Gestionar alergias →</Text>
          </Card>

          {/* Food introduction */}
          <Card style={styles.card}>
            <Text style={styles.cardLabel}>INTRODUCCIÓN DE ALIMENTOS</Text>
            {MOCK_FOODS.map((food) => {
              const cfg = STATUS_CONFIG[food.status as keyof typeof STATUS_CONFIG];
              return (
                <View key={food.name} style={styles.foodRow}>
                  <Text style={styles.foodEmoji}>{food.emoji}</Text>
                  <Text style={styles.foodName}>{food.name}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: `${cfg.color}15` }]}>
                    <Text style={[styles.statusText, { color: cfg.color }]}>
                      {cfg.icon} {cfg.label}
                    </Text>
                  </View>
                </View>
              );
            })}
          </Card>

          {/* Food diary placeholder */}
          <Card style={styles.card}>
            <Text style={styles.cardLabel}>DIARIO ALIMENTICIO</Text>
            <View style={styles.diaryPlaceholder}>
              <Text style={styles.diaryEmoji}>🍽️</Text>
              <Text style={styles.diaryText}>Registra las comidas de hoy</Text>
              <Text style={styles.link}>+ Añadir entrada →</Text>
            </View>
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
    backgroundColor: Colors.mint,
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
  allergyList: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 10 },
  allergyChip: {
    backgroundColor: `${Colors.rose}15`,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: `${Colors.rose}30`,
  },
  allergyText: { ...Typography.bodyMedium, color: Colors.rose, fontWeight: '700' },
  link: { ...Typography.bodyMedium, color: Colors.mint, marginTop: 4 },
  foodRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  foodEmoji: { fontSize: 22, width: 30 },
  foodName: { ...Typography.bodyMedium, flex: 1 },
  statusBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  statusText: { ...Typography.caption, fontWeight: '600' },
  diaryPlaceholder: { alignItems: 'center', paddingVertical: 16, gap: 8 },
  diaryEmoji: { fontSize: 36 },
  diaryText: { ...Typography.bodyRegular },
});
