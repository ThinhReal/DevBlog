import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { BlogEditorPage } from './pages/BlogEditorPage';
import { CategoryManagePage } from './pages/CategoryManagePage';
import { fetchCategories } from './api/categories';
import type { Category } from './types';

function AuthenticatedLayout() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All Topics');

  const loadCategories = () => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const onFocus = () => loadCategories();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  return (
    <Layout
      categories={categories}
      selectedCategory={selectedCategory}
      onSelectCategory={setSelectedCategory}
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            element={
              <ProtectedRoute>
                <AuthenticatedLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomePage />} />
            <Route
              path="blogs/new"
              element={
                <ProtectedRoute requireWrite>
                  <BlogEditorPage />
                </ProtectedRoute>
              }
            />
            <Route path="blogs/:id" element={<BlogDetailPage />} />
            <Route
              path="blogs/:id/edit"
              element={
                <ProtectedRoute requireWrite>
                  <BlogEditorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="categories/manage"
              element={
                <ProtectedRoute requireWrite>
                  <CategoryManagePage />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
