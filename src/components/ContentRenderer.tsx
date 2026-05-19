import type { JSX } from 'react';
import type { ContentBlock } from '../types';
import { CodeBlockView } from './CodeBlockView';

export function ContentRenderer({ content }: { content: ContentBlock[] }) {
  if (!content.length) {
    return <p className="text-gray-500">No content yet.</p>;
  }

  return (
    <div className="space-y-4">
      {content.map((block, index) => {
        if (block.type === 'paragraph') {
          return (
            <p key={index} className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {block.text}
            </p>
          );
        }
        if (block.type === 'heading') {
          const Tag = `h${block.level}` as keyof JSX.IntrinsicElements;
          return (
            <Tag key={index} className="text-white font-semibold mt-6 mb-2">
              {block.text}
            </Tag>
          );
        }
        if (block.type === 'code') {
          return <CodeBlockView key={index} block={block} />;
        }
        return null;
      })}
    </div>
  );
}
