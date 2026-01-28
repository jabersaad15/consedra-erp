import React from 'react';
import { useList } from '../../hooks/useQuery';
import { ListScreen } from '../../components/ListScreen';
import { RowCard } from '../../components/RowCard';

export default function Inventory() {
  const { data, isLoading } = useList('inventory', '/api/inventory');
  return (
    <ListScreen
      title="Inventory Items"
      data={data}
      isLoading={isLoading}
      keyExtractor={(i: any) => i.id}
      renderItem={(i: any) => <RowCard title={i.name} subtitle={i.sku} right={i.unit} />}
    />
  );
}
