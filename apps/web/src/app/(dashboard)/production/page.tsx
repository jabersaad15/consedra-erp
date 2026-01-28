'use client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '@/lib/api';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Plus, Factory, CheckCircle, Clock, Package } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';

export default function ManufacturingProductionPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data } = useQuery({
    queryKey: ['productionOrders', page, search],
    queryFn: () => api.get('/api/production/orders', { params: { page, limit: 20, search } }).then(r => r.data),
  });

  const statusMap: Record<string, { label: string; color: string }> = {
    PLANNED: { label: 'مخطط', color: 'bg-gray-100 text-gray-700' },
    IN_PROGRESS: { label: 'قيد التنفيذ', color: 'bg-blue-100 text-blue-700' },
    COMPLETED: { label: 'مكتمل', color: 'bg-green-100 text-green-700' },
    CANCELLED: { label: 'ملغي', color: 'bg-red-100 text-red-700' },
  };

  const columns = [
    { key: 'number', header: 'رقم الأمر' },
    { key: 'status', header: 'الحالة', render: (item: Record<string, any>) => {
      const s = statusMap[item.status] || { label: item.status, color: 'bg-gray-100' };
      return <span className={`px-2 py-1 rounded-full text-xs ${s.color}`}>{s.label}</span>;
    }},
    { key: 'quantity', header: 'الكمية المطلوبة' },
    { key: 'batchNumber', header: 'رقم الدفعة' },
    { key: 'yieldQuantity', header: 'الكمية المنتجة' },
  ];

  return (
    <div>
      <PageHeader title="الإنتاج والتصنيع" description="إدارة أوامر الإنتاج والوصفات" actions={<Button><Plus className="w-4 h-4 ml-2" />أمر إنتاج جديد</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="أوامر الإنتاج" value="15" icon={<Factory className="w-6 h-6" />} />
        <StatCard title="قيد التنفيذ" value="5" icon={<Clock className="w-6 h-6" />} />
        <StatCard title="مكتملة" value="10" trend="up" icon={<CheckCircle className="w-6 h-6" />} />
        <StatCard title="الوصفات" value="5" icon={<Package className="w-6 h-6" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-card rounded-xl border p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">أوامر الإنتاج</h3>
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

        <div className="bg-card rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4">الوصفات</h3>
          {[
            { name: 'دجاج مشوي', output: '1 وجبة', materials: 3 },
            { name: 'كبسة', output: '1 طبق', materials: 5 },
            { name: 'مشويات مشكلة', output: '1 طبق', materials: 6 },
            { name: 'حمص', output: '500 جم', materials: 4 },
            { name: 'فتوش', output: '1 طبق', materials: 8 },
          ].map((recipe, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg mb-2">
              <div>
                <span className="text-sm font-medium">{recipe.name}</span>
                <span className="text-xs text-muted-foreground block">الناتج: {recipe.output}</span>
              </div>
              <span className="text-xs text-muted-foreground">{recipe.materials} مكونات</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
