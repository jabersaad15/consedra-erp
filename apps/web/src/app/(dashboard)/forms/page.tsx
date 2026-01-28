'use client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '@/lib/api';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Plus, FileText, ClipboardList, Eye, Edit2 } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';

export default function FormsBuilderPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data } = useQuery({
    queryKey: ['forms', page, search],
    queryFn: () => api.get('/api/forms', { params: { page, limit: 20, search } }).then(r => r.data),
  });

  const moduleLabels: Record<string, string> = {
    hr: 'الموارد البشرية',
    operations: 'العمليات',
    quality: 'الجودة',
    inventory: 'المخزون',
  };

  const columns = [
    { key: 'name', header: 'اسم النموذج' },
    { key: 'moduleKey', header: 'الوحدة', render: (item: Record<string, any>) => moduleLabels[item.moduleKey] || item.moduleKey },
    { key: 'createdAt', header: 'تاريخ الإنشاء', render: (item: Record<string, any>) => item.createdAt ? new Date(item.createdAt).toLocaleDateString('ar-SA') : '-' },
  ];

  return (
    <div>
      <PageHeader title="بناء النماذج" description="إنشاء وإدارة النماذج المخصصة" actions={<Button><Plus className="w-4 h-4 ml-2" />نموذج جديد</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="إجمالي النماذج" value="24" icon={<FileText className="w-6 h-6" />} />
        <StatCard title="نماذج نشطة" value="18" icon={<ClipboardList className="w-6 h-6" />} />
        <StatCard title="عمليات التعبئة" value="1,250" trend="up" icon={<Edit2 className="w-6 h-6" />} />
        <StatCard title="المشاهدات" value="3,400" icon={<Eye className="w-6 h-6" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-card rounded-xl border p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">النماذج</h3>
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
          <h3 className="text-lg font-semibold mb-4">النماذج الأكثر استخداماً</h3>
          {[
            { name: 'قائمة فحص الافتتاح', module: 'العمليات', uses: 450 },
            { name: 'طلب إجازة', module: 'الموارد البشرية', uses: 320 },
            { name: 'فحص الجودة اليومي', module: 'الجودة', uses: 280 },
            { name: 'جرد المخزون', module: 'المخزون', uses: 195 },
            { name: 'تقييم الموظف', module: 'الموارد البشرية', uses: 145 },
          ].map((form, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg mb-2">
              <div>
                <span className="text-sm font-medium">{form.name}</span>
                <span className="text-xs text-muted-foreground block">{form.module}</span>
              </div>
              <span className="text-sm font-semibold text-brand-600">{form.uses} استخدام</span>
            </div>
          ))}

          <h3 className="text-lg font-semibold mb-4 mt-6">أنواع الحقول المستخدمة</h3>
          {[
            { type: 'نص', count: 85 },
            { type: 'اختيار من متعدد', count: 42 },
            { type: 'تاريخ', count: 35 },
            { type: 'رقم', count: 28 },
            { type: 'صورة/مرفق', count: 15 },
          ].map((field, i) => (
            <div key={i} className="flex justify-between items-center p-2 text-sm">
              <span>{field.type}</span>
              <span className="font-semibold">{field.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
