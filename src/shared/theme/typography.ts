import { StyleSheet } from 'react-native';
import { Colors } from './colors';

export const Typography = StyleSheet.create({
  displayBold: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
    color: Colors.textPrimary,
  },
  titleBold: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: Colors.textPrimary,
  },
  headingBold: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  bodyMedium: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  bodyRegular: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  labelUppercase: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Colors.textSecondary,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
});
