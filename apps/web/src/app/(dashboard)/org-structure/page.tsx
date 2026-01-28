'use client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '@/lib/api';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Plus, Building2, MapPin, Store, Users } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';

export default function OrganizationStructurePage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data } = useQuery({
    queryKey: ['org', page, search],
    queryFn: () => api.get('/api/org/regions', { params: { page, limit: 20, search } }).then(r => r.data),
  });

  const columns = [
    { key: 'name', header: 'اسم المنطقة' },
    { key: 'code', header: 'الرمز' },
  ];

  return (
    <div>
      <PageHeader title="الهيكل التنظيمي" description="إدارة المناطق والفروع" actions={<Button><Plus className="w-4 h-4 ml-2" />إضافة منطقة</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="المناطق" value="3" icon={<MapPin className="w-6 h-6" />} />
        <StatCard title="الفروع" value="7" icon={<Store className="w-6 h-6" />} />
        <StatCard title="الأقسام" value="12" icon={<Building2 className="w-6 h-6" />} />
        <StatCard title="الموظفون" value="150" icon={<Users className="w-6 h-6" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-card rounded-xl border p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">المناطق</h3>
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
          <h3 className="text-lg font-semibold mb-4">الهيكل التنظيمي</h3>

          <div className="space-y-4">
            <div className="p-3 bg-brand-50 rounded-lg border border-brand-200">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-brand-600" />
                <span className="font-semibold text-brand-700">المنطقة الوسطى</span>
              </div>
              <div className="mr-6 space-y-2">
                {['فرع العليا', 'فرع الملز', 'فرع السليمانية'].map((branch, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Store className="w-3 h-3 text-muted-foreground" />
                    <span>{branch}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-green-700">المنطقة الغربية</span>
              </div>
              <div className="mr-6 space-y-2">
                {['فرع التحلية', 'فرع الكورنيش'].map((branch, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Store className="w-3 h-3 text-muted-foreground" />
                    <span>{branch}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-purple-600" />
                <span className="font-semibold text-purple-700">المنطقة الشرقية</span>
              </div>
              <div className="mr-6 space-y-2">
                {['فرع الحمرا', 'المطبخ المركزي'].map((branch, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Store className="w-3 h-3 text-muted-foreground" />
                    <span>{branch}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-4 mt-6">توزيع الموظفين</h3>
          {[
            { branch: 'فرع العليا', count: 35, percent: 23 },
            { branch: 'فرع الملز', count: 28, percent: 19 },
            { branch: 'فرع التحلية', count: 25, percent: 17 },
            { branch: 'المطبخ المركزي', count: 40, percent: 27 },
          ].map((item, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>{item.branch}</span>
                <span className="font-semibold">{item.count} موظف</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-brand-500 h-2 rounded-full" style={{ width: `${item.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
