'use client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '@/lib/api';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Plus, Headphones, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';

export default function CRMCustomerServicePage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data } = useQuery({
    queryKey: ['crmTickets', page, search],
    queryFn: () => api.get('/api/crm/tickets', { params: { page, limit: 20, search } }).then(r => r.data),
  });

  const statusMap: Record<string, { label: string; color: string }> = {
    OPEN: { label: 'مفتوحة', color: 'bg-blue-100 text-blue-700' },
    IN_PROGRESS: { label: 'قيد المعالجة', color: 'bg-yellow-100 text-yellow-700' },
    RESOLVED: { label: 'تم الحل', color: 'bg-green-100 text-green-700' },
    CLOSED: { label: 'مغلقة', color: 'bg-gray-100 text-gray-700' },
  };

  const priorityMap: Record<string, { label: string; color: string }> = {
    LOW: { label: 'منخفضة', color: 'bg-gray-100 text-gray-700' },
    MEDIUM: { label: 'متوسطة', color: 'bg-blue-100 text-blue-700' },
    HIGH: { label: 'عالية', color: 'bg-orange-100 text-orange-700' },
    CRITICAL: { label: 'حرجة', color: 'bg-red-100 text-red-700' },
  };

  const columns = [
    { key: 'number', header: 'رقم التذكرة' },
    { key: 'customerName', header: 'اسم العميل' },
    { key: 'subject', header: 'الموضوع' },
    { key: 'status', header: 'الحالة', render: (item: Record<string, any>) => {
      const s = statusMap[item.status] || { label: item.status, color: 'bg-gray-100' };
      return <span className={`px-2 py-1 rounded-full text-xs ${s.color}`}>{s.label}</span>;
    }},
    { key: 'priority', header: 'الأولوية', render: (item: Record<string, any>) => {
      const p = priorityMap[item.priority] || { label: item.priority, color: 'bg-gray-100' };
      return <span className={`px-2 py-1 rounded-full text-xs ${p.color}`}>{p.label}</span>;
    }},
  ];

  return (
    <div>
      <PageHeader title="إدارة العملاء" description="تذاكر الدعم وخدمة العملاء" actions={<Button><Plus className="w-4 h-4 ml-2" />تذكرة جديدة</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="إجمالي التذاكر" value="80" icon={<Headphones className="w-6 h-6" />} />
        <StatCard title="مفتوحة" value="25" icon={<Clock className="w-6 h-6" />} />
        <StatCard title="تم حلها" value="45" trend="up" icon={<CheckCircle className="w-6 h-6" />} />
        <StatCard title="حرجة" value="5" trend="down" icon={<AlertTriangle className="w-6 h-6" />} />
      </div>

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
  );
}
