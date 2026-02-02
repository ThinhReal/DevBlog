import { 
  Database, 
  Cpu, 
  Globe, 
  GitBranch, 
  Folder, 
  LayoutGrid 
} from 'lucide-react';

interface SidebarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  'All Topics': <LayoutGrid className="w-5 h-5" />,
  'Data Structures': <Database className="w-5 h-5" />,
  'Algorithms': <Cpu className="w-5 h-5" />,
  'Web Development': <Globe className="w-5 h-5" />,
  'Git': <GitBranch className="w-5 h-5" />,
  'Personal Projects': <Folder className="w-5 h-5" />
};

export function Sidebar({ categories, selectedCategory, onSelectCategory }: SidebarProps) {
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
          {categories.map(category => {
            const isSelected = category === selectedCategory;
            return (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all duration-200 group relative overflow-hidden
                  ${isSelected 
                    ? 'bg-linear-to-r from-blue-500/20 to-purple-600/20 text-white border border-blue-500/30' 
                    : 'text-gray-400 hover:text-white hover:bg-zinc-900/50'
                  }
                `}
              >
                {isSelected && (
                  <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 to-purple-600/10 blur-xl" />
                )}
                <span className={`relative z-10 ${isSelected ? 'text-blue-400' : 'text-gray-500 group-hover:text-blue-400'} transition-colors`}>
                  {categoryIcons[category]}
                </span>
                <span className="relative z-10">{category}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-10 p-4 rounded-lg bg-linear-to-br from-zinc-900/50 to-zinc-900/30 border border-zinc-800/50 backdrop-blur-sm">
          <p className="text-xs text-gray-400 mb-2">Progress Overview</p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Completed</span>
              <span className="text-blue-400">24 topics</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-linear-to-r from-blue-500 to-purple-600 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
