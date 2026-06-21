import { useState } from 'react';
import { Lightbulb } from 'lucide-react';

interface ParagraphWithKeyPointProps {
  text: string;
  keyPoint?: string;
}

export function ParagraphWithKeyPoint({ text, keyPoint }: ParagraphWithKeyPointProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const trimmedKeyPoint = keyPoint?.trim();

  if (!trimmedKeyPoint) {
    return (
      <p className="text-foreground leading-relaxed whitespace-pre-wrap">{text}</p>
    );
  }

  const tipVisible = mobileOpen;

  return (
    <div className="relative group flex gap-2 items-start">
      <p
        className="
          flex-1 text-foreground leading-relaxed whitespace-pre-wrap rounded-lg px-3 py-2 -mx-3
          border-l-2 border-transparent transition-colors cursor-help
          group-hover:border-accent group-hover:bg-accent/5
        "
      >
        {text}
      </p>

      <button
        type="button"
        onClick={() => setMobileOpen((prev) => !prev)}
        className="
          shrink-0 p-1.5 rounded-lg border border-accent/30 bg-accent/10 text-accent
          hover:bg-accent/15 transition-colors
          [@media(hover:hover)]:hidden
        "
        aria-label="Show key point"
        aria-expanded={mobileOpen}
      >
        <Lightbulb className="w-4 h-4" />
      </button>

      <div
        className={`
          absolute left-0 right-0 sm:right-auto sm:max-w-md z-20 bottom-full mb-2
          transition-all duration-200 pointer-events-none
          [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:translate-y-1
          [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-hover:translate-y-0
          ${tipVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}
        `}
      >
        <div className="rounded-xl border border-accent/30 bg-card shadow-lg p-3 sm:p-4">
          <div className="flex items-center gap-1.5 text-accent mb-1.5">
            <Lightbulb className="w-3.5 h-3.5 shrink-0" />
            <span className="text-xs uppercase tracking-wider font-semibold">Key point</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{trimmedKeyPoint}</p>
        </div>
      </div>
    </div>
  );
}
