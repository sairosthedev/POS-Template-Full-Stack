import React from 'react';
import { Pressable, Text, ActivityIndicator } from 'react-native';
import { theme } from './theme';

export function PrimaryButton({ title, onPress, disabled, loading, tone = 'primary' }) {
  const bg =
    tone === 'danger'
      ? theme.colors.danger
      : tone === 'accent'
        ? theme.colors.accent
        : theme.colors.primary;
  const textColor = tone === 'accent' ? '#0E2413' : '#fff';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => ({
        backgroundColor: bg,
        opacity: disabled || loading ? 0.45 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
        borderRadius: 16,
        height: 54,
        paddingHorizontal: 18,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        shadowColor: bg,
        shadowOpacity: 0.35,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
      })}>
      {loading ? <ActivityIndicator color={textColor} /> : null}
      <Text style={{ color: textColor, fontSize: 16, fontFamily: theme.fonts.bold, letterSpacing: 0.2 }}>
        {title}
      </Text>
    </Pressable>
  );
}
