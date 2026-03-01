'use client';

import { useState, useEffect } from 'react';
import { usersService } from '@/services/api';
import Link from 'next/link';
import Image from 'next/image';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

interface SavedUser extends User {
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [savedUsers, setSavedUsers] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
    loadSavedUsers();
  }, [page]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await usersService.getUsersFromReqRes(page);
      setUsers(response.data);
      setTotalPages(response.total_pages);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSavedUsers = async () => {
    try {
      const saved = await usersService.getSavedUsers();
      setSavedUsers(new Set(saved.map((u: SavedUser) => u.id)));
    } catch (error) {
      console.error('Error loading saved users:', error);
    }
  };

  const handleImport = async (userId: number) => {
    try {
      await usersService.importUser(userId);
      setSavedUsers((prev) => new Set([...prev, userId]));
    } catch (error) {
      console.error('Error importing user:', error);
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
        <div className="text-gray-500">Cargando usuarios...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Usuarios de ReqRes</h1>
        <Link
          href="/dashboard/users/saved"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          View saved ({savedUsers.size})
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
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
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <Link
                href={`/dashboard/users/${user.id}`}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                See more
              </Link>

              {savedUsers.has(user.id) ? (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  ✓ Saved
                </span>
              ) : (
                <button
                  onClick={() => handleImport(user.id)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                >
                  Save locally
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length > 0 && (
        <div className="flex justify-center space-x-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}

      {filteredUsers.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No users were found
        </div>
      )}
    </div>
  );
}
