export const Colors = {
  // Backgrounds
  background: '#FFF0EC',
  surface: '#FFFFFF',

  // Text
  textPrimary: '#2d1a16',
  textSecondary: '#a07060',

  // Section accents
  coral: '#F4614A',
  lavender: '#8B5CF6',
  mint: '#10B981',
  skyBlue: '#0EA5E9',
  amber: '#F59E0B',
  rose: '#F43F5E',
  indigo: '#6366f1',

  // Gradients per section (start → end)
  gradients: {
    pregnancy: ['#7c3aed', '#ec4899'] as const,
    health:    ['#F4614A', '#FF8E53'] as const,
    nutrition: ['#10B981', '#059669'] as const,
    development: ['#0EA5E9', '#6366f1'] as const,
    home:      ['#8B5CF6', '#6366f1'] as const,
  },

  // Utility
  border: '#F0E0D8',
  shadow: 'rgba(45,26,22,0.08)',
  overlay: 'rgba(45,26,22,0.4)',
} as const;

export type SectionName = keyof typeof Colors.gradients;
