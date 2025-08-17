import React, { useState } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { 
  Menu, 
  Bell, 
  Search, 
  Settings, 
  User, 
  LogOut,
  ChevronDown,
  Home
} from 'lucide-react';

const AdminHeader = ({ onMenuClick, admin, className = '' }) => {
  const { logout } = useAdmin();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    setShowNotifications(false);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowUserMenu(false);
  };

  const handleBackToSite = () => {
    // In a full implementation, this would navigate back to the main site
    console.log('Navigate back to main site');
  };

  return (
    <header className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb / Page title */}
          <div className="hidden sm:flex items-center space-x-2">
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          </div>
        </div>

        {/* Center section - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products, orders, users..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-3">
          {/* Back to site button */}
          <button
            onClick={handleBackToSite}
            className="hidden sm:flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <Home className="w-4 h-4" />
            <span>Back to Site</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={toggleNotifications}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg relative"
            >
              <Bell className="w-5 h-5" />
              {/* Notification badge */}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="p-4">
                  <div className="text-center py-8">
                    <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No new notifications</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={toggleUserMenu}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {admin?.full_name ? admin.full_name.charAt(0).toUpperCase() : admin?.email?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {admin?.full_name || admin?.email || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {admin?.role || 'Administrator'}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {/* User dropdown menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  <button className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </button>
                  <button className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <hr className="my-1" />
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;