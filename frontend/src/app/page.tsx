'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const { user, logout } = useAuthStore();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black p-6">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-lg text-center">
        <h1 className="text-3xl text-white font-bold mb-4">Bienvenid@ a la App de Películas 🎬</h1>
        {user ? (
          <>
            <p className="text-lg">Hola, {user.name}</p>
            <button
              onClick={logout}
              className="mt-4 bg-gradient-to-r from-red-600 to-red-900 text-white rounded-lg hover:from-red-700 hover:to-red-950 cursor-pointer"
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <p className="text-gray-300 mb-6">Accedé a tu cuenta o registrate para comenzar.</p>
            <div className="flex justify-center gap-4">
              <Link
                href="/login"
                className="bg-gradient-to-r from-violet-700 to-blue-800 text-white rounded-lg text-white px-4 py-2 hover:from-violet-800 hover:to-blue-900 transition"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 px-4 py-2 rounded-lg hover:from-gray-200 hover:to-gray-300  transition"
              >
                Crear cuenta
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
