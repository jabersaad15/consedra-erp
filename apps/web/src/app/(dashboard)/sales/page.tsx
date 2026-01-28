'use client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '@/lib/api';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, DollarSign, ShoppingBag, Building2 } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';

export default function SalesRevenuePage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data } = useQuery({
    queryKey: ['salesSummaries', page, search],
    queryFn: () => api.get('/api/sales/summaries', { params: { page, limit: 20, search } }).then(r => r.data),
  });

  const columns = [
    { key: 'branchId', header: 'الفرع' },
    { key: 'date', header: 'التاريخ', render: (item: Record<string, any>) => item.date ? new Date(item.date).toLocaleDateString('ar-SA') : '-' },
    { key: 'totalSales', header: 'إجمالي المبيعات', render: (item: Record<string, any>) => `${item.totalSales?.toLocaleString('ar-SA')} ر.س` },
    { key: 'totalOrders', header: 'عدد الطلبات' },
  ];

  return (
    <div>
      <PageHeader title="المبيعات" description="تقارير المبيعات والإيرادات" actions={<Button><Plus className="w-4 h-4 ml-2" />إضافة ملخص</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="مبيعات اليوم" value="85K ر.س" change="+15%" trend="up" icon={<DollarSign className="w-6 h-6" />} />
        <StatCard title="طلبات اليوم" value="156" change="+8%" trend="up" icon={<ShoppingBag className="w-6 h-6" />} />
        <StatCard title="مبيعات الشهر" value="2.4M ر.س" change="+12%" trend="up" icon={<TrendingUp className="w-6 h-6" />} />
        <StatCard title="أفضل فرع" value="العليا" icon={<Building2 className="w-6 h-6" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-card rounded-xl border p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">ملخص المبيعات</h3>
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
          <h3 className="text-lg font-semibold mb-4">مبيعات الفروع</h3>
          {[
            { name: 'فرع العليا', sales: '520K', percent: 22 },
            { name: 'فرع الملز', sales: '410K', percent: 17 },
            { name: 'فرع التحلية', sales: '380K', percent: 16 },
            { name: 'فرع الكورنيش', sales: '350K', percent: 15 },
            { name: 'فرع السليمانية', sales: '320K', percent: 13 },
            { name: 'فرع الحمرا', sales: '280K', percent: 12 },
            { name: 'المطبخ المركزي', sales: '140K', percent: 5 },
          ].map((branch, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>{branch.name}</span>
                <span className="font-semibold">{branch.sales} ر.س</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-brand-500 h-2 rounded-full" style={{ width: `${branch.percent * 4}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
