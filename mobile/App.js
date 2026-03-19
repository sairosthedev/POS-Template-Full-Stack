import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import { store } from './store';
import { initDb } from './services/db';
import { useSelector } from 'react-redux';

import AuthScreen from './modules/auth/AuthScreen';
import SalesScreen from './modules/sales/SalesScreen';
import CartScreen from './modules/cart/CartScreen';
import ProductsScreen from './modules/products/ProductsScreen';
import InventoryScreen from './modules/inventory/InventoryScreen';
import ReportsScreen from './modules/reports/ReportsScreen';
import SettingsScreen from './modules/settings/SettingsScreen';
import UsersScreen from './modules/users/UsersScreen';
import { theme } from './ui/theme';
import { Ionicons } from '@expo/vector-icons';
import ScanScreen from './modules/scan/ScanScreen';
import NetInfo from '@react-native-community/netinfo';
import { syncNow } from './state/syncSlice';
import { hydrateAuth } from './state/authSlice';
import ReceiptScreen from './modules/sales/ReceiptScreen';

const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();

function MainTabs() {
  const role = String(useSelector((s) => s.auth.user?.role || '')).toLowerCase();
  const isCashier = role === 'cashier';
  const isManager = role === 'manager';
  const isAdmin = role === 'admin';

  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.bg,
          borderTopColor: theme.colors.border,
        },
        tabBarActiveTintColor: theme.colors.gold,
        tabBarInactiveTintColor: theme.colors.muted,
      }}>
      <Tabs.Screen
        name="Sell"
        component={ProductsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} />,
        }}
      />
      {!isCashier ? (
        <Tabs.Screen
          name="Inventory"
          component={InventoryScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="cube-outline" size={size} color={color} />,
          }}
        />
      ) : null}
      {!isCashier ? (
        <Tabs.Screen
          name="Reports"
          component={ReportsScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="bar-chart-outline" size={size} color={color} />,
          }}
        />
      ) : null}
      {isAdmin || isManager ? (
        <Tabs.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
          }}
        />
      ) : null}
    </Tabs.Navigator>
  );
}

function RootStack() {
  const token = useSelector((s) => s.auth.token);
  const hydrated = useSelector((s) => s.auth.hydrated);

  // Avoid flashing the wrong navigator before SecureStore loads
  if (!hydrated) return null;

  return (
    <Stack.Navigator initialRouteName={token ? 'Main' : 'Auth'}>
      <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />

      {token ? (
        <>
          <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen name="Cart" component={CartScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Scan" component={ScanScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Receipt" component={ReceiptScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Users" component={UsersScreen} options={{ headerShown: false }} />
        </>
      ) : null}
    </Stack.Navigator>
  );
}

export default function App() {
  React.useEffect(() => {
    initDb().catch(() => {
      // keep app running; errors will show in console
    });
  }, []);

  React.useEffect(() => {
    store.dispatch(hydrateAuth());
  }, []);

  React.useEffect(() => {
    const unsub = NetInfo.addEventListener((state) => {
      if (state.isConnected && state.isInternetReachable !== false) {
        store.dispatch(syncNow());
      }
    });
    return () => unsub();
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </Provider>
  );
}
