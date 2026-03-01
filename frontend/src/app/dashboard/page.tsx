'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function DashboardPage() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Fullstack Challenge
            </h1>
            <div className="flex items-center gap-3 mx-2">
              <Link href="/dashboard/users" className="btn-outline btn-sm">
                Users
              </Link>
              <Link href="/dashboard/posts" className="btn-outline btn-sm">
                Posts
              </Link>
              <button
                onClick={logout}
                className="btn-outline btn-sm text-red-600 border-red-200 hover:bg-red-50"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="card max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-gray-900">
              Welcome to Dashboard
            </h2>
            <p className="text-lg text-gray-600">
              Manage users and posts in one place
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-6">
            <Link href="/dashboard/users" className="btn-primary">
              View Users
            </Link>
            <Link href="/dashboard/posts" className="btn-secondary">
              View Posts
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
