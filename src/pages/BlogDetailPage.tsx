import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { fetchBlog, deleteBlog } from '../api/blogs';
import { ContentRenderer } from '../components/ContentRenderer';
import { useAuth } from '../context/AuthContext';
import type { Blog } from '../types';
import { getCategoryName } from '../types';

export function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { canWrite } = useAuth();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetchBlog(id)
      .then(setBlog)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!id || !blog) return;
    if (!confirm(`Delete "${blog.title}"?`)) return;
    await deleteBlog(id);
    navigate('/');
  }

  if (loading) {
    return <div className="p-8 text-gray-400">Loading...</div>;
  }

  if (error || !blog) {
    return (
      <div className="p-8">
        <p className="text-red-400">{error || 'Blog not found'}</p>
        <Link to="/" className="text-blue-400 mt-4 inline-block">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <article className="p-8 max-w-4xl">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 text-sm">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-blue-400 text-sm uppercase tracking-wider mb-2">
            {getCategoryName(blog)}
          </p>
          <h1 className="text-4xl text-white mb-3">{blog.title}</h1>
          <p className="text-gray-400">{blog.summary}</p>
        </div>
        {canWrite && (
          <div className="flex gap-2 shrink-0">
            <Link
              to={`/blogs/${blog._id}/edit`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 text-gray-300 hover:text-white"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-900/50 text-red-400 hover:bg-red-950/30"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        )}
      </div>

      {blog.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {blog.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs border border-purple-500/30 bg-purple-500/10 text-purple-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mb-8">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progress</span>
          <span>{blog.progress}%</span>
        </div>
        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-blue-500 to-purple-600 rounded-full"
            style={{ width: `${blog.progress}%` }}
          />
        </div>
      </div>

      {blog.sourceLinks.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg text-white mb-3">Sources</h2>
          <ul className="space-y-2">
            {blog.sourceLinks.map((link, i) => (
              <li key={i}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300"
                >
                  {link.label}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="text-lg text-white mb-4">Content</h2>
        <ContentRenderer content={blog.content} />
      </section>
    </article>
  );
}
