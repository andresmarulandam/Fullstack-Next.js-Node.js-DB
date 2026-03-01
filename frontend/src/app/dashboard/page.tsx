'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function DashboardPage() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Fullstack Challenge</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard/users"
                className="text-gray-700 hover:text-gray-900"
              >
                Users
              </Link>
              <Link
                href="/dashboard/posts"
                className="text-gray-700 hover:text-gray-900"
              >
                Posts
              </Link>
              <button
                onClick={logout}
                className="ml-4 px-4 py-2 text-sm text-red-600 hover:text-red-800"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Welcome to the Dashboard
            </h2>
            <p className="text-gray-600 mb-8">
              Select Users to view the list of users or Posts to manage posts
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/dashboard/users"
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                View Users
              </Link>
              <Link
                href="/dashboard/posts"
                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                View Posts
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
