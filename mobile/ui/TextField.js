import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { theme } from './theme';

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  autoCapitalize,
  keyboardType,
}) {
  return (
    <View style={{ width: '100%' }}>
      {label ? (
        <Text style={{ ...theme.text.small, color: theme.colors.muted, marginBottom: 8 }}>
          {label}
        </Text>
      ) : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(234, 240, 255, 0.45)"
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        style={{
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.border,
          color: theme.colors.text,
          paddingVertical: 12,
          paddingHorizontal: 14,
          borderRadius: theme.radius.md,
        }}
      />
    </View>
  );
}

