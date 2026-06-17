import React from 'react';
import { ScrollView, StatusBar, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { Colors } from '@/shared/theme/colors';

interface AppScreenProps {
  children: React.ReactNode;
  edges?: Edge[];
  statusBarStyle?: 'light-content' | 'dark-content';
  paddingBottom?: number;
  noScroll?: boolean;
}

export function AppScreen({
  children,
  edges = ['bottom'],
  statusBarStyle = 'dark-content',
  paddingBottom = 40,
  noScroll = false,
}: AppScreenProps) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={edges}>
      <StatusBar barStyle={statusBarStyle} />
      {noScroll ? (
        children
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom }}
        >
          {children}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
