import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { theme } from './theme';

function Key({ label, icon, onPress, tone = 'default' }) {
  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      style={({ pressed }) => ({
        flex: 1,
        height: 64,
        borderRadius: theme.radius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: pressed
          ? 'rgba(240, 247, 238, 0.14)'
          : tone === 'ghost'
            ? 'transparent'
            : theme.colors.surface,
      })}>
      {icon ? (
        <Ionicons
          name={icon}
          size={22}
          color={tone === 'danger' ? theme.colors.danger : theme.colors.muted}
        />
      ) : (
        <Text style={{ color: theme.colors.text, fontFamily: theme.fonts.bold, fontSize: 24 }}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

export function Keypad({ value, onChange }) {
  const v = String(value ?? '');

  const push = (ch) => onChange(v + ch);
  const back = () => onChange(v.slice(0, -1));
  const clear = () => onChange('');

  const rows = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
  ];

  return (
    <View style={{ gap: 10 }}>
      {rows.map((row) => (
        <View key={row[0]} style={{ flexDirection: 'row', gap: 10 }}>
          {row.map((d) => (
            <Key key={d} label={d} onPress={() => push(d)} />
          ))}
        </View>
      ))}
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Key icon="close-outline" tone="ghost" onPress={clear} />
        <Key label="0" onPress={() => push('0')} />
        <Key icon="backspace-outline" tone="ghost" onPress={back} />
      </View>
    </View>
  );
}
