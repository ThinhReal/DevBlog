import React from 'react';
// Sử dụng 'import type' để tránh lỗi verbatimModuleSyntax
import type { Algorithm } from '../types';

interface AlgorithmCardProps {
  data: Algorithm;
  onClick?: () => void;
}

const AlgorithmCard: React.FC<AlgorithmCardProps> = ({ data, onClick }) => {
  const difficultyStyles = {
    Easy: 'text-green-600 bg-green-50',
    Medium: 'text-yellow-600 bg-yellow-50',
    Hard: 'text-red-600 bg-red-50',
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col h-full group"
    >
      <div className="flex justify-between items-start mb-4">
        <span className="px-2 py-1 bg-gray-100 text-gray-500 text-[10px] font-bold uppercase rounded">
          {data.category}
        </span>
        <span className={`px-2 py-1 text-[10px] font-bold rounded ${difficultyStyles[data.difficulty]}`}>
          {data.difficulty}
        </span>
      </div>

      <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
        {data.title}
      </h3>

      <p className="text-gray-500 text-xs line-clamp-3 mb-6 grow leading-relaxed">
        {data.coreConcept}
      </p>

      <div className="flex gap-6 pt-4 border-t border-gray-50">
        <div>
          <p className="text-[10px] text-gray-400 uppercase font-semibold">Time</p>
          <code className="text-xs text-blue-600 font-mono">{data.complexity.time}</code>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 uppercase font-semibold">Space</p>
          <code className="text-xs text-blue-600 font-mono">{data.complexity.space}</code>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmCard;