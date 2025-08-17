import React from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  Users, 
  Calendar, 
  BarChart3, 
  Settings, 
  LogOut,
  X,
  Shield
} from 'lucide-react';

const AdminSidebar = ({ currentView = 'overview', onClose, onNavigate, className = '' }) => {
  const { admin, logout, hasPermission } = useAdmin();

  const menuItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: Home,
      path: '/admin',
      permission: null // Available to all admin users
    },
    {
      id: 'products',
      label: 'Products',
      icon: Package,
      path: '/admin/products',
      permission: 'manage_products'
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingCart,
      path: '/admin/orders',
      permission: 'manage_orders'
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      path: '/admin/users',
      permission: 'manage_users'
    },
    {
      id: 'services',
      label: 'Services',
      icon: Calendar,
      path: '/admin/services',
      permission: 'manage_services'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      path: '/admin/analytics',
      permission: 'view_analytics'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/admin/settings',
      permission: 'manage_settings'
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      if (onClose) onClose();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleMenuClick = (item) => {
    // Close sidebar on mobile
    if (onClose) onClose();
    
    // Handle navigation
    if (onNavigate) {
      onNavigate(item.id);
    }
  };

  // Filter menu items based on permissions
  const visibleMenuItems = menuItems.filter(item => 
    !item.permission || hasPermission(item.permission)
  );

  return (
    <div className={`flex flex-col h-full bg-white border-r border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">PawRanger</h2>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>
        
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Admin info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {admin?.full_name ? admin.full_name.charAt(0).toUpperCase() : admin?.email?.charAt(0).toUpperCase() || 'A'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {admin?.full_name || admin?.email || 'Admin User'}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {admin?.role || 'Administrator'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {visibleMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item)}
              className={`
                w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200
                ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
        >
          <LogOut className="w-5 h-5 text-gray-400" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;