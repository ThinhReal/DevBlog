import { apiRequest } from './client';
import type { Category } from '../types';

export function fetchCategories() {
  return apiRequest<Category[]>('/api/categories');
}

export function createCategory(data: {
  name: string;
  slug?: string;
  icon?: string;
  order?: number;
}) {
  return apiRequest<Category>('/api/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateCategory(
  id: string,
  data: { name?: string; slug?: string; icon?: string; order?: number }
) {
  return apiRequest<Category>(`/api/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteCategory(id: string) {
  return apiRequest<void>(`/api/categories/${id}`, { method: 'DELETE' });
}
