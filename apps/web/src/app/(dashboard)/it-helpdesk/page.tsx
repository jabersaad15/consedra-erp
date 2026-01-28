'use client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '@/lib/api';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Plus, Headphones, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';

export default function ITHelpdeskPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data } = useQuery({
    queryKey: ['supportTickets', page, search],
    queryFn: () => api.get('/api/it/tickets', { params: { page, limit: 20, search } }).then(r => r.data),
  });

  const statusMap: Record<string, { label: string; color: string }> = {
    OPEN: { label: 'مفتوحة', color: 'bg-blue-100 text-blue-700' },
    IN_PROGRESS: { label: 'قيد المعالجة', color: 'bg-yellow-100 text-yellow-700' },
    RESOLVED: { label: 'تم الحل', color: 'bg-green-100 text-green-700' },
    CLOSED: { label: 'مغلقة', color: 'bg-gray-100 text-gray-700' },
  };

  const priorityMap: Record<string, { label: string; color: string }> = {
    LOW: { label: 'منخفضة', color: 'text-green-600' },
    MEDIUM: { label: 'متوسطة', color: 'text-yellow-600' },
    HIGH: { label: 'عالية', color: 'text-orange-600' },
    CRITICAL: { label: 'حرجة', color: 'text-red-600' },
  };

  const columns = [
    { key: 'number', header: 'رقم التذكرة' },
    { key: 'title', header: 'العنوان' },
    { key: 'category', header: 'الفئة', render: (item: Record<string, any>) => {
      const cats: Record<string, string> = { HARDWARE: 'أجهزة', SOFTWARE: 'برمجيات', NETWORK: 'شبكة', OTHER: 'أخرى' };
      return cats[item.category] || item.category;
    }},
    { key: 'status', header: 'الحالة', render: (item: Record<string, any>) => {
      const s = statusMap[item.status] || { label: item.status, color: 'bg-gray-100' };
      return <span className={`px-2 py-1 rounded-full text-xs ${s.color}`}>{s.label}</span>;
    }},
    { key: 'priority', header: 'الأولوية', render: (item: Record<string, any>) => {
      const p = priorityMap[item.priority] || { label: item.priority, color: '' };
      return <span className={`font-semibold text-sm ${p.color}`}>{p.label}</span>;
    }},
  ];

  return (
    <div>
      <PageHeader title="الدعم الفني" description="إدارة تذاكر الدعم والمشكلات التقنية" actions={<Button><Plus className="w-4 h-4 ml-2" />تذكرة جديدة</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="التذاكر المفتوحة" value="12" icon={<AlertCircle className="w-6 h-6" />} />
        <StatCard title="قيد المعالجة" value="5" icon={<Clock className="w-6 h-6" />} />
        <StatCard title="تم حلها اليوم" value="8" trend="up" icon={<CheckCircle className="w-6 h-6" />} />
        <StatCard title="متوسط وقت الحل" value="2.5 ساعة" icon={<Headphones className="w-6 h-6" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-card rounded-xl border p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">تذاكر الدعم</h3>
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
          <h3 className="text-lg font-semibold mb-4">التذاكر الحرجة</h3>
          {[
            { number: 'TKT-001', title: 'عطل في نظام الكاشير', branch: 'فرع العليا', time: 'منذ 30 دقيقة' },
            { number: 'TKT-002', title: 'مشكلة في الطابعة', branch: 'فرع الملز', time: 'منذ ساعة' },
            { number: 'TKT-003', title: 'انقطاع الإنترنت', branch: 'فرع التحلية', time: 'منذ ساعتين' },
            { number: 'TKT-004', title: 'خطأ في المزامنة', branch: 'المطبخ المركزي', time: 'منذ 3 ساعات' },
          ].map((ticket, i) => (
            <div key={i} className="p-3 bg-red-50 rounded-lg mb-2 border border-red-200">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono text-xs text-red-600">{ticket.number}</span>
                  <p className="text-sm font-medium mt-1">{ticket.title}</p>
                  <span className="text-xs text-muted-foreground">{ticket.branch}</span>
                </div>
                <span className="text-xs text-red-600">{ticket.time}</span>
              </div>
            </div>
          ))}

          <h3 className="text-lg font-semibold mb-4 mt-6">توزيع التذاكر</h3>
          {[
            { category: 'أجهزة', count: 15, percent: 35 },
            { category: 'برمجيات', count: 12, percent: 28 },
            { category: 'شبكة', count: 10, percent: 23 },
            { category: 'أخرى', count: 6, percent: 14 },
          ].map((cat, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>{cat.category}</span>
                <span className="font-semibold">{cat.count} تذكرة</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-brand-500 h-2 rounded-full" style={{ width: `${cat.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
