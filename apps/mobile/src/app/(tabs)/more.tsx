import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../lib/auth';

const links = [
  { label: 'Projects', href: '/projects' },
  { label: 'Purchasing', href: '/purchasing' },
  { label: 'CRM', href: '/crm' },
  { label: 'Finance', href: '/finance' },
  { label: 'Quality', href: '/quality' },
  { label: 'Production', href: '/production' },
  { label: 'IT Support', href: '/support' },
  { label: 'Approvals', href: '/approvals' },
];

export default function More() {
  const { logout, user } = useAuth();
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>More</Text>
      <Text style={styles.user}>{user?.email}</Text>
      {links.map(l => (
        <TouchableOpacity key={l.href} style={styles.link} onPress={() => router.push(l.href as any)}>
          <Text style={styles.linkText}>{l.label}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.logout} onPress={() => { logout(); router.replace('/login'); }}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  title: { fontSize: 22, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  user: { fontSize: 13, color: '#64748B', marginBottom: 20 },
  link: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 8 },
  linkText: { fontSize: 15, fontWeight: '600', color: '#0F172A' },
  logout: { backgroundColor: '#FEE2E2', borderRadius: 10, padding: 16, marginTop: 16, alignItems: 'center' },
  logoutText: { fontSize: 15, fontWeight: '700', color: '#EF4444' },
});
