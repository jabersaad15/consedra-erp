import React from 'react';
import { Stack } from 'expo-router';
import { useList } from '../hooks/useQuery';
import { ListScreen } from '../components/ListScreen';
import { RowCard } from '../components/RowCard';

export default function PurchasingScreen() {
  const { data, isLoading } = useList('purchasing', '/api/purchase-orders');
  return (
    <>
      <Stack.Screen options={{ title: 'Purchase Orders' }} />
      <ListScreen
        title="Purchase Orders"
        data={data}
        isLoading={isLoading}
        keyExtractor={(i: any) => i.id}
        renderItem={(i: any) => <RowCard title={String(i.poNumber || '')} subtitle={String(i.status || '')} right={String(i.totalAmount || '')} />}
      />
    </>
  );
}
