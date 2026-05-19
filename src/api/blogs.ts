import { apiRequest } from './client';
import type { Blog, ContentBlock, SourceLink } from '../types';

export interface BlogInput {
  title: string;
  slug?: string;
  categoryId: string;
  summary: string;
  tags: string[];
  progress: number;
  content: ContentBlock[];
  sourceLinks: SourceLink[];
}

export function fetchBlogs(params?: { categoryId?: string; search?: string }) {
  const query = new URLSearchParams();
  if (params?.categoryId) query.set('categoryId', params.categoryId);
  if (params?.search) query.set('search', params.search);
  const qs = query.toString();
  return apiRequest<Blog[]>(`/api/blogs${qs ? `?${qs}` : ''}`);
}

export function fetchBlog(id: string) {
  return apiRequest<Blog>(`/api/blogs/${id}`);
}

export function createBlog(data: BlogInput) {
  return apiRequest<Blog>('/api/blogs', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateBlog(id: string, data: BlogInput) {
  return apiRequest<Blog>(`/api/blogs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteBlog(id: string) {
  return apiRequest<void>(`/api/blogs/${id}`, { method: 'DELETE' });
}
