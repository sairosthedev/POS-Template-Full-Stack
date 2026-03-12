import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LogOut } from 'lucide-react-native';
import { theme } from '../../utils/theme';

export const Header = ({ title, subtitle, onLogout, user }) => {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>{title || user?.name || 'User'}</Text>
        <Text style={styles.subtitle}>{subtitle || 'Terminal #1'}</Text>
      </View>
      {onLogout && (
        <TouchableOpacity onPress={onLogout} style={styles.logoutBtn} activeOpacity={0.7}>
          <LogOut size={20} color={theme.colors.textSub} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 70,
    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    elevation: 2,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: theme.colors.textMain,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 10,
    color: theme.colors.textSub,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    letterSpacing: 1,
    marginTop: 2,
  },
  logoutBtn: {
    width: 40,
    height: 40,
    borderRadius: theme.roundness.md,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
