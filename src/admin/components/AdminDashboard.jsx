import React, { useState } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { Menu, X } from 'lucide-react';

const AdminDashboard = ({ children, currentView = 'overview', onNavigate }) => {
  const { admin } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <AdminSidebar 
          currentView={currentView} 
          onClose={closeSidebar}
          onNavigate={onNavigate}
          className="h-full"
        />
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <AdminHeader 
          onMenuClick={toggleSidebar}
          admin={admin}
          className="sticky top-0 z-30"
        />

        {/* Page content */}
        <main className="p-4 lg:p-6">
          {children || (
            <div className="max-w-7xl mx-auto">
              {/* Default dashboard overview */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome back, {admin?.full_name || admin?.email}
                </h1>
                <p className="text-gray-600">
                  Manage your PawRanger platform from this dashboard.
                </p>
              </div>

              {/* Quick stats cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-medium">P</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Products</p>
                      <p className="text-2xl font-semibold text-gray-900">-</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-medium">O</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Orders</p>
                      <p className="text-2xl font-semibold text-gray-900">-</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-medium">U</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Users</p>
                      <p className="text-2xl font-semibold text-gray-900">-</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-medium">S</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Services</p>
                      <p className="text-2xl font-semibold text-gray-900">-</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent activity placeholder */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                </div>
                <div className="p-6">
                  <div className="text-center py-12">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <Menu className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 mb-2">No recent activity</p>
                    <p className="text-sm text-gray-400">
                      Activity will appear here once you start managing your platform.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;