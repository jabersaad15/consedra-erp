'use client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '@/lib/api';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

export default function OperationsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['checklists', page, search],
    queryFn: () => api.get('/api/operations/checklists', { params: { page, limit: 20, search } }).then(r => r.data),
  });

  const columns = [
      { key: 'title', header: 'Title' },
      { key: 'branchId', header: 'Branch Id' },
      { key: 'frequency', header: 'Frequency' },
      { key: 'completedAt', header: 'Completed At' },
      { key: 'createdAt', header: 'Created At' }
  ];

  return (<div>
    <PageHeader title="Operations" actions={<Button><Plus className="w-4 h-4 mr-2" />Create</Button>} />
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