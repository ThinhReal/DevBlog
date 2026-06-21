import { Search } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {
  return (
    <div className="fixed top-14 sm:top-16 left-0 lg:left-64 right-0 z-10 bg-header backdrop-blur-xl border-b border-border">
      <div className="p-3 sm:p-4 lg:p-6">
        <div className="relative w-full max-w-2xl">
          <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search topics, tags, or content..."
            className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-card border border-border rounded-xl 
                     text-foreground placeholder:text-muted focus:outline-none focus:border-blue-500/50 
                     focus:ring-2 focus:ring-blue-500/20 transition-all backdrop-blur-sm text-sm sm:text-base"
          />
        </div>
      </div>
    </div>
  );
}
