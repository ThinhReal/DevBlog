import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { Blog } from '../types';
import { getCategoryName } from '../types';

interface BlogListRowProps {
  blog: Blog;
  showCategory?: boolean;
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(iso));
}

export function BlogListRow({ blog, showCategory = false }: BlogListRowProps) {
  const navigate = useNavigate();
  const category = getCategoryName(blog);

  return (
    <button
      type="button"
      onClick={() => navigate(`/blogs/${blog._id}`)}
      className="group w-full text-left flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-border bg-card/80 hover:border-border-strong hover:bg-card transition-colors"
    >
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4 mb-1">
          <h3 className="text-sm sm:text-base font-medium text-foreground group-hover:text-accent transition-colors line-clamp-2 sm:truncate">
            {blog.title}
          </h3>
          <time className="text-xs text-muted shrink-0" dateTime={blog.updatedAt}>
            {formatDate(blog.updatedAt)}
          </time>
        </div>

        <p className="text-sm text-muted line-clamp-1 mb-2">{blog.summary}</p>

        <div className="flex items-center gap-3 flex-wrap">
          {showCategory && category && (
            <span className="text-xs uppercase tracking-wider text-accent font-medium">{category}</span>
          )}
          {blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {blog.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full text-xs border border-border-strong bg-background text-foreground font-medium"
                >
                  {tag}
                </span>
              ))}
              {blog.tags.length > 3 && (
                <span className="text-xs text-muted">+{blog.tags.length - 3}</span>
              )}
            </div>
          )}
          <span className="text-xs text-muted ml-auto">{blog.progress}%</span>
        </div>
      </div>

      <ChevronRight className="w-4 h-4 text-muted group-hover:text-foreground shrink-0 transition-colors" />
    </button>
  );
}
