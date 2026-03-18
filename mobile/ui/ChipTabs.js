import React from 'react';
import { ScrollView, Pressable, Text, View } from 'react-native';
import { theme } from './theme';

export function ChipTabs({ items, value, onChange }) {
  return (
    <View style={{ marginTop: theme.space.sm }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
        {items.map((it) => {
          const active = it === value;
          return (
            <Pressable
              key={it}
              onPress={() => onChange?.(it)}
              style={({ pressed }) => ({
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: active ? 'rgba(240, 193, 90, 0.55)' : theme.colors.border,
                backgroundColor: active ? 'rgba(240, 193, 90, 0.12)' : 'transparent',
                opacity: pressed ? 0.9 : 1,
              })}>
              <Text style={{ color: active ? theme.colors.gold : theme.colors.text, fontWeight: '700' }}>
                {it}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

