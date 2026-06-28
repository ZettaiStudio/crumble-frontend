'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function MetricasPage() {
  const [sucursales, setSucursales] = useState<any[]>([]);
  const [sucursalId, setSucursalId] = useState('');
  const [desde, setDesde] = useState(() => { const d = new Date(); d.setDate(d.getDate() - 7); return d.toISOString().split('T')[0]; });
  const [hasta, setHasta] = useState(() => new Date().toISOString().split('T')[0]);
  const [metricas, setMetricas] = useState<any>(null);

  useEffect(() => {
    const empresaId = localStorage.getItem('crumble_empresaId');
    if (!empresaId) return;
    apiFetch<any[]>(`/sucursales/por-empresa/${empresaId}`).then(s => { setSucursales(s); if (s.length > 0) setSucursalId(s[0].id); });
  }, []);

  useEffect(() => { if (sucursalId) load(); }, [sucursalId, desde, hasta]);

  const load = () => apiFetch<any>(`/metricas/resumen/${sucursalId}?desde=${desde}T00:00:00Z&hasta=${hasta}T23:59:59Z`).then(setMetricas).catch(() => setMetricas(null));

  const stats = metricas ? [
    { label: 'Scans QR', value: metricas.totalScansQr },
    { label: 'Vistas de platos', value: metricas.totalVistasPlatos },
    { label: 'Búsquedas', value: metricas.totalBusquedas },
    { label: 'Llamadas al mozo', value: metricas.totalLlamadasMozo },
    { label: 'Logins backoffice', value: metricas.totalLoginsBackoffice },
    { label: 'Ediciones de platos', value: metricas.totalEdicionesPlatos },
    { label: 'Cargas de platos', value: metricas.totalCargasPlatos },
  ] : [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Métricas</h1>

      <div className="flex gap-4 mb-6 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
          <input type="date" value={desde} onChange={e => setDesde(e.target.value)} className="border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
          <input type="date" value={hasta} onChange={e => setHasta(e.target.value)} className="border rounded-lg px-3 py-2" />
        </div>
      </div>

      {metricas ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm text-center">
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center py-8">No hay datos para el período seleccionado</p>
      )}
    </div>
  );
}
