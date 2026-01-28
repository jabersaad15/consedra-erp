'use client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '@/lib/api';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Plus, ClipboardCheck, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';

export default function OperationsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data } = useQuery({
    queryKey: ['checklists', page, search],
    queryFn: () => api.get('/api/operations/checklists', { params: { page, limit: 20, search } }).then(r => r.data),
  });

  const columns = [
    { key: 'title', header: 'عنوان القائمة' },
    { key: 'branchId', header: 'الفرع' },
    { key: 'frequency', header: 'التكرار' },
    { key: 'completedAt', header: 'تاريخ الإكمال' },
  ];

  return (
    <div>
      <PageHeader title="العمليات" description="إدارة قوائم الفحص والتفتيشات اليومية" actions={<Button><Plus className="w-4 h-4 ml-2" />قائمة فحص جديدة</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="قوائم الفحص اليوم" value="20" icon={<ClipboardCheck className="w-6 h-6" />} />
        <StatCard title="مكتملة" value="15" change="75%" trend="up" icon={<CheckCircle className="w-6 h-6" />} />
        <StatCard title="متأخرة" value="3" icon={<AlertTriangle className="w-6 h-6" />} />
        <StatCard title="قيد التنفيذ" value="2" icon={<Clock className="w-6 h-6" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-card rounded-xl border p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">قوائم الفحص</h3>
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
          <h3 className="text-lg font-semibold mb-4">حالة الفروع</h3>
          {[
            { name: 'فرع العليا', status: 'مكتمل', score: 95 },
            { name: 'فرع الملز', status: 'مكتمل', score: 88 },
            { name: 'فرع السليمانية', status: 'قيد التنفيذ', score: 60 },
            { name: 'فرع التحلية', status: 'مكتمل', score: 92 },
            { name: 'فرع الكورنيش', status: 'لم يبدأ', score: 0 },
            { name: 'فرع الحمرا', status: 'مكتمل', score: 85 },
            { name: 'المطبخ المركزي', status: 'مكتمل', score: 98 },
          ].map((branch, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg mb-2">
              <div>
                <span className="text-sm font-medium">{branch.name}</span>
                <span className={`text-xs block ${branch.status === 'مكتمل' ? 'text-green-600' : branch.status === 'قيد التنفيذ' ? 'text-yellow-600' : 'text-red-600'}`}>
                  {branch.status}
                </span>
              </div>
              <span className="text-lg font-bold">{branch.score}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
