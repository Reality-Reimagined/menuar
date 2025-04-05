import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useMenuContext } from '../context/MenuContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const { initDemoMenu } = useMenuContext();

  useEffect(() => {
    // Check if this is a demo-related route
    const isDemoRoute = location.pathname.includes('/preview/') || 
                       location.pathname.includes('/view/');

    // If it's a demo route and user isn't logged in, initialize demo menu
    if (isDemoRoute && !user && !isLoading) {
      initDemoMenu();
      return;
    }

    // For non-demo routes, require authentication
    if (!isLoading && !user && !isDemoRoute) {
      showToast('Please log in to access this page', 'info');
      navigate('/login', { state: { from: location } });
    }
  }, [user, isLoading, navigate, showToast, location, initDemoMenu]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Allow access to demo routes without login
  if (location.pathname.includes('/preview/') || location.pathname.includes('/view/')) {
    return <>{children}</>;
  }

  return user ? <>{children}</> : null;
};

export default ProtectedRoute;