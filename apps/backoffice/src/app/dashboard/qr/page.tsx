'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

export default function QrPage() {
  const [sucursales, setSucursales] = useState<any[]>([]);
  const [sucursalId, setSucursalId] = useState('');
  const [mesas, setMesas] = useState<any[]>([]);
  const [tokens, setTokens] = useState<Record<string, any>>({});
  const [showAddMesa, setShowAddMesa] = useState(false);
  const [nuevoNumero, setNuevoNumero] = useState('');

  useEffect(() => {
    const empresaId = localStorage.getItem('crumble_empresaId');
    if (!empresaId) return;
    apiFetch<any[]>(`/sucursales/por-empresa/${empresaId}`).then(s => { setSucursales(s); if (s.length > 0) setSucursalId(s[0].id); });
  }, []);

  useEffect(() => { if (sucursalId) loadMesas(); }, [sucursalId]);

  const loadMesas = () => apiFetch<any[]>(`/mesas/por-sucursal/${sucursalId}`).then(setMesas);

  const addMesa = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiFetch('/mesas', { method: 'POST', body: JSON.stringify({ sucursalId, numero: parseInt(nuevoNumero) }) });
    setShowAddMesa(false); setNuevoNumero(''); loadMesas();
  };

  const generarQr = async (mesaId: string) => {
    const token = await apiFetch<any>('/qr/generar', { method: 'POST', body: JSON.stringify({ mesaId, duracionHoras: 12 }) });
    setTokens(t => ({ ...t, [mesaId]: token }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Códigos QR</h1>
        <button onClick={() => setShowAddMesa(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">+ Agregar mesa</button>
      </div>

      {showAddMesa && (
        <form onSubmit={addMesa} className="bg-white rounded-xl p-6 shadow-sm mb-6 flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Número de mesa</label>
            <input type="number" min="1" value={nuevoNumero} onChange={e => setNuevoNumero(e.target.value)} required className="w-full border rounded-lg px-3 py-2" />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">Agregar</button>
          <button type="button" onClick={() => setShowAddMesa(false)} className="text-gray-500 text-sm">Cancelar</button>
        </form>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {mesas.map(m => (
          <div key={m.id} className="bg-white rounded-xl p-4 shadow-sm text-center">
            <h3 className="font-bold text-lg mb-2">Mesa {m.numero}</h3>
            {tokens[m.id] ? (
              <div>
                <img src={`${API_URL}/qr/imagen/${tokens[m.id].token}`} alt={`QR Mesa ${m.numero}`} className="mx-auto mb-2 w-40 h-40" />
                <a href={`${API_URL}/qr/imagen/${tokens[m.id].token}`} download={`qr-mesa-${m.numero}.png`} className="text-blue-600 text-sm hover:underline">Descargar PNG</a>
              </div>
            ) : (
              <button onClick={() => generarQr(m.id)} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200">Generar QR</button>
            )}
          </div>
        ))}
        {mesas.length === 0 && <p className="text-gray-400 col-span-3 text-center py-8">No hay mesas configuradas</p>}
      </div>
    </div>
  );
}
