import React from 'react';
import { Text, View, Pressable, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { login, pinLogin } from '../../state/authSlice';
import { Card } from '../../ui/Card';
import { PrimaryButton } from '../../ui/PrimaryButton';
import { theme } from '../../ui/theme';
import { HeaderBar } from '../../ui/HeaderBar';
import { Keypad } from '../../ui/Keypad';
import { PinDots } from '../../ui/PinDots';
import { deleteDeviceAccount, listDeviceAccounts, saveDeviceAccount } from '../../services/deviceAccounts';

function EmailAvatar({ email }) {
  const e = String(email || '').trim();
  const letter = e ? e[0].toUpperCase() : '?';
  return (
    <View
      style={{
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: 'rgba(240, 193, 90, 0.18)',
        borderWidth: 1,
        borderColor: 'rgba(240, 193, 90, 0.35)',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text style={{ color: theme.colors.gold, fontWeight: '900', fontSize: 18 }}>{letter}</Text>
    </View>
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

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <HeaderBar
        // Use the same header style as Sell (default MICCS title/subtitle)
        onBack={
          mode === 'pick'
            ? null
            : () => {
                setMode('pick');
                setPin('');
                setLocalError('');
              }
        }
        rightIcon="person-add-outline"
        onRightPress={() => {
          setMode('add');
          setLocalError('');
        }}
      />

      <View style={{ flex: 1, padding: theme.space.md, alignItems: 'center' }}>
        <View style={{ flex: 1, justifyContent: 'center', width: '100%', maxWidth: 520 }}>
          <View style={{ alignItems: 'center', marginBottom: 14 }}>
            <View
              style={{
                width: 54,
                height: 54,
                borderRadius: 18,
                backgroundColor: 'rgba(240, 193, 90, 0.14)',
                borderWidth: 1,
                borderColor: 'rgba(240, 193, 90, 0.35)',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{ color: theme.colors.gold, fontWeight: '900', fontSize: 20 }}>M</Text>
            </View>
            <Text style={{ color: theme.colors.text, fontWeight: '900', fontSize: 18, marginTop: 10 }}>
              Miccs POS Terminal
            </Text>
            <Text style={{ color: theme.colors.muted, marginTop: 2 }}>
              {mode === 'pick'
                ? 'Tap your account to enter PIN'
                : mode === 'pin'
                  ? 'Use keypad to enter your PIN'
                  : 'Enroll using email + password'}
            </Text>
          </View>

        {mode === 'pick' ? (
          <>
            {accounts.length === 0 ? (
              <Card>
                <Text style={{ color: theme.colors.text, fontWeight: '900', marginBottom: 6 }}>
                  No users on this device
                </Text>
                <Text style={{ color: theme.colors.muted, marginBottom: 12 }}>
                  Enroll a user with email + password (PIN is set by admin in Back Office).
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
                      borderRadius: theme.radius.lg,
                      borderWidth: 1,
                      borderColor: theme.colors.border,
                      backgroundColor: theme.colors.card,
                      padding: 14,
                      opacity: pressed ? 0.9 : 1,
                    })}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <EmailAvatar email={a.email} />
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: theme.colors.text, fontWeight: '900', fontSize: 16 }}>
                          {a.email}
                        </Text>
                        <Text style={{ color: theme.colors.muted, marginTop: 2 }}>
                          Tap to enter PIN
                        </Text>
                      </View>
                      <View
                        style={{
                          paddingVertical: 6,
                          paddingHorizontal: 10,
                          borderRadius: 999,
                          backgroundColor: 'rgba(240, 193, 90, 0.12)',
                          borderWidth: 1,
                          borderColor: 'rgba(240, 193, 90, 0.25)',
                        }}>
                        <Text style={{ color: theme.colors.gold, fontWeight: '900', fontSize: 12 }}>
                          PIN
                        </Text>
                      </View>
                    </View>

                    <View style={{ height: 10 }} />
                    <Pressable
                      onPress={async () => {
                        await deleteDeviceAccount(a.email);
                        await refreshAccounts();
                      }}
                      style={({ pressed }) => ({
                        alignSelf: 'flex-start',
                        opacity: pressed ? 0.85 : 1,
                      })}>
                      <Text style={{ color: theme.colors.danger, fontWeight: '900' }}>
                        Remove
                      </Text>
                    </Pressable>
                  </Pressable>
                ))}
              </View>
            )}
          </>
        ) : null}

        {mode === 'pin' ? (
          <>
            <Card style={{ marginBottom: 12 }}>
              <Text style={{ color: theme.colors.muted }}>Account</Text>
              <Text style={{ color: theme.colors.text, fontWeight: '900', marginTop: 4 }}>
                {selectedEmail}
              </Text>
              <View style={{ height: 14 }} />
              <PinDots length={4} value={pin} />
              {localError || error ? (
                <Text style={{ color: theme.colors.danger, marginTop: 12 }}>
                  {String(localError || error)}
                </Text>
              ) : null}
            </Card>

            <Keypad
              value={pin}
              onChange={(v) => {
                const next = String(v).replace(/\D/g, '').slice(0, 6);
                setPin(next);
              }}
            />
            <View style={{ height: 12 }} />
            <PrimaryButton
              title={status === 'loading' ? 'Signing in…' : 'Sign in'}
              loading={status === 'loading'}
              disabled={pin.length < 4}
              onPress={async () => {
                setLocalError('');
                const res = await dispatch(pinLogin({ email: selectedEmail, pin }));
                if (res.meta.requestStatus === 'fulfilled') {
                  navigation.replace('Main');
                } else {
                  setLocalError('Invalid PIN');
                  setPin('');
                }
              }}
            />
          </>
        ) : null}

        {mode === 'add' ? (
          <Card>
            <Text style={{ color: theme.colors.text, fontWeight: '900', marginBottom: 10 }}>
              Enroll user
            </Text>

            <Text style={{ color: theme.colors.muted, marginBottom: 8 }}>Email</Text>
            <TextInput
              value={addEmail}
              onChangeText={setAddEmail}
              autoCapitalize="none"
              placeholder="cashier@shop.com"
              placeholderTextColor="rgba(234, 240, 255, 0.45)"
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
            <View style={{ height: 10 }} />

            <Text style={{ color: theme.colors.muted, marginBottom: 8 }}>Password</Text>
            <TextInput
              value={addPassword}
              onChangeText={setAddPassword}
              secureTextEntry
              autoCapitalize="none"
              placeholder="••••••••"
              placeholderTextColor="rgba(234, 240, 255, 0.45)"
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

            {localError ? (
              <Text style={{ color: theme.colors.danger, marginTop: 10 }}>{String(localError)}</Text>
            ) : null}

            <View style={{ height: 12 }} />
            <PrimaryButton
              title={status === 'loading' ? 'Enrolling…' : 'Enroll on device'}
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

          <View style={{ height: 14 }} />
          <Text style={{ color: theme.colors.muted, textAlign: 'center', fontSize: 12 }}>
            PIN is managed by Admin in Back Office.
          </Text>
        </View>
      </View>
    </View>
  );
}
