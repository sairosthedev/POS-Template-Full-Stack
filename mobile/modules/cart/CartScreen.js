import React from 'react';
import { View, Text, FlatList, Pressable, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { clearCart, removeFromCart, setPaymentMethod, setQuantity } from '../../state/cartSlice';
import { enqueueSync } from '../../services/db';
import { syncNow } from '../../state/syncSlice';
import { Screen } from '../../ui/Screen';
import { Card } from '../../ui/Card';
import { PrimaryButton } from '../../ui/PrimaryButton';
import { theme } from '../../ui/theme';
import { HeaderBar } from '../../ui/HeaderBar';
import { printReceipt } from '../../services/printer';

export default function CartScreen({ navigation }) {
  const dispatch = useDispatch();
  const items = useSelector((s) => s.cart.items);
  const total = useSelector((s) => s.cart.total);
  const paymentMethod = useSelector((s) => s.cart.paymentMethod);

  const [amountReceived, setAmountReceived] = React.useState('');

  const receivedNumber = React.useMemo(() => {
    const n = Number(String(amountReceived).replace(/[^0-9.]/g, ''));
    return Number.isFinite(n) ? n : 0;
  }, [amountReceived]);

  const change = React.useMemo(() => {
    if (paymentMethod !== 'cash') return 0;
    return Math.max(0, receivedNumber - Number(total || 0));
  }, [paymentMethod, receivedNumber, total]);

  React.useEffect(() => {
    // For non-cash methods, default "amount received" to total (editable)
    if (paymentMethod !== 'cash' && String(amountReceived).trim() === '') {
      setAmountReceived(String(Number(total || 0).toFixed(2)));
    }
  }, [paymentMethod, total, amountReceived]);

  function buildReceiptHtml({ saleId, createdAt, paid, changeDue }) {
    const rows = items
      .map(
        (i) =>
          `<tr><td>${escapeHtml(i.name)}</td><td style="text-align:right;">${i.quantity}</td><td style="text-align:right;">$${(
            Number(i.price) * Number(i.quantity)
          ).toFixed(2)}</td></tr>`,
      )
      .join('');

    return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body { font-family: -apple-system, Segoe UI, Roboto, Arial; padding: 24px; }
      h1 { margin: 0 0 6px; }
      .muted { color: #667; font-size: 12px; }
      table { width: 100%; border-collapse: collapse; margin-top: 16px; }
      th, td { border-bottom: 1px solid #eee; padding: 8px 0; }
      th { text-align: left; font-size: 12px; color: #667; }
      .total { font-size: 18px; font-weight: 800; margin-top: 16px; text-align: right; }
      .row { display:flex; justify-content:space-between; margin-top:8px; }
    </style>
  </head>
  <body>
    <h1>MICCS STORE</h1>
    <div class="muted">Receipt: ${escapeHtml(saleId)} • ${escapeHtml(createdAt)}</div>
    <div class="muted">Payment: ${escapeHtml(paymentMethod)}</div>
    <table>
      <thead><tr><th>Item</th><th style="text-align:right;">Qty</th><th style="text-align:right;">Amount</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="total">TOTAL: $${Number(total).toFixed(2)}</div>
    <div class="row"><div class="muted">Paid</div><div><b>$${Number(paid).toFixed(2)}</b></div></div>
    <div class="row"><div class="muted">Change</div><div><b>$${Number(changeDue).toFixed(2)}</b></div></div>
    <div class="muted" style="margin-top: 14px;">Thank you</div>
  </body>
</html>`;
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <HeaderBar onBack={() => navigation.goBack()} rightIcon="cart-outline" />
      <Screen>
        <View style={{ flex: 1 }}>

        <FlatList
          data={items}
          keyExtractor={(i) => String(i.productId)}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          renderItem={({ item }) => (
            <Card>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ ...theme.text.h1, color: theme.colors.text }}>{item.name}</Text>
                  <Text style={{ ...theme.text.body, color: theme.colors.muted, marginTop: 4 }}>
                    {item.quantity} × ${Number(item.price).toFixed(2)}
                  </Text>
                </View>
                <Text style={{ ...theme.text.h1, color: theme.colors.text }}>
                  ${Number(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>

                <View style={{ height: 12 }} />
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: theme.colors.border,
                      borderRadius: theme.radius.md,
                      overflow: 'hidden',
                      backgroundColor: theme.colors.surface,
                    }}>
                    <Pressable
                      onPress={() => {
                        const next = Number(item.quantity) - 1;
                        if (next <= 0) dispatch(removeFromCart(item.productId));
                        else dispatch(setQuantity({ productId: item.productId, quantity: next }));
                      }}
                      style={({ pressed }) => ({
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        opacity: pressed ? 0.85 : 1,
                      })}>
                      <Text style={{ color: theme.colors.text, fontWeight: '900', fontSize: 16 }}>−</Text>
                    </Pressable>
                    <View style={{ width: 1, height: '100%', backgroundColor: theme.colors.border }} />
                    <View style={{ paddingVertical: 8, paddingHorizontal: 12, minWidth: 42, alignItems: 'center' }}>
                      <Text style={{ color: theme.colors.text, fontWeight: '900' }}>{item.quantity}</Text>
                    </View>
                    <View style={{ width: 1, height: '100%', backgroundColor: theme.colors.border }} />
                    <Pressable
                      onPress={() =>
                        dispatch(setQuantity({ productId: item.productId, quantity: Number(item.quantity) + 1 }))
                      }
                      style={({ pressed }) => ({
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        opacity: pressed ? 0.85 : 1,
                      })}>
                      <Text style={{ color: theme.colors.text, fontWeight: '900', fontSize: 16 }}>+</Text>
                    </Pressable>
                  </View>

                  <View style={{ flex: 1 }} />

                  <Pressable
                    onPress={() => dispatch(removeFromCart(item.productId))}
                    style={({ pressed }) => ({
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      borderRadius: theme.radius.md,
                      borderWidth: 1,
                      borderColor: theme.colors.border,
                      backgroundColor: 'rgba(255, 77, 79, 0.08)',
                      opacity: pressed ? 0.9 : 1,
                    })}>
                    <Text style={{ color: theme.colors.danger, fontWeight: '900' }}>Remove</Text>
                  </Pressable>
                </View>
            </Card>
          )}
          ListEmptyComponent={
            <Card>
              <Text style={{ ...theme.text.body, color: theme.colors.muted }}>
                Cart is empty. Add items from Sell.
              </Text>
            </Card>
          }
        />
      </View>

        <View
        style={{
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
        }}>
        <Text style={{ ...theme.text.body, color: theme.colors.muted, marginBottom: 8 }}>
          Payment method
        </Text>
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

        <View style={{ marginBottom: 10 }}>
          <Text style={{ ...theme.text.body, color: theme.colors.muted, marginBottom: 8 }}>
            Amount received
          </Text>
          <TextInput
            value={amountReceived}
            onChangeText={setAmountReceived}
            keyboardType="numeric"
            placeholder="0.00"
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
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 }}>
          <Text style={{ ...theme.text.h1, color: theme.colors.text }}>Total</Text>
          <Text style={{ ...theme.text.h1, color: theme.colors.gold }}>
            ${Number(total).toFixed(2)}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 }}>
          <Text style={{ ...theme.text.h1, color: theme.colors.text }}>Change</Text>
          <Text style={{ ...theme.text.h1, color: theme.colors.text }}>
            ${paymentMethod === 'cash' ? Number(change).toFixed(2) : '0.00'}
          </Text>
        </View>

        <PrimaryButton
          title="Complete sale"
          tone="gold"
          disabled={
            items.length === 0 ||
            receivedNumber <= 0 ||
            (paymentMethod === 'cash' && receivedNumber < Number(total || 0))
          }
          onPress={async () => {
            const saleId =
              global.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
            const createdAt = new Date().toISOString();
            const paid = receivedNumber;
            const changeDue = paymentMethod === 'cash' ? change : 0;
            const sale = {
              _id: saleId,
              cashierId: null,
              branchId: null,
              total,
              paymentMethod,
              createdAt,
              amountReceived: paid,
              change: changeDue,
              items: items.map((i) => ({
                productId: i.productId,
                quantity: i.quantity,
                price: i.price,
              })),
            };
            await enqueueSync('sale:create', sale);
            const html = buildReceiptHtml({ saleId, createdAt, paid, changeDue });
            const textLines = [
              'MICCS STORE',
              `Receipt: ${saleId}`,
              `Payment: ${paymentMethod}`,
              ...items.map(
                (i) =>
                  `${i.name}  x${i.quantity}  $${(Number(i.price) * Number(i.quantity)).toFixed(2)}`,
              ),
              `TOTAL: $${Number(total).toFixed(2)}`,
              `PAID: $${Number(paid).toFixed(2)}`,
              `CHANGE: $${Number(changeDue).toFixed(2)}`,
              'Thank you',
            ];
            await printReceipt({ html, textLines }).catch(() => {});
            dispatch(clearCart());
            await dispatch(syncNow());
            navigation.goBack();
          }}
        />
        <View style={{ height: 8 }} />
        <PrimaryButton
          title="Back to Sell"
          onPress={() => navigation.navigate('Main', { screen: 'Sell' })}
          disabled={items.length === 0}
        />
          <View style={{ height: 8 }} />
          <Pressable onPress={() => dispatch(clearCart())}>
            <Text style={{ color: theme.colors.danger, textAlign: 'center', fontSize: 13 }}>
              Clear cart
            </Text>
          </Pressable>
        </View>
      </Screen>
    </View>
  );
}

function escapeHtml(s) {
  return String(s ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
