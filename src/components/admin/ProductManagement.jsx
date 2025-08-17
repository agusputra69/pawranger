import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Filter, Download, Upload } from 'lucide-react';
import { getAllProductsAdmin, getProductCategories, getProductBrands } from '../../lib/supabase';
import ProductTable from './ProductTable';
import ProductForm from './ProductForm';
import CategoryManagement from './CategoryManagement';
import { toast } from 'sonner';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryManagement, setShowCategoryManagement] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const itemsPerPage = 20;

  // Fetch products with filters
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error, count } = await getAllProductsAdmin({
        search: searchTerm,
        category: selectedCategory,
        brand: selectedBrand,
        sortBy,
        sortOrder,
        page: currentPage,
        limit: itemsPerPage
      });

      if (error) throw error;

      setProducts(data || []);
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory, selectedBrand, sortBy, sortOrder, currentPage]);

  // Fetch filter options
  const fetchFilterOptions = async () => {
    try {
      const [categoriesData, brandsData] = await Promise.all([
        getProductCategories(),
        getProductBrands()
      ]);

      setCategories(categoriesData.data || []);
      setBrands(brandsData.data || []);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory, selectedBrand, sortBy, sortOrder, currentPage, fetchProducts]);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleProductSaved = () => {
    setShowProductForm(false);
    setEditingProduct(null);
    fetchProducts();
    toast.success(editingProduct ? 'Product updated successfully' : 'Product created successfully');
  };

  const handleProductDeleted = () => {
    fetchProducts();
    toast.success('Product deleted successfully');
  };

  const handleBulkAction = async (action) => {
    if (selectedProducts.length === 0) {
      toast.error('Please select products first');
      return;
    }

    try {
      // Implement bulk actions here
      switch (action) {
        case 'delete':
          // Bulk delete logic
          break;
        case 'activate':
          // Bulk activate logic
          break;
        case 'deactivate':
          // Bulk deactivate logic
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Bulk action error:', error);
      toast.error('Failed to perform bulk action');
    }
  };

  const handleExport = () => {
    // Export products to CSV
    toast.info('Export functionality coming soon');
  };

  const handleImport = () => {
    // Import products from CSV
    toast.info('Import functionality coming soon');
  };

  if (showProductForm) {
    return (
      <ProductForm
        product={editingProduct}
        onSave={handleProductSaved}
        onCancel={() => {
          setShowProductForm(false);
          setEditingProduct(null);
        }}
      />
    );
  }

  if (showCategoryManagement) {
    return (
      <CategoryManagement
        onBack={() => setShowCategoryManagement(false)}
        onCategoriesUpdated={fetchFilterOptions}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowCategoryManagement(true)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Filter className="w-4 h-4 inline mr-2" />
            Categories
          </button>
          <button
            onClick={handleImport}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Upload className="w-4 h-4 inline mr-2" />
            Import
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Download className="w-4 h-4 inline mr-2" />
            Export
          </button>
          <button
            onClick={handleAddProduct}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Brand Filter */}
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Brands</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="created_at-desc">Newest First</option>
            <option value="created_at-asc">Oldest First</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="price-asc">Price Low-High</option>
            <option value="price-desc">Price High-Low</option>
            <option value="stock_quantity-asc">Stock Low-High</option>
            <option value="stock_quantity-desc">Stock High-Low</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded hover:bg-green-200"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="px-3 py-1 text-sm font-medium text-yellow-700 bg-yellow-100 rounded hover:bg-yellow-200"
              >
                Deactivate
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Table */}
      <ProductTable
        products={products}
        loading={loading}
        selectedProducts={selectedProducts}
        onSelectionChange={setSelectedProducts}
        onEdit={handleEditProduct}
        onDelete={handleProductDeleted}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default ProductManagement;