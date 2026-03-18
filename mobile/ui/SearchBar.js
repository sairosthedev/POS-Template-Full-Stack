import React from 'react';
import { View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from './theme';

export function SearchBar({ value, onChangeText, placeholder = 'Search product' }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.lg,
        paddingHorizontal: 12,
        paddingVertical: 10,
      }}>
      <Ionicons name="search" size={18} color={theme.colors.muted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(234, 240, 255, 0.45)"
        style={{ flex: 1, color: theme.colors.text }}
      />
      <Ionicons name="barcode-outline" size={20} color={theme.colors.muted} />
    </View>
  );
}

