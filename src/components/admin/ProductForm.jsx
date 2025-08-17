import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, X, Plus } from 'lucide-react';
import { createProduct, updateProduct, getProductCategories, getProductBrands } from '../../lib/supabase';
import { toast } from 'sonner';

const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    brand: '',
    price: '',
    stock_quantity: '',
    image_url: '',
    image_urls: [],
    is_active: true,
    tags: []
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        category: product.category || '',
        brand: product.brand || '',
        price: product.price?.toString() || '',
        stock_quantity: product.stock_quantity?.toString() || '',
        image_url: product.image_url || '',
        image_urls: product.image_urls || [],
        is_active: product.is_active ?? true,
        tags: product.tags || []
      });
    }
  }, [product]);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!formData.stock_quantity || parseInt(formData.stock_quantity) < 0) {
      newErrors.stock_quantity = 'Valid stock quantity is required';
    }

    if (!formData.image_url.trim()) {
      newErrors.image_url = 'Main image URL is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity)
      };

      if (product) {
        const { error } = await updateProduct(product.id, productData);
        if (error) throw error;
      } else {
        const { error } = await createProduct(productData);
        if (error) throw error;
      }

      onSave();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addImageUrl = () => {
    if (newImageUrl.trim() && !formData.image_urls.includes(newImageUrl.trim())) {
      setFormData(prev => ({
        ...prev,
        image_urls: [...prev.image_urls, newImageUrl.trim()]
      }));
      setNewImageUrl('');
    }
  };

  const removeImageUrl = (index) => {
    setFormData(prev => ({
      ...prev,
      image_urls: prev.image_urls.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onCancel}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-gray-600">
            {product ? 'Update product information' : 'Create a new product in your catalog'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter product name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.category ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand
              </label>
              <select
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select brand</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.price ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>

            {/* Stock Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock_quantity}
                onChange={(e) => handleInputChange('stock_quantity', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.stock_quantity ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.stock_quantity && <p className="mt-1 text-sm text-red-600">{errors.stock_quantity}</p>}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter product description"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Images</h2>
          
          {/* Main Image */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Main Image URL *
            </label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => handleInputChange('image_url', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.image_url ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="https://example.com/image.jpg"
            />
            {errors.image_url && <p className="mt-1 text-sm text-red-600">{errors.image_url}</p>}
            {formData.image_url && (
              <div className="mt-2">
                <img
                  src={formData.image_url}
                  alt="Main product image"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Additional Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Images
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
              <button
                type="button"
                onClick={addImageUrl}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {formData.image_urls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.image_urls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImageUrl(index)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags</h2>
          
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter tag"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => handleInputChange('is_active', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor="is_active" className="ml-2 text-sm font-medium text-gray-700">
              Product is active and visible to customers
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;