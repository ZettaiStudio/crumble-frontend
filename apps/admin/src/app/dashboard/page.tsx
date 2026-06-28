'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function AdminDashboardPage() {
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [planes, setPlanes] = useState<any[]>([]);
  const [suscripciones, setSuscripciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch<any[]>('/empresas'),
      apiFetch<any[]>('/planes'),
      apiFetch<any[]>('/suscripciones'),
    ]).then(([e, p, s]) => {
      setEmpresas(e);
      setPlanes(p);
      setSuscripciones(s);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-500">Cargando...</p>;

  const suscActivas = suscripciones.filter(s => s.esActiva);

  const stats = [
    { label: 'Empresas', value: empresas.length, color: 'blue' },
    { label: 'Planes activos', value: planes.filter(p => p.esActivo).length, color: 'green' },
    { label: 'Suscripciones activas', value: suscActivas.length, color: 'purple' },
    { label: 'Ingresos mensuales', value: `$${suscActivas.reduce((acc, s) => { const plan = planes.find(p => p.id === s.planId); return acc + (plan?.precioMensual ?? 0); }, 0).toLocaleString('es-AR')}`, color: 'yellow' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <p className="text-3xl font-bold text-white">{s.value}</p>
            <p className="text-sm text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-bold text-white mb-4">Últimas empresas registradas</h2>
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Empresa</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Fecha registro</th>
            </tr>
          </thead>
          <tbody>
            {empresas.slice(0, 10).map(e => (
              <tr key={e.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                <td className="px-4 py-3 text-white">{e.nombre}</td>
                <td className="px-4 py-3 text-gray-400">{new Date(e.createdAt).toLocaleDateString('es-AR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {empresas.length === 0 && <p className="text-gray-500 text-center py-6">Sin empresas registradas</p>}
      </div>
    </div>
  );
}
