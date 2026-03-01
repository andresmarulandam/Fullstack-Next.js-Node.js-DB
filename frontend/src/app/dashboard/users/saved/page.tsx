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
    if (
      !confirm(
        "'Are you sure you want to delete this user from the local database?'",
      )
    ) {
      return;
    }

    try {
      setUsers(users.filter((u) => u.id !== id));
      alert('User deleted (simulated)');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
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
        <div className="text-gray-500">Loading saved users...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Saved Users</h1>
          <p className="text-gray-600 text-sm mt-1">Local database</p>
        </div>
        <Link href="/dashboard/users" className="btn-secondary">
          ← Back to Users
        </Link>
      </div>

      <div className="max-w-md">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input"
          />
        </div>
      </div>

      {users.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">There are no locally saved users</p>
          <Link
            href="/dashboard/users"
            className="text-primary hover:text-primary-dark"
          >
            Go to import users
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="card group hover:shadow-xl transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <Image
                src={user.avatar}
                alt={`${user.first_name} ${user.last_name}`}
                width={50}
                height={50}
                className="rounded-full flex-shrink-0 "
              />
              <div className="flex-1 m-4">
                <Link
                  href={`/dashboard/users/${user.id}`}
                  className="font-semibold text-gray-900 hover:text-primary transition"
                >
                  {user.first_name} {user.last_name}
                </Link>
                <p className="text-xs text-gray-500">{user.email}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Saved {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center pt-4  gap-2">
              <Link
                href={`/dashboard/users/${user.id}`}
                className="btn-primary"
              >
                View
              </Link>
              <button
                onClick={() => handleDelete(user.id)}
                className="btn-secondary"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && users.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          {`There are no results for "${searchTerm}"`}
        </div>
      )}
    </div>
  );
}
