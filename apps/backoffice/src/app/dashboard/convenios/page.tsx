'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function ConveniosPage() {
  const [sucursales, setSucursales] = useState<any[]>([]);
  const [sucursalId, setSucursalId] = useState('');
  const [convenios, setConvenios] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nombreTarjeta: '', descripcion: '', porcentajeDescuento: '' });

  useEffect(() => {
    const empresaId = localStorage.getItem('crumble_empresaId');
    if (!empresaId) return;
    apiFetch<any[]>(`/sucursales/por-empresa/${empresaId}`).then(s => { setSucursales(s); if (s.length > 0) setSucursalId(s[0].id); });
  }, []);

  useEffect(() => { if (sucursalId) load(); }, [sucursalId]);

  const load = () => apiFetch<any[]>(`/convenios-tarjeta/por-sucursal/${sucursalId}`).then(setConvenios);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiFetch('/convenios-tarjeta', { method: 'POST', body: JSON.stringify({ sucursalId, nombreTarjeta: form.nombreTarjeta, descripcion: form.descripcion, porcentajeDescuento: parseFloat(form.porcentajeDescuento) }) });
    setShowForm(false); setForm({ nombreTarjeta: '', descripcion: '', porcentajeDescuento: '' }); load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Convenios con tarjeta</h1>
        <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">+ Nuevo convenio</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm mb-6 space-y-4">
          <input type="text" placeholder="Nombre de la tarjeta" value={form.nombreTarjeta} onChange={e => setForm(f => ({ ...f, nombreTarjeta: e.target.value }))} required className="w-full border rounded-lg px-3 py-2" />
          <textarea placeholder="Descripción del beneficio" value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} required className="w-full border rounded-lg px-3 py-2" rows={2} />
          <input type="number" step="0.01" min="0.01" max="100" placeholder="% descuento" value={form.porcentajeDescuento} onChange={e => setForm(f => ({ ...f, porcentajeDescuento: e.target.value }))} required className="w-full border rounded-lg px-3 py-2" />
          <div className="flex gap-3">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">Guardar</button>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-500 text-sm">Cancelar</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {convenios.map(c => (
          <div key={c.id} className="bg-white rounded-xl p-4 shadow-sm flex justify-between items-center">
            <div>
              <h3 className="font-bold">{c.nombreTarjeta} — {c.porcentajeDescuento}%</h3>
              <p className="text-sm text-gray-500">{c.descripcion}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { apiFetch(`/convenios-tarjeta/${c.id}/estado`, { method: 'PATCH', body: JSON.stringify({ valor: !c.esActivo }) }).then(load); }}
                className={`text-xs px-2 py-1 rounded ${c.esActivo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {c.esActivo ? 'Activo' : 'Inactivo'}
              </button>
              <button onClick={() => { apiFetch(`/convenios-tarjeta/${c.id}`, { method: 'DELETE' }).then(load); }} className="text-red-600 text-sm hover:underline">Eliminar</button>
            </div>
          </div>
        ))}
        {convenios.length === 0 && <p className="text-gray-400 text-center py-8">No hay convenios configurados</p>}
      </div>
    </div>
  );
}
