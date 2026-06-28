'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/empresas', label: 'Empresas' },
  { href: '/dashboard/planes', label: 'Planes' },
  { href: '/dashboard/metricas', label: 'Métricas Global' },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('crumble_admin') !== 'true') {
      router.push('/login');
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) return null;

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <aside className="w-56 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-lg font-bold text-white">Crumble</h1>
          <p className="text-xs text-gray-500">Administración</p>
        </div>
        <nav className="flex-1 p-2">
          {navItems.map(item => (
            <Link key={item.href} href={item.href}
              className={`block px-3 py-2 rounded-lg text-sm mb-1 ${pathname === item.href ? 'bg-blue-600/20 text-blue-400 font-medium' : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'}`}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-2 border-t border-gray-700">
          <button onClick={() => { localStorage.removeItem('crumble_admin'); router.push('/login'); }}
            className="w-full px-3 py-2 text-sm text-red-400 hover:bg-red-900/20 rounded-lg text-left">
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
  );
}
