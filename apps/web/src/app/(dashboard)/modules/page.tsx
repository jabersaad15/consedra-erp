'use client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '@/lib/api';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Boxes, Check, X, Settings } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';

export default function ModuleManagerPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data } = useQuery({
    queryKey: ['modules', page, search],
    queryFn: () => api.get('/api/modules', { params: { page, limit: 20, search } }).then(r => r.data),
  });

  const moduleLabels: Record<string, string> = {
    hr: 'الموارد البشرية',
    operations: 'العمليات',
    finance: 'المالية',
    inventory: 'المخزون',
    sales: 'المبيعات',
    crm: 'إدارة العملاء',
    purchasing: 'المشتريات',
    quality: 'الجودة',
    production: 'الإنتاج',
    marketing: 'التسويق',
    projects: 'المشاريع',
  };

  const columns = [
    { key: 'moduleKey', header: 'الوحدة', render: (item: Record<string, any>) => moduleLabels[item.moduleKey] || item.moduleKey },
    { key: 'isEnabled', header: 'الحالة', render: (item: Record<string, any>) => (
      <span className={`px-2 py-1 rounded-full text-xs ${item.isEnabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {item.isEnabled ? 'مفعّل' : 'معطّل'}
      </span>
    )},
    { key: 'order', header: 'الترتيب' },
  ];

  return (
    <div>
      <PageHeader title="إدارة الوحدات" description="تفعيل وتعطيل وحدات النظام" actions={<Button><Settings className="w-4 h-4 ml-2" />إعدادات</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="إجمالي الوحدات" value="15" icon={<Boxes className="w-6 h-6" />} />
        <StatCard title="مفعّلة" value="12" trend="up" icon={<Check className="w-6 h-6" />} />
        <StatCard title="معطّلة" value="3" icon={<X className="w-6 h-6" />} />
        <StatCard title="قيد التطوير" value="2" icon={<Settings className="w-6 h-6" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-card rounded-xl border p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">الوحدات</h3>
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
          <h3 className="text-lg font-semibold mb-4">الوحدات المفعّلة</h3>
          {[
            { name: 'الموارد البشرية', users: 25, usage: 85 },
            { name: 'العمليات', users: 45, usage: 92 },
            { name: 'المالية', users: 12, usage: 78 },
            { name: 'المخزون', users: 30, usage: 88 },
            { name: 'المبيعات', users: 50, usage: 95 },
          ].map((module, i) => (
            <div key={i} className="p-3 bg-muted/50 rounded-lg mb-2">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-sm">{module.name}</span>
                <span className="text-xs text-green-600">مفعّل</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{module.users} مستخدم</span>
                <span>الاستخدام: {module.usage}%</span>
              </div>
            </div>
          ))}

          <h3 className="text-lg font-semibold mb-4 mt-6">الوحدات المعطّلة</h3>
          {[
            { name: 'التصنيع المتقدم', reason: 'غير مطلوب' },
            { name: 'التجارة الإلكترونية', reason: 'قيد الإعداد' },
            { name: 'إدارة الأصول', reason: 'اختياري' },
          ].map((module, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-red-50 rounded-lg mb-2">
              <div>
                <span className="font-medium text-sm">{module.name}</span>
                <span className="text-xs text-muted-foreground block">{module.reason}</span>
              </div>
              <Button size="sm" variant="outline" className="h-7">تفعيل</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
