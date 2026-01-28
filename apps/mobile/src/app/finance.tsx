import React from 'react';
import { Stack } from 'expo-router';
import { useList } from '../hooks/useQuery';
import { ListScreen } from '../components/ListScreen';
import { RowCard } from '../components/RowCard';

export default function FinanceScreen() {
  const { data, isLoading } = useList('finance', '/api/expenses');
  return (
    <>
      <Stack.Screen options={{ title: 'Expenses' }} />
      <ListScreen
        title="Expenses"
        data={data}
        isLoading={isLoading}
        keyExtractor={(i: any) => i.id}
        renderItem={(i: any) => <RowCard title={String(i.description || '')} subtitle={String(i.category || '')} right={String(i.amount || '')} />}
      />
    </>
  );
}
