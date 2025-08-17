import { useAuthContext } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthContext();

  // Show loading screen while checking authentication
  if (loading) {
    return <LoadingScreen />;
  }

  // Redirect to home if not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Render protected content if authenticated
  return children;
};

export default ProtectedRoute;