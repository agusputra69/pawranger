import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { errorUtils } from '../utils';
import { ERROR_MESSAGES, PAGINATION } from '../constants';
import { useLoading } from '../components/LoadingBoundary';

/**
 * Custom hook for managing products state and operations
 * @returns {Object} Products state and methods
 */
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const { isLoading, error, executeAsync, setError } = useLoading(true);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filters state
  const [filters, setFilters] = useState({
    category: 'all',
    search: '',
    minPrice: 0,
    maxPrice: 1000000,
    brands: [],
    sortBy: 'popular',
    page: 1,
    limit: PAGINATION.itemsPerPage
  });

  // Fetch products with current filters
  const fetchProducts = useCallback(async (resetProducts = false) => {
    return executeAsync(async () => {
      let query = supabase
        .from('products')
        .select('*', { count: 'exact' });

      // Apply category filter
      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      // Apply search filter
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      // Apply price range filter
      if (filters.minPrice > 0) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters.maxPrice < 1000000) {
        query = query.lte('price', filters.maxPrice);
      }

      // Apply brand filter
      if (filters.brands && filters.brands.length > 0) {
        query = query.in('brand', filters.brands);
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'price-low':
          query = query.order('price', { ascending: true });
          break;
        case 'price-high':
          query = query.order('price', { ascending: false });
          break;
        case 'rating':
          query = query.order('rating', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'popular':
        default:
          query = query.order('review_count', { ascending: false });
          break;
      }

      // Apply pagination
      const from = (filters.page - 1) * filters.limit;
      const to = from + filters.limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw new Error(`Failed to fetch products: ${error.message}`);

      if (resetProducts || filters.page === 1) {
        setProducts(data || []);
      } else {
        setProducts(prev => [...prev, ...(data || [])]);
      }

      setTotalCount(count || 0);
      setHasMore(data && data.length === filters.limit && (from + data.length) < (count || 0));
      
      return data;
    });
  }, [filters, executeAsync]);

  // Load initial products
  useEffect(() => {
    fetchProducts(true);
  }, [fetchProducts]);

  // Load more products (pagination)
  useEffect(() => {
    if (filters.page > 1) {
      fetchProducts(false);
    }
  }, [filters.page, fetchProducts]);

  // Update filter
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value // Reset page when other filters change
    }));
  }, []);

  // Update multiple filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset page when filters change
    }));
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters({
      category: 'all',
      search: '',
      minPrice: 0,
      maxPrice: 1000000,
      brands: [],
      sortBy: 'popular',
      page: 1,
      limit: PAGINATION.itemsPerPage
    });
  }, []);

  // Load more products (pagination)
  const loadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      updateFilter('page', filters.page + 1);
    }
  }, [hasMore, isLoading, filters.page, updateFilter]);

  // Refresh products
  const refresh = useCallback(() => {
    setFilters(prev => ({ ...prev, page: 1 }));
    fetchProducts(true);
  }, [fetchProducts]);

  // Search products
  const searchProducts = useCallback((searchTerm) => {
    updateFilter('search', searchTerm);
  }, [updateFilter]);

  // Filter by category
  const filterByCategory = useCallback((category) => {
    updateFilter('category', category);
  }, [updateFilter]);

  // Filter by price range
  const filterByPriceRange = useCallback((minPrice, maxPrice) => {
    updateFilters({ minPrice, maxPrice });
  }, [updateFilters]);

  // Filter by brands
  const filterByBrands = useCallback((brands) => {
    updateFilter('brands', brands);
  }, [updateFilter]);

  // Sort products
  const sortProducts = useCallback((sortBy) => {
    updateFilter('sortBy', sortBy);
  }, [updateFilter]);

  // Toggle brand filter
  const toggleBrand = useCallback((brand) => {
    const currentBrands = filters.brands || [];
    const newBrands = currentBrands.includes(brand)
      ? currentBrands.filter(b => b !== brand)
      : [...currentBrands, brand];
    
    updateFilter('brands', newBrands);
  }, [filters.brands, updateFilter]);

  // Get product by ID
  const getProductById = useCallback((id) => {
    return products.find(product => product.id === id);
  }, [products]);

  // Get products by category
  const getProductsByCategory = useCallback((category) => {
    return products.filter(product => product.category === category);
  }, [products]);

  // Get featured products
  const getFeaturedProducts = useCallback((limit = 8) => {
    return products
      .filter(product => product.featured)
      .slice(0, limit);
  }, [products]);

  // Get related products
  const getRelatedProducts = useCallback((productId, limit = 4) => {
    const product = getProductById(productId);
    if (!product) return [];

    return products
      .filter(p => p.id !== productId && p.category === product.category)
      .slice(0, limit);
  }, [products, getProductById]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  // Memoized computed values
  const computedValues = useMemo(() => {
    const availableBrands = [...new Set(products.map(p => p.brand).filter(Boolean))];
    const availableCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
    const priceRange = products.length > 0 ? {
      min: Math.min(...products.map(p => p.price)),
      max: Math.max(...products.map(p => p.price))
    } : { min: 0, max: 1000000 };

    return {
      availableBrands,
      availableCategories,
      priceRange,
      isEmpty: products.length === 0,
      totalPages: Math.ceil(totalCount / filters.limit),
      currentPage: filters.page,
      isFirstPage: filters.page === 1,
      isLastPage: !hasMore
    };
  }, [products, totalCount, filters.limit, filters.page, hasMore]);

  return {
    // State
    products,
    loading: isLoading,
    error,
    filters,
    hasMore,
    totalCount,
    
    // Computed values
    ...computedValues,
    
    // Methods
    fetchProducts,
    updateFilter,
    updateFilters,
    resetFilters,
    loadMore,
    refresh,
    
    // Specific filter methods
    searchProducts,
    filterByCategory,
    filterByPriceRange,
    filterByBrands,
    sortProducts,
    toggleBrand,
    
    // Utility methods
    getProductById,
    getProductsByCategory,
    getFeaturedProducts,
    getRelatedProducts,
    clearError,
    setError
  };
};

/**
 * Hook for fetching a single product by ID
 * @param {string} productId - Product ID to fetch
 * @returns {Object} Single product state and methods
 */
export const useProduct = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProduct = useCallback(async () => {
    if (!productId) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;

      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      setError(errorUtils.getErrorMessage(error));
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
    clearError
  };
};