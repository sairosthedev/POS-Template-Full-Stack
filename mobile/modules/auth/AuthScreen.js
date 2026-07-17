import React from 'react';
import { Text, View, Pressable, Image, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import { login, pinLogin } from '../../state/authSlice';
import { Card } from '../../ui/Card';
import { PrimaryButton } from '../../ui/PrimaryButton';
import { TextField } from '../../ui/TextField';
import { theme } from '../../ui/theme';
import { Keypad } from '../../ui/Keypad';
import { PinDots } from '../../ui/PinDots';
import { deleteDeviceAccount, listDeviceAccounts, saveDeviceAccount } from '../../services/deviceAccounts';

function Avatar({ email, size = 44 }) {
  const letter = String(email || '').trim().charAt(0).toUpperCase() || '?';
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: 'rgba(141, 198, 63, 0.16)',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text style={{ color: theme.colors.accent, fontFamily: theme.fonts.extrabold, fontSize: size * 0.4 }}>
        {letter}
      </Text>
    </View>
  );
}

function CircleIconButton({ icon, onPress, style }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.border,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed ? 0.8 : 1,
        },
        style,
      ]}>
      <Ionicons name={icon} size={18} color={theme.colors.text} />
    </Pressable>
  );
}

export default function AuthScreen({ navigation }) {
  const dispatch = useDispatch();
  const status = useSelector((s) => s.auth.status);
  const error = useSelector((s) => s.auth.error);

  const [accounts, setAccounts] = React.useState([]);
  const [mode, setMode] = React.useState('pick'); // pick | pin | add
  const [selectedEmail, setSelectedEmail] = React.useState('');
  const [pin, setPin] = React.useState('');

  const [addEmail, setAddEmail] = React.useState('');
  const [addPassword, setAddPassword] = React.useState('');
  const [localError, setLocalError] = React.useState('');

  const refreshAccounts = React.useCallback(async () => {
    const list = await listDeviceAccounts();
    setAccounts(list);
  }, []);

  React.useEffect(() => {
    refreshAccounts();
  }, [refreshAccounts]);

  const goBackToPick = () => {
    setMode('pick');
    setPin('');
    setLocalError('');
  };

  const subtitle =
    mode === 'pick'
      ? 'Select your account to sign in'
      : mode === 'pin'
        ? 'Enter your PIN to continue'
        : 'Sign in once with email and password';

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      {/* Top bar: back on the left (contextual), add-user on the right */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: theme.space.md,
          paddingTop: 56,
        }}>
        <View style={{ width: 40 }}>
          {mode !== 'pick' ? <CircleIconButton icon="chevron-back" onPress={goBackToPick} /> : null}
        </View>
        {mode === 'pick' ? (
          <CircleIconButton icon="person-add-outline" onPress={() => { setMode('add'); setLocalError(''); }} />
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: theme.space.lg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        keyboardShouldPersistTaps="handled">
        <View style={{ width: '100%', maxWidth: 440 }}>
          {/* Brand header */}
          <View style={{ alignItems: 'center', marginBottom: 28 }}>
            <View
              style={{
                width: 92,
                height: 92,
                borderRadius: 46,
                backgroundColor: '#FFFFFF',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOpacity: 0.35,
                shadowRadius: 16,
                shadowOffset: { width: 0, height: 8 },
                elevation: 10,
              }}>
              <Image
                source={require('../../assets/images/logo.png')}
                style={{ width: 84, height: 84, borderRadius: 42 }}
                resizeMode="cover"
              />
            </View>
            <Text
              style={{
                color: theme.colors.text,
                fontFamily: theme.fonts.extrabold,
                fontSize: 24,
                marginTop: 18,
                letterSpacing: 0.2,
              }}>
              {mode === 'add' ? 'Add a user' : 'Welcome back'}
            </Text>
            <Text
              style={{
                color: theme.colors.muted,
                fontFamily: theme.fonts.medium,
                fontSize: 14,
                marginTop: 6,
              }}>
              {subtitle}
            </Text>
          </View>

          {mode === 'pick' ? (
            accounts.length === 0 ? (
              <Card style={{ alignItems: 'center', paddingVertical: 28 }}>
                <Ionicons name="people-outline" size={30} color={theme.colors.muted} />
                <Text
                  style={{
                    color: theme.colors.text,
                    fontFamily: theme.fonts.bold,
                    fontSize: 16,
                    marginTop: 12,
                  }}>
                  No users on this device yet
                </Text>
                <Text
                  style={{
                    color: theme.colors.muted,
                    fontFamily: theme.fonts.regular,
                    fontSize: 13,
                    textAlign: 'center',
                    marginTop: 6,
                    marginBottom: 18,
                    lineHeight: 19,
                  }}>
                  Sign in once with your email and password.{'\n'}After that, your PIN is all you need.
                </Text>
                <PrimaryButton title="Add user" onPress={() => setMode('add')} />
              </Card>
            ) : (
              <View style={{ gap: 10 }}>
                {accounts.map((a) => (
                  <Pressable
                    key={a.email}
                    onPress={() => {
                      setSelectedEmail(a.email);
                      setPin('');
                      setLocalError('');
                      setMode('pin');
                    }}
                    style={({ pressed }) => ({
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 14,
                      borderRadius: theme.radius.lg,
                      backgroundColor: pressed ? theme.colors.surface : theme.colors.card,
                      borderWidth: 1,
                      borderColor: theme.colors.border,
                      paddingVertical: 14,
                      paddingHorizontal: 16,
                    })}>
                    <Avatar email={a.email} />
                    <View style={{ flex: 1 }}>
                      <Text
                        numberOfLines={1}
                        style={{ color: theme.colors.text, fontFamily: theme.fonts.semibold, fontSize: 15 }}>
                        {a.email}
                      </Text>
                      <Text
                        style={{
                          color: theme.colors.muted,
                          fontFamily: theme.fonts.regular,
                          fontSize: 12,
                          marginTop: 2,
                        }}>
                        Sign in with PIN
                      </Text>
                    </View>
                    <Pressable
                      hitSlop={10}
                      onPress={async () => {
                        await deleteDeviceAccount(a.email);
                        await refreshAccounts();
                      }}
                      style={({ pressed }) => ({ padding: 6, opacity: pressed ? 0.6 : 1 })}>
                      <Ionicons name="trash-outline" size={17} color={theme.colors.muted} />
                    </Pressable>
                    <Ionicons name="chevron-forward" size={18} color={theme.colors.muted} />
                  </Pressable>
                ))}
              </View>
            )
          ) : null}

          {mode === 'pin' ? (
            <View>
              <View style={{ alignItems: 'center', marginBottom: 22 }}>
                <Avatar email={selectedEmail} size={52} />
                <Text
                  style={{
                    color: theme.colors.text,
                    fontFamily: theme.fonts.semibold,
                    fontSize: 15,
                    marginTop: 10,
                    marginBottom: 20,
                  }}>
                  {selectedEmail}
                </Text>
                <PinDots length={4} value={pin} />
                {localError || error ? (
                  <Text
                    style={{
                      color: theme.colors.danger,
                      fontFamily: theme.fonts.semibold,
                      fontSize: 13,
                      marginTop: 14,
                    }}>
                    {String(localError || error)}
                  </Text>
                ) : null}
              </View>

              <Keypad
                value={pin}
                onChange={(v) => {
                  const next = String(v).replace(/\D/g, '').slice(0, 6);
                  setPin(next);
                }}
              />
              <View style={{ height: 16 }} />
              <PrimaryButton
                title={status === 'loading' ? 'Signing in…' : 'Sign in'}
                tone="accent"
                loading={status === 'loading'}
                disabled={pin.length < 4}
                onPress={async () => {
                  setLocalError('');
                  const res = await dispatch(pinLogin({ email: selectedEmail, pin }));
                  if (res.meta.requestStatus === 'fulfilled') {
                    navigation.replace('Main');
                  } else {
                    setLocalError('Incorrect PIN — try again');
                    setPin('');
                  }
                }}
              />
            </View>
          ) : null}

          {mode === 'add' ? (
            <Card style={{ padding: theme.space.lg }}>
              <TextField
                label="Email"
                value={addEmail}
                onChangeText={setAddEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="cashier@belcit.co.zw"
              />
              <View style={{ height: 14 }} />
              <TextField
                label="Password"
                value={addPassword}
                onChangeText={setAddPassword}
                secureTextEntry
                autoCapitalize="none"
                placeholder="••••••••"
              />

              {localError ? (
                <Text
                  style={{
                    color: theme.colors.danger,
                    fontFamily: theme.fonts.semibold,
                    fontSize: 13,
                    marginTop: 12,
                  }}>
                  {String(localError)}
                </Text>
              ) : null}

              <View style={{ height: 18 }} />
              <PrimaryButton
                title={status === 'loading' ? 'Verifying…' : 'Add user to this device'}
                loading={status === 'loading'}
                onPress={async () => {
                  setLocalError('');
                  const e = addEmail.trim().toLowerCase();
                  if (!e.includes('@')) return setLocalError('Enter a valid email');
                  try {
                    const res = await dispatch(login({ email: e, password: addPassword }));
                    if (res.meta.requestStatus !== 'fulfilled') {
                      return setLocalError('Invalid email or password');
                    }
                    await saveDeviceAccount({ email: e });
                    await refreshAccounts();
                    setAddEmail('');
                    setAddPassword('');
                    setMode('pick');
                  } catch (err) {
                    setLocalError(err?.message || 'Failed to save');
                  }
                }}
              />
            </Card>
          ) : null}

          <Text
            style={{
              color: 'rgba(240, 247, 238, 0.40)',
              fontFamily: theme.fonts.regular,
              textAlign: 'center',
              fontSize: 12,
              marginTop: 24,
            }}>
            PINs are managed by your administrator in the Back Office
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
