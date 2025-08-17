import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, Filter, Eye, Edit, User, Mail, Phone, MapPin, Calendar, Shield, Ban, CheckCircle, XCircle, AlertTriangle, ChevronDown, ChevronUp, MoreVertical, Package } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showUserOrders, setShowUserOrders] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [updatingUser, setUpdatingUser] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const usersPerPage = 20;

  const userRoles = [
    { value: 'user', label: 'Customer', color: 'bg-blue-100 text-blue-800' },
    { value: 'admin', label: 'Admin', color: 'bg-purple-100 text-purple-800' },
    { value: 'moderator', label: 'Moderator', color: 'bg-green-100 text-green-800' }
  ];

  const userStatuses = [
    { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    { value: 'inactive', label: 'Inactive', color: 'bg-gray-100 text-gray-800', icon: XCircle },
    { value: 'suspended', label: 'Suspended', color: 'bg-red-100 text-red-800', icon: Ban },
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle }
  ];

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('users')
        .select(`
          *,
          orders(count)
        `, { count: 'exact' });

      // Apply filters
      if (roleFilter !== 'all') {
        query = query.eq('role', roleFilter);
      }
      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`);
      }
      if (dateFilter !== 'all') {
        const now = new Date();
        let startDate;
        switch (dateFilter) {
          case 'today':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
          case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          case 'year':
            startDate = new Date(now.getFullYear(), 0, 1);
            break;
          default:
            startDate = null;
        }
        if (startDate) {
          query = query.gte('created_at', startDate.toISOString());
        }
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      const from = (currentPage - 1) * usersPerPage;
      const to = from + usersPerPage - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      setUsers(data || []);
      setTotalUsers(count || 0);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [roleFilter, searchTerm, dateFilter, sortBy, sortOrder, currentPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const fetchUserOrders = async (userId) => {
    try {
      setLoadingOrders(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          status,
          payment_status,
          total_amount,
          created_at,
          order_items(count)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setUserOrders(data || []);
    } catch (error) {
      console.error('Error fetching user orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      setUpdatingUser(true);
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      // Update local state
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, role: newRole }
          : user
      ));

      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({ ...selectedUser, role: newRole });
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    } finally {
      setUpdatingUser(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const getRoleConfig = (role) => {
    return userRoles.find(r => r.value === role) || userRoles[0];
  };



  const totalPages = Math.ceil(totalUsers / usersPerPage);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">User Management</h1>
        <p className="text-gray-600">Manage customer accounts and user data</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Roles</option>
            {userRoles.map(role => (
              <option key={role.value} value={role.value}>{role.label}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            {userStatuses.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="created_at">Date Joined</option>
            <option value="full_name">Name</option>
            <option value="email">Email</option>
            <option value="role">Role</option>
          </select>

          {/* Sort Order */}
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <span className="ml-1 text-sm">{sortOrder === 'asc' ? 'Asc' : 'Desc'}</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No users found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => {
                    const roleConfig = getRoleConfig(user.role);
                    const orderCount = user.orders?.[0]?.count || 0;

                    return (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {user.avatar_url ? (
                                <img className="h-10 w-10 rounded-full" src={user.avatar_url} alt="" />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                  <User className="h-5 w-5 text-gray-600" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.full_name || 'N/A'}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {user.phone && (
                              <div className="flex items-center mb-1">
                                <Phone className="w-3 h-3 mr-1 text-gray-400" />
                                <span>{user.phone}</span>
                              </div>
                            )}
                            {(user.city || user.country) && (
                              <div className="flex items-center">
                                <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                                <span className="text-xs text-gray-500">
                                  {[user.city, user.country].filter(Boolean).join(', ')}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleConfig.color}`}>
                            <Shield className="w-3 h-3 mr-1" />
                            {roleConfig.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="font-medium">{orderCount}</span>
                          <span className="text-gray-500 ml-1">orders</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(user.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowUserDetails(true);
                              }}
                              className="text-blue-600 hover:text-blue-900"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                fetchUserOrders(user.id);
                                setShowUserOrders(true);
                              }}
                              className="text-green-600 hover:text-green-900"
                              title="View Orders"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            <select
                              value={user.role}
                              onChange={(e) => updateUserRole(user.id, e.target.value)}
                              disabled={updatingUser}
                              className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              {userRoles.map(role => (
                                <option key={role.value} value={role.value}>{role.label}</option>
                              ))}
                            </select>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(currentPage - 1) * usersPerPage + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(currentPage * usersPerPage, totalUsers)}</span> of{' '}
                      <span className="font-medium">{totalUsers}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + Math.max(1, currentPage - 2);
                        if (page > totalPages) return null;
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              page === currentPage
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">User Details</h3>
              <button
                onClick={() => setShowUserDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Profile Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Profile Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedUser.full_name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedUser.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <p className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleConfig(selectedUser.role).color}`}>
                        {getRoleConfig(selectedUser.role).label}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Address Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedUser.address || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedUser.city || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedUser.postal_code || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Country</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedUser.country || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Account Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date Joined</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(selectedUser.created_at)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(selectedUser.updated_at)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowUserDetails(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Orders Modal */}
      {showUserOrders && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Order History - {selectedUser.full_name || selectedUser.email}
              </h3>
              <button
                onClick={() => setShowUserOrders(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {loadingOrders ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading orders...</p>
              </div>
            ) : userOrders.length === 0 ? (
              <div className="p-8 text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No orders found for this user</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{order.order_number}</div>
                            <div className="text-sm text-gray-500">{order.order_items?.[0]?.count || 0} items</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                            order.payment_status === 'failed' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.payment_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(order.total_amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(order.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowUserOrders(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;