import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, Filter, Eye, Edit, Package, Truck, CheckCircle, XCircle, Clock, AlertCircle, ChevronDown, ChevronUp, Calendar, User, DollarSign } from 'lucide-react';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const ordersPerPage = 20;

  const orderStatuses = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
    { value: 'processing', label: 'Processing', color: 'bg-purple-100 text-purple-800', icon: Package },
    { value: 'shipped', label: 'Shipped', color: 'bg-indigo-100 text-indigo-800', icon: Truck },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle },
    { value: 'refunded', label: 'Refunded', color: 'bg-gray-100 text-gray-800', icon: AlertCircle }
  ];

  const paymentStatuses = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'paid', label: 'Paid', color: 'bg-green-100 text-green-800' },
    { value: 'failed', label: 'Failed', color: 'bg-red-100 text-red-800' },
    { value: 'refunded', label: 'Refunded', color: 'bg-gray-100 text-gray-800' }
  ];

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('orders')
        .select(`
          *,
          users!inner(id, full_name, email),
          order_items(
            id,
            product_id,
            quantity,
            unit_price,
            total_price,
            product_name,
            product_sku
          )
        `);

      // Apply filters
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      if (paymentStatusFilter !== 'all') {
        query = query.eq('payment_status', paymentStatusFilter);
      }
      if (searchTerm) {
        query = query.or(`order_number.ilike.%${searchTerm}%,users.full_name.ilike.%${searchTerm}%,users.email.ilike.%${searchTerm}%`);
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
      const from = (currentPage - 1) * ordersPerPage;
      const to = from + ordersPerPage - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      setOrders(data || []);
      setTotalOrders(count || 0);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, paymentStatusFilter, searchTerm, dateFilter, sortBy, sortOrder, currentPage]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(true);
      const updateData = { status: newStatus };
      
      // Add timestamps for specific statuses
      if (newStatus === 'shipped') {
        updateData.shipped_at = new Date().toISOString();
      } else if (newStatus === 'delivered') {
        updateData.delivered_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);

      if (error) throw error;

      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, ...updateData }
          : order
      ));

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, ...updateData });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
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

  const getStatusConfig = (status) => {
    return orderStatuses.find(s => s.value === status) || orderStatuses[0];
  };

  const getPaymentStatusConfig = (status) => {
    return paymentStatuses.find(s => s.value === status) || paymentStatuses[0];
  };

  const totalPages = Math.ceil(totalOrders / ordersPerPage);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Management</h1>
        <p className="text-gray-600">Manage and track customer orders</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            {orderStatuses.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>

          {/* Payment Status Filter */}
          <select
            value={paymentStatusFilter}
            onChange={(e) => setPaymentStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Payments</option>
            {paymentStatuses.map(status => (
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
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="created_at">Date Created</option>
            <option value="total_amount">Total Amount</option>
            <option value="status">Status</option>
            <option value="order_number">Order Number</option>
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

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No orders found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => {
                    const statusConfig = getStatusConfig(order.status);
                    const paymentConfig = getPaymentStatusConfig(order.payment_status);
                    const StatusIcon = statusConfig.icon;

                    return (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{order.order_number}</div>
                            <div className="text-sm text-gray-500">{order.order_items?.length || 0} items</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{order.users?.full_name || 'N/A'}</div>
                            <div className="text-sm text-gray-500">{order.users?.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${paymentConfig.color}`}>
                            {paymentConfig.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(order.total_amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(order.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowOrderDetails(true);
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              disabled={updatingStatus}
                              className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              {orderStatuses.map(status => (
                                <option key={status.value} value={status.value}>{status.label}</option>
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
                      Showing <span className="font-medium">{(currentPage - 1) * ordersPerPage + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(currentPage * ordersPerPage, totalOrders)}</span> of{' '}
                      <span className="font-medium">{totalOrders}</span> results
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

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Order Details - {selectedOrder.order_number}</h3>
              <button
                onClick={() => setShowOrderDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Information */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Order Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Number:</span>
                      <span className="font-medium">{selectedOrder.order_number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusConfig(selectedOrder.status).color}`}>
                        {getStatusConfig(selectedOrder.status).label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getPaymentStatusConfig(selectedOrder.payment_status).color}`}>
                        {getPaymentStatusConfig(selectedOrder.payment_status).label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span>{formatDate(selectedOrder.created_at)}</span>
                    </div>
                    {selectedOrder.shipped_at && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipped:</span>
                        <span>{formatDate(selectedOrder.shipped_at)}</span>
                      </div>
                    )}
                    {selectedOrder.delivered_at && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivered:</span>
                        <span>{formatDate(selectedOrder.delivered_at)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Customer Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{selectedOrder.users?.full_name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span>{selectedOrder.users?.email}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                {selectedOrder.shipping_address && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Shipping Address</h4>
                    <div className="text-sm text-gray-600">
                      <p>{selectedOrder.shipping_address.name}</p>
                      <p>{selectedOrder.shipping_address.phone}</p>
                      <p>{selectedOrder.shipping_address.address}</p>
                      <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.postal_code}</p>
                      <p>{selectedOrder.shipping_address.country}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Items and Totals */}
              <div className="space-y-4">
                {/* Order Items */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
                  <div className="space-y-3">
                    {selectedOrder.order_items?.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                        <div>
                          <p className="font-medium text-sm">{item.product_name}</p>
                          <p className="text-xs text-gray-500">SKU: {item.product_sku || 'N/A'}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity} × {formatCurrency(item.unit_price)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">{formatCurrency(item.total_price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Totals */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Order Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span>{formatCurrency(selectedOrder.subtotal)}</span>
                    </div>
                    {selectedOrder.tax_amount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax:</span>
                        <span>{formatCurrency(selectedOrder.tax_amount)}</span>
                      </div>
                    )}
                    {selectedOrder.shipping_cost > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping:</span>
                        <span>{formatCurrency(selectedOrder.shipping_cost)}</span>
                      </div>
                    )}
                    {selectedOrder.discount_amount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Discount:</span>
                        <span className="text-red-600">-{formatCurrency(selectedOrder.discount_amount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-medium text-base border-t border-gray-300 pt-2">
                      <span>Total:</span>
                      <span>{formatCurrency(selectedOrder.total_amount)}</span>
                    </div>
                  </div>
                </div>

                {/* Tracking Information */}
                {selectedOrder.tracking_number && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Tracking Information</h4>
                    <div className="text-sm">
                      <p className="text-gray-600">Tracking Number:</p>
                      <p className="font-medium">{selectedOrder.tracking_number}</p>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedOrder.notes && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Notes</h4>
                    <p className="text-sm text-gray-600">{selectedOrder.notes}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowOrderDetails(false)}
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

export default OrderManagement;