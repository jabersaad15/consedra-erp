import React from 'react';
import { Stack } from 'expo-router';
import { useList } from '../hooks/useQuery';
import { ListScreen } from '../components/ListScreen';
import { RowCard } from '../components/RowCard';

export default function SupportScreen() {
  const { data, isLoading } = useList('support', '/api/support-tickets');
  return (
    <>
      <Stack.Screen options={{ title: 'IT Support Tickets' }} />
      <ListScreen
        title="IT Support Tickets"
        data={data}
        isLoading={isLoading}
        keyExtractor={(i: any) => i.id}
        renderItem={(i: any) => <RowCard title={String(i.subject || '')} subtitle={String(i.status || '')} right={String(i.priority || '')} />}
      />
    </>
  );
}
