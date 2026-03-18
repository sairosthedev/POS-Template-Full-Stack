import React from 'react';
import { Pressable, Text, ActivityIndicator } from 'react-native';
import { theme } from './theme';

export function PrimaryButton({ title, onPress, disabled, loading, tone = 'primary' }) {
  const bg =
    tone === 'danger'
      ? theme.colors.danger
      : tone === 'gold'
        ? theme.colors.gold
        : theme.colors.primary;
  const textColor = tone === 'gold' ? '#1C2B45' : '#fff';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => ({
        backgroundColor: bg,
        opacity: disabled || loading ? 0.55 : pressed ? 0.9 : 1,
        borderRadius: theme.radius.md,
        paddingVertical: 12,
        paddingHorizontal: 14,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
      })}>
      {loading ? <ActivityIndicator color={textColor} /> : null}
      <Text style={{ color: textColor, fontSize: 15, fontWeight: '800' }}>{title}</Text>
    </Pressable>
  );
}

