import React from 'react';
import { Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { login } from '../../state/authSlice';
import { Screen } from '../../ui/Screen';
import { Card } from '../../ui/Card';
import { PrimaryButton } from '../../ui/PrimaryButton';
import { TextField } from '../../ui/TextField';
import { theme } from '../../ui/theme';

export default function AuthScreen({ navigation }) {
  const dispatch = useDispatch();
  const status = useSelector((s) => s.auth.status);
  const error = useSelector((s) => s.auth.error);

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={{ ...theme.text.title, color: theme.colors.text, marginBottom: 6 }}>
          Miccs POS
        </Text>
        <Text style={{ ...theme.text.body, color: theme.colors.muted, marginBottom: 16 }}>
          Sign in to start selling
        </Text>

        <Card>
          <Text style={{ ...theme.text.h1, color: theme.colors.text, marginBottom: 12 }}>
            Login
          </Text>

          <TextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="you@company.com"
          />
          <View style={{ height: 12 }} />
          <TextField
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            placeholder="••••••••"
          />

          {error ? (
            <Text style={{ color: theme.colors.danger, marginTop: 12 }}>{String(error)}</Text>
          ) : null}

          <View style={{ height: 14 }} />
          <PrimaryButton
            title={status === 'loading' ? 'Signing in…' : 'Sign in'}
            loading={status === 'loading'}
            onPress={async () => {
              const res = await dispatch(login({ email, password }));
              if (res.meta.requestStatus === 'fulfilled') {
                navigation.replace('Main');
              }
            }}
          />
        </Card>
      </View>
    </Screen>
  );
}
