import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { theme } from '../../../utils/theme';

export const CartItem = ({ item, onAdd, onRemove }) => {
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.price}>${(item.price * item.quantity).toFixed(2)}</Text>
      </View>
      
      <View style={styles.controls}>
        <TouchableOpacity 
          style={styles.btn} 
          onPress={() => onRemove(item._id)}
          activeOpacity={0.6}
        >
          <Minus size={16} color={theme.colors.textMain} />
        </TouchableOpacity>
        
        <Text style={styles.qty}>{item.quantity}</Text>
        
        <TouchableOpacity 
          style={[styles.btn, styles.btnPrimary]} 
          onPress={() => onAdd(item)}
          activeOpacity={0.6}
        >
          <Plus size={16} color={theme.colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
    backgroundColor: theme.colors.white,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textMain,
    flex: 1,
    marginRight: 10,
  },
  price: {
    fontSize: 14,
    fontWeight: '900',
    color: theme.colors.primary,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  btn: {
    width: 32,
    height: 32,
    borderRadius: theme.roundness.md,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: {
    backgroundColor: theme.colors.primary,
  },
  qty: {
    fontSize: 15,
    fontWeight: '900',
    color: theme.colors.textMain,
    minWidth: 20,
    textAlign: 'center',
  }
});
