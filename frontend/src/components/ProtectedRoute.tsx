import { Navigate } from 'react-router-dom';
import { useAuth, TipoRol } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: TipoRol[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { usuario, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(usuario?.tipoRol as TipoRol)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
