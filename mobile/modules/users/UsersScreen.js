import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { useSelector } from 'react-redux';

import { api } from '../../services/api';
import { theme } from '../../ui/theme';
import { HeaderBar } from '../../ui/HeaderBar';
import { Screen } from '../../ui/Screen';
import { Card } from '../../ui/Card';
import { PrimaryButton } from '../../ui/PrimaryButton';

export default function UsersScreen({ navigation }) {
  const user = useSelector((s) => s.auth.user);
  const roleLower = String(user?.role || '').toLowerCase();

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [role, setRole] = React.useState('cashier');

  const [status, setStatus] = React.useState('idle');
  const [message, setMessage] = React.useState(null);
  const [error, setError] = React.useState(null);

  async function register() {
    try {
      setStatus('loading');
      setMessage(null);
      setError(null);
      await api.post('/api/auth/register', { name, email, password, role });
      setStatus('succeeded');
      setMessage('User created.');
      setName('');
      setEmail('');
      setPassword('');
      setRole('cashier');
    } catch (e) {
      setStatus('failed');
      setError(e?.response?.data?.message || e?.message || 'Failed to create user');
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <HeaderBar onBack={() => navigation.goBack()} rightIcon="person-add-outline" />
      <Screen>
        <Text style={{ ...theme.text.title, color: theme.colors.text, marginBottom: 10 }}>Users</Text>

        <Card style={{ marginBottom: 10 }}>
          <Text style={{ color: theme.colors.muted, marginBottom: 6 }}>Current session</Text>
          <Text style={{ color: theme.colors.text, fontWeight: '900' }}>
            {user?.name || user?.email || '—'}
          </Text>
          <Text style={{ color: theme.colors.muted, marginTop: 6 }}>
            Role: {user?.role || '—'}
          </Text>
        </Card>

        {roleLower !== 'admin' && roleLower !== 'manager' ? (
          <Card>
            <Text style={{ color: theme.colors.danger, fontWeight: '900', marginBottom: 6 }}>
              Forbidden
            </Text>
            <Text style={{ color: theme.colors.muted }}>
              You don&apos;t have permission to manage users.
            </Text>
          </Card>
        ) : (
        <Card>
          <Text style={{ color: theme.colors.text, fontWeight: '900', marginBottom: 10 }}>
            Create user
          </Text>

          <Text style={{ color: theme.colors.muted, marginBottom: 8 }}>Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Full name"
            placeholderTextColor="rgba(234, 240, 255, 0.45)"
            style={fieldStyle}
          />
          <View style={{ height: 10 }} />

          <Text style={{ color: theme.colors.muted, marginBottom: 8 }}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            placeholder="email@example.com"
            placeholderTextColor="rgba(234, 240, 255, 0.45)"
            style={fieldStyle}
          />
          <View style={{ height: 10 }} />

          <Text style={{ color: theme.colors.muted, marginBottom: 8 }}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
            placeholderTextColor="rgba(234, 240, 255, 0.45)"
            style={fieldStyle}
          />
          <View style={{ height: 10 }} />

          <Text style={{ color: theme.colors.muted, marginBottom: 8 }}>Role (admin/manager/cashier)</Text>
          <TextInput
            value={role}
            onChangeText={setRole}
            autoCapitalize="none"
            placeholder="cashier"
            placeholderTextColor="rgba(234, 240, 255, 0.45)"
            style={fieldStyle}
          />

          {error ? <Text style={{ color: theme.colors.danger, marginTop: 10 }}>{String(error)}</Text> : null}
          {message ? <Text style={{ color: theme.colors.gold, marginTop: 10 }}>{String(message)}</Text> : null}

          <View style={{ height: 12 }} />
          <PrimaryButton
            title={status === 'loading' ? 'Creating…' : 'Create user'}
            loading={status === 'loading'}
            onPress={register}
          />
        </Card>
        )}
      </Screen>
    </View>
  );
}

const fieldStyle = {
  backgroundColor: theme.colors.surface,
  borderWidth: 1,
  borderColor: theme.colors.border,
  color: theme.colors.text,
  paddingVertical: 12,
  paddingHorizontal: 14,
  borderRadius: theme.radius.md,
};
