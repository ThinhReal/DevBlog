import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../api/client';
import { ThemeToggle } from '../components/ThemeToggle';

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
      setError(getErrorMessage(err, 'Login failed'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 relative">
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 sm:p-8 backdrop-blur-lg shadow-sm">
        <h1 className="text-2xl sm:text-3xl mb-2 bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Thinh Learning Diary
        </h1>
        <p className="text-muted text-sm mb-8">Sign in to your learning diary</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-muted mb-1 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="thinhlinhtinh2006@gmail.com"
              className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:border-blue-500/50"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1 font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:border-blue-500/50"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-foreground transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          {error && <p className="text-danger text-sm font-medium">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-lg bg-linear-to-r from-blue-600 to-purple-600 text-white font-medium hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs uppercase tracking-wider text-muted">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <button
          type="button"
          onClick={handleGuest}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-border-strong text-muted hover:text-foreground hover:bg-card transition-colors"
        >
          <UserRound className="w-4 h-4" />
          Continue as guest (read-only)
        </button>
        <p className="text-xs text-muted text-center mt-3">
          Browse blogs and categories without an account. You won't be able to create, edit, or delete.
        </p>
      </div>
    </div>
  );
}
