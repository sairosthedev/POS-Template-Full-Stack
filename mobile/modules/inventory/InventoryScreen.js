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
  const role = String(useSelector((s) => s.auth.user?.role || '')).toLowerCase();
  const canEdit = role === 'admin' || role === 'manager';
  const [items, setItems] = React.useState([]);
  const [status, setStatus] = React.useState('idle');
  const [error, setError] = React.useState(null);
  const [query, setQuery] = React.useState('');
  const [edit, setEdit] = React.useState(null); // { productId, stock }

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
      const name = String(row.name || '').toLowerCase();
      const barcode = String(row.barcode || '').toLowerCase();
      const cat = String(row.category || '').toLowerCase();
      return name.includes(q) || barcode.includes(q) || cat.includes(q);
    });
  }, [items, query]);

  async function saveUpdate() {
    if (!edit?.productId) return;
    try {
      setStatus('loading');
      setError(null);
      await api.post('/api/inventory/update', {
        productId: edit.productId,
        stock: Number(edit.stock ?? 0),
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

        {edit && canEdit ? (
          <Card style={{ marginBottom: 10 }}>
            <Text style={{ color: theme.colors.text, fontWeight: '900', marginBottom: 8 }}>
              Update stock
            </Text>
            <Text style={{ color: theme.colors.muted, marginBottom: 8 }}>
              {items.find((p) => String(p._id) === String(edit.productId))?.name || edit.productId}
            </Text>
            <TextInput
              value={String(edit.stock ?? '')}
              onChangeText={(t) => setEdit({ ...edit, stock: t })}
              keyboardType="numeric"
              placeholder="New stock quantity"
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
          keyExtractor={(row) => String(row._id)}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          renderItem={({ item }) => {
            const stock = Number(item.stock ?? 0);
            const isOut = stock <= 0;
            const isLow = !isOut && stock <= (item.stockAlert ?? 5);
            return (
              <Card>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: theme.colors.text, fontWeight: '900' }}>
                      {item.name}
                    </Text>
                    <Text style={{ color: theme.colors.muted, marginTop: 4 }}>
                      Stock: {stock} {item.unit || 'units'}
                      {(isOut || isLow) && (
                        <Text style={{ color: theme.colors.danger, marginLeft: 8 }}>
                          {isOut ? '(Out of stock)' : '(Low)'}
                        </Text>
                      )}
                    </Text>
                  </View>
                  {canEdit && (
                    <Pressable
                      onPress={() =>
                        setEdit({
                          productId: String(item._id),
                          stock: String(stock),
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
                  )}
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
