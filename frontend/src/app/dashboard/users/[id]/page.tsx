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
      if (foundUser) setUser(foundUser);
      else setTimeout(() => router.push('/dashboard/users'), 3000);
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
      if (axiosError.response?.status !== 404)
        console.error('Error checking saved user:', error);
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
        <div className="text-gray-500 animate-pulse">Loading user...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">User not found</h2>
        <p className="text-gray-600">Redirecting to the user list...</p>
        <Link
          href="/dashboard/users"
          className="btn-secondary btn-sm inline-block"
        >
          Back
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link
        href="/dashboard/users"
        className="text-gray-700 hover:text-gray-900 flex items-center gap-2 font-medium transition-colors duration-150"
      >
        ← Back to Users
      </Link>

      <div className="card p-8 space-y-8 shadow-lg hover:shadow-xl transition-shadow rounded-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6  pb-6">
          <Image
            src={user.avatar}
            alt={`${user.first_name} ${user.last_name}`}
            width={120}
            height={120}
            className="rounded-full ring-4 ring-gray-100 object-cover"
          />
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              {user.first_name} {user.last_name}
            </h1>
            <p className="text-xs text-gray-500">ID: {user.id}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Details</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {['First Name', 'Last Name', 'Email'].map((label, idx) => (
              <div className="space-y-1" key={idx}>
                <dt className="text-xs font-semibold text-gray-500 uppercase"></dt>
                <dd className="text-lg font-medium text-gray-900">
                  {label === 'First Name' && user.first_name}
                  {label === 'Last Name' && user.last_name}
                  {label === 'Email' && user.email}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {savedUser ? (
          <div className="p-6 rounded-lg bg-green-50 border border-green-200 space-y-4 hover:shadow-md transition-all duration-150">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-green-900">
                  Saved locally
                </h3>
                <p className="text-sm text-green-700">
                  Saved on {new Date(savedUser.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Link href="/dashboard/users/saved" className="btn-secondary ">
              View All Saved Users
            </Link>
          </div>
        ) : (
          <div className="p-6 rounded-lg bg-blue-50 border border-blue-200 space-y-4 hover:shadow-md transition-all duration-150">
            <p className="text-sm text-blue-900">
              Save this user to your local database for easy access later.
            </p>
            <button
              onClick={handleSaveUser}
              disabled={saving}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 focus:ring-4 focus:ring-blue-200"
            >
              {saving ? 'Saving...' : '+ Save User Locally'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
