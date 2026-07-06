'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

interface Sucursal {
  id: string;
  empresaId: string;
  nombre: string;
  direccion: string;
  telefono?: string;
  createdAt: string;
}

const emptyForm = { nombre: '', direccion: '', telefono: '' };

export default function SucursalesPage() {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const empresaId = localStorage.getItem('crumble_empresaId');
    if (!empresaId) { setLoading(false); return; }
    try {
      const data = await apiFetch<Sucursal[]>(`/sucursales/por-empresa/${empresaId}`);
      setSucursales(data);
    } catch {}
    setLoading(false);
  };

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setError('');
    setShowForm(true);
  };

  const openEdit = (s: Sucursal) => {
    setEditId(s.id);
    setForm({ nombre: s.nombre, direccion: s.direccion, telefono: s.telefono ?? '' });
    setError('');
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const body = { nombre: form.nombre, direccion: form.direccion, telefono: form.telefono || null };
      if (editId) {
        await apiFetch(`/sucursales/${editId}`, { method: 'PUT', body: JSON.stringify(body) });
      } else {
        const empresaId = localStorage.getItem('crumble_empresaId') ?? '';
        await apiFetch('/sucursales', { method: 'POST', body: JSON.stringify({ ...body, empresaId }) });
      }
      setShowForm(false);
      setEditId(null);
      setForm(emptyForm);
      load();
    } catch (err: any) {
      setError(err.message ?? 'Error al guardar');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, nombre: string) => {
    if (!confirm(`¿Eliminar la sucursal "${nombre}"? Esta acción no se puede deshacer.`)) return;
    try {
      await apiFetch(`/sucursales/${id}`, { method: 'DELETE' });
      load();
    } catch (err: any) {
      alert(err.message ?? 'No se pudo eliminar');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sucursales</h1>
        <button onClick={openCreate} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
          + Nueva sucursal
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{editId ? 'Editar sucursal' : 'Nueva sucursal'}</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nombre de la sucursal"
              value={form.nombre}
              onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Dirección"
              value={form.direccion}
              onChange={e => setForm(f => ({ ...f, direccion: e.target.value }))}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
            <input
              type="tel"
              placeholder="Teléfono (opcional)"
              value={form.telefono}
              onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
          <div className="flex gap-3 mt-5">
            <button type="submit" disabled={saving}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
              {saving ? 'Guardando...' : editId ? 'Guardar cambios' : 'Crear sucursal'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-500 text-sm hover:text-gray-700">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500 text-sm">Cargando...</p>
      ) : sucursales.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg mb-2">Sin sucursales</p>
          <p className="text-sm">Creá tu primera sucursal para empezar a cargar el menú.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sucursales.map(s => (
            <div key={s.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 text-base">{s.nombre}</h3>
                <p className="text-sm text-gray-500 mt-1">{s.direccion}</p>
                {s.telefono && <p className="text-sm text-gray-500">{s.telefono}</p>}
                <p className="text-xs text-gray-400 mt-2">
                  Registrada {new Date(s.createdAt).toLocaleDateString('es-AR')}
                </p>
              </div>
              <div className="flex gap-2 ml-4 flex-shrink-0">
                <button
                  onClick={() => openEdit(s)}
                  className="text-xs px-3 py-1.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(s.id, s.nombre)}
                  className="text-xs px-3 py-1.5 border border-red-200 rounded-lg text-red-600 hover:bg-red-50"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
