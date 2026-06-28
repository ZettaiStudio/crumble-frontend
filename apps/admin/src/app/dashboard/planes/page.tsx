'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function PlanesPage() {
  const [planes, setPlanes] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nombre: '', maxSucursales: '', precioMensual: '' });

  useEffect(() => { load(); }, []);

  const load = () => apiFetch<any[]>('/planes').then(setPlanes);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiFetch('/planes', { method: 'POST', body: JSON.stringify({ nombre: form.nombre, maxSucursales: parseInt(form.maxSucursales), precioMensual: parseFloat(form.precioMensual) }) });
    setShowForm(false);
    setForm({ nombre: '', maxSucursales: '', precioMensual: '' });
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Planes</h1>
        <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">+ Nuevo plan</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6 space-y-4">
          <input type="text" placeholder="Nombre del plan (ej: Starter)" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} required className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500" />
          <div className="grid grid-cols-2 gap-4">
            <input type="number" min="1" placeholder="Max sucursales" value={form.maxSucursales} onChange={e => setForm(f => ({ ...f, maxSucursales: e.target.value }))} required className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500" />
            <input type="number" step="0.01" min="0" placeholder="Precio mensual ($)" value={form.precioMensual} onChange={e => setForm(f => ({ ...f, precioMensual: e.target.value }))} required className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500" />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">Crear plan</button>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 text-sm">Cancelar</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {planes.map(p => (
          <div key={p.id} className={`rounded-xl p-6 border ${p.esActivo ? 'bg-gray-800 border-gray-700' : 'bg-gray-800/50 border-gray-700/50 opacity-60'}`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-white">{p.nombre}</h3>
              <button onClick={() => { apiFetch(`/planes/${p.id}/estado`, { method: 'PATCH', body: JSON.stringify({ esActivo: !p.esActivo }) }).then(load); }}
                className={`text-xs px-2 py-1 rounded-full ${p.esActivo ? 'bg-green-900/30 text-green-400' : 'bg-gray-700 text-gray-500'}`}>
                {p.esActivo ? 'Activo' : 'Inactivo'}
              </button>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              ${p.precioMensual.toLocaleString('es-AR')}<span className="text-sm font-normal text-gray-500">/mes</span>
            </div>
            <p className="text-sm text-gray-400">Hasta {p.maxSucursales} {p.maxSucursales === 1 ? 'sucursal' : 'sucursales'}</p>
          </div>
        ))}
        {planes.length === 0 && <p className="text-gray-500 col-span-3 text-center py-8">No hay planes creados</p>}
      </div>
    </div>
  );
}
