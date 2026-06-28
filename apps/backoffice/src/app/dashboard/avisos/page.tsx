'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function AvisosPage() {
  const [sucursales, setSucursales] = useState<any[]>([]);
  const [sucursalId, setSucursalId] = useState('');
  const [avisos, setAvisos] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ contenido: '', orden: '0' });

  useEffect(() => {
    const empresaId = localStorage.getItem('crumble_empresaId');
    if (!empresaId) return;
    apiFetch<any[]>(`/sucursales/por-empresa/${empresaId}`).then(s => { setSucursales(s); if (s.length > 0) setSucursalId(s[0].id); });
  }, []);

  useEffect(() => { if (sucursalId) load(); }, [sucursalId]);

  const load = () => apiFetch<any[]>(`/avisos/por-sucursal/${sucursalId}`).then(setAvisos);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiFetch('/avisos', { method: 'POST', body: JSON.stringify({ sucursalId, contenido: form.contenido, orden: parseInt(form.orden) }) });
    setShowForm(false); setForm({ contenido: '', orden: '0' }); load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Avisos</h1>
        <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">+ Nuevo aviso</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm mb-6 space-y-4">
          <textarea placeholder="Contenido del aviso" value={form.contenido} onChange={e => setForm(f => ({ ...f, contenido: e.target.value }))} required className="w-full border rounded-lg px-3 py-2" rows={3} />
          <input type="number" placeholder="Orden" value={form.orden} onChange={e => setForm(f => ({ ...f, orden: e.target.value }))} className="w-full border rounded-lg px-3 py-2" />
          <div className="flex gap-3">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">Guardar</button>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-500 text-sm">Cancelar</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {avisos.map(a => (
          <div key={a.id} className="bg-white rounded-xl p-4 shadow-sm flex justify-between items-center">
            <p>{a.contenido}</p>
            <div className="flex gap-2">
              <button onClick={() => { apiFetch(`/avisos/${a.id}/estado`, { method: 'PATCH', body: JSON.stringify({ valor: !a.esActivo }) }).then(load); }}
                className={`text-xs px-2 py-1 rounded ${a.esActivo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {a.esActivo ? 'Activo' : 'Inactivo'}
              </button>
              <button onClick={() => { apiFetch(`/avisos/${a.id}`, { method: 'DELETE' }).then(load); }} className="text-red-600 text-sm hover:underline">Eliminar</button>
            </div>
          </div>
        ))}
        {avisos.length === 0 && <p className="text-gray-400 text-center py-8">No hay avisos configurados</p>}
      </div>
    </div>
  );
}
