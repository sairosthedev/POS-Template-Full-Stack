import React from 'react';
import { View, Text, FlatList, Pressable, TextInput } from 'react-native';
import { useSelector } from 'react-redux';

import { api } from '../../services/api';
import { theme } from '../../ui/theme';
import { HeaderBar } from '../../ui/HeaderBar';
import { Screen } from '../../ui/Screen';
import { Card } from '../../ui/Card';
import { PrimaryButton } from '../../ui/PrimaryButton';

export default function InventoryScreen({ navigation }) {
  const products = useSelector((s) => s.products.items);
  const byId = React.useMemo(() => {
    const map = new Map();
    for (const p of products) map.set(String(p._id), p);
    return map;
  }, [products]);

  const [items, setItems] = React.useState([]);
  const [status, setStatus] = React.useState('idle');
  const [error, setError] = React.useState(null);
  const [query, setQuery] = React.useState('');

  const [edit, setEdit] = React.useState(null); // { productId, branchId, quantity }

  const load = React.useCallback(async () => {
    try {
      setStatus('loading');
      setError(null);
      const res = await api.get('/api/inventory');
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setItems(data);
      setStatus('succeeded');
    } catch (e) {
      setStatus('failed');
      setError(e?.response?.data?.message || e?.message || 'Failed to load inventory');
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((row) => {
      const p = byId.get(String(row.productId));
      const name = String(p?.name || '').toLowerCase();
      const barcode = String(p?.barcode || '').toLowerCase();
      return name.includes(q) || barcode.includes(q);
    });
  }, [items, query, byId]);

  async function saveUpdate() {
    if (!edit?.productId) return;
    try {
      setStatus('loading');
      setError(null);
      await api.post('/api/inventory/update', {
        productId: edit.productId,
        branchId: edit.branchId || null,
        quantity: Number(edit.quantity),
      });
      setEdit(null);
      await load();
    } catch (e) {
      setStatus('failed');
      setError(e?.response?.data?.message || e?.message || 'Failed to update inventory');
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <HeaderBar onBack={null} rightIcon="refresh" onRightPress={load} />
      <Screen>
        <Text style={{ ...theme.text.title, color: theme.colors.text, marginBottom: 10 }}>
          Inventory
        </Text>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search product / barcode"
          placeholderTextColor="rgba(234, 240, 255, 0.45)"
          style={{
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.border,
            color: theme.colors.text,
            paddingVertical: 12,
            paddingHorizontal: 14,
            borderRadius: theme.radius.md,
            marginBottom: 10,
          }}
        />

        {error ? <Text style={{ color: theme.colors.danger, marginBottom: 10 }}>{String(error)}</Text> : null}

        {edit ? (
          <Card style={{ marginBottom: 10 }}>
            <Text style={{ color: theme.colors.text, fontWeight: '900', marginBottom: 8 }}>
              Update stock
            </Text>
            <Text style={{ color: theme.colors.muted, marginBottom: 8 }}>
              {byId.get(String(edit.productId))?.name || edit.productId}
            </Text>
            <TextInput
              value={String(edit.quantity ?? '')}
              onChangeText={(t) => setEdit({ ...edit, quantity: t })}
              keyboardType="numeric"
              placeholder="Quantity"
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
            <PrimaryButton title={status === 'loading' ? 'Saving…' : 'Save'} loading={status === 'loading'} onPress={saveUpdate} />
            <View style={{ height: 8 }} />
            <Pressable onPress={() => setEdit(null)}>
              <Text style={{ color: theme.colors.muted, textAlign: 'center' }}>Cancel</Text>
            </Pressable>
          </Card>
        ) : null}

        <FlatList
          data={filtered}
          keyExtractor={(row, idx) => String(row._id || `${row.productId}-${row.branchId}-${idx}`)}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          renderItem={({ item }) => {
            const p = byId.get(String(item.productId));
            return (
              <Card>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: theme.colors.text, fontWeight: '900' }}>
                      {p?.name || String(item.productId)}
                    </Text>
                    <Text style={{ color: theme.colors.muted, marginTop: 4 }}>
                      Qty: {Number(item.quantity ?? 0)}
                      {item.branchId ? ` • Branch: ${item.branchId}` : ''}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() =>
                      setEdit({
                        productId: String(item.productId),
                        branchId: item.branchId ? String(item.branchId) : null,
                        quantity: String(item.quantity ?? 0),
                      })
                    }
                    style={({ pressed }) => ({
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      borderRadius: theme.radius.md,
                      borderWidth: 1,
                      borderColor: theme.colors.border,
                      opacity: pressed ? 0.9 : 1,
                    })}>
                    <Text style={{ color: theme.colors.text, fontWeight: '900' }}>Edit</Text>
                  </Pressable>
                </View>
              </Card>
            );
          }}
          ListEmptyComponent={
            <Card>
              <Text style={{ color: theme.colors.muted }}>
                {status === 'loading' ? 'Loading…' : 'No inventory records yet.'}
              </Text>
            </Card>
          }
        />
      </Screen>
    </View>
  );
}
