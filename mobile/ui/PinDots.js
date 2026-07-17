import React from 'react';
import { View } from 'react-native';
import { theme } from './theme';

export function PinDots({ length = 4, value = '' }) {
  const v = String(value || '');
  return (
    <View style={{ flexDirection: 'row', gap: 14, justifyContent: 'center' }}>
      {Array.from({ length }).map((_, i) => {
        const filled = i < v.length;
        return (
          <View
            key={i}
            style={{
              width: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: filled ? theme.colors.accent : 'transparent',
              borderWidth: filled ? 0 : 1.5,
              borderColor: 'rgba(240, 247, 238, 0.25)',
              shadowColor: theme.colors.accent,
              shadowOpacity: filled ? 0.6 : 0,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 0 },
              elevation: filled ? 4 : 0,
            }}
          />
        );
      })}
    </View>
  );
}
