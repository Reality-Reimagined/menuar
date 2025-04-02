import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (!isLoading && !user) {
      showToast('Please log in to access this page', 'info');
      navigate('/login');
    }
  }, [user, isLoading, navigate, showToast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return user ? <>{children}</> : null;
};

export default ProtectedRoute;
