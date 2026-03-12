import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  SafeAreaView,
  Alert
} from 'react-native';
import axios from 'axios';
import { theme } from '../../utils/theme';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

const API = 'http://localhost:5000/api'; // Use your machine's IP for real device testing

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API}/auth/login`, { email, password });
      onLoginSuccess(res.data.data.user, res.data.data.token);
    } catch (err) {
      Alert.alert(
        'Login Failed', 
        err.response?.data?.message || 'Unable to connect to server'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>M</Text>
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your POS terminal</Text>
          </View>

          <Card style={styles.formCard}>
            <Input
              label="Email Address"
              placeholder="admin@miccspos.co.zw"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            
            <Input
              label="Access Key"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Button
              title="Sign In to Terminal"
              onPress={handleLogin}
              loading={loading}
              style={styles.loginBtn}
            />
          </Card>

          <Text style={styles.footerText}>
            Miccs POS Mobile Suite • v1.0.0
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 70,
    height: 70,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.roundness.lg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
    marginBottom: 20,
  },
  logoText: {
    color: theme.colors.white,
    fontSize: 32,
    fontWeight: '900',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: theme.colors.textMain,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSub,
    marginTop: 4,
    fontWeight: '500',
  },
  formCard: {
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.white,
  },
  loginBtn: {
    marginTop: 20,
  },
  footerText: {
    textAlign: 'center',
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 40,
  }
});

export default Login;
