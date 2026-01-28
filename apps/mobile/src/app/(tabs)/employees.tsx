import React from 'react';
import { useList } from '../../hooks/useQuery';
import { ListScreen } from '../../components/ListScreen';
import { RowCard } from '../../components/RowCard';

export default function Employees() {
  const { data, isLoading } = useList('employees', '/api/employees');
  return (
    <ListScreen
      title="Employees"
      data={data}
      isLoading={isLoading}
      keyExtractor={(e: any) => e.id}
      renderItem={(e: any) => <RowCard title={e.firstName + ' ' + e.lastName} subtitle={e.position || e.department} right={e.status} />}
    />
  );
}
