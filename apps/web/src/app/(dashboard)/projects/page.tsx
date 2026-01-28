'use client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '@/lib/api';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Plus, FolderKanban, CheckCircle, Clock, ListTodo } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';

export default function ProjectsPlansPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data } = useQuery({
    queryKey: ['projects', page, search],
    queryFn: () => api.get('/api/projects', { params: { page, limit: 20, search } }).then(r => r.data),
  });

  const statusMap: Record<string, { label: string; color: string }> = {
    PLANNING: { label: 'تخطيط', color: 'bg-gray-100 text-gray-700' },
    ACTIVE: { label: 'نشط', color: 'bg-green-100 text-green-700' },
    ON_HOLD: { label: 'معلق', color: 'bg-yellow-100 text-yellow-700' },
    COMPLETED: { label: 'مكتمل', color: 'bg-blue-100 text-blue-700' },
  };

  const columns = [
    { key: 'name', header: 'اسم المشروع' },
    { key: 'status', header: 'الحالة', render: (item: Record<string, any>) => {
      const s = statusMap[item.status] || { label: item.status, color: 'bg-gray-100' };
      return <span className={`px-2 py-1 rounded-full text-xs ${s.color}`}>{s.label}</span>;
    }},
    { key: 'startDate', header: 'تاريخ البدء', render: (item: Record<string, any>) => item.startDate ? new Date(item.startDate).toLocaleDateString('ar-SA') : '-' },
    { key: 'endDate', header: 'تاريخ الانتهاء', render: (item: Record<string, any>) => item.endDate ? new Date(item.endDate).toLocaleDateString('ar-SA') : '-' },
  ];

  return (
    <div>
      <PageHeader title="المشاريع والخطط" description="إدارة المشاريع والمهام" actions={<Button><Plus className="w-4 h-4 ml-2" />مشروع جديد</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="إجمالي المشاريع" value="5" icon={<FolderKanban className="w-6 h-6" />} />
        <StatCard title="المهام النشطة" value="100" icon={<ListTodo className="w-6 h-6" />} />
        <StatCard title="مهام مكتملة" value="78" trend="up" icon={<CheckCircle className="w-6 h-6" />} />
        <StatCard title="مهام متأخرة" value="12" trend="down" icon={<Clock className="w-6 h-6" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-card rounded-xl border p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">المشاريع</h3>
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
          <h3 className="text-lg font-semibold mb-4">المشاريع النشطة</h3>
          {[
            { name: 'تجديد المطبخ', progress: 75, tasks: 20 },
            { name: 'ترقية نظام POS', progress: 45, tasks: 15 },
            { name: 'إعادة تصميم القائمة', progress: 90, tasks: 12 },
            { name: 'برنامج تدريب الموظفين', progress: 30, tasks: 25 },
            { name: 'حملة تسويق Q1', progress: 60, tasks: 18 },
          ].map((project, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{project.name}</span>
                <span className="text-muted-foreground">{project.tasks} مهمة</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div className="bg-brand-500 h-2 rounded-full" style={{ width: `${project.progress}%` }} />
                </div>
                <span className="text-xs font-semibold">{project.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
