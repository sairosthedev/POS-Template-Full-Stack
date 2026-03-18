import React from 'react';
import { View } from 'react-native';
import { theme } from './theme';

export function Card({ children, style }) {
  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.card,
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.md,
          padding: theme.space.md,
        },
        style,
      ]}>
      {children}
    </View>
  );
}

