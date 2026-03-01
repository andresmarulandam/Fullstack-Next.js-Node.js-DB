'use client';

import { useState, useEffect } from 'react';
import { usersService } from '@/services/api';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { AxiosError } from 'axios';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

interface SavedUser extends User {
  created_at: string;
  updated_at: string;
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = Number(params.id);

  const [user, setUser] = useState<User | null>(null);
  const [savedUser, setSavedUser] = useState<SavedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUser();
    checkIfSaved();
  }, [userId]);

  const loadUser = async () => {
    setLoading(true);
    try {
      const response = await usersService.getUsersFromReqRes(1);
      const foundUser = response.data.find((u: User) => u.id === userId);

      if (foundUser) {
        setUser(foundUser);
      } else {
        setTimeout(() => router.push('/dashboard/users'), 3000);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfSaved = async () => {
    try {
      const saved = await usersService.getSavedUser(userId);
      setSavedUser(saved);
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status !== 404) {
        console.error('Error checking saved user:', error);
      }
    }
  };

  const handleSaveUser = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const result = await usersService.importUser(user.id);
      setSavedUser(result.user);
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Error al guardar el usuario');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading user...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 mb-4">User not found</h2>
        <p className="text-gray-600 mb-4">Redirecting to the user list...</p>
        <Link
          href="/dashboard/users"
          className="text-blue-600 hover:text-blue-800"
        >
          Back
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard/users"
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          ← Back to users
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="flex items-center space-x-6">
            <Image
              src={user.avatar}
              alt={`${user.first_name} ${user.last_name}`}
              width={120}
              height={120}
              className="rounded-full"
            />
            <div>
              <h1 className="text-3xl font-bold">
                {user.first_name} {user.last_name}
              </h1>
              <p className="text-xl text-gray-600 mt-2">{user.email}</p>
              <p className="text-sm text-gray-500 mt-1">ID: {user.id}</p>
            </div>
          </div>

          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">User information</h2>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-500">Name</dt>
                <dd className="text-lg font-medium">{user.first_name}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Lastname</dt>
                <dd className="text-lg font-medium">{user.last_name}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Email</dt>
                <dd className="text-lg font-medium">{user.email}</dd>
              </div>
            </dl>
          </div>

          {savedUser && (
            <div className="mt-8 border-t pt-6 bg-green-50 -mx-8 -mb-8 p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-green-800">
                    ✅ Locally saved user
                  </h3>
                  <p className="text-sm text-green-600 mt-1">
                    Saved: {new Date(savedUser.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Link
                  href="/dashboard/users/saved"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  View saved
                </Link>
              </div>
            </div>
          )}

          {!savedUser && (
            <div className="mt-8 border-t pt-6">
              <button
                onClick={handleSaveUser}
                disabled={saving}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save user locally'}
              </button>
              <p className="text-sm text-gray-500 text-center mt-2">
                This user will be saved in our local database
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
