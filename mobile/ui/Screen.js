import React from 'react';
import { SafeAreaView, StatusBar, View } from 'react-native';
import { theme } from './theme';

export function Screen({ children }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <StatusBar barStyle="light-content" />
      <View style={{ flex: 1, padding: theme.space.md }}>{children}</View>
    </SafeAreaView>
  );
}

