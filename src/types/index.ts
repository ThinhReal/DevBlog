export interface User {
  id: string;
  email: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  order: number;
}

export type ContentBlock =
  | { type: 'paragraph'; text: string; keyPoint?: string }
  | { type: 'heading'; level: number; text: string }
  | { type: 'code'; language: string; code: string; runnable: boolean };

export interface SourceLink {
  label: string;
  url: string;
}

export interface CategoryRef {
  _id: string;
  name: string;
  slug: string;
  icon: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  categoryId: CategoryRef | string;
  summary: string;
  tags: string[];
  progress: number;
  content: ContentBlock[];
  sourceLinks: SourceLink[];
  createdAt: string;
  updatedAt: string;
}

export interface BlogListItem extends Omit<Blog, 'categoryId'> {
  categoryId: CategoryRef;
}

export function getCategoryName(blog: Blog): string {
  if (typeof blog.categoryId === 'string') return '';
  return blog.categoryId.name;
}
