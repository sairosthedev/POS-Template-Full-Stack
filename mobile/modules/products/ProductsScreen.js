import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { loadLocalProducts, refreshProducts } from '../../state/productsSlice';
import { addToCart } from '../../state/cartSlice';
import { logout } from '../../state/authSlice';
import { Screen } from '../../ui/Screen';
import { PrimaryButton } from '../../ui/PrimaryButton';
import { theme } from '../../ui/theme';
import { HeaderBar } from '../../ui/HeaderBar';
import { SearchBar } from '../../ui/SearchBar';
import { ProductCard } from '../../ui/ProductCard';
import { getProductByBarcode } from '../../services/db';

export default function ProductsScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const items = useSelector((s) => s.products.items);
  const status = useSelector((s) => s.products.status);
  const warning = useSelector((s) => s.products.warning);
  const cartCount = useSelector((s) => s.cart.items.length);
  const cartTotal = useSelector((s) => s.cart.total);

  const [query, setQuery] = React.useState('');

  React.useEffect(() => {
    dispatch(loadLocalProducts());
    dispatch(refreshProducts());
  }, [dispatch]);

  React.useEffect(() => {
    const code = route?.params?.scannedCode;
    if (!code) return;
    setQuery(String(code));
    (async () => {
      const p = await getProductByBarcode(String(code));
      if (p?._id) {
        dispatch(
          addToCart({
            productId: String(p._id),
            name: p.name,
            price: Number(p.price),
          }),
        );
      }
      navigation.setParams({ scannedCode: undefined });
    })();
  }, [route?.params?.scannedCode, dispatch, navigation]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = items;
    if (!q) return list;
    return list.filter((p) => {
      const name = String(p.name || '').toLowerCase();
      const bc = String(p.barcode || '').toLowerCase();
      return name.includes(q) || bc.includes(q);
    });
  }, [items, query]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <HeaderBar
        rightIcon="cart-outline"
        onRightPress={() => navigation.navigate('Cart')}
        badgeCount={cartCount}
      />
      <View style={{ paddingHorizontal: theme.space.md, paddingTop: theme.space.sm }}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search product or barcode" />
      </View>

      <View style={{ flex: 1, paddingHorizontal: theme.space.md, paddingTop: theme.space.sm }}>
        {warning ? <Text style={{ color: theme.colors.danger, marginBottom: 10 }}>{String(warning)}</Text> : null}

        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item._id)}
          numColumns={2}
          columnWrapperStyle={{ gap: 10 }}
          contentContainerStyle={{ gap: 10, paddingBottom: 10 }}
          renderItem={({ item }) => (
            <ProductCard
              name={item.name}
              price={item.price}
              onAdd={() =>
                dispatch(
                  addToCart({
                    productId: String(item._id),
                    name: item.name,
                    price: Number(item.price),
                  }),
                )
              }
            />
          )}
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 10,
          padding: theme.space.md,
          backgroundColor: 'rgba(7, 18, 37, 0.92)',
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
        }}>
        <View style={{ flexGrow: 1, flexBasis: '48%' }}>
          <PrimaryButton title="Scan" tone="gold" onPress={() => navigation.navigate('Scan')} />
        </View>
        <View style={{ flexGrow: 1, flexBasis: '48%' }}>
          <PrimaryButton
            title={`Cart (${cartCount})  $${Number(cartTotal).toFixed(2)}`}
            disabled={cartCount === 0}
            onPress={() => navigation.navigate('Cart')}
          />
        </View>
        <View style={{ flexGrow: 1, flexBasis: '48%' }}>
          <PrimaryButton
            title={status === 'loading' ? 'Syncing…' : 'Refresh'}
            loading={status === 'loading'}
            onPress={() => dispatch(refreshProducts())}
          />
        </View>
        <View style={{ flexGrow: 1, flexBasis: '48%' }}>
          <PrimaryButton
            title="Logout"
            tone="danger"
            onPress={() => {
              dispatch(logout());
              navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
            }}
          />
        </View>
      </View>
    </View>
  );
}
