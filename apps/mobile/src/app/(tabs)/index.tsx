import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { useAuth } from '../../lib/auth';
import { StatCard } from '../../components/StatCard';
import { useList } from '../../hooks/useQuery';

export default function Dashboard() {
  const { user } = useAuth();
  const { data: employees } = useList('employees', '/api/employees');
  const { data: tasks } = useList('tasks', '/api/tasks');
  const { data: branches } = useList('branches', '/api/branches');
  const { data: approvals } = useList('approvals', '/api/approvals');

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.greeting}>Welcome, {user?.firstName || 'Admin'}</Text>
      <StatCard title="Employees" value={employees?.length ?? '—'} color="#6366F1" />
      <StatCard title="Tasks" value={tasks?.length ?? '—'} color="#F59E0B" />
      <StatCard title="Branches" value={branches?.length ?? '—'} color="#10B981" />
      <StatCard title="Pending Approvals" value={approvals?.length ?? '—'} color="#EF4444" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  greeting: { fontSize: 20, fontWeight: '700', color: '#0F172A', marginBottom: 20 },
});
