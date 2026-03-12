import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { theme } from '../../utils/theme';
import { Header } from '../../components/layout/Header';
import { Card } from '../../components/ui/Card';
import { LineChart, DollarSign, TrendingUp, Package } from 'lucide-react-native';

const ReportsHome = ({ user }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Header user={user} title="Financial Reports" subtitle="Performance Analytics" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.grid}>
          <Card style={styles.statCard}>
            <DollarSign color={theme.colors.primary} size={24} />
            <Text style={styles.statLabel}>Daily Sales</Text>
            <Text style={styles.statValue}>$0.00</Text>
          </Card>
          <Card style={styles.statCard}>
            <TrendingUp color={theme.colors.success} size={24} />
            <Text style={styles.statLabel}>Net Profit</Text>
            <Text style={styles.statValue}>$0.00</Text>
          </Card>
        </View>

        <Card style={styles.chartPlaceholder}>
          <Text style={styles.chartTitle}>Sales Trend (Last 7 Days)</Text>
          <View style={styles.placeholderBox}>
            <LineChart size={48} color={theme.colors.background} />
            <Text style={styles.placeholderText}>Analytics Engine Loading...</Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { padding: 16 },
  grid: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  statCard: { flex: 1, alignItems: 'center', padding: 20 },
  statLabel: { fontSize: 10, fontWeight: '900', color: theme.colors.textMuted, textTransform: 'uppercase', marginTop: 8 },
  statValue: { fontSize: 20, fontWeight: '900', color: theme.colors.textMain, marginTop: 4 },
  chartPlaceholder: { height: 300, padding: 20 },
  chartTitle: { fontSize: 14, fontWeight: '900', color: theme.colors.textMain, marginBottom: 20 },
  placeholderBox: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background, borderRadius: 12 },
  placeholderText: { marginTop: 12, color: theme.colors.textMuted, fontSize: 13, fontWeight: '700' }
});

export default ReportsHome;
