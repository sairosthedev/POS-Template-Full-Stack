import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { theme } from './theme';

export function ProductCard({ name, price, onAdd, outOfStock = false }) {
  const initials = String(name || '?').trim().slice(0, 1).toUpperCase();
  const disabled = outOfStock;
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.92)',
        borderRadius: theme.radius.md,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.06)',
      }}>
      <View
        style={{
          height: 84,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(7, 18, 37, 0.08)',
        }}>
        <Text style={{ fontSize: 34, fontWeight: '900', color: 'rgba(7,18,37,0.55)' }}>
          {initials}
        </Text>
      </View>
      <View style={{ padding: 10 }}>
        <Text numberOfLines={1} style={{ fontWeight: '800', color: '#1C2B45' }}>
          {name}
        </Text>
        {outOfStock && (
          <Text style={{ fontSize: 10, fontWeight: '800', color: theme.colors.danger, marginTop: 4 }}>
            Out of stock
          </Text>
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
          <Text style={{ fontWeight: '800', color: '#1C2B45' }}>${Number(price).toFixed(2)}</Text>
          <View style={{ flex: 1 }} />
          <Pressable
            onPress={disabled ? undefined : onAdd}
            disabled={disabled}
            style={({ pressed }) => ({
              width: 30,
              height: 30,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: disabled ? '#9CA3AF' : theme.colors.gold,
              opacity: disabled ? 0.6 : pressed ? 0.9 : 1,
            })}>
            <Text style={{ fontWeight: '900', color: disabled ? '#6B7280' : '#1C2B45', fontSize: 18 }}>+</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

