import React from 'react';
import { View, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { logout } from '../../state/authSlice';
import { refreshProducts } from '../../state/productsSlice';
import { Screen } from '../../ui/Screen';
import { Card } from '../../ui/Card';
import { PrimaryButton } from '../../ui/PrimaryButton';
import { theme } from '../../ui/theme';
import { HeaderBar } from '../../ui/HeaderBar';
import { API_BASE_URL } from '../../config';
import { syncNow } from '../../state/syncSlice';

export default function SettingsScreen({ navigation }) {
  const dispatch = useDispatch();
  const token = useSelector((s) => s.auth.token);
  const syncStatus = useSelector((s) => s.sync.status);
  const role = String(useSelector((s) => s.auth.user?.role || '')).toLowerCase();
  const canManageUsers = role === 'admin' || role === 'manager';

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <HeaderBar rightIcon="settings-outline" />
      <Screen>
        <Text style={{ ...theme.text.title, color: theme.colors.text, marginBottom: 12 }}>
          Settings
        </Text>

        <Card style={{ marginBottom: 12 }}>
          <Text style={{ ...theme.text.body, color: theme.colors.muted, marginBottom: 6 }}>
            Session
          </Text>
          <Text style={{ ...theme.text.h1, color: theme.colors.text }}>
            {token ? 'Signed in' : 'Not signed in'}
          </Text>
        </Card>

        <Card style={{ marginBottom: 12 }}>
          <Text style={{ ...theme.text.body, color: theme.colors.muted, marginBottom: 6 }}>
            API
          </Text>
          <Text style={{ color: theme.colors.text, fontWeight: '800' }}>{API_BASE_URL}</Text>
        </Card>

        <PrimaryButton
          title={syncStatus === 'loading' ? 'Syncing…' : 'Sync now'}
          loading={syncStatus === 'loading'}
          onPress={() => dispatch(syncNow())}
        />
        <View style={{ height: 10 }} />
        <PrimaryButton title="Refresh products" onPress={() => dispatch(refreshProducts())} />
        <View style={{ height: 10 }} />
        {canManageUsers ? (
          <>
            <PrimaryButton title="Users" onPress={() => navigation.navigate('Users')} />
            <View style={{ height: 10 }} />
          </>
        ) : null}
        <PrimaryButton
          title="Logout"
          tone="danger"
          onPress={() => {
            dispatch(logout());
            navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
          }}
        />
      </Screen>
    </View>
  );
}
