import React from 'react';
import { View, ActivityIndicator, Animated, Easing } from 'react-native';

/**
 * Branded boot splash shown while fonts/SecureStore/SQLite hydrate.
 * Deliberately text-free: the logo carries the wordmark, and this can render
 * before custom fonts have loaded. White background matches the native splash
 * so the OS → JS hand-off is seamless.
 */
export function Splash() {
  const scale = React.useRef(new Animated.Value(0.92)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, scale]);

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
      <Animated.Image
        source={require('../assets/images/logo.png')}
        style={{ width: 210, height: 210, opacity, transform: [{ scale }] }}
        resizeMode="contain"
      />
      <View style={{ position: 'absolute', bottom: 64 }}>
        <ActivityIndicator size="small" color="#2E8B3A" />
      </View>
    </View>
  );
}
