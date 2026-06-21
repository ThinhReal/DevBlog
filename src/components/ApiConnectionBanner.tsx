interface ApiConnectionBannerProps {
  message: string;
}

export function ApiConnectionBanner({ message }: ApiConnectionBannerProps) {
  return (
    <div className="mx-4 sm:mx-6 lg:mx-8 mt-16 sm:mt-20 mb-0 p-3 sm:p-4 rounded-xl border border-danger-border bg-danger-bg text-danger text-sm">
      <p className="font-semibold mb-1">Cannot reach the API server</p>
      <p className="text-danger/90">{message}</p>
      <p className="text-muted mt-2 text-xs">
        Start the backend:{' '}
        <code className="bg-card border border-border px-1.5 py-0.5 rounded text-foreground font-mono">
          cd server && npm run dev
        </code>
        {' '}or run{' '}
        <code className="bg-card border border-border px-1.5 py-0.5 rounded text-foreground font-mono">
          npm run dev:all
        </code>
        {' '}from the project root.
      </p>
    </div>
  );
}
