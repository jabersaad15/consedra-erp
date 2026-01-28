import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props { title: string; value: string | number; color?: string; }

export function StatCard({ title, value, color = '#6366F1' }: Props) {
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderLeftWidth: 4, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  value: { fontSize: 28, fontWeight: '700', color: '#0F172A' },
  title: { fontSize: 13, color: '#64748B', marginTop: 4 },
});
