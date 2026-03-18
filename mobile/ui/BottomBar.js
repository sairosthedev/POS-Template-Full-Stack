import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from './theme';

function Action({ icon, label, onPress, tone = 'dark' }) {
  const bg =
    tone === 'gold'
      ? theme.colors.gold
      : tone === 'danger'
        ? theme.colors.danger
        : 'rgba(13, 33, 63, 0.9)';
  const textColor = tone === 'gold' ? '#1C2B45' : '#fff';
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: theme.radius.md,
        paddingVertical: 12,
        backgroundColor: bg,
        opacity: pressed ? 0.9 : 1,
        borderWidth: tone === 'dark' ? 1 : 0,
        borderColor: theme.colors.border,
      })}>
      <Ionicons name={icon} size={18} color={textColor} />
      <Text style={{ color: textColor, fontWeight: '800' }}>{label}</Text>
    </Pressable>
  );
}

export function BottomBar({ onScan, onHold, onCancel }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 10,
        padding: theme.space.md,
        backgroundColor: 'rgba(7, 18, 37, 0.92)',
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
      }}>
      <Action icon="barcode-outline" label="Scan" onPress={onScan} />
      <Action icon="pause-outline" label="Hold" onPress={onHold} tone="gold" />
      <Action icon="close-outline" label="Cancel" onPress={onCancel} />
    </View>
  );
}

