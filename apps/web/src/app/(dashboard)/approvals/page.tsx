'use client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '@/lib/api';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, FileCheck, AlertTriangle } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';

export default function ApprovalsInboxPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data } = useQuery({
    queryKey: ['approvals', page, search],
    queryFn: () => api.get('/api/approvals', { params: { page, limit: 20, search } }).then(r => r.data),
  });

  const statusMap: Record<string, { label: string; color: string }> = {
    PENDING: { label: 'في الانتظار', color: 'bg-yellow-100 text-yellow-700' },
    APPROVED: { label: 'موافق عليه', color: 'bg-green-100 text-green-700' },
    REJECTED: { label: 'مرفوض', color: 'bg-red-100 text-red-700' },
  };

  const entityTypes: Record<string, string> = {
    PURCHASE_ORDER: 'أمر شراء',
    EXPENSE: 'مصروف',
    LEAVE_REQUEST: 'طلب إجازة',
    TRANSFER: 'تحويل',
  };

  const columns = [
    { key: 'entityType', header: 'نوع الطلب', render: (item: Record<string, any>) => entityTypes[item.entityType] || item.entityType },
    { key: 'entityId', header: 'رقم المرجع' },
    { key: 'status', header: 'الحالة', render: (item: Record<string, any>) => {
      const s = statusMap[item.status] || { label: item.status, color: 'bg-gray-100' };
      return <span className={`px-2 py-1 rounded-full text-xs ${s.color}`}>{s.label}</span>;
    }},
    { key: 'currentStep', header: 'المرحلة الحالية' },
    { key: 'createdAt', header: 'تاريخ الطلب', render: (item: Record<string, any>) => item.createdAt ? new Date(item.createdAt).toLocaleDateString('ar-SA') : '-' },
  ];

  return (
    <div>
      <PageHeader title="الموافقات" description="صندوق طلبات الموافقة" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="في انتظار الموافقة" value="15" icon={<Clock className="w-6 h-6" />} />
        <StatCard title="تمت الموافقة" value="48" trend="up" icon={<CheckCircle className="w-6 h-6" />} />
        <StatCard title="مرفوضة" value="5" icon={<XCircle className="w-6 h-6" />} />
        <StatCard title="متأخرة" value="3" trend="down" icon={<AlertTriangle className="w-6 h-6" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-card rounded-xl border p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">طلبات الموافقة</h3>
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
          <h3 className="text-lg font-semibold mb-4">طلبات تحتاج موافقتك</h3>
          {[
            { type: 'أمر شراء', ref: 'PO-2024-156', amount: '15,000 ر.س', from: 'أحمد محمد', urgent: true },
            { type: 'طلب إجازة', ref: 'LV-2024-089', amount: '5 أيام', from: 'سارة علي', urgent: false },
            { type: 'مصروف', ref: 'EXP-2024-234', amount: '2,500 ر.س', from: 'خالد عمر', urgent: false },
            { type: 'تحويل مخزون', ref: 'TR-2024-045', amount: '100 وحدة', from: 'محمد سعيد', urgent: true },
          ].map((item, i) => (
            <div key={i} className={`p-3 rounded-lg mb-2 ${item.urgent ? 'bg-red-50 border border-red-200' : 'bg-muted/50'}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-sm font-medium">{item.type}</span>
                  <p className="text-xs text-muted-foreground">{item.ref}</p>
                </div>
                <span className="text-sm font-semibold text-brand-600">{item.amount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">من: {item.from}</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-7 px-2 text-red-600 hover:text-red-700">
                    <XCircle className="w-3 h-3" />
                  </Button>
                  <Button size="sm" className="h-7 px-2 bg-green-600 hover:bg-green-700">
                    <CheckCircle className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <h3 className="text-lg font-semibold mb-4 mt-6">إحصائيات الموافقات</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="text-sm">أوامر الشراء</span>
              <span className="font-semibold">8</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="text-sm">طلبات الإجازة</span>
              <span className="font-semibold">4</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="text-sm">المصروفات</span>
              <span className="font-semibold">2</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="text-sm">التحويلات</span>
              <span className="font-semibold">1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
