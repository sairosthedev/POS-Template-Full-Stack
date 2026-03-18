import React from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';

import { api } from '../../services/api';
import { theme } from '../../ui/theme';
import { HeaderBar } from '../../ui/HeaderBar';
import { Screen } from '../../ui/Screen';
import { Card } from '../../ui/Card';

function money(n) {
  const x = Number(n || 0);
  return `$${x.toFixed(2)}`;
}

export default function ReportsScreen() {
  const [sales, setSales] = React.useState([]);
  const [status, setStatus] = React.useState('idle');
  const [error, setError] = React.useState(null);

  const load = React.useCallback(async () => {
    try {
      setStatus('loading');
      setError(null);
      const res = await api.get('/api/sales');
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setSales(data);
      setStatus('succeeded');
    } catch (e) {
      setStatus('failed');
      setError(e?.response?.data?.message || e?.message || 'Failed to load sales');
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const summary = React.useMemo(() => {
    const total = sales.reduce((acc, s) => acc + Number(s.total || 0), 0);
    const count = sales.length;
    const byPay = { cash: 0, card: 0, online: 0, other: 0 };
    for (const s of sales) {
      const k = String(s.paymentMethod || 'other').toLowerCase();
      if (byPay[k] == null) byPay.other += Number(s.total || 0);
      else byPay[k] += Number(s.total || 0);
    }
    return { total, count, byPay };
  }, [sales]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <HeaderBar rightIcon="refresh" onRightPress={load} />
      <Screen>
        <Text style={{ ...theme.text.title, color: theme.colors.text, marginBottom: 10 }}>
          Reports
        </Text>

        {error ? <Text style={{ color: theme.colors.danger, marginBottom: 10 }}>{String(error)}</Text> : null}

        <Card style={{ marginBottom: 10 }}>
          <Text style={{ color: theme.colors.muted, marginBottom: 6 }}>Sales summary</Text>
          <Text style={{ color: theme.colors.text, fontWeight: '900', fontSize: 20 }}>
            {money(summary.total)}
          </Text>
          <Text style={{ color: theme.colors.muted, marginTop: 6 }}>{summary.count} sale(s)</Text>

          <View style={{ height: 10 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: theme.colors.muted }}>Cash</Text>
            <Text style={{ color: theme.colors.text, fontWeight: '800' }}>{money(summary.byPay.cash)}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
            <Text style={{ color: theme.colors.muted }}>Card</Text>
            <Text style={{ color: theme.colors.text, fontWeight: '800' }}>{money(summary.byPay.card)}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
            <Text style={{ color: theme.colors.muted }}>Online</Text>
            <Text style={{ color: theme.colors.text, fontWeight: '800' }}>{money(summary.byPay.online)}</Text>
          </View>
        </Card>

        <Text style={{ color: theme.colors.muted, marginBottom: 8 }}>Recent sales</Text>
        <FlatList
          data={sales}
          keyExtractor={(s, idx) => String(s._id || idx)}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          renderItem={({ item }) => (
            <Card>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.colors.text, fontWeight: '900' }}>
                    {String(item.paymentMethod || 'cash').toUpperCase()}
                  </Text>
                  <Text style={{ color: theme.colors.muted, marginTop: 4 }}>
                    {item.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}
                  </Text>
                </View>
                <Text style={{ color: theme.colors.gold, fontWeight: '900' }}>{money(item.total)}</Text>
              </View>
            </Card>
          )}
          ListEmptyComponent={
            <Card>
              <Text style={{ color: theme.colors.muted }}>
                {status === 'loading' ? 'Loading…' : 'No sales yet.'}
              </Text>
            </Card>
          }
        />

        <View style={{ height: 10 }} />
        <Pressable onPress={load} style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>
          <Text style={{ color: theme.colors.muted, textAlign: 'center' }}>
            {status === 'loading' ? 'Refreshing…' : 'Refresh'}
          </Text>
        </Pressable>
      </Screen>
    </View>
  );
}
