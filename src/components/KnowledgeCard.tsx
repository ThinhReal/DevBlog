import type { KnowledgeItem } from '../App';
import { BookOpen, TrendingUp } from 'lucide-react';

interface KnowledgeCardProps {
  item: KnowledgeItem;
}

const tagColors: Record<string, string> = {
  'React': 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400',
  'Java': 'from-orange-500/20 to-red-500/20 border-orange-500/30 text-orange-400',
  'TypeScript': 'from-blue-600/20 to-blue-400/20 border-blue-600/30 text-blue-300',
  'Python': 'from-yellow-500/20 to-green-500/20 border-yellow-500/30 text-yellow-400',
  'Node.js': 'from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400',
  'Git': 'from-orange-600/20 to-orange-400/20 border-orange-600/30 text-orange-300',
  'MongoDB': 'from-green-600/20 to-green-400/20 border-green-600/30 text-green-300',
  'Next.js': 'from-gray-500/20 to-zinc-500/20 border-gray-500/30 text-gray-300'
};

const getTagColor = (tag: string): string => {
  return tagColors[tag] || 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400';
};

export function KnowledgeCard({ item }: KnowledgeCardProps) {
  return (
    <div className="group relative">
      {/* Glassmorphism card */}
      <div className="relative bg-zinc-900/30 backdrop-blur-lg border border-zinc-800/50 rounded-2xl p-6 
                    hover:border-zinc-700/50 transition-all duration-300 hover:transform hover:scale-[1.02]
                    overflow-hidden">
        
        {/* Gradient glow effect on hover */}
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/0 via-purple-600/0 to-blue-500/0 
                      group-hover:from-blue-500/5 group-hover:via-purple-600/5 group-hover:to-blue-500/5 
                      transition-all duration-500 rounded-2xl" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2 text-blue-400">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider">{item.category}</span>
            </div>
            <div className="flex items-center gap-1 text-purple-400">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs">{item.progress}%</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl mb-3 text-white group-hover:text-blue-300 transition-colors">
            {item.title}
          </h3>

          {/* Snippet */}
          <p className="text-sm text-gray-400 mb-4 line-clamp-3 leading-relaxed">
            {item.snippet}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {item.tags.map(tag => (
              <span
                key={tag}
                className={`
                  px-3 py-1 rounded-full text-xs border
                  bg-linear-to-r ${getTagColor(tag)}
                  backdrop-blur-sm transition-all duration-200
                  hover:scale-105
                `}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Progress</span>
              <span className="text-gray-400">{item.progress}% Complete</span>
            </div>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-linear-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 relative overflow-hidden"
                style={{ width: `${item.progress}%` }}
              >
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent 
                              animate-shimmer" />
              </div>
            </div>
          </div>
        </div>

        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-blue-500/10 to-transparent 
                      rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </div>
  );
}
