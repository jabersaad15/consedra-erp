'use client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '@/lib/api';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

export default function IntegrationHubPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['integrations', page, search],
    queryFn: () => api.get('/api/integrations', { params: { page, limit: 20, search } }).then(r => r.data),
  });

  const columns = [
      { key: 'name', header: 'Name' },
      { key: 'type', header: 'Type' },
      { key: 'isActive', header: 'Is Active' }
  ];

  return (<div>
    <PageHeader title="Integration Hub" actions={<Button><Plus className="w-4 h-4 mr-2" />Create</Button>} />
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