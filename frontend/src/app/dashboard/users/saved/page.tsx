'use client';

import { useState, useEffect } from 'react';
import { usersService } from '@/services/api';
import Link from 'next/link';
import Image from 'next/image';

interface SavedUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
  created_at: string;
  updated_at: string;
}

export default function SavedUsersPage() {
  const [users, setUsers] = useState<SavedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadSavedUsers();
  }, []);

  const loadSavedUsers = async () => {
    setLoading(true);
    try {
      const savedUsers = await usersService.getSavedUsers();
      setUsers(savedUsers);
    } catch (error) {
      console.error('Error loading saved users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este usuario de la base local?')) {
      return;
    }

    try {
      setUsers(users.filter((u) => u.id !== id));
      alert('Usuario eliminado (simulado)');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error al eliminar usuario');
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      `${user.first_name} ${user.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Cargando usuarios guardados...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Usuarios guardados localmente</h1>
        <Link
          href="/dashboard/users"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          ← Volver a ReqRes
        </Link>
      </div>

      <div className="max-w-md">
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {users.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">
            No hay usuarios guardados localmente
          </p>
          <Link
            href="/dashboard/users"
            className="text-blue-600 hover:text-blue-800"
          >
            Ir a importar usuarios
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white"
          >
            <div className="flex items-center space-x-4">
              <Image
                src={user.avatar}
                alt={`${user.first_name} ${user.last_name}`}
                width={50}
                height={50}
                className="rounded-full"
              />
              <div className="flex-1">
                <Link
                  href={`/dashboard/users/${user.id}`}
                  className="font-semibold hover:text-blue-600"
                >
                  {user.first_name} {user.last_name}
                </Link>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Guardado: {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <Link
                href={`/dashboard/users/${user.id}`}
                className="px-3 py-1 text-blue-600 hover:text-blue-800 text-sm border border-blue-300 rounded-md hover:bg-blue-50"
              >
                Ver
              </Link>
              <button
                onClick={() => handleDelete(user.id)}
                className="px-3 py-1 text-red-600 hover:text-red-800 text-sm border border-red-300 rounded-md hover:bg-red-50"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && users.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          {`No hay resultados para "${searchTerm}"`}
        </div>
      )}
    </div>
  );
}
