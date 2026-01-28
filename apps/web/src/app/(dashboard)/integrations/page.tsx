'use client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '@/lib/api';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Plus, Plug, Check, X, RefreshCw, Zap } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';

export default function IntegrationHubPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data } = useQuery({
    queryKey: ['integrations', page, search],
    queryFn: () => api.get('/api/integrations', { params: { page, limit: 20, search } }).then(r => r.data),
  });

  const typeLabels: Record<string, string> = {
    POS: 'نقطة البيع',
    ACCOUNTING: 'المحاسبة',
    DELIVERY: 'التوصيل',
    PAYMENT: 'الدفع',
    SMS: 'الرسائل',
  };

  const columns = [
    { key: 'name', header: 'اسم التكامل' },
    { key: 'type', header: 'النوع', render: (item: Record<string, any>) => typeLabels[item.type] || item.type },
    { key: 'isActive', header: 'الحالة', render: (item: Record<string, any>) => (
      <span className={`px-2 py-1 rounded-full text-xs ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {item.isActive ? 'نشط' : 'غير نشط'}
      </span>
    )},
  ];

  return (
    <div>
      <PageHeader title="مركز التكامل" description="إدارة التكاملات والربط مع الأنظمة الخارجية" actions={<Button><Plus className="w-4 h-4 ml-2" />تكامل جديد</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="التكاملات النشطة" value="8" icon={<Plug className="w-6 h-6" />} />
        <StatCard title="متصل" value="7" trend="up" icon={<Check className="w-6 h-6" />} />
        <StatCard title="غير متصل" value="1" icon={<X className="w-6 h-6" />} />
        <StatCard title="عمليات اليوم" value="2,450" icon={<Zap className="w-6 h-6" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-card rounded-xl border p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">التكاملات</h3>
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
          <h3 className="text-lg font-semibold mb-4">التكاملات المتصلة</h3>
          {[
            { name: 'Foodics POS', type: 'نقطة البيع', status: 'متصل', lastSync: 'منذ 5 دقائق' },
            { name: 'Qoyod', type: 'المحاسبة', status: 'متصل', lastSync: 'منذ ساعة' },
            { name: 'HungerStation', type: 'التوصيل', status: 'متصل', lastSync: 'منذ 10 دقائق' },
            { name: 'Jahez', type: 'التوصيل', status: 'متصل', lastSync: 'منذ 15 دقيقة' },
            { name: 'MOYASAR', type: 'الدفع', status: 'متصل', lastSync: 'مباشر' },
            { name: 'Unifonic', type: 'الرسائل', status: 'غير متصل', lastSync: 'منذ يوم' },
          ].map((integration, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg mb-2">
              <div>
                <span className="text-sm font-medium">{integration.name}</span>
                <span className="text-xs text-muted-foreground block">{integration.type}</span>
              </div>
              <div className="text-left">
                <span className={`text-xs px-2 py-1 rounded-full ${integration.status === 'متصل' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {integration.status}
                </span>
                <span className="text-xs text-muted-foreground block mt-1">{integration.lastSync}</span>
              </div>
            </div>
          ))}

          <h3 className="text-lg font-semibold mb-4 mt-6">سجل المزامنة</h3>
          {[
            { action: 'مزامنة الطلبات', source: 'Foodics', count: 45, time: 'منذ 5 دقائق' },
            { action: 'تحديث المخزون', source: 'النظام', count: 120, time: 'منذ 30 دقيقة' },
            { action: 'إرسال فواتير', source: 'Qoyod', count: 8, time: 'منذ ساعة' },
          ].map((log, i) => (
            <div key={i} className="p-3 bg-muted/50 rounded-lg mb-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{log.action}</span>
                <RefreshCw className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">{log.source} - {log.count} عنصر</span>
                <span className="text-xs text-muted-foreground">{log.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
