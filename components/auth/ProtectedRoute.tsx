import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import Spinner from '../ui/Spinner';

interface ProtectedRouteProps {
  roles: UserRole[];
  children: React.ReactNode;
}

// FIX: Changed to React.FC to solve child prop type inference errors, aligning with conventions in other components.
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/connexion" replace />;
  }

  if (user && !roles.includes(user.role)) {
    // Redirect to a 'not authorized' page or home page
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;