import React from 'react';
import { Stack } from 'expo-router';
import { useList } from '../hooks/useQuery';
import { ListScreen } from '../components/ListScreen';
import { RowCard } from '../components/RowCard';

export default function ProjectsScreen() {
  const { data, isLoading } = useList('projects', '/api/projects');
  return (
    <>
      <Stack.Screen options={{ title: 'Projects' }} />
      <ListScreen
        title="Projects"
        data={data}
        isLoading={isLoading}
        keyExtractor={(i: any) => i.id}
        renderItem={(i: any) => <RowCard title={String(i.name || '')} subtitle={String(i.status || '')}  />}
      />
    </>
  );
}
