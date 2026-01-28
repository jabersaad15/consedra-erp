'use client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '@/lib/api';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

export default function ITHelpdeskPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['supportTickets', page, search],
    queryFn: () => api.get('/api/it/tickets', { params: { page, limit: 20, search } }).then(r => r.data),
  });

  const columns = [
      { key: 'number', header: 'Number' },
      { key: 'title', header: 'Title' },
      { key: 'category', header: 'Category' },
      { key: 'status', header: 'Status' },
      { key: 'priority', header: 'Priority' }
  ];

  return (<div>
    <PageHeader title="IT Helpdesk" actions={<Button><Plus className="w-4 h-4 mr-2" />Create</Button>} />
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