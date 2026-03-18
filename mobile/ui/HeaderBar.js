import React from 'react';
import { View, Text, Pressable, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from './theme';

export function HeaderBar({
  title = 'MICCS',
  subtitle = 'TECHNOLOGIES',
  onBack,
  rightIcon = 'grid-outline',
  onRightPress,
  badgeCount,
}) {
  const badge =
    typeof badgeCount === 'number'
      ? badgeCount
      : badgeCount == null
        ? 0
        : Number(badgeCount) || 0;

  return (
    <LinearGradient
      colors={[theme.colors.bg2, theme.colors.bg]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
      }}>
      <SafeAreaView
        style={{
          paddingHorizontal: theme.space.md,
          paddingTop: theme.space.sm,
          paddingBottom: theme.space.sm,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Pressable
          onPress={onBack}
          disabled={!onBack}
          style={({ pressed }) => ({
            width: 36,
            height: 36,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: !onBack ? 0 : pressed ? 0.85 : 1,
          })}>
          {onBack ? <Ionicons name="chevron-back" size={22} color={theme.colors.text} /> : null}
        </Pressable>

        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ color: theme.colors.text, fontWeight: '900', letterSpacing: 1 }}>
            {title}
          </Text>
          <Text style={{ color: theme.colors.muted, fontSize: 11, letterSpacing: 1 }}>
            {subtitle}
          </Text>
        </View>

        <Pressable
          onPress={onRightPress}
          style={({ pressed }) => ({
            width: 36,
            height: 36,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.85 : 1,
          })}>
          <Ionicons name={rightIcon} size={20} color={theme.colors.text} />
          {badge > 0 ? (
            <View
              style={{
                position: 'absolute',
                top: -4,
                right: -4,
                minWidth: 18,
                height: 18,
                paddingHorizontal: 5,
                borderRadius: 999,
                backgroundColor: theme.colors.gold,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.15)',
              }}>
              <Text style={{ color: '#1C2B45', fontWeight: '900', fontSize: 11 }}>
                {badge > 99 ? '99+' : String(badge)}
              </Text>
            </View>
          ) : null}
        </Pressable>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

