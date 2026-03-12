import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';

const API = 'http://localhost:5000/api'; // In real device use your local IP, e.g. 192.168.1.x

const LoginScreen = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API}/auth/login`, { email, password });
      onLoginSuccess(res.data.user, res.data.token);
    } catch (err) {
      Alert.alert('Login Failed', err.response?.data?.message || 'Check your internet connection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>M</Text>
        </View>
        <Text style={styles.title}>MICCS POS</Text>
        <Text style={styles.subtitle}>Mobile Terminal</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="email@example.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Sign In</Text>}
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>© 2026 Miccs Technologies</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 20, justifyContent: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logo: { width: 80, height: 80, backgroundColor: '#1d4ed8', borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 10 },
  logoText: { color: 'white', fontSize: 40, fontWeight: 'black' },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 15, color: '#1e293b' },
  subtitle: { color: '#64748b' },
  form: { backgroundColor: 'white', padding: 25, borderRadius: 20, elevation: 2 },
  label: { fontSize: 14, color: '#64748b', marginBottom: 8, marginTop: 15 },
  input: { borderBottomWidth: 1, borderColor: '#e2e8f0', paddingVertical: 10, fontSize: 16, color: '#1e293b' },
  button: { backgroundColor: '#1d4ed8', padding: 18, borderRadius: 12, marginTop: 30, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#93c5fd' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  footer: { textAlign: 'center', color: '#94a3b8', fontSize: 12, marginTop: 40 }
});

export default LoginScreen;
