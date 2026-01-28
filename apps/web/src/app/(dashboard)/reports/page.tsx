'use client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '@/lib/api';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Plus, BarChart3, PieChart, TrendingUp, Download } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';

export default function ReportsAnalyticsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data } = useQuery({
    queryKey: ['reports', page, search],
    queryFn: () => api.get('/api/reports', { params: { page, limit: 20, search } }).then(r => r.data),
  });

  const moduleLabels: Record<string, string> = {
    sales: 'المبيعات',
    inventory: 'المخزون',
    hr: 'الموارد البشرية',
    finance: 'المالية',
    operations: 'العمليات',
  };

  const columns = [
    { key: 'name', header: 'اسم التقرير' },
    { key: 'moduleKey', header: 'الوحدة', render: (item: Record<string, any>) => moduleLabels[item.moduleKey] || item.moduleKey },
    { key: 'entity', header: 'الكيان' },
  ];

  return (
    <div>
      <PageHeader title="التقارير والتحليلات" description="إنشاء وعرض التقارير" actions={<Button><Plus className="w-4 h-4 ml-2" />تقرير جديد</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="التقارير المتاحة" value="45" icon={<BarChart3 className="w-6 h-6" />} />
        <StatCard title="تقارير مجدولة" value="12" icon={<PieChart className="w-6 h-6" />} />
        <StatCard title="التحميلات اليوم" value="28" trend="up" icon={<Download className="w-6 h-6" />} />
        <StatCard title="لوحات المعلومات" value="8" icon={<TrendingUp className="w-6 h-6" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-card rounded-xl border p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">التقارير</h3>
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
          <h3 className="text-lg font-semibold mb-4">التقارير الأكثر طلباً</h3>
          {[
            { name: 'تقرير المبيعات اليومي', module: 'المبيعات', downloads: 156 },
            { name: 'تقرير المخزون', module: 'المخزون', downloads: 89 },
            { name: 'تقرير الحضور الشهري', module: 'الموارد البشرية', downloads: 67 },
            { name: 'تقرير المصروفات', module: 'المالية', downloads: 54 },
            { name: 'تقرير أداء الفروع', module: 'العمليات', downloads: 42 },
          ].map((report, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg mb-2">
              <div>
                <span className="text-sm font-medium">{report.name}</span>
                <span className="text-xs text-muted-foreground block">{report.module}</span>
              </div>
              <Button size="sm" variant="ghost" className="h-8">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          ))}

          <h3 className="text-lg font-semibold mb-4 mt-6">التقارير المجدولة</h3>
          {[
            { name: 'تقرير المبيعات الأسبوعي', schedule: 'كل أحد 8:00 ص', recipients: 5 },
            { name: 'تقرير المخزون الشهري', schedule: 'أول كل شهر', recipients: 3 },
            { name: 'تقرير الأداء ربع السنوي', schedule: 'كل 3 أشهر', recipients: 8 },
          ].map((scheduled, i) => (
            <div key={i} className="p-3 bg-muted/50 rounded-lg mb-2">
              <span className="text-sm font-medium">{scheduled.name}</span>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">{scheduled.schedule}</span>
                <span className="text-xs text-brand-600">{scheduled.recipients} مستلمين</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
