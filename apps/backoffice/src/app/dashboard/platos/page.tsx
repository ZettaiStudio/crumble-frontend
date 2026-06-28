'use client';

import { useEffect, useState } from 'react';
import { apiFetch, apiUpload } from '@/lib/api';

export default function PlatosPage() {
  const [sucursales, setSucursales] = useState<any[]>([]);
  const [sucursalId, setSucursalId] = useState('');
  const [platos, setPlatos] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', imagenUrl: '', categoria: '', datosNutricionales: '' });

  useEffect(() => {
    const empresaId = localStorage.getItem('crumble_empresaId');
    if (!empresaId) return;
    apiFetch<any[]>(`/sucursales/por-empresa/${empresaId}`).then(s => {
      setSucursales(s);
      if (s.length > 0) setSucursalId(s[0].id);
    });
  }, []);

  useEffect(() => {
    if (sucursalId) loadPlatos();
  }, [sucursalId]);

  const loadPlatos = () => apiFetch<any[]>(`/platos/por-sucursal/${sucursalId}`).then(setPlatos);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      await apiFetch(`/platos/${editId}`, { method: 'PUT', body: JSON.stringify({ nombre: form.nombre, descripcion: form.descripcion, imagenUrl: form.imagenUrl || null, categoria: form.categoria || null, datosNutricionales: form.datosNutricionales || null }) });
      if (form.precio) await apiFetch(`/platos/${editId}/precio`, { method: 'PATCH', body: JSON.stringify({ nuevoPrecio: parseFloat(form.precio) }) });
    } else {
      await apiFetch('/platos', { method: 'POST', body: JSON.stringify({ sucursalId, nombre: form.nombre, descripcion: form.descripcion, precio: parseFloat(form.precio), imagenUrl: form.imagenUrl || null, categoria: form.categoria || null, datosNutricionales: form.datosNutricionales || null }) });
    }
    setShowForm(false); setEditId(null); setForm({ nombre: '', descripcion: '', precio: '', imagenUrl: '', categoria: '', datosNutricionales: '' }); loadPlatos();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { url } = await apiUpload('/archivos/imagen', file);
    setForm(f => ({ ...f, imagenUrl: url }));
  };

  const toggleFlag = async (id: string, flag: string, valor: boolean) => {
    await apiFetch(`/platos/${id}/${flag}`, { method: 'PATCH', body: JSON.stringify({ valor }) });
    loadPlatos();
  };

  const deletePlato = async (id: string) => {
    if (!confirm('¿Eliminar este plato definitivamente?')) return;
    await apiFetch(`/platos/${id}`, { method: 'DELETE' });
    loadPlatos();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Platos</h1>
        <div className="flex gap-3">
          {sucursales.length > 1 && (
            <select value={sucursalId} onChange={e => setSucursalId(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
              {sucursales.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
            </select>
          )}
          <button onClick={() => { setShowForm(true); setEditId(null); setForm({ nombre: '', descripcion: '', precio: '', imagenUrl: '', categoria: '', datosNutricionales: '' }); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            + Nuevo plato
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm mb-6 space-y-4">
          <h2 className="font-bold text-lg">{editId ? 'Editar plato' : 'Nuevo plato'}</h2>
          <input type="text" placeholder="Nombre" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} required className="w-full border rounded-lg px-3 py-2" />
          <textarea placeholder="Descripción" value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} required className="w-full border rounded-lg px-3 py-2" rows={3} />
          <div className="grid grid-cols-2 gap-4">
            <input type="number" step="0.01" placeholder="Precio" value={form.precio} onChange={e => setForm(f => ({ ...f, precio: e.target.value }))} required={!editId} className="border rounded-lg px-3 py-2" />
            <input type="text" placeholder="Categoría" value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))} className="border rounded-lg px-3 py-2" />
          </div>
          <input type="text" placeholder="Datos nutricionales (opcional)" value={form.datosNutricionales} onChange={e => setForm(f => ({ ...f, datosNutricionales: e.target.value }))} className="w-full border rounded-lg px-3 py-2" />
          <div>
            <label className="block text-sm text-gray-600 mb-1">Imagen</label>
            <input type="file" accept="image/*,video/mp4,video/webm" onChange={handleImageUpload} className="text-sm" />
            {form.imagenUrl && <p className="text-xs text-green-600 mt-1">Imagen cargada</p>}
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Guardar</button>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-500 text-sm">Cancelar</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {platos.map(p => (
          <div key={p.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
            {p.imagenUrl && <img src={p.imagenUrl} alt={p.nombre} className="w-16 h-16 rounded-lg object-cover" />}
            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className="font-bold">{p.nombre}</h3>
                <span className="font-bold">${p.precioActual.toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-500 line-clamp-1">{p.descripcion}</p>
              <div className="flex gap-2 mt-2">
                <button onClick={() => toggleFlag(p.id, 'visibilidad', !p.esVisible)} className={`text-xs px-2 py-1 rounded ${p.esVisible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {p.esVisible ? 'Visible' : 'Oculto'}
                </button>
                <button onClick={() => toggleFlag(p.id, 'disponibilidad', !p.esDisponible)} className={`text-xs px-2 py-1 rounded ${p.esDisponible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                  {p.esDisponible ? 'Disponible' : 'Agotado'}
                </button>
                <button onClick={() => toggleFlag(p.id, 'sugerencia-del-dia', !p.esSugerenciaDelDia)} className={`text-xs px-2 py-1 rounded ${p.esSugerenciaDelDia ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>
                  Día
                </button>
                <button onClick={() => toggleFlag(p.id, 'sugerencia-del-chef', !p.esSugerenciaDelChef)} className={`text-xs px-2 py-1 rounded ${p.esSugerenciaDelChef ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                  Chef
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditId(p.id); setForm({ nombre: p.nombre, descripcion: p.descripcion, precio: '', imagenUrl: p.imagenUrl ?? '', categoria: p.categoria ?? '', datosNutricionales: p.datosNutricionales ?? '' }); setShowForm(true); }} className="text-blue-600 text-sm hover:underline">Editar</button>
              <button onClick={() => deletePlato(p.id)} className="text-red-600 text-sm hover:underline">Eliminar</button>
            </div>
          </div>
        ))}
        {platos.length === 0 && <p className="text-gray-400 text-center py-8">No hay platos cargados</p>}
      </div>
    </div>
  );
}
