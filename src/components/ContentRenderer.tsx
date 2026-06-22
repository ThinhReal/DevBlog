import type { JSX } from 'react';
import type { ContentBlock } from '../types';
import { getHeadingClassName } from '../lib/headingStyles';
import { CodeBlockView } from './CodeBlockView';
import { ParagraphWithKeyPoint } from './ParagraphWithKeyPoint';

export function ContentRenderer({ content }: { content: ContentBlock[] }) {
  if (!content.length) {
    return <p className="text-muted">No content yet.</p>;
  }

  return (
    <div className="space-y-4">
      {content.map((block, index) => {
        if (block.type === 'paragraph') {
          return (
            <ParagraphWithKeyPoint
              key={index}
              text={block.text}
              keyPoint={block.keyPoint}
            />
          );
        }
        if (block.type === 'heading') {
          const Tag = `h${block.level}` as keyof JSX.IntrinsicElements;
          return (
            <Tag
              key={index}
              className={`${getHeadingClassName(block.level)} mt-6 mb-2 first:mt-0`}
            >
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
