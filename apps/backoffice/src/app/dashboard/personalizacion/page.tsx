'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function PersonalizacionPage() {
  const [sucursales, setSucursales] = useState<any[]>([]);
  const [sucursalId, setSucursalId] = useState('');
  const [form, setForm] = useState({ logoUrl: '', fondoUrl: '', colorPrimario: '#1a1a2e', colorSecundario: '#16213e', colorTexto: '#eaeaea', fuenteTitulos: '', fuenteCuerpo: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const empresaId = localStorage.getItem('crumble_empresaId');
    if (!empresaId) return;
    apiFetch<any[]>(`/sucursales/por-empresa/${empresaId}`).then(s => { setSucursales(s); if (s.length > 0) setSucursalId(s[0].id); });
  }, []);

  useEffect(() => {
    if (!sucursalId) return;
    apiFetch<any>(`/personalizacion-carta/${sucursalId}`).then(p => {
      setForm({ logoUrl: p.logoUrl ?? '', fondoUrl: p.fondoUrl ?? '', colorPrimario: p.colorPrimario ?? '#1a1a2e', colorSecundario: p.colorSecundario ?? '#16213e', colorTexto: p.colorTexto ?? '#eaeaea', fuenteTitulos: p.fuenteTitulos ?? '', fuenteCuerpo: p.fuenteCuerpo ?? '' });
    });
  }, [sucursalId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiFetch(`/personalizacion-carta/${sucursalId}`, { method: 'PUT', body: JSON.stringify({ logoUrl: form.logoUrl || null, fondoUrl: form.fondoUrl || null, colorPrimario: form.colorPrimario || null, colorSecundario: form.colorSecundario || null, colorTexto: form.colorTexto || null, fuenteTitulos: form.fuenteTitulos || null, fuenteCuerpo: form.fuenteCuerpo || null }) });
    setSaved(true); setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Personalización de la carta</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm space-y-4 max-w-xl">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL del logo</label>
          <input type="text" value={form.logoUrl} onChange={e => setForm(f => ({ ...f, logoUrl: e.target.value }))} className="w-full border rounded-lg px-3 py-2" placeholder="https://..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL de fondo</label>
          <input type="text" value={form.fondoUrl} onChange={e => setForm(f => ({ ...f, fondoUrl: e.target.value }))} className="w-full border rounded-lg px-3 py-2" placeholder="https://..." />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color primario</label>
            <input type="color" value={form.colorPrimario} onChange={e => setForm(f => ({ ...f, colorPrimario: e.target.value }))} className="w-full h-10 rounded border cursor-pointer" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color secundario</label>
            <input type="color" value={form.colorSecundario} onChange={e => setForm(f => ({ ...f, colorSecundario: e.target.value }))} className="w-full h-10 rounded border cursor-pointer" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color texto</label>
            <input type="color" value={form.colorTexto} onChange={e => setForm(f => ({ ...f, colorTexto: e.target.value }))} className="w-full h-10 rounded border cursor-pointer" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fuente títulos</label>
            <input type="text" value={form.fuenteTitulos} onChange={e => setForm(f => ({ ...f, fuenteTitulos: e.target.value }))} className="w-full border rounded-lg px-3 py-2" placeholder="Roboto" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fuente cuerpo</label>
            <input type="text" value={form.fuenteCuerpo} onChange={e => setForm(f => ({ ...f, fuenteCuerpo: e.target.value }))} className="w-full border rounded-lg px-3 py-2" placeholder="Open Sans" />
          </div>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
          {saved ? 'Guardado!' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
}
