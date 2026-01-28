'use client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '@/lib/api';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Plus, Megaphone, Tag, TrendingUp, Users } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';

export default function MarketingPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data } = useQuery({
    queryKey: ['campaigns', page, search],
    queryFn: () => api.get('/api/marketing/campaigns', { params: { page, limit: 20, search } }).then(r => r.data),
  });

  const statusMap: Record<string, { label: string; color: string }> = {
    DRAFT: { label: 'مسودة', color: 'bg-gray-100 text-gray-700' },
    ACTIVE: { label: 'نشطة', color: 'bg-green-100 text-green-700' },
    ENDED: { label: 'منتهية', color: 'bg-blue-100 text-blue-700' },
    PAUSED: { label: 'متوقفة', color: 'bg-yellow-100 text-yellow-700' },
  };

  const columns = [
    { key: 'name', header: 'اسم الحملة' },
    { key: 'type', header: 'النوع', render: (item: Record<string, any>) => item.type === 'DISCOUNT' ? 'خصم' : item.type === 'PROMOTION' ? 'عرض' : item.type },
    { key: 'status', header: 'الحالة', render: (item: Record<string, any>) => {
      const s = statusMap[item.status] || { label: item.status, color: 'bg-gray-100' };
      return <span className={`px-2 py-1 rounded-full text-xs ${s.color}`}>{s.label}</span>;
    }},
    { key: 'startDate', header: 'تاريخ البدء', render: (item: Record<string, any>) => item.startDate ? new Date(item.startDate).toLocaleDateString('ar-SA') : '-' },
    { key: 'budget', header: 'الميزانية', render: (item: Record<string, any>) => item.budget ? `${item.budget?.toLocaleString('ar-SA')} ر.س` : '-' },
  ];

  return (
    <div>
      <PageHeader title="التسويق" description="إدارة الحملات والكوبونات" actions={<Button><Plus className="w-4 h-4 ml-2" />حملة جديدة</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="الحملات النشطة" value="10" icon={<Megaphone className="w-6 h-6" />} />
        <StatCard title="الكوبونات" value="15" icon={<Tag className="w-6 h-6" />} />
        <StatCard title="نسبة التحويل" value="8.5%" trend="up" icon={<TrendingUp className="w-6 h-6" />} />
        <StatCard title="العملاء الجدد" value="245" change="+12% هذا الشهر" trend="up" icon={<Users className="w-6 h-6" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-card rounded-xl border p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">الحملات التسويقية</h3>
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
          <h3 className="text-lg font-semibold mb-4">أفضل الكوبونات</h3>
          {[
            { code: 'COUP001', discount: '5%', used: 45, max: 100 },
            { code: 'COUP002', discount: '10%', used: 38, max: 100 },
            { code: 'COUP003', discount: '15%', used: 27, max: 100 },
            { code: 'COUP004', discount: '20%', used: 15, max: 100 },
          ].map((coupon, i) => (
            <div key={i} className="p-3 bg-muted/50 rounded-lg mb-2">
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-sm font-semibold">{coupon.code}</span>
                <span className="text-sm font-semibold text-brand-600">{coupon.discount}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div className="bg-brand-500 h-2 rounded-full" style={{ width: `${(coupon.used / coupon.max) * 100}%` }} />
                </div>
                <span className="text-xs text-muted-foreground">{coupon.used}/{coupon.max}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
