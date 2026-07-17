import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { theme } from '../../ui/theme';
import { HeaderBar } from '../../ui/HeaderBar';
import { Screen } from '../../ui/Screen';
import { Card } from '../../ui/Card';
import { PrimaryButton } from '../../ui/PrimaryButton';
import { printReceipt } from '../../services/printer';
import { currencySymbol } from '../../services/settings';

const PAPER_TEXT = '#1B1B1B';
const PAPER_MUTED = '#6B6B6B';

function Dashed() {
  return (
    <View
      style={{
        borderBottomWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#C9C9C9',
        marginVertical: 10,
      }}
    />
  );
}

function Row({ label, value, bold, big }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 3 }}>
      <Text
        style={{
          color: bold ? PAPER_TEXT : PAPER_MUTED,
          fontFamily: bold ? theme.fonts.extrabold : theme.fonts.medium,
          fontSize: big ? 17 : 12.5,
        }}>
        {label}
      </Text>
      <Text
        style={{
          color: PAPER_TEXT,
          fontFamily: bold ? theme.fonts.extrabold : theme.fonts.semibold,
          fontSize: big ? 17 : 12.5,
        }}>
        {value}
      </Text>
    </View>
  );
}

export default function ReceiptScreen({ navigation, route }) {
  const sale = route?.params?.sale;
  const html = route?.params?.html;
  const textLines = route?.params?.textLines;
  const store = route?.params?.store || {};

  if (!sale) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
        <HeaderBar onBack={() => navigation.goBack()} rightIcon="receipt-outline" />
        <Screen>
          <Card>
            <Text style={{ color: theme.colors.text, fontFamily: theme.fonts.extrabold }}>No receipt</Text>
          </Card>
        </Screen>
      </View>
    );
  }

  const sym = currencySymbol(store.currency);
  const money = (n) => `${sym}${Number(n || 0).toFixed(2)}`;
  const items = Array.isArray(sale.items) ? sale.items : [];
  const when = new Date(sale.createdAt || Date.now()).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <HeaderBar onBack={() => navigation.navigate('Main', { screen: 'Sell' })} rightIcon="receipt-outline" />
      <Screen>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
          {/* Paper receipt preview */}
          <View
            style={{
              backgroundColor: '#FDFDF8',
              borderRadius: 14,
              paddingVertical: 20,
              paddingHorizontal: 18,
              shadowColor: '#000',
              shadowOpacity: 0.35,
              shadowRadius: 14,
              shadowOffset: { width: 0, height: 8 },
              elevation: 8,
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: PAPER_TEXT,
                fontFamily: theme.fonts.extrabold,
                fontSize: 17,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
              }}>
              {store.companyName || 'Receipt'}
            </Text>
            {store.address ? (
              <Text style={{ textAlign: 'center', color: PAPER_MUTED, fontFamily: theme.fonts.regular, fontSize: 11.5, marginTop: 3 }}>
                {store.address}
              </Text>
            ) : null}
            {store.phone ? (
              <Text style={{ textAlign: 'center', color: PAPER_MUTED, fontFamily: theme.fonts.regular, fontSize: 11.5, marginTop: 2 }}>
                Tel: {store.phone}
              </Text>
            ) : null}

            <Dashed />
            <Row label="Receipt" value={String(sale.receiptNo || sale._id || '')} />
            <Row label="Date" value={when} />
            <Row label="Payment" value={String(sale.paymentMethod || '').toUpperCase()} />
            <Dashed />

            {items.map((i, idx) => (
              <View key={`${i.productId || idx}`} style={{ marginBottom: 7 }}>
                <Text style={{ color: PAPER_TEXT, fontFamily: theme.fonts.bold, fontSize: 13 }}>{i.name}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: PAPER_MUTED, fontFamily: theme.fonts.medium, fontSize: 12 }}>
                    {Number(i.quantity)} × {money(i.price)}
                  </Text>
                  <Text style={{ color: PAPER_TEXT, fontFamily: theme.fonts.semibold, fontSize: 12.5 }}>
                    {money(Number(i.price) * Number(i.quantity))}
                  </Text>
                </View>
              </View>
            ))}

            <Dashed />
            <Row label="TOTAL" value={money(sale.total)} bold big />
            <Row label="Paid" value={money(sale.amountReceived)} />
            <Row label="Change" value={money(sale.change)} />
            <Dashed />
            <Text style={{ textAlign: 'center', color: PAPER_MUTED, fontFamily: theme.fonts.medium, fontSize: 12 }}>
              Thank you for shopping with us!
            </Text>
          </View>

          <View style={{ height: 18 }} />
          <PrimaryButton title="Print receipt" tone="accent" onPress={() => printReceipt({ html, textLines })} />
          <View style={{ height: 10 }} />
          <PrimaryButton title="Save / Send PDF" onPress={() => printReceipt({ html })} />
          <View style={{ height: 10 }} />
          <PrimaryButton title="New sale" onPress={() => navigation.navigate('Main', { screen: 'Sell' })} />
        </ScrollView>
      </Screen>
    </View>
  );
}
