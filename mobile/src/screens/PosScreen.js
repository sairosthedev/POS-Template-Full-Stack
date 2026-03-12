import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, TextInput, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import SunmiPrinter from '../services/SunmiPrinter';
import { ShoppingCart, LogOut, Search, Scan } from 'lucide-react-native';

const API = 'http://localhost:5000/api';

const PosScreen = ({ user, token, onLogout }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/products`);
      setProducts(res.data);
    } catch (err) {
      Alert.alert("Network Error", "Could not load products. Pull down to refresh.");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item._id === product._id);
    if (existing) {
      setCart(cart.map(item => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    const existing = cart.find(item => item._id === productId);
    if (existing.quantity > 1) {
      setCart(cart.map(item => item._id === productId ? { ...item, quantity: item.quantity - 1 } : item));
    } else {
      setCart(cart.filter(item => item._id !== productId));
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    setSubmitting(true);
    try {
      // 1. Save sale to backend
      const salePayload = {
        cashierId: user._id,
        items: cart.map(item => ({
          productId: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        paymentMethod: 'Cash', // Default to cash for now
      };

      await axios.post(`${API}/sales`, salePayload);

      // 2. Print Receipt via Sunmi Bridge
      try {
        SunmiPrinter.printText("--------------------------------\n");
        SunmiPrinter.printText("        MICCS POS STORE        \n");
        SunmiPrinter.printText("--------------------------------\n");
        SunmiPrinter.printText(`Date: ${new Date().toLocaleString()}\n`);
        SunmiPrinter.printText(`Cashier: ${user.name}\n`);
        SunmiPrinter.printText("--------------------------------\n");

        cart.forEach(item => {
          SunmiPrinter.printText(`${item.name}\n`);
          SunmiPrinter.printText(`${item.quantity} x $${item.price.toFixed(2)}    $${(item.quantity * item.price).toFixed(2)}\n`);
        });

        SunmiPrinter.printText("--------------------------------\n");
        SunmiPrinter.printText(`TOTAL: $${total.toFixed(2)}\n`);
        SunmiPrinter.printText("--------------------------------\n\n");
        SunmiPrinter.printText("     THANK YOU FOR SHOPPING     \n\n\n");
        SunmiPrinter.cutPaper();
      } catch (err) {
        console.log("Printer error", err);
        // We don't alert here because the sale already went through the backend
      }

      Alert.alert("Sale Successful", "Receipt has been printed.");
      setCart([]);
      fetchProducts(); // Refresh stock counts
    } catch (err) {
      Alert.alert("Checkout Failed", err.response?.data?.message || "Internal server error");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    (p.barcode && p.barcode.includes(search))
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.terminalName}>Terminal #1</Text>
        </View>
        <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
          <LogOut size={20} color="#64748b" />
        </TouchableOpacity>
      </View>

      <View style={styles.main}>
        {/* Products Section */}
        <View style={styles.productsArea}>
          <View style={styles.searchBar}>
            <Search size={20} color="#94a3b8" />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search products or scan barcode..."
              value={search}
              onChangeText={setSearch}
            />
            <TouchableOpacity style={styles.scanBtn}>
              <Scan size={20} color="#1d4ed8" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator style={{ marginTop: 50 }} color="#1d4ed8" />
          ) : (
            <FlatList 
              data={filteredProducts}
              numColumns={2}
              keyExtractor={item => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.productCard} onPress={() => addToCart(item)}>
                  <View style={styles.categoryBadge}><Text style={styles.categoryText}>{item.category}</Text></View>
                  <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                  <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
                  <Text style={styles.stockText}>Stock: {item.stock}</Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.productList}
            />
          )}
        </View>

        {/* Cart Section */}
        <View style={styles.cartArea}>
          <View style={styles.cartHeader}>
            <ShoppingCart size={20} color="#1e293b" />
            <Text style={styles.cartTitle}>Current Cart ({cart.length})</Text>
          </View>

          <FlatList 
            data={cart}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <View style={styles.cartItemInfo}>
                  <Text style={styles.cartItemName}>{item.name}</Text>
                  <Text style={styles.cartItemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                </View>
                <View style={styles.qtyControls}>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => removeFromCart(item._id)}>
                    <Text style={styles.qtyBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{item.quantity}</Text>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => addToCart(item)}>
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            ListEmptyComponent={<Text style={styles.emptyCart}>Tap a product to start</Text>}
          />

          <View style={styles.cartFooter}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.checkoutBtn, (cart.length === 0 || submitting) && styles.btnDisabled]} 
              onPress={handleCheckout}
              disabled={cart.length === 0 || submitting}
            >
              {submitting ? <ActivityIndicator color="white" /> : <Text style={styles.checkoutText}>COMPLETE SALE & PRINT</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  header: { padding: 15, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: '#e2e8f0' },
  userName: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  terminalName: { fontSize: 11, color: '#64748b', textTransform: 'uppercase' },
  logoutBtn: { padding: 10 },
  main: { flex: 1, flexDirection: 'row' },
  
  // Products Area
  productsArea: { flex: 1.5, borderRightWidth: 1, borderColor: '#e2e8f0' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', margin: 15, paddingHorizontal: 15, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 14, marginLeft: 10 },
  scanBtn: { padding: 5 },
  productList: { padding: 10 },
  productCard: { flex: 1, backgroundColor: 'white', margin: 5, padding: 15, borderRadius: 12, elevation: 2, borderBottomWidth: 3, borderBottomColor: '#1d4ed8' },
  categoryBadge: { alignSelf: 'flex-start', backgroundColor: '#eff6ff', paddingHorizontal: 8, py: 2, borderRadius: 4, marginBottom: 8 },
  categoryText: { fontSize: 10, color: '#1d4ed8', fontWeight: 'bold' },
  productName: { fontSize: 13, fontWeight: 'bold', color: '#334155', height: 40 },
  productPrice: { fontSize: 16, fontWeight: 'black', color: '#1e293b', marginTop: 5 },
  stockText: { fontSize: 11, color: '#64748b', marginTop: 4 },

  // Cart Area
  cartArea: { flex: 1, backgroundColor: 'white' },
  cartHeader: { padding: 15, flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1, borderColor: '#f1f5f9' },
  cartTitle: { fontSize: 14, fontWeight: 'bold', color: '#1e293b' },
  cartItem: { padding: 15, borderBottomWidth: 1, borderColor: '#f8fafc' },
  cartItemInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  cartItemName: { fontSize: 14, color: '#334155', flex: 1 },
  cartItemPrice: { fontWeight: 'bold', color: '#1e293b' },
  qtyControls: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  qtyBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
  qtyBtnText: { fontSize: 18, color: '#1e293b' },
  qtyText: { fontSize: 14, fontWeight: 'bold' },
  emptyCart: { textAlign: 'center', marginTop: 100, color: '#94a3b8' },

  cartFooter: { padding: 20, borderTopWidth: 1, borderColor: '#f1f5f9' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  totalLabel: { fontSize: 14, color: '#64748b' },
  totalValue: { fontSize: 24, fontWeight: 'black', color: '#1d4ed8' },
  checkoutBtn: { backgroundColor: '#1d4ed8', padding: 18, borderRadius: 12, alignItems: 'center' },
  btnDisabled: { backgroundColor: '#94a3b8' },
  checkoutText: { color: 'white', fontWeight: 'bold', fontSize: 14 }
});

export default PosScreen;
