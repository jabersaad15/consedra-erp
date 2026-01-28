import React from 'react';
import { Stack } from 'expo-router';
import { useList } from '../hooks/useQuery';
import { ListScreen } from '../components/ListScreen';
import { RowCard } from '../components/RowCard';

export default function QualityScreen() {
  const { data, isLoading } = useList('quality', '/api/quality-checklists');
  return (
    <>
      <Stack.Screen options={{ title: 'Quality Checklists' }} />
      <ListScreen
        title="Quality Checklists"
        data={data}
        isLoading={isLoading}
        keyExtractor={(i: any) => i.id}
        renderItem={(i: any) => <RowCard title={String(i.name || '')} subtitle={String(i.status || '')}  />}
      />
    </>
  );
}
