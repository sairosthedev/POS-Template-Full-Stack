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
  const [focused, setFocused] = React.useState(false);

  return (
    <View style={{ width: '100%' }}>
      {label ? (
        <Text
          style={{
            fontSize: 13,
            fontFamily: theme.fonts.semibold,
            color: theme.colors.muted,
            marginBottom: 8,
          }}>
          {label}
        </Text>
      ) : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(240, 247, 238, 0.35)"
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          backgroundColor: theme.colors.surface,
          borderWidth: 1.5,
          borderColor: focused ? theme.colors.accent : theme.colors.border,
          color: theme.colors.text,
          fontFamily: theme.fonts.medium,
          fontSize: 15,
          height: 52,
          paddingHorizontal: 16,
          borderRadius: theme.radius.md,
        }}
      />
    </View>
  );
}
