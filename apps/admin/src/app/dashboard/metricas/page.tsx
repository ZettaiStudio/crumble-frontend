'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function MetricasGlobalPage() {
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [metricasPorSucursal, setMetricasPorSucursal] = useState<Record<string, any>>({});
  const [desde, setDesde] = useState(() => { const d = new Date(); d.setDate(d.getDate() - 30); return d.toISOString().split('T')[0]; });
  const [hasta, setHasta] = useState(() => new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, [desde, hasta]);

  const load = async () => {
    setLoading(true);
    const empresas = await apiFetch<any[]>('/empresas');
    setEmpresas(empresas);

    const metMap: Record<string, any> = {};
    for (const e of empresas) {
      const sucs = await apiFetch<any[]>(`/sucursales/por-empresa/${e.id}`);
      for (const s of sucs) {
        try {
          const m = await apiFetch<any>(`/metricas/resumen/${s.id}?desde=${desde}T00:00:00Z&hasta=${hasta}T23:59:59Z`);
          metMap[s.id] = { ...m, sucursalNombre: s.nombre, empresaNombre: e.nombre };
        } catch {}
      }
    }
    setMetricasPorSucursal(metMap);
    setLoading(false);
  };

  const totales = Object.values(metricasPorSucursal).reduce((acc: any, m: any) => ({
    scans: (acc.scans ?? 0) + m.totalScansQr,
    vistas: (acc.vistas ?? 0) + m.totalVistasPlatos,
    busquedas: (acc.busquedas ?? 0) + m.totalBusquedas,
    llamadas: (acc.llamadas ?? 0) + m.totalLlamadasMozo,
    logins: (acc.logins ?? 0) + m.totalLoginsBackoffice,
  }), {});

  const globalStats = [
    { label: 'Scans QR', value: totales.scans ?? 0 },
    { label: 'Vistas platos', value: totales.vistas ?? 0 },
    { label: 'Búsquedas', value: totales.busquedas ?? 0 },
    { label: 'Llamadas mozo', value: totales.llamadas ?? 0 },
    { label: 'Logins backoffice', value: totales.logins ?? 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Métricas Globales</h1>

      <div className="flex gap-4 mb-6 items-end">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Desde</label>
          <input type="date" value={desde} onChange={e => setDesde(e.target.value)} className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Hasta</label>
          <input type="date" value={hasta} onChange={e => setHasta(e.target.value)} className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
        </div>
      </div>

      {loading ? <p className="text-gray-500">Cargando...</p> : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {globalStats.map(s => (
              <div key={s.label} className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-gray-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <h2 className="text-lg font-bold text-white mb-4">Por sucursal</h2>
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Sucursal</th>
                  <th className="text-right px-4 py-3 text-gray-400 font-medium">Scans</th>
                  <th className="text-right px-4 py-3 text-gray-400 font-medium">Vistas</th>
                  <th className="text-right px-4 py-3 text-gray-400 font-medium">Búsquedas</th>
                  <th className="text-right px-4 py-3 text-gray-400 font-medium">Mozo</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(metricasPorSucursal).map((m: any) => (
                  <tr key={m.sucursalId} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                    <td className="px-4 py-3">
                      <span className="text-white">{m.sucursalNombre}</span>
                      <span className="text-gray-500 text-xs block">{m.empresaNombre}</span>
                    </td>
                    <td className="text-right px-4 py-3 text-gray-300">{m.totalScansQr}</td>
                    <td className="text-right px-4 py-3 text-gray-300">{m.totalVistasPlatos}</td>
                    <td className="text-right px-4 py-3 text-gray-300">{m.totalBusquedas}</td>
                    <td className="text-right px-4 py-3 text-gray-300">{m.totalLlamadasMozo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {Object.keys(metricasPorSucursal).length === 0 && <p className="text-gray-500 text-center py-6">Sin datos en el período</p>}
          </div>
        </>
      )}
    </div>
  );
}
