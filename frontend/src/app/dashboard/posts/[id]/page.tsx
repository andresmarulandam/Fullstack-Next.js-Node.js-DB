'use client';

import { useState, useEffect } from 'react';
import { postsService } from '@/services/api';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Post } from '@/types/post';

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = Number(params.id);

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadPost();
  }, [postId]);

  const loadPost = async () => {
    setLoading(true);
    try {
      const data = await postsService.getPost(postId);
      setPost(data);
    } catch (error) {
      console.error('Error loading post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de eliminar este post?')) return;

    setDeleting(true);
    try {
      await postsService.deletePost(postId);
      router.push('/dashboard/posts');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error al eliminar el post');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center space-y-3">
          <div className="animate-spin w-10 h-10 border-2 border-primary  rounded-full mx-auto"></div>
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
              The post you are looking for does not exist or has been deleted.
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
        href="/dashboard/posts"
        className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
      >
        Back to Posts
      </Link>

      <div className="card border border-gray-200 space-y-0">
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 -m-6 mb-0 p-6 rounded-t-lg  flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{post.title}</h1>
            <p className="text-gray-600 text-sm mt-2">
              Blog post by {post.first_name} {post.last_name}
            </p>
          </div>
          <div className="flex gap-2 whitespace-nowrap">
            <Link
              href={`/dashboard/posts/${post.id}/edit`}
              className="btn-secondary btn-sm inline-flex items-center gap-2"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 text-sm font-medium border border-red-200 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {deleting ? (
                <>
                  <div className="animate-spin w-4 h-4 border-1 border-current  rounded-full"></div>
                  Deleting...
                </>
              ) : (
                <>Delete</>
              )}
            </button>
          </div>
        </div>

        <div className="px-6 py-8 space-y-6 gap-2">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <span className="font-medium">
                {post.first_name} {post.last_name}
                {'   '}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <span>
                Created
                {new Date(post.created_at).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            {post.created_at !== post.updated_at && (
              <div className="flex items-center gap-2 text-gray-600">
                <span>
                  Updated
                  {new Date(post.updated_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            )}
          </div>

          <div className="pt-6 ">
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="whitespace-pre-wrap leading-relaxed text-base">
                {post.content}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50  rounded-b-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Author Contact
            </p>
            <p className="text-sm text-gray-700">{post.author_email}</p>
          </div>
          <Link
            href={`/dashboard/users/${post.author_id}`}
            className="btn-secondary btn-sm inline-flex items-center gap-2 whitespace-nowrap"
          >
            View Author
          </Link>
        </div>
      </div>
    </div>
  );
}
