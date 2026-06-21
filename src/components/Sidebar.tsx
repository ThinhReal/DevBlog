import { Link } from 'react-router-dom';
import { LayoutGrid, X } from 'lucide-react';
import type { Category } from '../types';
import { useAuth } from '../context/AuthContext';
import { getCategoryIcon } from '../lib/categoryIcons';

interface SidebarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  open: boolean;
  onClose: () => void;
}

function CategoryIcon({ name }: { name: string }) {
  const Icon = getCategoryIcon(name);
  return <Icon className="w-5 h-5" />;
}

export function Sidebar({
  categories,
  selectedCategory,
  onSelectCategory,
  open,
  onClose,
}: SidebarProps) {
  const navItems = ['All Topics', ...categories.map((c) => c.name)];
  const { canWrite } = useAuth();

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen w-64 max-w-[85vw] bg-surface border-r border-border backdrop-blur-xl z-40
        transition-transform duration-300 ease-in-out overflow-y-auto
        lg:translate-x-0
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <div className="p-4 sm:p-6">
        <div className="mb-8 sm:mb-10 flex items-start justify-between gap-2">
          <button
            type="button"
            onClick={() => onSelectCategory('All Topics')}
            className="text-left group min-w-0 flex-1"
          >
            <h2 className="text-lg sm:text-xl leading-tight bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
              Thinh Learning Diary
            </h2>
            <p className="text-xs text-muted mt-1">Learning diary</p>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg text-muted hover:text-foreground hover:bg-card shrink-0"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="space-y-2">
          {navItems.map((category) => {
            const isSelected = category === selectedCategory;
            const catData = categories.find((c) => c.name === category);
            return (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                className={`
                  w-full flex items-center gap-3 px-3 sm:px-4 py-3 rounded-lg
                  transition-all duration-200 group relative overflow-hidden
                  ${
                    isSelected
                      ? 'bg-linear-to-r from-blue-500/20 to-purple-600/20 text-foreground border border-blue-500/30'
                      : 'text-muted hover:text-foreground hover:bg-card/80'
                  }
                `}
              >
                {isSelected && (
                  <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 to-purple-600/10 blur-xl" />
                )}
                <span
                  className={`relative z-10 shrink-0 ${
                    isSelected ? 'text-accent' : 'text-muted group-hover:text-accent'
                  } transition-colors`}
                >
                  {category === 'All Topics' ? (
                    <LayoutGrid className="w-5 h-5" />
                  ) : (
                    <CategoryIcon name={catData?.icon ?? 'Folder'} />
                  )}
                </span>
                <span className="relative z-10 truncate">{category}</span>
              </button>
            );
          })}
        </nav>

        {canWrite && (
          <div className="mt-6">
            <Link
              to="/categories/manage"
              onClick={onClose}
              className="block text-center text-xs text-muted hover:text-accent transition-colors"
            >
              Manage categories
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
