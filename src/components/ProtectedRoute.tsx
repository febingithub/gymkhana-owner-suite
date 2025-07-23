import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  userType?: 'owner' | 'member';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, userType }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user type matches required type
  if (userType && user.userType !== userType) {
    const redirectTo = user.userType === 'owner' ? '/dashboard' : '/member-dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};