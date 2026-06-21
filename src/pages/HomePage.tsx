import { useEffect, useMemo, useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { KnowledgeCard } from '../components/KnowledgeCard';
import { BlogListRow } from '../components/BlogListRow';
import { BlogViewToggle, type BlogViewMode } from '../components/BlogViewToggle';
import { fetchBlogs } from '../api/blogs';
import { getErrorMessage } from '../api/client';
import type { Blog } from '../types';
import { getCategoryName } from '../types';
import type { LayoutOutletContext } from '../components/Layout';

const VIEW_KEY = 'devcollect-blog-view';

function getInitialViewMode(): BlogViewMode {
  const stored = localStorage.getItem(VIEW_KEY);
  return stored === 'grid' ? 'grid' : 'list';
}

function sortNewestFirst(blogs: Blog[]): Blog[] {
  return [...blogs].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function HomePage() {
  const { categories, selectedCategory } = useOutletContext<LayoutOutletContext>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') ?? '');
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<BlogViewMode>(getInitialViewMode);

  const selectedCat = categories.find((c) => c.name === selectedCategory);
  const categoryId = selectedCategory === 'All Topics' ? undefined : selectedCat?._id;
  const showCategory = selectedCategory === 'All Topics';

  const sortedBlogs = useMemo(() => sortNewestFirst(blogs), [blogs]);

  useEffect(() => {
    localStorage.setItem(VIEW_KEY, viewMode);
  }, [viewMode]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        setSearchParams({ search: searchQuery });
      } else {
        setSearchParams({});
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, setSearchParams]);

  useEffect(() => {
    setLoading(true);
    setError('');
    fetchBlogs({ categoryId, search: searchQuery || undefined })
      .then(setBlogs)
      .catch((err) => setError(getErrorMessage(err, 'Failed to load blogs')))
      .finally(() => setLoading(false));
  }, [categoryId, searchQuery]);

  return (
    <>
      <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <div className="p-4 sm:p-6 lg:p-8 pt-28 sm:pt-32 lg:pt-36">
        <div className="mb-6 sm:mb-8 flex items-start justify-between gap-3 sm:gap-4 flex-wrap">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl mb-1 sm:mb-2 bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent break-words">
              {selectedCategory}
            </h1>
            <p className="text-muted">
              {loading
                ? 'Loading...'
                : `${blogs.length} ${blogs.length === 1 ? 'topic' : 'topics'} found`}
            </p>
          </div>
          <BlogViewToggle value={viewMode} onChange={setViewMode} />
        </div>

        {error && <p className="text-danger mb-4 font-medium">{error}</p>}

        {!loading && !error && viewMode === 'list' && (
          <div className="space-y-2">
            {sortedBlogs.map((blog) => (
              <BlogListRow key={blog._id} blog={blog} showCategory={showCategory} />
            ))}
          </div>
        )}

        {!loading && !error && viewMode === 'grid' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {sortedBlogs.map((blog) => (
              <KnowledgeCard
                key={blog._id}
                id={blog._id}
                title={blog.title}
                snippet={blog.summary}
                tags={blog.tags}
                progress={blog.progress}
                category={getCategoryName(blog)}
              />
            ))}
          </div>
        )}

        {!loading && !error && blogs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted text-lg">No topics found matching your criteria</p>
          </div>
        )}
      </div>
    </>
  );
}
