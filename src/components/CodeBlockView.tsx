import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { PythonRunner } from './PythonRunner';
import type { ContentBlock } from '../types';

interface CodeBlockViewProps {
  block: Extract<ContentBlock, { type: 'code' }>;
}

export function CodeBlockView({ block }: CodeBlockViewProps) {
  const canRun = block.runnable && block.language.toLowerCase() === 'python';

  return (
    <div className="my-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wider text-gray-500">{block.language}</span>
        {block.runnable && (
          <span className="text-xs text-green-500/80">Runnable</span>
        )}
      </div>
      <SyntaxHighlighter
        language={block.language === 'python' ? 'python' : block.language}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: '0.75rem',
          border: '1px solid rgb(39 39 42)',
          fontSize: '0.875rem',
        }}
      >
        {block.code}
      </SyntaxHighlighter>
      {canRun && <PythonRunner code={block.code} />}
    </div>
  );
}
