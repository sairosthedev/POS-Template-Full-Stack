import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { theme } from '../../utils/theme';
import { Header } from '../../components/layout/Header';
import { Card } from '../../components/ui/Card';
import { Box, AlertTriangle } from 'lucide-react-native';

const InventoryHome = ({ user }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Header user={user} title="Stock Inventory" subtitle="Stock Count & Alerts" />
      <View style={styles.content}>
        <Card style={styles.alertCard}>
          <AlertTriangle color={theme.colors.warning} size={20} />
          <View>
            <Text style={styles.alertTitle}>Low Stock Warning</Text>
            <Text style={styles.alertSub}>3 items are below critical levels</Text>
          </View>
        </Card>
        
        <View style={styles.emptyState}>
          <Box size={48} color={theme.colors.border} />
          <Text style={styles.emptyText}>Stock details will appear here</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: 16, flex: 1 },
  alertCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderLeftWidth: 4, borderLeftColor: theme.colors.warning, marginBottom: 16 },
  alertTitle: { fontSize: 14, fontWeight: '900', color: theme.colors.textMain },
  alertSub: { fontSize: 12, color: theme.colors.textSub, fontWeight: '500' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { marginTop: 16, color: theme.colors.textMuted, fontSize: 14, fontWeight: '700' }
});

export default InventoryHome;
