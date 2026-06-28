'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function DashboardPage() {
  const [sucursales, setSucursales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const empresaId = localStorage.getItem('crumble_empresaId');
    if (!empresaId) return;

    apiFetch<any[]>(`/sucursales/por-empresa/${empresaId}`)
      .then(setSucursales)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-500">Cargando...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Panel de administración</h1>

      {sucursales.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center">
          <p className="text-gray-500 mb-4">No tenés sucursales configuradas.</p>
          <p className="text-sm text-gray-400">Creá tu primera sucursal para empezar a cargar tu carta.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {sucursales.map(s => (
            <div key={s.id} className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg">{s.nombre}</h3>
              <p className="text-gray-500 text-sm">{s.direccion}</p>
              {s.telefono && <p className="text-gray-400 text-sm">{s.telefono}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
