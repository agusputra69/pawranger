import React, { useState } from 'react';
import { Edit, Trash2, Eye, EyeOff, Package, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import { deleteProduct, toggleProductStatus } from '../../lib/supabase';
import { toast } from 'sonner';

const ProductTable = ({
  products,
  loading,
  selectedProducts,
  onSelectionChange,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange
}) => {
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange(products.map(p => p.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectProduct = (productId, checked) => {
    if (checked) {
      onSelectionChange([...selectedProducts, productId]);
    } else {
      onSelectionChange(selectedProducts.filter(id => id !== productId));
    }
  };

  const handleDelete = async (product) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(product.id);
    try {
      const { error } = await deleteProduct(product.id);
      if (error) throw error;
      
      onDelete();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (product) => {
    setTogglingId(product.id);
    try {
      const { error } = await toggleProductStatus(product.id, !product.is_active);
      if (error) throw error;
      
      toast.success(`Product ${!product.is_active ? 'activated' : 'deactivated'} successfully`);
      onDelete(); // Refresh the list
    } catch (error) {
      console.error('Error toggling product status:', error);
      toast.error('Failed to update product status');
    } finally {
      setTogglingId(null);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { text: 'Out of Stock', color: 'text-red-600 bg-red-50' };
    if (quantity <= 10) return { text: 'Low Stock', color: 'text-yellow-600 bg-yellow-50' };
    return { text: 'In Stock', color: 'text-green-600 bg-green-50' };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-12 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">No products match your current filters. Try adjusting your search criteria.</p>
        </div>
      </div>
    );
  }

  const allSelected = products.length > 0 && selectedProducts.length === products.length;
  const someSelected = selectedProducts.length > 0 && selectedProducts.length < products.length;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="w-12 px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => {
              const stockStatus = getStockStatus(product.stock_quantity);
              const isSelected = selectedProducts.includes(product.id);
              
              return (
                <tr key={product.id} className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-12 h-12">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/48x48?text=No+Image';
                          }}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 line-clamp-1">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {product.brand || 'No brand'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {product.stock_quantity}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                        {stockStatus.text}
                      </span>
                      {product.stock_quantity <= 10 && product.stock_quantity > 0 && (
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(product.created_at)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleStatus(product)}
                        disabled={togglingId === product.id}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title={product.is_active ? 'Deactivate product' : 'Activate product'}
                      >
                        {togglingId === product.id ? (
                          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                        ) : product.is_active ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => onEdit(product)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        disabled={deletingId === product.id}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete product"
                      >
                        {deletingId === product.id ? (
                          <div className="w-4 h-4 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
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
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => onPageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          pageNum === currentPage
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTable;