'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function EmpresasPage() {
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [sucursalesPorEmpresa, setSucursalesPorEmpresa] = useState<Record<string, any[]>>({});
  const [suscripciones, setSuscripciones] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<any[]>('/empresas').then(async (empresas) => {
      setEmpresas(empresas);
      const sucMap: Record<string, any[]> = {};
      const subMap: Record<string, any> = {};
      await Promise.all(empresas.map(async (e) => {
        const [sucs, sub] = await Promise.all([
          apiFetch<any[]>(`/sucursales/por-empresa/${e.id}`),
          apiFetch<any>(`/suscripciones/empresa/${e.id}`).catch(() => null),
        ]);
        sucMap[e.id] = sucs;
        if (sub) subMap[e.id] = sub;
      }));
      setSucursalesPorEmpresa(sucMap);
      setSuscripciones(subMap);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="text-gray-500">Cargando...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Empresas ({empresas.length})</h1>

      <div className="space-y-4">
        {empresas.map(e => {
          const sucs = sucursalesPorEmpresa[e.id] ?? [];
          const sub = suscripciones[e.id];
          return (
            <div key={e.id} className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-white">{e.nombre}</h3>
                  <p className="text-xs text-gray-500">ID: {e.id}</p>
                </div>
                {sub ? (
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${sub.esActiva ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-red-900/30 text-red-400 border border-red-800'}`}>
                    {sub.esActiva ? 'Suscripción activa' : 'Suscripción inactiva'}
                  </span>
                ) : (
                  <span className="text-xs px-3 py-1 rounded-full bg-gray-700 text-gray-400">Sin suscripción</span>
                )}
              </div>
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="text-gray-500">Sucursales:</span>
                  <span className="text-white ml-2 font-medium">{sucs.length}</span>
                </div>
                <div>
                  <span className="text-gray-500">Registro:</span>
                  <span className="text-gray-300 ml-2">{new Date(e.createdAt).toLocaleDateString('es-AR')}</span>
                </div>
                {sub && (
                  <div>
                    <span className="text-gray-500">Vence:</span>
                    <span className="text-gray-300 ml-2">{new Date(sub.fechaFin).toLocaleDateString('es-AR')}</span>
                  </div>
                )}
              </div>
              {sucs.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                  {sucs.map(s => (
                    <div key={s.id} className="flex justify-between text-sm py-1">
                      <span className="text-gray-300">{s.nombre}</span>
                      <span className="text-gray-500">{s.direccion}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
