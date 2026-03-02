'use client';

import { useState, useEffect } from 'react';
import { postsService } from '@/services/api';
import { usersService } from '@/services/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SavedUser } from '@/types/user';
import { AxiosError } from 'axios';

export default function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [authorId, setAuthorId] = useState<number | ''>('');
  const [savedUsers, setSavedUsers] = useState<SavedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadSavedUsers();
  }, []);

  const loadSavedUsers = async () => {
    try {
      const users = await usersService.getSavedUsers();
      setSavedUsers(users);
    } catch (error) {
      console.error('Error loading saved users:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await postsService.createPost({
        title,
        content,
        author_id: Number(authorId),
      });
      router.push('/dashboard/posts');
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.error || 'Error creating post');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error creating post');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/dashboard/posts"
        className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
      >
        Back to Posts
      </Link>

      <div className="card border border-gray-200">
        <div className="bg-gradient-to-r from-gray-50 to-white -m-6 mb-6 p-6 rounded-t-lg ">
          <h1 className="text-4xl font-bold text-gray-900">Create New Post</h1>
          <p className="text-gray-600 text-sm mt-2">
            Write and publish a new blog post
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <div>
              <h3 className="font-semibold text-red-900">
                Error creating post
              </h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-gray-700 mb-3"
            >
              Post Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={3}
              className="input"
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-semibold text-gray-700 mb-3"
            >
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              minLength={10}
              rows={8}
              className="input resize-none"
            />
          </div>

          <div>
            <label
              htmlFor="author"
              className="block text-sm font-semibold text-gray-700 mb-3"
            >
              Author
            </label>
            {savedUsers.length === 0 ? (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                <div>
                  <h4 className="font-semibold text-amber-900">
                    No saved users available
                  </h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Please import a user first from the Users section to create
                    a post.
                  </p>
                  <Link
                    href="/dashboard/users"
                    className="inline-block mt-3 text-sm font-medium text-amber-600 hover:text-amber-700 underline"
                  >
                    Go to Users →
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <select
                  id="author"
                  value={authorId}
                  onChange={(e) =>
                    setAuthorId(e.target.value ? Number(e.target.value) : '')
                  }
                  required
                  className="input"
                >
                  <option value="">
                    Select an author from your saved users
                  </option>
                  {savedUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.first_name} {user.last_name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  {savedUsers.length} user{savedUsers.length !== 1 ? 's' : ''}{' '}
                  available
                </p>
              </>
            )}
          </div>

          <div className="pt-6  flex justify-end gap-3">
            <Link href="/dashboard/posts" className="btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || savedUsers.length === 0}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Creating...
                </>
              ) : (
                <>Create Post</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
