'use client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '@/lib/api';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Plus, Users, FileText, Calendar } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';

export default function HRManagementPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data } = useQuery({
    queryKey: ['employees', page, search],
    queryFn: () => api.get('/api/hr/employees', { params: { page, limit: 20, search } }).then(r => r.data),
  });

  const columns = [
    { key: 'employeeNumber', header: 'رقم الموظف' },
    { key: 'firstName', header: 'الاسم الأول' },
    { key: 'lastName', header: 'اسم العائلة' },
    { key: 'email', header: 'البريد الإلكتروني' },
    { key: 'departmentId', header: 'القسم' },
    { key: 'hireDate', header: 'تاريخ التعيين', render: (item: Record<string, any>) => item.hireDate ? new Date(item.hireDate).toLocaleDateString('ar-SA') : '-' },
  ];

  return (
    <div>
      <PageHeader title="إدارة الموارد البشرية" description="إدارة الموظفين والإجازات والحضور" actions={<Button><Plus className="w-4 h-4 ml-2" />إضافة موظف</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="إجمالي الموظفين" value="60" icon={<Users className="w-6 h-6" />} />
        <StatCard title="موظفون نشطون" value="55" change="+3 هذا الشهر" trend="up" icon={<Users className="w-6 h-6" />} />
        <StatCard title="طلبات الإجازات المعلقة" value="8" icon={<FileText className="w-6 h-6" />} />
        <StatCard title="إجازات اليوم" value="5" icon={<Calendar className="w-6 h-6" />} />
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
