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
        <div className="text-gray-500">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="space-y-10 px-4 sm:px-6 lg:px-8 py-8">
      <div className="card border border-gray-100 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">ReqRes Users</h1>
            <p className="text-sm text-gray-600">
              Browse and import users from ReqRes API
            </p>
          </div>

          <Link
            href="/dashboard/users/saved"
            className="btn-secondary btn-sm whitespace-nowrap"
          >
            Saved ({savedUsers.size})
          </Link>
        </div>

        <div className="pt-6  space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Search Users
          </label>

          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-9"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-6">
          Available Users ({filteredUsers.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="card border border-gray-100 hover:shadow-md transition duration-200"
            >
              <div className="flex items-center gap-4 mb-6">
                <Image
                  src={user.avatar}
                  alt={`${user.first_name} ${user.last_name}`}
                  width={50}
                  height={50}
                  className="rounded-full"
                />

                <div className="flex-1 space-y-1">
                  <Link
                    href={`/dashboard/users/${user.id}`}
                    className="font-semibold "
                  >
                    {user.first_name} {user.last_name}
                  </Link>

                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 ">
                <Link
                  href={`/dashboard/users/${user.id}`}
                  className="btn-outline btn-sm"
                >
                  View
                </Link>

                {savedUsers.has(user.id) ? (
                  <span className="badge bg-green-100 text-green-700">
                    ✓ Saved
                  </span>
                ) : (
                  <button
                    onClick={() => handleImport(user.id)}
                    className="btn-primary btn-sm"
                  >
                    Save
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredUsers.length > 0 && (
        <div className="flex justify-center items-center gap-4 mt-10 pt-8 ">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="pagination-btn"
          >
            ← Previous
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Page</span>
            <span className="font-semibold text-gray-900 bg-gray-100 px-4 py-1 rounded-md">
              {page}
            </span>
            <span className="text-sm text-gray-600">of {totalPages}</span>
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="pagination-btn"
          >
            Next →
          </button>
        </div>
      )}

      {filteredUsers.length === 0 && (
        <div className="card text-center py-14 space-y-2">
          <p className="font-medium text-gray-800">No users were found</p>
          <p className="text-sm text-gray-500">
            Try adjusting your search criteria
          </p>
        </div>
      )}
    </div>
  );
}
