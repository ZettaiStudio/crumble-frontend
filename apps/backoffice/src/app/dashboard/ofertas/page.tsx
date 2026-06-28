'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export default function OfertasPage() {
  const [sucursales, setSucursales] = useState<any[]>([]);
  const [sucursalId, setSucursalId] = useState('');
  const [ofertas, setOfertas] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ titulo: '', descripcion: '', diaSemana: '1', horaInicio: '12:00', horaFin: '15:00' });

  useEffect(() => {
    const empresaId = localStorage.getItem('crumble_empresaId');
    if (!empresaId) return;
    apiFetch<any[]>(`/sucursales/por-empresa/${empresaId}`).then(s => { setSucursales(s); if (s.length > 0) setSucursalId(s[0].id); });
  }, []);

  useEffect(() => { if (sucursalId) load(); }, [sucursalId]);

  const load = () => apiFetch<any[]>(`/ofertas/por-sucursal/${sucursalId}`).then(setOfertas);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiFetch('/ofertas', { method: 'POST', body: JSON.stringify({ sucursalId, titulo: form.titulo, descripcion: form.descripcion, diaSemana: parseInt(form.diaSemana), horaInicio: form.horaInicio, horaFin: form.horaFin }) });
    setShowForm(false); setForm({ titulo: '', descripcion: '', diaSemana: '1', horaInicio: '12:00', horaFin: '15:00' }); load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ofertas</h1>
        <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">+ Nueva oferta</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm mb-6 space-y-4">
          <input type="text" placeholder="Título" value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} required className="w-full border rounded-lg px-3 py-2" />
          <textarea placeholder="Descripción" value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} required className="w-full border rounded-lg px-3 py-2" rows={2} />
          <div className="grid grid-cols-3 gap-4">
            <select value={form.diaSemana} onChange={e => setForm(f => ({ ...f, diaSemana: e.target.value }))} className="border rounded-lg px-3 py-2">
              {DIAS.map((d, i) => <option key={i} value={i}>{d}</option>)}
            </select>
            <input type="time" value={form.horaInicio} onChange={e => setForm(f => ({ ...f, horaInicio: e.target.value }))} className="border rounded-lg px-3 py-2" />
            <input type="time" value={form.horaFin} onChange={e => setForm(f => ({ ...f, horaFin: e.target.value }))} className="border rounded-lg px-3 py-2" />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">Guardar</button>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-500 text-sm">Cancelar</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {ofertas.map(o => (
          <div key={o.id} className="bg-white rounded-xl p-4 shadow-sm flex justify-between items-center">
            <div>
              <h3 className="font-bold">{o.titulo}</h3>
              <p className="text-sm text-gray-500">{o.descripcion}</p>
              <p className="text-xs text-gray-400 mt-1">{DIAS[o.diaSemana]} {o.horaInicio} - {o.horaFin}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { apiFetch(`/ofertas/${o.id}/estado`, { method: 'PATCH', body: JSON.stringify({ valor: !o.esActiva }) }).then(load); }}
                className={`text-xs px-2 py-1 rounded ${o.esActiva ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {o.esActiva ? 'Activa' : 'Inactiva'}
              </button>
              <button onClick={() => { apiFetch(`/ofertas/${o.id}`, { method: 'DELETE' }).then(load); }} className="text-red-600 text-sm hover:underline">Eliminar</button>
            </div>
          </div>
        ))}
        {ofertas.length === 0 && <p className="text-gray-400 text-center py-8">No hay ofertas configuradas</p>}
      </div>
    </div>
  );
}
