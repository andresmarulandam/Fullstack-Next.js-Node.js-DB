'use client';

import { useState, useEffect } from 'react';
import { postsService } from '@/services/api';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Post } from '@/types/post';
import { AxiosError } from 'axios';

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = Number(params.id);

  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPost();
  }, [postId]);

  const loadPost = async () => {
    setLoading(true);
    try {
      const data = await postsService.getPost(postId);
      setPost(data);
      setTitle(data.title);
      setContent(data.content);
    } catch (error) {
      console.error('Error loading post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      await postsService.updatePost(postId, { title, content });
      router.push(`/dashboard/posts/${postId}`);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.error || 'Error updating post');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error updating post');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center space-y-3">
          <div className="animate-spin w-10 h-10 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="card text-center space-y-6 max-w-sm border border-gray-200">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Post not found</h3>
            <p className="text-gray-600 text-sm mt-2">
              The post you are trying to edit does not exist or has been
              deleted.
            </p>
          </div>
          <Link href="/dashboard/posts" className="btn-secondary inline-block">
            ← Back to Posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href={`/dashboard/posts/${postId}`}
        className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
      >
        Back to Post
      </Link>

      <div className="card border border-gray-200">
        <div className="bg-gradient-to-r from-gray-50 to-white -m-6 mb-6 p-6 rounded-t-lg ">
          <h1 className="text-4xl font-bold text-gray-900">Edit Post</h1>
          <p className="text-gray-600 text-sm mt-2">
            Update your blog post content and title
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <div>
              <h3 className="font-semibold text-red-900">
                Error updating post
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
              placeholder="Enter post title"
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
              rows={10}
              className="input resize-none"
              placeholder="Write your post content..."
            />
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Post Information
            </p>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Author: </span>
                <span className="text-sm font-semibold text-gray-900">
                  {post.first_name} {post.last_name}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Email: </span>
                <span className="text-sm font-mono text-primary">
                  {post.author_email}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Created: </span>
                <span className="text-sm text-gray-900">
                  {new Date(post.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6  flex justify-end gap-3">
            <Link href={`/dashboard/posts/${postId}`} className="btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Saving...
                </>
              ) : (
                <>Save Changes</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
