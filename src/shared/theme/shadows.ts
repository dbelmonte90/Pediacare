import { Platform } from 'react-native';

export const Shadows = {
  card: Platform.select({
    ios: {
      shadowColor: 'rgba(45,26,22,0.12)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 8,
    },
    android: { elevation: 3 },
    default: {},
  }),
  modal: Platform.select({
    ios: {
      shadowColor: 'rgba(45,26,22,0.2)',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 24,
    },
    android: { elevation: 8 },
    default: {},
  }),
};
