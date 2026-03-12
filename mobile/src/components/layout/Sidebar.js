import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { 
  Home, 
  FileText, 
  Package, 
  Box, 
  Store, 
  Users, 
  HelpCircle, 
  Settings,
  X,
  Receipt
} from 'lucide-react-native';
import { theme } from '../../utils/theme';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.75;

export const Sidebar = ({ isOpen, onClose, activePath, onNavigate }) => {
  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={22} /> },
    { name: 'Reports', path: '/reports', icon: <FileText size={22} /> },
    { name: 'Products', path: '/products', icon: <Package size={22} /> },
    { name: 'Inventory', path: '/inventory', icon: <Box size={22} /> },
    { name: 'Stores', path: '/stores', icon: <Store size={22} /> },
    { name: 'People', path: '/people', icon: <Users size={22} /> },
    { name: 'Expenses', path: '/expenses', icon: <Receipt size={22} /> },
    { name: 'Support', path: '/support', icon: <HelpCircle size={22} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={22} /> },
  ];

  if (!isOpen) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
      <Animated.View style={styles.sidebar}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>M</Text>
            </View>
            <Text style={styles.brand}>Miccs POS</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X size={20} color={theme.colors.textSub} />
          </TouchableOpacity>
        </View>

        <View style={styles.nav}>
          <Text style={styles.sectionTitle}>Main Menu</Text>
          {navItems.map((item) => {
            const isActive = activePath === item.path;
            return (
              <TouchableOpacity 
                key={item.name}
                style={[styles.navItem, isActive && styles.navItemActive]}
                onPress={() => {
                  onNavigate(item.path);
                  onClose();
                }}
              >
                <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
                  {React.cloneElement(item.icon, { 
                    color: isActive ? theme.colors.white : theme.colors.textSub 
                  })}
                </View>
                <Text style={[styles.navText, isActive && styles.navTextActive]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Text style={styles.copy}>© 2026 Miccs Technologies</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    height: '100%',
    backgroundColor: theme.colors.card,
    borderRightWidth: 1,
    borderRightColor: theme.colors.border,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 32,
    height: 32,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: '900',
  },
  brand: {
    fontSize: 18,
    fontWeight: '900',
    color: theme.colors.textMain,
    letterSpacing: -0.5,
  },
  closeBtn: {
    padding: 8,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
  },
  nav: {
    flex: 1,
    paddingHorizontal: 12,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  navItemActive: {
    backgroundColor: theme.colors.primary,
  },
  iconContainer: {
    marginRight: 12,
  },
  navText: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textMain,
  },
  navTextActive: {
    color: theme.colors.white,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  copy: {
    fontSize: 10,
    color: theme.colors.textMuted,
    fontWeight: '700',
    textAlign: 'center',
  }
});
