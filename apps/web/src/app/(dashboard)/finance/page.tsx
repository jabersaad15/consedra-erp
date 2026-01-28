'use client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '@/lib/api';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Plus, DollarSign, TrendingUp, TrendingDown, Receipt } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';

export default function FinancePage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data } = useQuery({
    queryKey: ['expenses', page, search],
    queryFn: () => api.get('/api/finance/expenses', { params: { page, limit: 20, search } }).then(r => r.data),
  });

  const columns = [
    { key: 'description', header: 'الوصف' },
    { key: 'amount', header: 'المبلغ', render: (item: Record<string, any>) => `${item.amount?.toLocaleString('ar-SA')} ر.س` },
    { key: 'status', header: 'الحالة', render: (item: Record<string, any>) => (
      <span className={`px-2 py-1 rounded-full text-xs ${item.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
        {item.status === 'APPROVED' ? 'معتمد' : item.status === 'PENDING' ? 'معلق' : item.status}
      </span>
    )},
    { key: 'date', header: 'التاريخ', render: (item: Record<string, any>) => item.date ? new Date(item.date).toLocaleDateString('ar-SA') : '-' },
  ];

  return (
    <div>
      <PageHeader title="المالية" description="إدارة المصروفات والإيرادات والتقارير المالية" actions={<Button><Plus className="w-4 h-4 ml-2" />مصروف جديد</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="إجمالي الإيرادات" value="2.4M ر.س" change="+12%" trend="up" icon={<TrendingUp className="w-6 h-6" />} />
        <StatCard title="إجمالي المصروفات" value="890K ر.س" change="+5%" trend="down" icon={<TrendingDown className="w-6 h-6" />} />
        <StatCard title="صافي الربح" value="1.5M ر.س" change="+18%" trend="up" icon={<DollarSign className="w-6 h-6" />} />
        <StatCard title="مصروفات معلقة" value="15" icon={<Receipt className="w-6 h-6" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-card rounded-xl border p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">المصروفات الأخيرة</h3>
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
          <h3 className="text-lg font-semibold mb-4">توزيع المصروفات</h3>
          {[
            { category: 'الرواتب', amount: '450K', percent: 50 },
            { category: 'المواد الخام', amount: '200K', percent: 22 },
            { category: 'الإيجار', amount: '120K', percent: 13 },
            { category: 'المرافق', amount: '80K', percent: 9 },
            { category: 'التسويق', amount: '40K', percent: 6 },
          ].map((item, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>{item.category}</span>
                <span className="font-semibold">{item.amount} ر.س</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-brand-500 h-2 rounded-full" style={{ width: `${item.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
