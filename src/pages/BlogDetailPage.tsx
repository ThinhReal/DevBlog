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
    return <div className="p-4 sm:p-6 lg:p-8 text-muted">Loading...</div>;
  }

  if (error || !blog) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <p className="text-danger">{error || 'Blog not found'}</p>
        <Link to="/" className="text-link hover:text-link-hover mt-4 inline-block font-medium">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <article className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">
      <Link to="/" className="inline-flex items-center gap-2 text-muted hover:text-foreground mb-4 sm:mb-6 text-sm">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div className="min-w-0">
          <p className="text-accent text-sm uppercase tracking-wider mb-2 font-medium">
            {getCategoryName(blog)}
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl text-foreground mb-3 break-words">{blog.title}</h1>
          <p className="text-muted">{blog.summary}</p>
        </div>
        {canWrite && (
          <div className="flex gap-2 shrink-0">
            <Link
              to={`/blogs/${blog._id}/edit`}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-border-strong text-muted hover:text-foreground text-sm"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-danger-border text-danger hover:bg-danger-bg text-sm font-medium"
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
              className="px-3 py-1 rounded-full text-xs border border-accent-secondary/30 bg-accent-secondary/10 text-accent-secondary font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mb-8">
        <div className="flex justify-between text-xs text-muted mb-1">
          <span>Progress</span>
          <span>{blog.progress}%</span>
        </div>
        <div className="w-full h-2 bg-progress-track rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-blue-500 to-purple-600 rounded-full"
            style={{ width: `${blog.progress}%` }}
          />
        </div>
      </div>

      {blog.sourceLinks.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg text-foreground mb-3">Sources</h2>
          <ul className="space-y-2">
            {blog.sourceLinks.map((link, i) => (
              <li key={i}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-link hover:text-link-hover font-medium"
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
        <h2 className="text-lg text-foreground mb-4">Content</h2>
        <ContentRenderer content={blog.content} />
      </section>
    </article>
  );
}
