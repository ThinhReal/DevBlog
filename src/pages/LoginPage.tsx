import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../api/client';

export function LoginPage() {
  const { isAuthenticated, login, loginAsGuest } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  function handleGuest() {
    loginAsGuest();
    navigate('/', { replace: true });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 backdrop-blur-lg">
        <h1 className="text-3xl mb-2 bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          TechKnowledge
        </h1>
        <p className="text-gray-400 text-sm mb-8">Sign in to manage your knowledge base</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="thinhlinhtinh2006@gmail.com"
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-300 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-lg bg-linear-to-r from-blue-600 to-purple-600 text-white font-medium hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-zinc-800" />
          <span className="text-xs uppercase tracking-wider text-gray-500">or</span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        <button
          type="button"
          onClick={handleGuest}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-zinc-700 text-gray-300 hover:text-white hover:bg-zinc-900 transition-colors"
        >
          <UserRound className="w-4 h-4" />
          Continue as guest (read-only)
        </button>
        <p className="text-xs text-gray-500 text-center mt-3">
          Browse blogs and categories without an account. You won't be able to create, edit, or delete.
        </p>
      </div>
    </div>
  );
}
