import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  userType?: 'OWNER' | 'MEMBER';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, userType }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user type matches required type
  if (userType && user?.role !== userType) {
    const redirectTo = user?.role === 'OWNER' ? '/dashboard' : '/member-dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};