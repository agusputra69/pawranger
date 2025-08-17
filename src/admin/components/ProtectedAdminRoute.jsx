import React from 'react';
import { useAdmin } from '../contexts/AdminContext';
import AdminLogin from './AdminLogin';
import { Shield, Loader2 } from 'lucide-react';

const ProtectedAdminRoute = ({ children, requiredRole = null, requiredPermission = null }) => {
  const { isAuthenticated, loading, admin, hasRole, hasPermission } = useAdmin();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Verifying admin access...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  // Check role-based access
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">
              You don't have the required role to access this area.
            </p>
            <div className="text-sm text-gray-500">
              <p>Required role: <span className="font-medium">{Array.isArray(requiredRole) ? requiredRole.join(' or ') : requiredRole}</span></p>
              <p>Your role: <span className="font-medium">{admin?.role || 'Unknown'}</span></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check permission-based access
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">
              You don't have the required permission to access this area.
            </p>
            <div className="text-sm text-gray-500">
              <p>Required permission: <span className="font-medium">{requiredPermission}</span></p>
              <p>Your role: <span className="font-medium">{admin?.role || 'Unknown'}</span></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated and authorized, render the protected content
  return children;
};

export default ProtectedAdminRoute;