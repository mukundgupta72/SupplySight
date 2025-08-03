import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// This component checks if a user is authenticated and has the required role
const ProtectedRoute = ({ requiredRole }) => {
  const { user } = useAuth();

  // 1. Check if user is logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Check if user has the required role
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to a 'not authorized' page or back to their own dashboard
    return <Navigate to={user.role === 'owner' ? '/' : '/user-dashboard'} replace />;
  }

  // 3. If everything is okay, render the component
  return <Outlet />;
};

export default ProtectedRoute;
