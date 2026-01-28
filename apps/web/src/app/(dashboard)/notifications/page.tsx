'use client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '@/lib/api';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Bell, BellRing, Check, Mail } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data } = useQuery({
    queryKey: ['notifications', page, search],
    queryFn: () => api.get('/api/notifications', { params: { page, limit: 20, search } }).then(r => r.data),
  });

  const typeLabels: Record<string, string> = {
    ALERT: 'تنبيه',
    INFO: 'معلومة',
    WARNING: 'تحذير',
    SUCCESS: 'نجاح',
  };

  const columns = [
    { key: 'title', header: 'العنوان' },
    { key: 'type', header: 'النوع', render: (item: Record<string, any>) => {
      const colors: Record<string, string> = {
        ALERT: 'bg-red-100 text-red-700',
        INFO: 'bg-blue-100 text-blue-700',
        WARNING: 'bg-yellow-100 text-yellow-700',
        SUCCESS: 'bg-green-100 text-green-700',
      };
      return <span className={`px-2 py-1 rounded-full text-xs ${colors[item.type] || 'bg-gray-100'}`}>{typeLabels[item.type] || item.type}</span>;
    }},
    { key: 'isRead', header: 'الحالة', render: (item: Record<string, any>) => (
      <span className={`text-sm ${item.isRead ? 'text-muted-foreground' : 'font-semibold'}`}>
        {item.isRead ? 'مقروء' : 'جديد'}
      </span>
    )},
    { key: 'createdAt', header: 'التاريخ', render: (item: Record<string, any>) => item.createdAt ? new Date(item.createdAt).toLocaleDateString('ar-SA') : '-' },
  ];

  return (
    <div>
      <PageHeader title="الإشعارات" description="جميع الإشعارات والتنبيهات" actions={<Button variant="outline"><Check className="w-4 h-4 ml-2" />تعليم الكل كمقروء</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="إجمالي الإشعارات" value="156" icon={<Bell className="w-6 h-6" />} />
        <StatCard title="غير مقروءة" value="12" icon={<BellRing className="w-6 h-6" />} />
        <StatCard title="مقروءة" value="144" trend="up" icon={<Check className="w-6 h-6" />} />
        <StatCard title="تنبيهات هامة" value="3" icon={<Mail className="w-6 h-6" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-card rounded-xl border p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">جميع الإشعارات</h3>
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
          <h3 className="text-lg font-semibold mb-4">الإشعارات الجديدة</h3>
          {[
            { title: 'طلب موافقة جديد', desc: 'أمر شراء بقيمة 15,000 ر.س', type: 'ALERT', time: 'منذ 10 دقائق' },
            { title: 'تم إكمال الجرد', desc: 'جرد فرع العليا مكتمل', type: 'SUCCESS', time: 'منذ 30 دقيقة' },
            { title: 'تنبيه مخزون', desc: 'منتج "دجاج" وصل للحد الأدنى', type: 'WARNING', time: 'منذ ساعة' },
            { title: 'موظف جديد', desc: 'تم إضافة موظف جديد للنظام', type: 'INFO', time: 'منذ ساعتين' },
          ].map((notif, i) => {
            const colors: Record<string, string> = {
              ALERT: 'border-r-red-500',
              INFO: 'border-r-blue-500',
              WARNING: 'border-r-yellow-500',
              SUCCESS: 'border-r-green-500',
            };
            return (
              <div key={i} className={`p-3 bg-muted/50 rounded-lg mb-2 border-r-4 ${colors[notif.type]}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium text-sm">{notif.title}</span>
                    <p className="text-xs text-muted-foreground">{notif.desc}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{notif.time}</span>
                </div>
              </div>
            );
          })}

          <h3 className="text-lg font-semibold mb-4 mt-6">تصنيف الإشعارات</h3>
          {[
            { type: 'تنبيهات', count: 45, color: 'bg-red-500' },
            { type: 'معلومات', count: 67, color: 'bg-blue-500' },
            { type: 'تحذيرات', count: 28, color: 'bg-yellow-500' },
            { type: 'نجاح', count: 16, color: 'bg-green-500' },
          ].map((cat, i) => (
            <div key={i} className="flex items-center justify-between p-2">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${cat.color}`}></div>
                <span className="text-sm">{cat.type}</span>
              </div>
              <span className="font-semibold">{cat.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
