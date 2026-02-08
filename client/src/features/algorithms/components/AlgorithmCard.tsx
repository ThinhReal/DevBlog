import React from 'react';
import { Clock, Box, ChevronRight } from 'lucide-react'; // Import icon cho chuyên nghiệp
import type { Algorithm } from '../types';

interface AlgorithmCardProps {
  data: Algorithm;
  onClick?: () => void;
}

const AlgorithmCard: React.FC<AlgorithmCardProps> = ({ data, onClick }) => {
  // Các class này sẽ tự động mapping với CSS Variables trong index.css
  const difficultyStyles = {
    Easy: 'text-easy bg-easy/10 border-easy/20',
    Medium: 'text-medium bg-medium/10 border-medium/20',
    Hard: 'text-hard bg-hard/10 border-hard/20',
  };

  return (
    <div 
      onClick={onClick}
      className="group relative bg-card-bg border border-border rounded-2xl p-6 shadow-sm 
                 hover:shadow-xl hover:shadow-brand/5 hover:border-brand/40 
                 transition-all duration-300 cursor-pointer flex flex-col h-full"
    >
      {/* Header: Category & Difficulty */}
      <div className="flex justify-between items-start mb-5">
        <span className="px-2.5 py-1 bg-main-bg text-text-muted text-[10px] font-bold uppercase tracking-wider rounded-md border border-border">
          {data.category}
        </span>
        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md border ${difficultyStyles[data.difficulty]}`}>
          {data.difficulty}
        </span>
      </div>

      {/* Content */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-text-main mb-2 group-hover:text-brand transition-colors flex items-center justify-between">
          {data.title}
          <ChevronRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand" />
        </h3>
        <p className="text-text-muted text-sm line-clamp-2 leading-relaxed italic">
          "{data.coreConcept}"
        </p>
      </div>

      {/* Spacer to push footer down */}
      <div className="grow" />

      {/* Footer: Complexity Metrics */}
      <div className="flex gap-4 pt-4 border-t border-border/50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-brand/5 rounded-lg text-brand">
            <Clock size={14} />
          </div>
          <div>
            <p className="text-[9px] text-text-muted uppercase font-bold tracking-tighter">Time</p>
            <code className="text-xs text-text-main font-mono font-semibold">{data.complexity.time}</code>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-brand/5 rounded-lg text-brand">
            <Box size={14} />
          </div>
          <div>
            <p className="text-[9px] text-text-muted uppercase font-bold tracking-tighter">Space</p>
            <code className="text-xs text-text-main font-mono font-semibold">{data.complexity.space}</code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmCard;