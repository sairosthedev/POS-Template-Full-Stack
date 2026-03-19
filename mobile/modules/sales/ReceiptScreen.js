import React from 'react';
import { View, Text } from 'react-native';
import { theme } from '../../ui/theme';
import { HeaderBar } from '../../ui/HeaderBar';
import { Screen } from '../../ui/Screen';
import { Card } from '../../ui/Card';
import { PrimaryButton } from '../../ui/PrimaryButton';
import { printReceipt } from '../../services/printer';

function money(n) {
  return `$${Number(n || 0).toFixed(2)}`;
}

export default function ReceiptScreen({ navigation, route }) {
  const sale = route?.params?.sale;
  const html = route?.params?.html;
  const textLines = route?.params?.textLines;

  if (!sale) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
        <HeaderBar onBack={() => navigation.goBack()} rightIcon="receipt-outline" />
        <Screen>
          <Card>
            <Text style={{ color: theme.colors.text, fontWeight: '900' }}>No receipt</Text>
          </Card>
        </Screen>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <HeaderBar onBack={() => navigation.goBack()} rightIcon="receipt-outline" />
      <Screen>
        <Text style={{ ...theme.text.title, color: theme.colors.text, marginBottom: 10 }}>
          Receipt
        </Text>
        <Card style={{ marginBottom: 10 }}>
          <Text style={{ color: theme.colors.muted }}>Status</Text>
          <Text style={{ color: theme.colors.text, fontWeight: '900' }}>{sale.status || 'Completed'}</Text>
          <View style={{ height: 10 }} />
          <Text style={{ color: theme.colors.muted }}>Payment</Text>
          <Text style={{ color: theme.colors.text, fontWeight: '900' }}>{String(sale.paymentMethod || '').toUpperCase()}</Text>
          <View style={{ height: 10 }} />
          <Text style={{ color: theme.colors.muted }}>Receipt No</Text>
          <Text style={{ color: theme.colors.text, fontWeight: '900' }}>{sale.receiptNo || sale._id}</Text>
        </Card>

        <Card style={{ marginBottom: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: theme.colors.muted }}>Total</Text>
            <Text style={{ color: theme.colors.gold, fontWeight: '900' }}>{money(sale.total)}</Text>
          </View>
          <View style={{ height: 8 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: theme.colors.muted }}>Paid</Text>
            <Text style={{ color: theme.colors.text, fontWeight: '900' }}>{money(sale.amountReceived)}</Text>
          </View>
          <View style={{ height: 8 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: theme.colors.muted }}>Change</Text>
            <Text style={{ color: theme.colors.text, fontWeight: '900' }}>{money(sale.change)}</Text>
          </View>
        </Card>

        <PrimaryButton title="Print receipt" tone="gold" onPress={() => printReceipt({ html, textLines })} />
        <View style={{ height: 10 }} />
        <PrimaryButton title="Save / Send" onPress={() => printReceipt({ html })} />
        <View style={{ height: 10 }} />
        <PrimaryButton title="Done" tone="danger" onPress={() => navigation.navigate('Main', { screen: 'Sell' })} />
      </Screen>
    </View>
  );
}

