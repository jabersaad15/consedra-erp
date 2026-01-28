'use client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '@/lib/api';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Plus, Users, UserCheck, UserX, Shield } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';

export default function UsersManagementPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data } = useQuery({
    queryKey: ['users', page, search],
    queryFn: () => api.get('/api/users', { params: { page, limit: 20, search } }).then(r => r.data),
  });

  const columns = [
    { key: 'email', header: 'البريد الإلكتروني' },
    { key: 'firstName', header: 'الاسم الأول' },
    { key: 'lastName', header: 'الاسم الأخير' },
    { key: 'isActive', header: 'الحالة', render: (item: Record<string, any>) => (
      <span className={`px-2 py-1 rounded-full text-xs ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {item.isActive ? 'نشط' : 'غير نشط'}
      </span>
    )},
    { key: 'createdAt', header: 'تاريخ الإنشاء', render: (item: Record<string, any>) => item.createdAt ? new Date(item.createdAt).toLocaleDateString('ar-SA') : '-' },
  ];

  return (
    <div>
      <PageHeader title="إدارة المستخدمين" description="إدارة حسابات المستخدمين والصلاحيات" actions={<Button><Plus className="w-4 h-4 ml-2" />مستخدم جديد</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="إجمالي المستخدمين" value="45" icon={<Users className="w-6 h-6" />} />
        <StatCard title="نشطون" value="42" trend="up" icon={<UserCheck className="w-6 h-6" />} />
        <StatCard title="غير نشطين" value="3" icon={<UserX className="w-6 h-6" />} />
        <StatCard title="مدراء" value="5" icon={<Shield className="w-6 h-6" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-card rounded-xl border p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">المستخدمون</h3>
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
          <h3 className="text-lg font-semibold mb-4">المستخدمون النشطون الآن</h3>
          {[
            { name: 'أحمد محمد', email: 'ahmed@alsharq.com', role: 'مدير النظام', lastActive: 'الآن' },
            { name: 'سارة علي', email: 'sara@alsharq.com', role: 'مدير العمليات', lastActive: 'منذ 5 دقائق' },
            { name: 'خالد عمر', email: 'khaled@alsharq.com', role: 'محاسب', lastActive: 'منذ 15 دقيقة' },
            { name: 'فاطمة أحمد', email: 'fatima@alsharq.com', role: 'موارد بشرية', lastActive: 'منذ 30 دقيقة' },
          ].map((user, i) => (
            <div key={i} className="p-3 bg-muted/50 rounded-lg mb-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium text-sm">{user.name}</span>
                  <span className="text-xs text-muted-foreground block">{user.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs text-muted-foreground">{user.lastActive}</span>
                </div>
              </div>
              <span className="text-xs text-brand-600">{user.role}</span>
            </div>
          ))}

          <h3 className="text-lg font-semibold mb-4 mt-6">توزيع المستخدمين</h3>
          {[
            { role: 'مدراء النظام', count: 2 },
            { role: 'مدراء فروع', count: 7 },
            { role: 'محاسبون', count: 5 },
            { role: 'أمناء مخزون', count: 8 },
            { role: 'موظفون', count: 23 },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-2 text-sm">
              <span>{item.role}</span>
              <span className="font-semibold">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
