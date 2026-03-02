'use client';

import { useState, useEffect } from 'react';
import { postsService } from '@/services/api';
import Link from 'next/link';
import { Post } from '@/types/post';

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await postsService.getAllPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este post?')) return;

    try {
      await postsService.deletePost(id);
      setPosts(posts.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error al eliminar el post');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center space-y-3">
          <div className="animate-spin w-10 h-10 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-8">
      <div className="card bg-gradient-to-r from-gray-50 to-white ">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Blog Posts</h1>
            <p className="text-gray-600 text-sm mt-2">
              Create, edit and manage your blog posts
            </p>
          </div>
          <Link
            href="/dashboard/posts/create"
            className="btn-primary whitespace-nowrap inline-flex items-center gap-2"
          >
            New Post
          </Link>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="card bg-blue-50 border border-blue-200 text-center py-16">
          <h3 className="text-2xl font-bold text-blue-900 mb-2">
            No posts yet
          </h3>
          <p className="text-blue-700 text-sm mb-6">
            Create your first post to get started
          </p>
          <Link
            href="/dashboard/posts/create"
            className="btn-primary inline-flex items-center gap-2"
          >
            Create First Post
          </Link>
        </div>
      ) : (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            All Posts ({posts.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="card group hover:shadow-lg hover:border-primary/20 transition-all duration-200 border border-gray-200 flex flex-col"
              >
                <Link href={`/dashboard/posts/${post.id}`} className="mb-3">
                  <h2 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                </Link>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                  {post.content}
                </p>

                <div className="space-y-3 pt-4">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="font-medium text-gray-700">
                      {post.first_name} {post.last_name}
                    </span>
                    <span>
                      {new Date(post.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between gap-2 pt-2">
                    <Link
                      href={`/dashboard/posts/${post.id}`}
                      className=" btn-secondary btn-sm text-xs font-medium flex items-center justify-center gap-1"
                    >
                      View
                    </Link>
                    <Link
                      href={`/dashboard/posts/${post.id}/edit`}
                      className=" btn-outline btn-sm text-xs font-medium flex items-center justify-center gap-1"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs font-medium border border-red-200 rounded-lg transition  flex items-center justify-center gap-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
