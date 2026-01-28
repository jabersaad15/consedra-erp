import React from 'react';
import { useList } from '../../hooks/useQuery';
import { ListScreen } from '../../components/ListScreen';
import { RowCard } from '../../components/RowCard';

export default function Tasks() {
  const { data, isLoading } = useList('tasks', '/api/tasks');
  return (
    <ListScreen
      title="Tasks"
      data={data}
      isLoading={isLoading}
      keyExtractor={(t: any) => t.id}
      renderItem={(t: any) => <RowCard title={t.title} subtitle={t.status} right={t.priority} />}
    />
  );
}
