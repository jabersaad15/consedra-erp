'use client';
import { useAuth } from '@/providers/providers';
import { Bell, Globe, Moon, Sun, Search } from 'lucide-react';
import { useState } from 'react';
const LOCALES = [{code:'en',name:'English'},{code:'ar',name:'العربية'},{code:'fr',name:'Français'},{code:'ur',name:'اردو'},{code:'fa',name:'فارسی'},{code:'hi',name:'हिन्दी'},{code:'bn',name:'বাংলা'}];

export function Header() {
  const { locale, setLocale } = useAuth();
  const [dark, setDark] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const toggleDark = () => { setDark(!dark); document.documentElement.classList.toggle('dark', !dark); };
  return (<header className="h-16 border-b bg-card flex items-center justify-between px-6">
    <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input placeholder="Search..." className="pl-10 pr-4 py-2 bg-muted rounded-lg text-sm w-64 outline-none" /></div>
    <div className="flex items-center gap-2">
      <div className="relative"><button onClick={() => setShowLang(!showLang)} className="p-2 hover:bg-muted rounded-lg"><Globe className="w-5 h-5" /></button>
        {showLang && <div className="absolute right-0 top-full mt-1 bg-card border rounded-lg shadow-lg py-1 z-50 min-w-[140px]">
          {LOCALES.map(l => <button key={l.code} onClick={() => {setLocale(l.code);setShowLang(false)}} className={`block w-full text-left px-4 py-2 text-sm hover:bg-muted ${locale===l.code?'font-bold text-brand-600':''}`}>{l.name}</button>)}
        </div>}
      </div>
      <button onClick={toggleDark} className="p-2 hover:bg-muted rounded-lg">{dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}</button>
      <button className="p-2 hover:bg-muted rounded-lg relative"><Bell className="w-5 h-5" /><span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" /></button>
    </div>
  </header>);
}