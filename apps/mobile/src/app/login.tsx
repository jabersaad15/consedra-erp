import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../lib/auth';
import { router } from 'expo-router';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@consedra.local');
  const [password, setPassword] = useState('Admin123!');
  const [tenant, setTenant] = useState('consedra');
  const [busy, setBusy] = useState(false);

  const handle = async () => {
    setBusy(true);
    try {
      await login(email, password, tenant);
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Login Failed', e.message);
    } finally { setBusy(false); }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>Consedra Admin</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="Tenant slug" value={tenant} onChangeText={setTenant} autoCapitalize="none" />
      <TouchableOpacity style={styles.btn} onPress={handle} disabled={busy}>
        <Text style={styles.btnText}>{busy ? 'Signing in...' : 'Sign In'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#0F172A' },
  brand: { fontSize: 28, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 40 },
  input: { backgroundColor: '#1E293B', color: '#fff', borderRadius: 10, padding: 14, marginBottom: 12, fontSize: 15 },
  btn: { backgroundColor: '#6366F1', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
