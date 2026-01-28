'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Column<T> { key: string; header: string; render?: (item: T) => React.ReactNode; }
interface Props<T> { columns: Column<T>[]; data: T[]; total?: number; page?: number; limit?: number; onPageChange?: (p: number) => void; onSearch?: (s: string) => void; actions?: (item: T) => React.ReactNode; title?: string; headerActions?: React.ReactNode; }

export function DataTable<T extends Record<string, any>>({ columns, data, total=0, page=1, limit=20, onPageChange, onSearch, actions, title, headerActions }: Props<T>) {
  const [search, setSearch] = useState('');
  const totalPages = Math.ceil(total / limit);
  return (<div className="bg-card rounded-xl border shadow-sm">
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-3">{title && <h2 className="text-lg font-semibold">{title}</h2>}
        <input type="text" value={search} onChange={e => { setSearch(e.target.value); onSearch?.(e.target.value); }} placeholder="Search..." className="pl-3 pr-4 py-2 bg-muted rounded-lg text-sm w-64 outline-none focus:ring-2 focus:ring-brand-500" />
      </div>
      {headerActions}
    </div>
    <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b bg-muted/50">
      {columns.map(c => <th key={c.key} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">{c.header}</th>)}
      {actions && <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Actions</th>}
    </tr></thead><tbody className="divide-y">
      {data.length === 0 ? <tr><td colSpan={columns.length+(actions?1:0)} className="px-4 py-8 text-center text-muted-foreground">No records</td></tr>
        : data.map((item, i) => <tr key={i} className="hover:bg-muted/30"><>
          {columns.map(c => <td key={c.key} className="px-4 py-3 text-sm">{c.render ? c.render(item) : item[c.key]}</td>)}
          {actions && <td className="px-4 py-3 text-right">{actions(item)}</td>}
        </></tr>)}
    </tbody></table></div>
    {totalPages > 1 && <div className="flex items-center justify-between p-4 border-t">
      <span className="text-sm text-muted-foreground">Page {page} of {totalPages} ({total} total)</span>
      <div className="flex gap-1">
        <button onClick={() => onPageChange?.(page-1)} disabled={page<=1} className="px-3 py-1 rounded text-sm hover:bg-muted disabled:opacity-50">Prev</button>
        <button onClick={() => onPageChange?.(page+1)} disabled={page>=totalPages} className="px-3 py-1 rounded text-sm hover:bg-muted disabled:opacity-50">Next</button>
      </div>
    </div>}
  </div>);
}