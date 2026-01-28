'use client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '@/lib/api';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

export default function SalesRevenuePage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['salesSummaries', page, search],
    queryFn: () => api.get('/api/sales/summaries', { params: { page, limit: 20, search } }).then(r => r.data),
  });

  const columns = [
      { key: 'branchId', header: 'Branch Id' },
      { key: 'date', header: 'Date' },
      { key: 'totalSales', header: 'Total Sales' },
      { key: 'totalOrders', header: 'Total Orders' }
  ];

  return (<div>
    <PageHeader title="Sales / Revenue" actions={<Button><Plus className="w-4 h-4 mr-2" />Create</Button>} />
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