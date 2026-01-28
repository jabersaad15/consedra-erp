'use client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '@/lib/api';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';

export default function OwnershipTransferPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data } = useQuery({
    queryKey: ['transfers', page, search],
    queryFn: () => api.get('/api/tenants', { params: { page, limit: 20, search } }).then(r => r.data),
  });

  const columns = [
    { key: 'name', header: 'المستأجر' },
    { key: 'slug', header: 'المعرف' },
    { key: 'ownerId', header: 'المالك الحالي' },
  ];

  return (
    <div>
      <PageHeader title="نقل الملكية" description="إدارة طلبات نقل ملكية المستأجرين" actions={<Button><ArrowRightLeft className="w-4 h-4 ml-2" />طلب نقل جديد</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="طلبات النقل" value="5" icon={<ArrowRightLeft className="w-6 h-6" />} />
        <StatCard title="في الانتظار" value="2" icon={<Clock className="w-6 h-6" />} />
        <StatCard title="مكتملة" value="3" trend="up" icon={<CheckCircle className="w-6 h-6" />} />
        <StatCard title="مرفوضة" value="0" icon={<AlertTriangle className="w-6 h-6" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-card rounded-xl border p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">المستأجرون</h3>
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
          <h3 className="text-lg font-semibold mb-4">طلبات النقل الأخيرة</h3>
          {[
            { tenant: 'مطاعم الشرق', from: 'أحمد محمد', to: 'خالد علي', status: 'في الانتظار', date: 'اليوم' },
            { tenant: 'كافيه لاتيه', from: 'سارة أحمد', to: 'محمد سعيد', status: 'مكتمل', date: 'أمس' },
            { tenant: 'مجموعة الغذاء', from: 'عمر خالد', to: 'فهد عبدالله', status: 'مكتمل', date: 'منذ 3 أيام' },
          ].map((transfer, i) => (
            <div key={i} className="p-3 bg-muted/50 rounded-lg mb-2">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-sm">{transfer.tenant}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${transfer.status === 'مكتمل' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {transfer.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{transfer.from}</span>
                <ArrowRightLeft className="w-3 h-3" />
                <span>{transfer.to}</span>
              </div>
              <span className="text-xs text-muted-foreground">{transfer.date}</span>
            </div>
          ))}

          <h3 className="text-lg font-semibold mb-4 mt-6">إرشادات النقل</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• يجب موافقة المالك الحالي على النقل</p>
            <p>• يتم التحقق من هوية المالك الجديد</p>
            <p>• يتم نقل جميع البيانات والصلاحيات</p>
            <p>• لا يمكن التراجع عن عملية النقل</p>
          </div>
        </div>
      </div>
    </div>
  );
}
