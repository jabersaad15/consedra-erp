'use client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '@/lib/api';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Plus, Shield, Users, Lock, Key } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';

export default function RolesPermissionsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data } = useQuery({
    queryKey: ['roles', page, search],
    queryFn: () => api.get('/api/roles', { params: { page, limit: 20, search } }).then(r => r.data),
  });

  const columns = [
    { key: 'name', header: 'اسم الدور' },
    { key: 'key', header: 'المفتاح' },
    { key: 'isSystem', header: 'نوع الدور', render: (item: Record<string, any>) => (
      <span className={`px-2 py-1 rounded-full text-xs ${item.isSystem ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
        {item.isSystem ? 'نظامي' : 'مخصص'}
      </span>
    )},
    { key: 'createdAt', header: 'تاريخ الإنشاء', render: (item: Record<string, any>) => item.createdAt ? new Date(item.createdAt).toLocaleDateString('ar-SA') : '-' },
  ];

  return (
    <div>
      <PageHeader title="الأدوار والصلاحيات" description="إدارة أدوار المستخدمين والصلاحيات" actions={<Button><Plus className="w-4 h-4 ml-2" />دور جديد</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="إجمالي الأدوار" value="8" icon={<Shield className="w-6 h-6" />} />
        <StatCard title="أدوار نظامية" value="4" icon={<Lock className="w-6 h-6" />} />
        <StatCard title="أدوار مخصصة" value="4" icon={<Key className="w-6 h-6" />} />
        <StatCard title="المستخدمون" value="45" icon={<Users className="w-6 h-6" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-card rounded-xl border p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">الأدوار</h3>
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
          <h3 className="text-lg font-semibold mb-4">الأدوار النظامية</h3>
          {[
            { name: 'مدير النظام', key: 'SUPER_ADMIN', users: 2, permissions: 'كامل' },
            { name: 'مدير الشركة', key: 'ADMIN', users: 3, permissions: 'إدارة كاملة' },
            { name: 'مدير فرع', key: 'BRANCH_MANAGER', users: 7, permissions: 'إدارة الفرع' },
            { name: 'موظف', key: 'EMPLOYEE', users: 33, permissions: 'محدود' },
          ].map((role, i) => (
            <div key={i} className="p-3 bg-purple-50 rounded-lg mb-2 border border-purple-200">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium text-sm">{role.name}</span>
                  <span className="text-xs text-muted-foreground block">{role.key}</span>
                </div>
                <span className="text-xs text-purple-600">{role.users} مستخدم</span>
              </div>
              <span className="text-xs text-muted-foreground">الصلاحيات: {role.permissions}</span>
            </div>
          ))}

          <h3 className="text-lg font-semibold mb-4 mt-6">الأدوار المخصصة</h3>
          {[
            { name: 'محاسب', users: 5, permissions: 12 },
            { name: 'أمين مخزون', users: 8, permissions: 8 },
            { name: 'موارد بشرية', users: 3, permissions: 15 },
            { name: 'مشرف جودة', users: 4, permissions: 10 },
          ].map((role, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg mb-2">
              <div>
                <span className="font-medium text-sm">{role.name}</span>
                <span className="text-xs text-muted-foreground block">{role.permissions} صلاحية</span>
              </div>
              <span className="text-xs text-muted-foreground">{role.users} مستخدم</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
