import React from 'react';
import { Stack } from 'expo-router';
import { useList } from '../hooks/useQuery';
import { ListScreen } from '../components/ListScreen';
import { RowCard } from '../components/RowCard';

export default function ProductionScreen() {
  const { data, isLoading } = useList('production', '/api/production-orders');
  return (
    <>
      <Stack.Screen options={{ title: 'Production Orders' }} />
      <ListScreen
        title="Production Orders"
        data={data}
        isLoading={isLoading}
        keyExtractor={(i: any) => i.id}
        renderItem={(i: any) => <RowCard title={String(i.orderNumber || '')} subtitle={String(i.status || '')}  />}
      />
    </>
  );
}
