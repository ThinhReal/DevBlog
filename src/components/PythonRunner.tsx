import { useCallback, useState } from 'react';
import { Play, Loader2 } from 'lucide-react';

let pyodidePromise: Promise<{
  runPythonAsync: (code: string) => Promise<unknown>;
  setStdout: (opts: { batched: (msg: string) => void }) => void;
}> | null = null;

async function loadPyodide() {
  if (!pyodidePromise) {
    pyodidePromise = import('pyodide').then(async ({ loadPyodide }) => {
      const pyodide = await loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.6/full/',
      });
      return pyodide;
    });
  }
  return pyodidePromise;
}

interface PythonRunnerProps {
  code: string;
}

export function PythonRunner({ code }: PythonRunnerProps) {
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [running, setRunning] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const run = useCallback(async () => {
    setRunning(true);
    setOutput('');
    setError('');

    try {
      const pyodide = await loadPyodide();
      setLoaded(true);

      let stdout = '';
      pyodide.setStdout({
        batched: (msg: string) => {
          stdout += msg;
        },
      });

      const result = await pyodide.runPythonAsync(code);
      const resultStr =
        result !== undefined && result !== null ? String(result) : '';
      setOutput(stdout || resultStr || '(no output)');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setRunning(false);
    }
  }, [code]);

  return (
    <div className="mt-3 space-y-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={run}
          disabled={running}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-600/20 border border-green-500/30 text-green-400 text-sm hover:bg-green-600/30 disabled:opacity-50"
        >
          {running ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          {running ? 'Running...' : 'Run Python'}
        </button>
        {!loaded && running && (
          <span className="text-xs text-gray-500">Loading Pyodide (first run may take a moment)...</span>
        )}
      </div>
      <p className="text-xs text-amber-500/80">
        Code runs locally in your browser. Do not run untrusted scripts.
      </p>
      {(output || error) && (
        <pre className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-sm overflow-x-auto whitespace-pre-wrap">
          {error ? <span className="text-red-400">{error}</span> : output}
        </pre>
      )}
    </div>
  );
}
