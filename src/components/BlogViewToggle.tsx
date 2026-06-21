import { LayoutGrid, List } from 'lucide-react';

export type BlogViewMode = 'list' | 'grid';

interface BlogViewToggleProps {
  value: BlogViewMode;
  onChange: (mode: BlogViewMode) => void;
}

export function BlogViewToggle({ value, onChange }: BlogViewToggleProps) {
  return (
    <div className="inline-flex rounded-lg border border-border bg-card p-1">
      <button
        type="button"
        onClick={() => onChange('list')}
        aria-label="List view"
        aria-pressed={value === 'list'}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
          value === 'list'
            ? 'bg-accent/10 text-accent border border-accent/30'
            : 'text-muted hover:text-foreground'
        }`}
      >
        <List className="w-4 h-4" />
        List
      </button>
      <button
        type="button"
        onClick={() => onChange('grid')}
        aria-label="Grid view"
        aria-pressed={value === 'grid'}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
          value === 'grid'
            ? 'bg-accent/10 text-accent border border-accent/30'
            : 'text-muted hover:text-foreground'
        }`}
      >
        <LayoutGrid className="w-4 h-4" />
        Grid
      </button>
    </div>
  );
}
