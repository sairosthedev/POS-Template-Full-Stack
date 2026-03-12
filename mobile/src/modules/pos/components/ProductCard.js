import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../../utils/theme';

export const ProductCard = ({ product, onPress }) => {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = !isOutOfStock && product.stock <= (product.stockAlert || 5);

  return (
    <TouchableOpacity 
      style={[styles.card, isOutOfStock && styles.outOfStock]} 
      onPress={() => !isOutOfStock && onPress(product)}
      activeOpacity={0.7}
    >
      <View style={styles.badgeContainer}>
        <View style={[
          styles.badge, 
          { backgroundColor: isOutOfStock ? theme.colors.danger + '10' : theme.colors.primary + '10' }
        ]}>
          <Text style={[
            styles.badgeText, 
            { color: isOutOfStock ? theme.colors.danger : theme.colors.primary }
          ]}>
            {product.category}
          </Text>
        </View>
      </View>

      <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
      
      <View style={styles.footer}>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        <Text style={[
          styles.stock,
          isLowStock && { color: theme.colors.warning, fontWeight: '900' },
          isOutOfStock && { color: theme.colors.danger, fontWeight: '900' }
        ]}>
          {isOutOfStock ? 'OUT' : `${product.stock} left`}
        </Text>
      </View>

      {/* Modern accent bar */}
      <View style={[
        styles.accent, 
        { backgroundColor: isOutOfStock ? theme.colors.danger : isLowStock ? theme.colors.warning : theme.colors.primary }
      ]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.roundness.lg,
    padding: theme.spacing.md,
    margin: 6,
    flex: 1,
    minHeight: 140,
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  outOfStock: {
    opacity: 0.6,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.roundness.sm,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.textMain,
    lineHeight: 18,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 16,
    fontWeight: '900',
    color: theme.colors.textMain,
  },
  stock: {
    fontSize: 10,
    color: theme.colors.textMuted,
    fontWeight: '700',
  },
  accent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
  }
});
