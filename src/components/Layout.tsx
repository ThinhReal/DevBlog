import { Link, Outlet, useNavigate } from 'react-router-dom';
import { LogOut, Plus, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from './Sidebar';
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

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <div className="flex">
        <Sidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
        />

        <main className="flex-1 ml-64">
          <header className="fixed top-0 left-64 right-0 z-20 bg-black/80 backdrop-blur-xl border-b border-zinc-800/50">
            <div className="flex items-center justify-end gap-3 p-4">
              <div className="flex items-center gap-2 mr-auto pl-2">
                <span className="text-sm text-gray-500">
                  {isGuest ? 'Guest' : user?.email}
                </span>
                {isGuest && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
                    Read-only
                  </span>
                )}
              </div>
              {canWrite && (
                <>
                  <Link
                    to="/blogs/new"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-300 hover:bg-blue-600/30 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    New Blog
                  </Link>
                  <Link
                    to="/categories/manage"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 text-gray-300 hover:text-white hover:bg-zinc-900 text-sm"
                  >
                    <Settings className="w-4 h-4" />
                    Categories
                  </Link>
                </>
              )}
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 text-gray-400 hover:text-white hover:bg-zinc-900 text-sm"
              >
                <LogOut className="w-4 h-4" />
                {isGuest ? 'Exit' : 'Logout'}
              </button>
            </div>
          </header>

          <div className="pt-16">
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
    </div>
  );
}
