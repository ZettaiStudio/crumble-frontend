'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'crumble-admin-2026') {
      localStorage.setItem('crumble_admin', 'true');
      router.push('/dashboard');
    } else {
      setError('Contraseña incorrecta');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-sm p-8 bg-gray-800 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Crumble</h1>
          <p className="text-gray-400 text-sm mt-1">Panel de Administración</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="password" placeholder="Contraseña de administrador" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500" />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">Ingresar</button>
        </form>
      </div>
    </div>
  );
}
