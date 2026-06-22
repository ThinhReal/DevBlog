import type { ReactNode } from 'react';

interface AddBlockButtonProps {
  label: string;
  icon?: ReactNode;
  active: boolean;
  onClick: () => void;
}

export function AddBlockButton({ label, icon, active, onClick }: AddBlockButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg border font-medium
        transition-all duration-200 select-none
        active:scale-95
        ${
          active
            ? 'bg-accent/20 border-accent text-accent shadow-sm scale-95'
            : 'border-border-strong text-muted hover:text-foreground hover:border-accent/40 hover:bg-accent/5'
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}
