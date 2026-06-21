import { useNavigate } from 'react-router-dom';
import { BookOpen, TrendingUp } from 'lucide-react';

interface KnowledgeCardProps {
  id: string;
  title: string;
  snippet: string;
  tags: string[];
  progress: number;
  category: string;
}

export function KnowledgeCard({
  id,
  title,
  snippet,
  tags,
  progress,
  category,
}: KnowledgeCardProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(`/blogs/${id}`)}
      className="group relative text-left w-full"
    >
      <div
        className="relative bg-card backdrop-blur-lg border border-border rounded-2xl p-4 sm:p-6 
                    hover:border-border-strong transition-all duration-300 sm:hover:transform sm:hover:scale-[1.02]
                    overflow-hidden shadow-sm"
      >
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/0 via-purple-600/0 to-blue-500/0 
                      group-hover:from-blue-500/5 group-hover:via-purple-600/5 group-hover:to-blue-500/5 
                      transition-all duration-500 rounded-2xl" />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2 text-accent">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider font-medium">{category}</span>
            </div>
            <div className="flex items-center gap-1 text-accent-secondary">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-medium">{progress}%</span>
            </div>
          </div>

          <h3 className="text-xl mb-3 text-foreground group-hover:text-accent transition-colors font-semibold">
            {title}
          </h3>

          <p className="text-sm text-muted mb-4 line-clamp-3 leading-relaxed">{snippet}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs border border-border-strong bg-background text-foreground font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted font-medium">Progress</span>
              <span className="text-muted font-medium">{progress}% Complete</span>
            </div>
            <div className="w-full h-2 bg-progress-track rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
