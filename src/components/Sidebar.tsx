import { Link } from 'react-router-dom';
import {
  Database,
  Cpu,
  Globe,
  GitBranch,
  Folder,
  LayoutGrid,
  type LucideIcon,
} from 'lucide-react';
import type { Category } from '../types';

interface SidebarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const iconMap: Record<string, LucideIcon> = {
  Database,
  Cpu,
  Globe,
  GitBranch,
  Folder,
  LayoutGrid,
};

function CategoryIcon({ name }: { name: string }) {
  const Icon = iconMap[name] ?? Folder;
  return <Icon className="w-5 h-5" />;
}

export function Sidebar({ categories, selectedCategory, onSelectCategory }: SidebarProps) {
  const navItems = ['All Topics', ...categories.map((c) => c.name)];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-zinc-950 border-r border-zinc-800/50 backdrop-blur-xl">
      <div className="p-6">
        <div className="mb-10">
          <h2 className="text-2xl bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            TechKnowledge
          </h2>
          <p className="text-xs text-gray-500 mt-1">Knowledge Management</p>
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
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all duration-200 group relative overflow-hidden
                  ${
                    isSelected
                      ? 'bg-linear-to-r from-blue-500/20 to-purple-600/20 text-white border border-blue-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-zinc-900/50'
                  }
                `}
              >
                {isSelected && (
                  <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 to-purple-600/10 blur-xl" />
                )}
                <span
                  className={`relative z-10 ${
                    isSelected ? 'text-blue-400' : 'text-gray-500 group-hover:text-blue-400'
                  } transition-colors`}
                >
                  {category === 'All Topics' ? (
                    <LayoutGrid className="w-5 h-5" />
                  ) : (
                    <CategoryIcon name={catData?.icon ?? 'Folder'} />
                  )}
                </span>
                <span className="relative z-10">{category}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-6">
          <Link
            to="/categories/manage"
            className="block text-center text-xs text-gray-500 hover:text-blue-400 transition-colors"
          >
            Manage categories
          </Link>
        </div>
      </div>
    </aside>
  );
}
