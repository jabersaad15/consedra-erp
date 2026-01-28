'use client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '@/lib/api';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Image, File, FolderOpen, Upload } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';

export default function DocumentsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data } = useQuery({
    queryKey: ['documents', page, search],
    queryFn: () => api.get('/api/documents', { params: { page, limit: 20, search } }).then(r => r.data),
  });

  const mimeIcons: Record<string, any> = {
    'application/pdf': FileText,
    'image/png': Image,
    'image/jpeg': Image,
    default: File,
  };

  const entityLabels: Record<string, string> = {
    EMPLOYEE: 'موظف',
    BRANCH: 'فرع',
    SUPPLIER: 'مورد',
    PRODUCT: 'منتج',
  };

  const columns = [
    { key: 'name', header: 'اسم الملف' },
    { key: 'mimeType', header: 'النوع', render: (item: Record<string, any>) => {
      const Icon = mimeIcons[item.mimeType] || mimeIcons.default;
      return <div className="flex items-center gap-2"><Icon className="w-4 h-4" /><span className="text-xs">{item.mimeType?.split('/')[1] || '-'}</span></div>;
    }},
    { key: 'entityType', header: 'مرتبط بـ', render: (item: Record<string, any>) => entityLabels[item.entityType] || item.entityType },
    { key: 'createdAt', header: 'تاريخ الرفع', render: (item: Record<string, any>) => item.createdAt ? new Date(item.createdAt).toLocaleDateString('ar-SA') : '-' },
  ];

  return (
    <div>
      <PageHeader title="المستندات" description="إدارة الملفات والمستندات" actions={<Button><Upload className="w-4 h-4 ml-2" />رفع ملف</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="إجمالي الملفات" value="1,245" icon={<FolderOpen className="w-6 h-6" />} />
        <StatCard title="ملفات PDF" value="456" icon={<FileText className="w-6 h-6" />} />
        <StatCard title="الصور" value="389" icon={<Image className="w-6 h-6" />} />
        <StatCard title="المساحة المستخدمة" value="2.4 GB" icon={<File className="w-6 h-6" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-card rounded-xl border p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">المستندات</h3>
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
          <h3 className="text-lg font-semibold mb-4">الملفات الأخيرة</h3>
          {[
            { name: 'عقد_موظف_جديد.pdf', type: 'PDF', size: '245 KB', date: 'منذ ساعة' },
            { name: 'صورة_الهوية.jpg', type: 'صورة', size: '1.2 MB', date: 'منذ 3 ساعات' },
            { name: 'فاتورة_مورد_123.pdf', type: 'PDF', size: '156 KB', date: 'اليوم' },
            { name: 'شهادة_صحية.pdf', type: 'PDF', size: '89 KB', date: 'أمس' },
            { name: 'رخصة_تجارية.pdf', type: 'PDF', size: '2.1 MB', date: 'منذ يومين' },
          ].map((file, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg mb-2">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-red-500" />
                <div>
                  <span className="text-sm font-medium block">{file.name}</span>
                  <span className="text-xs text-muted-foreground">{file.size}</span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{file.date}</span>
            </div>
          ))}

          <h3 className="text-lg font-semibold mb-4 mt-6">المجلدات</h3>
          {[
            { name: 'عقود الموظفين', count: 156 },
            { name: 'فواتير الموردين', count: 234 },
            { name: 'المستندات القانونية', count: 45 },
            { name: 'الشهادات الصحية', count: 89 },
          ].map((folder, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg mb-2">
              <div className="flex items-center gap-3">
                <FolderOpen className="w-6 h-6 text-yellow-500" />
                <span className="text-sm font-medium">{folder.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">{folder.count} ملف</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
