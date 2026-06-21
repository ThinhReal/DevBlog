import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireWrite?: boolean;
}

export function ProtectedRoute({ children, requireWrite = false }: ProtectedRouteProps) {
  const { isAuthenticated, canWrite, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireWrite && !canWrite) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
