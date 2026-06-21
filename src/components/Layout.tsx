import { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { LogOut, Menu, Plus, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from './Sidebar';
import { ThemeToggle } from './ThemeToggle';
import type { Category } from '../types';

export interface LayoutOutletContext {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (name: string) => void;
}

interface LayoutProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (name: string) => void;
}

export function Layout({ categories, selectedCategory, onSelectCategory }: LayoutProps) {
  const { user, isGuest, canWrite, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleSelectCategory(category: string) {
    onSelectCategory(category);
    navigate('/');
    setSidebarOpen(false);
  }

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const onChange = () => {
      if (media.matches) setSidebarOpen(false);
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!sidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="lg:ml-64 min-w-0">
        <header className="fixed top-0 left-0 lg:left-64 right-0 z-20 bg-header backdrop-blur-xl border-b border-border">
          <div className="flex items-center justify-end gap-2 sm:gap-3 p-3 sm:p-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center justify-center p-2 rounded-lg border border-border text-muted hover:text-foreground hover:bg-card mr-auto"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex items-center gap-2 mr-auto pl-0 lg:pl-2 min-w-0">
              <span className="text-sm text-muted truncate max-w-[140px] md:max-w-none">
                {isGuest ? 'Guest' : user?.email}
              </span>
              {isGuest && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-warning/10 border border-warning/30 text-warning shrink-0 font-medium">
                  Read-only
                </span>
              )}
            </div>

            {canWrite && (
              <>
                <Link
                  to="/blogs/new"
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-accent/10 border border-accent/30 text-accent hover:bg-accent/15 text-sm font-medium"
                  title="New Blog"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden md:inline">New Blog</span>
                </Link>
                <Link
                  to="/categories/manage"
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-border-strong text-muted hover:text-foreground hover:bg-card text-sm"
                  title="Categories"
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden md:inline">Categories</span>
                </Link>
              </>
            )}
            <ThemeToggle />
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-border-strong text-muted hover:text-foreground hover:bg-card text-sm"
              title={isGuest ? 'Exit' : 'Logout'}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">{isGuest ? 'Exit' : 'Logout'}</span>
            </button>
          </div>
        </header>

        <div className="pt-14 sm:pt-16">
          <Outlet
            context={{
              categories,
              selectedCategory,
              onSelectCategory,
            } satisfies LayoutOutletContext}
          />
        </div>
      </main>
    </div>
  );
}
