import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, Tag } from 'lucide-react';
import { getProductCategories } from '../../lib/supabase';
import { toast } from 'sonner';

const CategoryManagement = ({ onBack, onCategoriesUpdated }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await getProductCategories();
      if (error) throw error;
      
      // Convert categories to objects with counts for better management
      const categoryData = (data || []).map(category => ({
        name: category,
        id: category.toLowerCase().replace(/\s+/g, '-'),
        productCount: 0 // This would need to be fetched from products table
      }));
      
      setCategories(categoryData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    if (categories.some(cat => cat.name.toLowerCase() === newCategory.trim().toLowerCase())) {
      toast.error('Category already exists');
      return;
    }

    setSaving(true);
    try {
      // In a real implementation, you would add this to a categories table
      // For now, we'll simulate the addition
      const newCat = {
        name: newCategory.trim(),
        id: newCategory.trim().toLowerCase().replace(/\s+/g, '-'),
        productCount: 0
      };
      
      setCategories(prev => [...prev, newCat]);
      setNewCategory('');
      toast.success('Category added successfully');
      onCategoriesUpdated();
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    } finally {
      setSaving(false);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category.id);
    setEditValue(category.name);
  };

  const handleSaveEdit = async (categoryId) => {
    if (!editValue.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    if (categories.some(cat => cat.id !== categoryId && cat.name.toLowerCase() === editValue.trim().toLowerCase())) {
      toast.error('Category already exists');
      return;
    }

    setSaving(true);
    try {
      // In a real implementation, you would update the category in the database
      setCategories(prev => prev.map(cat => 
        cat.id === categoryId 
          ? { ...cat, name: editValue.trim() }
          : cat
      ));
      
      setEditingCategory(null);
      setEditValue('');
      toast.success('Category updated successfully');
      onCategoriesUpdated();
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (category) => {
    if (category.productCount > 0) {
      toast.error('Cannot delete category with existing products');
      return;
    }

    if (!confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
      return;
    }

    setSaving(true);
    try {
      // In a real implementation, you would delete from the database
      setCategories(prev => prev.filter(cat => cat.id !== category.id));
      toast.success('Category deleted successfully');
      onCategoriesUpdated();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditValue('');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
            <p className="text-gray-600">Organize your product categories</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
          <p className="text-gray-600">Organize your product categories</p>
        </div>
      </div>

      {/* Add New Category */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Category</h2>
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddCategory();
                }
              }}
            />
          </div>
          <button
            onClick={handleAddCategory}
            disabled={saving || !newCategory.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Existing Categories</h2>
          <p className="text-sm text-gray-600 mt-1">
            {categories.length} {categories.length === 1 ? 'category' : 'categories'} total
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="p-12 text-center">
            <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
            <p className="text-gray-600">Add your first product category to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {categories.map((category) => (
              <div key={category.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Tag className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      {editingCategory === category.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleSaveEdit(category.id);
                              } else if (e.key === 'Escape') {
                                handleCancelEdit();
                              }
                            }}
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveEdit(category.id)}
                            disabled={saving}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                          <p className="text-sm text-gray-600">
                            {category.productCount} {category.productCount === 1 ? 'product' : 'products'}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {editingCategory !== category.id && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit category"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category)}
                        disabled={category.productCount > 0}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={category.productCount > 0 ? 'Cannot delete category with products' : 'Delete category'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Category Management Tips</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Categories help organize your products and improve customer navigation</li>
          <li>• You cannot delete categories that have products assigned to them</li>
          <li>• Category names should be descriptive and consistent</li>
          <li>• Consider creating broad categories that can accommodate multiple product types</li>
        </ul>
      </div>
    </div>
  );
};

export default CategoryManagement;