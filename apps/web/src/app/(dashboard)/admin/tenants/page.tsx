'use client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '@/lib/api';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Plus, Building, Users, CreditCard, Settings } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';

export default function TenantManagementPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data } = useQuery({
    queryKey: ['tenants', page, search],
    queryFn: () => api.get('/api/tenants', { params: { page, limit: 20, search } }).then(r => r.data),
  });

  const columns = [
    { key: 'name', header: 'اسم المستأجر' },
    { key: 'slug', header: 'المعرف' },
    { key: 'isActive', header: 'الحالة', render: (item: Record<string, any>) => (
      <span className={`px-2 py-1 rounded-full text-xs ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {item.isActive ? 'نشط' : 'غير نشط'}
      </span>
    )},
    { key: 'createdAt', header: 'تاريخ الإنشاء', render: (item: Record<string, any>) => item.createdAt ? new Date(item.createdAt).toLocaleDateString('ar-SA') : '-' },
  ];

  return (
    <div>
      <PageHeader title="إدارة المستأجرين" description="إدارة الشركات والمؤسسات" actions={<Button><Plus className="w-4 h-4 ml-2" />مستأجر جديد</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="إجمالي المستأجرين" value="15" icon={<Building className="w-6 h-6" />} />
        <StatCard title="المستأجرون النشطون" value="12" trend="up" icon={<Users className="w-6 h-6" />} />
        <StatCard title="الاشتراكات الفعالة" value="10" icon={<CreditCard className="w-6 h-6" />} />
        <StatCard title="في فترة التجربة" value="3" icon={<Settings className="w-6 h-6" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-card rounded-xl border p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">المستأجرون</h3>
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
          <h3 className="text-lg font-semibold mb-4">أحدث المستأجرين</h3>
          {[
            { name: 'مطاعم الشرق', plan: 'احترافي', users: 25, branches: 5 },
            { name: 'مجموعة الغذاء', plan: 'مؤسسي', users: 50, branches: 12 },
            { name: 'كافيه لاتيه', plan: 'أساسي', users: 8, branches: 2 },
            { name: 'مطعم البيت', plan: 'تجربة', users: 3, branches: 1 },
          ].map((tenant, i) => (
            <div key={i} className="p-3 bg-muted/50 rounded-lg mb-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium text-sm">{tenant.name}</span>
                  <span className="text-xs text-brand-600 block">{tenant.plan}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full bg-green-100 text-green-700`}>نشط</span>
              </div>
              <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                <span>{tenant.users} مستخدم</span>
                <span>{tenant.branches} فرع</span>
              </div>
            </div>
          ))}

          <h3 className="text-lg font-semibold mb-4 mt-6">توزيع الخطط</h3>
          {[
            { plan: 'مؤسسي', count: 3, percent: 20 },
            { plan: 'احترافي', count: 5, percent: 33 },
            { plan: 'أساسي', count: 4, percent: 27 },
            { plan: 'تجربة', count: 3, percent: 20 },
          ].map((plan, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>{plan.plan}</span>
                <span className="font-semibold">{plan.count}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-brand-500 h-2 rounded-full" style={{ width: `${plan.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
