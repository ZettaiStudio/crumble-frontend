'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Inicio' },
  { href: '/dashboard/platos', label: 'Platos' },
  { href: '/dashboard/sucursales', label: 'Sucursales' },
  { href: '/dashboard/ofertas', label: 'Ofertas' },
  { href: '/dashboard/convenios', label: 'Convenios' },
  { href: '/dashboard/avisos', label: 'Avisos' },
  { href: '/dashboard/personalizacion', label: 'Personalización' },
  { href: '/dashboard/qr', label: 'QR' },
  { href: '/dashboard/metricas', label: 'Métricas' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('crumble_token')) {
      router.push('/login');
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) return null;

  return (
    <div className="flex h-screen">
      <aside className="w-56 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Crumble</h1>
        </div>
        <nav className="flex-1 p-2">
          {navItems.map(item => (
            <Link key={item.href} href={item.href}
              className={`block px-3 py-2 rounded-lg text-sm mb-1 ${pathname === item.href ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-2 border-t">
          <button onClick={() => { localStorage.clear(); router.push('/login'); }}
            className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg text-left">
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
