import { useEffect, useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { KnowledgeCard } from '../components/KnowledgeCard';
import { fetchBlogs } from '../api/blogs';
import type { Blog } from '../types';
import { getCategoryName } from '../types';
import type { LayoutOutletContext } from '../components/Layout';

export function HomePage() {
  const { categories, selectedCategory } = useOutletContext<LayoutOutletContext>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') ?? '');
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const selectedCat = categories.find((c) => c.name === selectedCategory);
  const categoryId = selectedCategory === 'All Topics' ? undefined : selectedCat?._id;

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
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load blogs'))
      .finally(() => setLoading(false));
  }, [categoryId, searchQuery]);

  return (
    <>
      <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <div className="p-8 pt-36">
        <div className="mb-8">
          <h1 className="text-4xl mb-2 bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            {selectedCategory}
          </h1>
          <p className="text-gray-400">
            {loading ? 'Loading...' : `${blogs.length} ${blogs.length === 1 ? 'topic' : 'topics'} found`}
          </p>
        </div>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {blogs.map((blog) => (
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
            <p className="text-gray-500 text-lg">No topics found matching your criteria</p>
          </div>
        )}
      </div>
    </>
  );
}
