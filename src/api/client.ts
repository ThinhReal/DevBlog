const API_BASE = import.meta.env.VITE_API_URL ?? '';

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export function isNetworkError(err: unknown): boolean {
  return err instanceof TypeError && err.message === 'Failed to fetch';
}

export function getErrorMessage(err: unknown, fallback = 'Request failed'): string {
  if (isNetworkError(err)) {
    return import.meta.env.PROD
      ? 'Cannot connect to the API. Check that the server is running and configured.'
      : 'Cannot connect to API server. Run npm run dev:all from the DevCollect folder.';
  }
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return fallback;
}

function getToken(): string | null {
  return localStorage.getItem('token');
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers ?? {}),
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });
  } catch (err) {
    if (isNetworkError(err)) {
      throw new ApiError(
        import.meta.env.PROD
          ? 'Cannot connect to the API. Check that the server is running and configured.'
          : 'Cannot connect to API server. Run npm run dev:all from the DevCollect folder.',
        0
      );
    }
    throw err;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof data === 'object' && data && 'error' in data
        ? String((data as { error: unknown }).error)
        : response.statusText;
    throw new ApiError(message, response.status, data);
  }

  return data as T;
}
