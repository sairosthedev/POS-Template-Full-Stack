import React from 'react';
import { View } from 'react-native';
import { theme } from './theme';

export function PinDots({ length = 4, value = '' }) {
  const v = String(value || '');
  return (
    <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center' }}>
      {Array.from({ length }).map((_, i) => {
        const filled = i < v.length;
        return (
          <View
            key={i}
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              backgroundColor: filled ? theme.colors.gold : 'rgba(234, 240, 255, 0.20)',
              borderWidth: 1,
              borderColor: theme.colors.border,
            }}
          />
        );
      })}
    </View>
  );
}

