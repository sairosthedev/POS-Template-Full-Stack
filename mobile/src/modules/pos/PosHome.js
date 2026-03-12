import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  Alert, 
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import axios from 'axios';
import { Search, Scan, ShoppingCart, Receipt } from 'lucide-react-native';
import { theme } from '../../utils/theme';
import { Header } from '../../components/layout/Header';
import { Button } from '../../components/ui/Button';
import { ProductCard } from './components/ProductCard';
import { CartItem } from './components/CartItem';
import SunmiPrinter from '../../services/SunmiPrinter';

const API = 'http://localhost:5000/api';

const PosHome = ({ user, token, onLogout }) => {
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
      setProducts(res.data.data || res.data);
    } catch (err) {
      Alert.alert("Network Error", "Could not load products. Please check server.");
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
      const salePayload = {
        cashierId: user.id || user._id,
        items: cart.map(item => ({
          productId: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        paymentMethod: 'Cash',
        total: total
      };

      await axios.post(`${API}/sales`, salePayload);

      // Printer logic
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
        SunmiPrinter.printText("--------------------------------\n\n\n");
        SunmiPrinter.cutPaper();
      } catch (e) { console.log("Print skip", e); }

      Alert.alert("Success", "Sale completed and receipt sent to printer.");
      setCart([]);
      fetchProducts();
    } catch (err) {
      Alert.alert("Checkout Failed", "Could not process sale. Try again.");
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
      <Header user={user} onLogout={onLogout} subtitle="Active Sales Terminal" />
      
      <View style={styles.main}>
        {/* LEFT: Products Area */}
        <View style={styles.productsSection}>
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Search size={18} color={theme.colors.textMuted} />
              <TextInput 
                style={styles.searchInput}
                placeholder="Search products..."
                value={search}
                onChangeText={setSearch}
              />
              <TouchableOpacity style={styles.scanBtn}>
                <Scan size={20} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {loading ? (
            <View style={styles.centered}><ActivityIndicator color={theme.colors.primary} size="large" /></View>
          ) : (
            <FlatList 
              data={filteredProducts}
              numColumns={2}
              keyExtractor={item => item._id}
              renderItem={({ item }) => <ProductCard product={item} onPress={addToCart} />}
              contentContainerStyle={styles.productList}
            />
          )}
        </View>

        {/* RIGHT: Cart Area */}
        <View style={styles.cartSection}>
          <View style={styles.cartHeader}>
            <View style={styles.cartBadge}>
              <ShoppingCart size={16} color={theme.colors.white} />
            </View>
            <Text style={styles.cartTitle}>Quick Cart</Text>
            <View style={styles.itemCount}>
              <Text style={styles.itemCountText}>{cart.length}</Text>
            </View>
          </View>

          <FlatList 
            data={cart}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
              <CartItem item={item} onAdd={addToCart} onRemove={removeFromCart} />
            )}
            style={styles.cartList}
            ListEmptyComponent={
              <View style={styles.emptyCart}>
                <ShoppingCart size={48} color={theme.colors.background} />
                <Text style={styles.emptyText}>Cart is currently empty</Text>
              </View>
            }
          />

          <View style={styles.checkoutSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Grand Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
            
            <Button 
              title="COMPLETE ORDER"
              onPress={handleCheckout}
              loading={submitting}
              disabled={cart.length === 0}
              style={styles.checkoutBtn}
              textStyle={styles.checkoutBtnText}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  main: {
    flex: 1,
    flexDirection: 'row',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Products
  productsSection: {
    flex: 1.6,
    borderRightWidth: 1,
    borderRightColor: theme.colors.border,
  },
  searchContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.white,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.roundness.md,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.textMain,
    marginLeft: 8,
    fontWeight: '600',
  },
  scanBtn: {
    padding: 4,
  },
  productList: {
    padding: 8,
  },

  // Cart
  cartSection: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  cartHeader: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
  },
  cartBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: theme.colors.textMain,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cartTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: theme.colors.textMain,
    flex: 1,
  },
  itemCount: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },
  itemCountText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: '900',
  },
  cartList: {
    flex: 1,
  },
  emptyCart: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyText: {
    marginTop: 16,
    color: theme.colors.textMuted,
    fontSize: 14,
    fontWeight: '700',
  },
  checkoutSection: {
    padding: 20,
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingBottom: Platform.OS === 'ios' ? 20 : 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: theme.colors.textSub,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  totalValue: {
    fontSize: 28,
    fontWeight: '900',
    color: theme.colors.primary,
    letterSpacing: -1,
  },
  checkoutBtn: {
    height: 60,
    borderRadius: theme.roundness.lg,
  },
  checkoutBtnText: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  }
});

export default PosHome;
