'use client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '@/lib/api';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

export default function PurchasingPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['purchaseOrders', page, search],
    queryFn: () => api.get('/api/purchasing/orders', { params: { page, limit: 20, search } }).then(r => r.data),
  });

  const columns = [
      { key: 'number', header: 'Number' },
      { key: 'supplierId', header: 'Supplier Id' },
      { key: 'status', header: 'Status' },
      { key: 'totalAmount', header: 'Total Amount' },
      { key: 'createdAt', header: 'Created At' }
  ];

  return (<div>
    <PageHeader title="Purchasing" actions={<Button><Plus className="w-4 h-4 mr-2" />Create</Button>} />
    <DataTable
      columns={columns}
      data={data?.data || []}
      total={data?.meta?.total || 0}
      page={page}
      limit={20}
      onPageChange={setPage}
      onSearch={setSearch}
    />
  </div>);
}