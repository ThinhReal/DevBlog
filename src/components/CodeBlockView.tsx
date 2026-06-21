import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { PythonRunner } from './PythonRunner';
import { useTheme } from '../context/ThemeContext';
import type { ContentBlock } from '../types';

const PRISM_LANGUAGE: Record<string, string> = {
  java: 'java',
  python: 'python',
  typescript: 'typescript',
  javascript: 'javascript',
  sql: 'sql',
  bash: 'bash',
};

function toPrismLanguage(language: string): string {
  return PRISM_LANGUAGE[language.toLowerCase()] ?? language.toLowerCase();
}

interface CodeBlockViewProps {
  block: Extract<ContentBlock, { type: 'code' }>;
}

export function CodeBlockView({ block }: CodeBlockViewProps) {
  const { theme } = useTheme();
  const lang = block.language.toLowerCase();
  const canRun = block.runnable && lang === 'python';
  const syntaxStyle = theme === 'dark' ? oneDark : oneLight;

  return (
    <div className="my-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wider text-muted">
          {block.language}
        </span>
        {block.runnable && lang === 'python' && (
          <span className="text-xs text-success font-medium">Runnable</span>
        )}
      </div>
      <div className="overflow-x-auto rounded-xl">
        <SyntaxHighlighter
          language={toPrismLanguage(block.language)}
          style={syntaxStyle}
          customStyle={{
            margin: 0,
            borderRadius: '0.75rem',
            border: '1px solid var(--app-border-strong)',
            fontSize: '0.8125rem',
            minWidth: 'min(100%, 20rem)',
          }}
        >
          {block.code}
        </SyntaxHighlighter>
      </div>
      {canRun && <PythonRunner code={block.code} />}
    </div>
  );
}
