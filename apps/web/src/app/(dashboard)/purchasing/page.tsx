'use client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '@/lib/api';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Plus, ShoppingCart, Clock, CheckCircle, XCircle } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';

export default function PurchasingPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data } = useQuery({
    queryKey: ['purchaseOrders', page, search],
    queryFn: () => api.get('/api/purchasing/orders', { params: { page, limit: 20, search } }).then(r => r.data),
  });

  const statusMap: Record<string, { label: string; color: string }> = {
    DRAFT: { label: 'مسودة', color: 'bg-gray-100 text-gray-700' },
    SUBMITTED: { label: 'مرسل', color: 'bg-blue-100 text-blue-700' },
    APPROVED: { label: 'معتمد', color: 'bg-green-100 text-green-700' },
    RECEIVED: { label: 'مستلم', color: 'bg-purple-100 text-purple-700' },
    CANCELLED: { label: 'ملغي', color: 'bg-red-100 text-red-700' },
  };

  const columns = [
    { key: 'number', header: 'رقم الأمر' },
    { key: 'supplierId', header: 'المورد' },
    { key: 'status', header: 'الحالة', render: (item: Record<string, any>) => {
      const s = statusMap[item.status] || { label: item.status, color: 'bg-gray-100' };
      return <span className={`px-2 py-1 rounded-full text-xs ${s.color}`}>{s.label}</span>;
    }},
    { key: 'totalAmount', header: 'المبلغ الإجمالي', render: (item: Record<string, any>) => `${item.totalAmount?.toLocaleString('ar-SA')} ر.س` },
    { key: 'createdAt', header: 'التاريخ', render: (item: Record<string, any>) => item.createdAt ? new Date(item.createdAt).toLocaleDateString('ar-SA') : '-' },
  ];

  return (
    <div>
      <PageHeader title="المشتريات" description="إدارة أوامر الشراء والموردين" actions={<Button><Plus className="w-4 h-4 ml-2" />أمر شراء جديد</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="أوامر الشراء" value="30" icon={<ShoppingCart className="w-6 h-6" />} />
        <StatCard title="بانتظار الموافقة" value="8" icon={<Clock className="w-6 h-6" />} />
        <StatCard title="معتمدة" value="18" icon={<CheckCircle className="w-6 h-6" />} />
        <StatCard title="ملغاة" value="4" icon={<XCircle className="w-6 h-6" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-card rounded-xl border p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">أوامر الشراء</h3>
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
          <h3 className="text-lg font-semibold mb-4">أفضل الموردين</h3>
          {[
            { name: 'شركة أغذية الخليج', orders: 12, total: '180K' },
            { name: 'المراعي للتوريدات', orders: 8, total: '120K' },
            { name: 'مجموعة صافولا', orders: 6, total: '95K' },
            { name: 'باندا للجملة', orders: 4, total: '65K' },
          ].map((supplier, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg mb-2">
              <div>
                <span className="text-sm font-medium">{supplier.name}</span>
                <span className="text-xs text-muted-foreground block">{supplier.orders} أمر شراء</span>
              </div>
              <span className="text-sm font-semibold text-brand-600">{supplier.total} ر.س</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
