import { Search } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {
  return (
    <div className="fixed top-0 left-64 right-0 z-10 bg-black/80 backdrop-blur-xl border-b border-zinc-800/50">
      <div className="p-6">
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search topics, tags, or content..."
            className="w-full pl-12 pr-4 py-3 bg-zinc-900/50 border border-zinc-800/50 rounded-xl 
                     text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 
                     focus:ring-2 focus:ring-blue-500/20 transition-all backdrop-blur-sm"
          />
        </div>
      </div>
    </div>
  );
}
