import React, { useState } from 'react';
import AdminDashboard from './AdminDashboard';
import ProductManagement from '../../components/admin/ProductManagement';
import CategoryManagement from '../../components/admin/CategoryManagement';
import OrderManagement from './OrderManagement';
import UserManagement from './UserManagement';

const AdminRouter = () => {
  const [currentView, setCurrentView] = useState('overview');
  const [viewStack, setViewStack] = useState(['overview']);

  const navigateTo = (view, addToStack = true) => {
    setCurrentView(view);
    if (addToStack) {
      setViewStack(prev => [...prev, view]);
    }
  };

  const navigateBack = () => {
    if (viewStack.length > 1) {
      const newStack = viewStack.slice(0, -1);
      const previousView = newStack[newStack.length - 1];
      setViewStack(newStack);
      setCurrentView(previousView);
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'overview':
        return null; // Will show default dashboard content
      
      case 'products':
        return (
          <ProductManagement 
            onBack={() => navigateTo('overview', false)}
            onNavigateToCategories={() => navigateTo('categories')}
          />
        );
      
      case 'categories':
        return (
          <CategoryManagement 
            onBack={navigateBack}
            onCategoriesUpdated={() => {
              // Refresh categories or handle updates
              console.log('Categories updated');
            }}
          />
        );
      
      case 'orders':
        return (
          <OrderManagement onBack={() => navigateTo('overview', false)} />
        );
      
      case 'users':
        return (
          <UserManagement onBack={() => navigateTo('overview', false)} />
        );
      
      case 'services':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateTo('overview', false)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Service Management</h1>
                <p className="text-gray-600">Manage pet care services and bookings</p>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
              <p className="text-gray-600">Service management features will be available in Phase 3.</p>
            </div>
          </div>
        );
      
      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateTo('overview', false)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-gray-600">View platform performance and insights</p>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
              <p className="text-gray-600">Analytics dashboard will be available in Phase 4.</p>
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateTo('overview', false)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600">Configure platform settings and preferences</p>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
              <p className="text-gray-600">Settings management will be available in future phases.</p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <AdminDashboard currentView={currentView} onNavigate={navigateTo}>
      {renderCurrentView()}
    </AdminDashboard>
  );
};

export default AdminRouter;