'use client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '@/lib/api';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Plus, ShieldCheck, AlertTriangle, CheckCircle, ClipboardList } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';

export default function QualityCompliancePage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data } = useQuery({
    queryKey: ['qualityChecklists', page, search],
    queryFn: () => api.get('/api/quality/checklists', { params: { page, limit: 20, search } }).then(r => r.data),
  });

  const columns = [
    { key: 'title', header: 'عنوان الفحص' },
    { key: 'branchId', header: 'الفرع' },
    { key: 'type', header: 'النوع' },
    { key: 'score', header: 'النتيجة', render: (item: Record<string, any>) => (
      <span className={`font-semibold ${item.score >= 80 ? 'text-green-600' : item.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
        {item.score}%
      </span>
    )},
  ];

  return (
    <div>
      <PageHeader title="الجودة والامتثال" description="إدارة معايير الجودة وعدم المطابقة" actions={<Button><Plus className="w-4 h-4 ml-2" />فحص جديد</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="فحوصات الجودة" value="10" icon={<ClipboardList className="w-6 h-6" />} />
        <StatCard title="متوسط النتيجة" value="87%" trend="up" icon={<ShieldCheck className="w-6 h-6" />} />
        <StatCard title="حالات عدم المطابقة" value="8" icon={<AlertTriangle className="w-6 h-6" />} />
        <StatCard title="تم إغلاقها" value="5" trend="up" icon={<CheckCircle className="w-6 h-6" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-card rounded-xl border p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">قوائم فحص الجودة</h3>
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
          <h3 className="text-lg font-semibold mb-4">حالات عدم المطابقة</h3>
          {[
            { title: 'NC-001', desc: 'درجة حرارة الثلاجة غير مناسبة', severity: 'كبيرة', status: 'مغلق' },
            { title: 'NC-002', desc: 'نقص في التوثيق', severity: 'صغيرة', status: 'مغلق' },
            { title: 'NC-003', desc: 'عدم التزام بالزي الرسمي', severity: 'صغيرة', status: 'مفتوح' },
            { title: 'NC-004', desc: 'تأخر في الصيانة الدورية', severity: 'كبيرة', status: 'مفتوح' },
          ].map((nc, i) => (
            <div key={i} className="p-3 bg-muted/50 rounded-lg mb-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium text-sm">{nc.title}</span>
                  <p className="text-xs text-muted-foreground">{nc.desc}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${nc.status === 'مغلق' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {nc.status}
                </span>
              </div>
              <span className={`text-xs ${nc.severity === 'كبيرة' ? 'text-red-600' : 'text-yellow-600'}`}>{nc.severity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
