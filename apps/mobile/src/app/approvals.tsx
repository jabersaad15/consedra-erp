import React from 'react';
import { Stack } from 'expo-router';
import { useList } from '../hooks/useQuery';
import { ListScreen } from '../components/ListScreen';
import { RowCard } from '../components/RowCard';

export default function ApprovalsScreen() {
  const { data, isLoading } = useList('approvals', '/api/approvals');
  return (
    <>
      <Stack.Screen options={{ title: 'Approvals' }} />
      <ListScreen
        title="Approvals"
        data={data}
        isLoading={isLoading}
        keyExtractor={(i: any) => i.id}
        renderItem={(i: any) => <RowCard title={String(i.id || '')} subtitle={String(i.status || '')} right={String(i.type || '')} />}
      />
    </>
  );
}
