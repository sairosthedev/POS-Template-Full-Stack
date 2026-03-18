import React from 'react';
import { Text, View, FlatList, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { syncNow } from '../../state/syncSlice';
import { theme } from '../../ui/theme';
import { HeaderBar } from '../../ui/HeaderBar';
import { PrimaryButton } from '../../ui/PrimaryButton';
import { setPaymentMethod } from '../../state/cartSlice';

export default function SalesScreen({ navigation }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((s) => s.cart.items);
  const total = useSelector((s) => s.cart.total);
  const paymentMethod = useSelector((s) => s.cart.paymentMethod);
  const syncStatus = useSelector((s) => s.sync.status);
  const syncError = useSelector((s) => s.sync.error);
  const lastProcessed = useSelector((s) => s.sync.lastProcessed);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <HeaderBar onBack={null} rightIcon="cart-outline" onRightPress={() => navigation.navigate('Cart')} />

      <View style={{ flex: 1, padding: theme.space.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <Text style={{ ...theme.text.h1, color: theme.colors.text }}>Checkout</Text>
          <View style={{ flex: 1 }} />
          <Pressable onPress={() => dispatch(syncNow())} style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>
            <Text style={{ color: theme.colors.muted, fontWeight: '800' }}>
              {syncStatus === 'loading' ? 'Syncing…' : 'Sync'}
            </Text>
          </Pressable>
        </View>

        <FlatList
          data={cartItems}
          keyExtractor={(i) => String(i.productId)}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          ListEmptyComponent={
            <View
              style={{
                borderWidth: 1,
                borderColor: theme.colors.border,
                borderRadius: theme.radius.md,
                padding: 14,
                backgroundColor: theme.colors.card,
              }}>
              <Text style={{ color: theme.colors.muted }}>Cart is empty. Add items from Products.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: theme.colors.card,
                borderWidth: 1,
                borderColor: theme.colors.border,
                borderRadius: theme.radius.md,
                padding: 12,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View style={{ width: 20, alignItems: 'center' }}>
                <Text style={{ color: theme.colors.gold, fontWeight: '900' }}>×</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.colors.text, fontWeight: '800' }}>{item.name}</Text>
              </View>
              <Text style={{ color: theme.colors.text, fontWeight: '900' }}>
                ${Number(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          )}
        />

        <View style={{ height: 12 }} />

        <View
          style={{
            backgroundColor: theme.colors.card,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.md,
            padding: 14,
          }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text style={{ color: theme.colors.muted, fontWeight: '700' }}>Total:</Text>
            <Text style={{ color: theme.colors.gold, fontWeight: '900', fontSize: 20 }}>
              ${Number(total).toFixed(2)}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
            {[
              { label: 'Cash', value: 'cash' },
              { label: 'Card', value: 'card' },
              { label: 'Online', value: 'online' },
            ].map((p) => {
              const active = paymentMethod === p.value;
              return (
                <Pressable
                  key={p.value}
                  onPress={() => dispatch(setPaymentMethod(p.value))}
                  style={({ pressed }) => ({
                    flex: 1,
                    borderRadius: theme.radius.md,
                    paddingVertical: 10,
                    alignItems: 'center',
                    backgroundColor: active ? 'rgba(240, 193, 90, 0.16)' : theme.colors.surface,
                    borderWidth: 1,
                    borderColor: active ? 'rgba(240, 193, 90, 0.55)' : theme.colors.border,
                    opacity: pressed ? 0.9 : 1,
                  })}>
                  <Text style={{ color: active ? theme.colors.gold : theme.colors.text, fontWeight: '800' }}>
                    {p.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <PrimaryButton title="Add items" onPress={() => navigation.navigate('Sell')} />
          <View style={{ height: 10 }} />
          <PrimaryButton title="Complete Sale" tone="gold" onPress={() => navigation.navigate('Cart')} />

          {syncError ? (
            <Text style={{ color: theme.colors.danger, marginTop: 10 }}>{String(syncError)}</Text>
          ) : null}
          <Text style={{ color: theme.colors.muted, marginTop: 6, fontSize: 12 }}>
            Last sync processed: {lastProcessed}
          </Text>
        </View>
      </View>
    </View>
  );
}
