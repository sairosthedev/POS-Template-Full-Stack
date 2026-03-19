import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { theme } from './theme';

function Key({ label, onPress, tone = 'dark' }) {
  const bg =
    tone === 'gold'
      ? theme.colors.gold
      : tone === 'danger'
        ? 'rgba(255, 77, 79, 0.12)'
        : theme.colors.surface;
  const color = tone === 'gold' ? '#1C2B45' : theme.colors.text;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        height: 52,
        borderRadius: theme.radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bg,
        borderWidth: 1,
        borderColor: theme.colors.border,
        opacity: pressed ? 0.9 : 1,
      })}>
      <Text style={{ color, fontWeight: '900', fontSize: 18 }}>{label}</Text>
    </Pressable>
  );
}

export function Keypad({ value, onChange }) {
  const v = String(value ?? '');

  const push = (ch) => {
    const next = v + ch;
    onChange(next);
  };
  const back = () => onChange(v.slice(0, -1));
  const clear = () => onChange('');

  return (
    <View style={{ gap: 10 }}>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Key label="1" onPress={() => push('1')} />
        <Key label="2" onPress={() => push('2')} />
        <Key label="3" onPress={() => push('3')} />
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Key label="4" onPress={() => push('4')} />
        <Key label="5" onPress={() => push('5')} />
        <Key label="6" onPress={() => push('6')} />
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Key label="7" onPress={() => push('7')} />
        <Key label="8" onPress={() => push('8')} />
        <Key label="9" onPress={() => push('9')} />
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Key label="C" tone="danger" onPress={clear} />
        <Key label="0" onPress={() => push('0')} />
        <Key label="⌫" onPress={back} />
      </View>
    </View>
  );
}

