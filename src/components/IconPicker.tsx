import { CATEGORY_ICON_NAMES, getCategoryIcon } from '../lib/categoryIcons';

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
      {CATEGORY_ICON_NAMES.map((name) => {
        const Icon = getCategoryIcon(name);
        const selected = value === name;

        return (
          <button
            key={name}
            type="button"
            onClick={() => onChange(name)}
            title={name}
            aria-label={name}
            aria-pressed={selected}
            className={`
              flex flex-col items-center justify-center gap-1 p-2 rounded-lg border transition-colors
              ${
                selected
                  ? 'border-accent/40 bg-accent/10 text-accent'
                  : 'border-border bg-card text-muted hover:text-foreground hover:border-border-strong hover:bg-card/80'
              }
            `}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] leading-tight truncate w-full text-center">{name}</span>
          </button>
        );
      })}
    </div>
  );
}
