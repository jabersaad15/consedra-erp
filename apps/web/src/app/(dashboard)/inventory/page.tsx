'use client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '@/lib/api';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Plus, Package, AlertTriangle, Warehouse, ArrowRightLeft } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';

export default function InventoryPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data } = useQuery({
    queryKey: ['inventoryItems', page, search],
    queryFn: () => api.get('/api/inventory/items', { params: { page, limit: 20, search } }).then(r => r.data),
  });

  const columns = [
    { key: 'name', header: 'اسم الصنف' },
    { key: 'sku', header: 'رمز الصنف' },
    { key: 'unit', header: 'الوحدة' },
    { key: 'minStock', header: 'الحد الأدنى' },
  ];

  return (
    <div>
      <PageHeader title="المخزون" description="إدارة الأصناف والمستودعات" actions={<Button><Plus className="w-4 h-4 ml-2" />صنف جديد</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="إجمالي الأصناف" value="20" icon={<Package className="w-6 h-6" />} />
        <StatCard title="تنبيهات المخزون" value="4" trend="down" icon={<AlertTriangle className="w-6 h-6" />} />
        <StatCard title="المستودعات" value="7" icon={<Warehouse className="w-6 h-6" />} />
        <StatCard title="عمليات النقل" value="12" icon={<ArrowRightLeft className="w-6 h-6" />} />
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        total={data?.meta?.total || 0}
        page={page}
        limit={20}
        onPageChange={setPage}
        onSearch={setSearch}
      />
    </div>
  );
}
