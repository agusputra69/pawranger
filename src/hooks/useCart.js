import { useState, useCallback, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { errorUtils } from '../utils';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants';

export const useCart = () => {
  const { user } = useAuthContext();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);

  // Update cart item in Supabase
  const updateCartItemInSupabase = useCallback(async (productId, quantity) => {
    if (!user) return;

    const { error } = await supabase
      .from('cart')
      .upsert({
        user_id: user.id,
        product_id: productId,
        quantity
      });

    if (error) throw error;
  }, [user]);

  // Remove cart item from Supabase
  const removeCartItemFromSupabase = useCallback(async (productId) => {
    if (!user) return;

    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (error) throw error;
  }, [user]);

  // Load cart from Supabase
  const loadCartFromSupabase = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('cart')
        .select(`
          *,
          products (
            id,
            name,
            price,
            image_url,
            stock_quantity
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const formattedItems = data.map(item => ({
        id: item.product_id,
        name: item.products.name,
        price: item.products.price,
        image_url: item.products.image_url,
        stock_quantity: item.products.stock_quantity,
        quantity: item.quantity
      }));

      setCartItems(formattedItems);
    } catch (error) {
      console.error('Error loading cart from Supabase:', error);
      setError(errorUtils.getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [user, setCartItems]);

  // Sync local cart to Supabase
  const syncCartToSupabase = useCallback(async () => {
    if (!user || cartItems.length === 0) return;

    setSyncing(true);
    setError(null);

    try {
      // Clear existing cart items for this user
      await supabase
        .from('cart')
        .delete()
        .eq('user_id', user.id);

      // Insert current cart items
      const cartData = cartItems.map(item => ({
        user_id: user.id,
        product_id: item.id,
        quantity: item.quantity
      }));

      const { error } = await supabase
        .from('cart')
        .insert(cartData);

      if (error) throw error;
    } catch (error) {
      console.error('Error syncing cart to Supabase:', error);
      setError(errorUtils.getErrorMessage(error));
    } finally {
      setSyncing(false);
    }
  }, [user, cartItems]);

  // Load cart from Supabase when user logs in
  useEffect(() => {
    if (user && cartItems.length === 0) {
      loadCartFromSupabase();
    }
  }, [user, cartItems.length, loadCartFromSupabase]);

  // Sync local cart to Supabase when user logs in
  useEffect(() => {
    if (user && cartItems.length > 0 && !syncing) {
      syncCartToSupabase();
    }
  }, [user, cartItems.length, syncing, syncCartToSupabase]);

  // Add item to cart
  const addToCart = useCallback(async (product, quantity = 1) => {
    setError(null);

    try {
      const existingItem = cartItems.find(item => item.id === product.id);
      let updatedItems;

      if (existingItem) {
        // Update quantity of existing item
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock_quantity) {
          throw new Error(`Cannot add more items. Only ${product.stock_quantity} in stock.`);
        }

        updatedItems = cartItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        // Add new item
        if (quantity > product.stock_quantity) {
          throw new Error(`Cannot add ${quantity} items. Only ${product.stock_quantity} in stock.`);
        }

        const newItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          stock_quantity: product.stock_quantity,
          quantity
        };

        updatedItems = [...cartItems, newItem];
      }

      setCartItems(updatedItems);

      // Sync to Supabase if user is authenticated
      if (user) {
        await updateCartItemInSupabase(product.id, existingItem ? existingItem.quantity + quantity : quantity);
      }

      return {
        success: true,
        message: SUCCESS_MESSAGES.CART_ITEM_ADDED
      };
    } catch (error) {
      const errorMessage = errorUtils.getErrorMessage(error);
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    }
  }, [cartItems, setCartItems, user, updateCartItemInSupabase]);

  // Remove item from cart
  const removeFromCart = useCallback(async (productId) => {
    setError(null);

    try {
      const updatedItems = cartItems.filter(item => item.id !== productId);
      setCartItems(updatedItems);

      // Remove from Supabase if user is authenticated
      if (user) {
        await removeCartItemFromSupabase(productId);
      }

      return {
        success: true,
        message: SUCCESS_MESSAGES.CART_ITEM_REMOVED
      };
    } catch (error) {
      const errorMessage = errorUtils.getErrorMessage(error);
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    }
  }, [cartItems, setCartItems, user, removeCartItemFromSupabase]);

  // Update cart item quantity
  const updateCartQuantity = useCallback(async (productId, quantity) => {
    setError(null);

    try {
      if (quantity <= 0) {
        return await removeFromCart(productId);
      }

      const item = cartItems.find(item => item.id === productId);
      if (!item) {
        throw new Error('Item not found in cart');
      }

      if (quantity > item.stock_quantity) {
        throw new Error(`Cannot set quantity to ${quantity}. Only ${item.stock_quantity} in stock.`);
      }

      const updatedItems = cartItems.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      );

      setCartItems(updatedItems);

      // Sync to Supabase if user is authenticated
      if (user) {
        await updateCartItemInSupabase(productId, quantity);
      }

      return {
        success: true,
        message: SUCCESS_MESSAGES.CART_ITEM_UPDATED
      };
    } catch (error) {
      const errorMessage = errorUtils.getErrorMessage(error);
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    }
  }, [cartItems, setCartItems, user, updateCartItemInSupabase, removeFromCart]);

  // Clear entire cart
  const clearCart = useCallback(async () => {
    setError(null);

    try {
      setCartItems([]);

      // Clear from Supabase if user is authenticated
      if (user) {
        await supabase
          .from('cart')
          .delete()
          .eq('user_id', user.id);
      }

      return {
        success: true,
        message: 'Cart cleared successfully'
      };
    } catch (error) {
      const errorMessage = errorUtils.getErrorMessage(error);
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    }
  }, [setCartItems, user]);

  // Get cart item by product ID
  const getCartItem = useCallback((productId) => {
    return cartItems.find(item => item.id === productId);
  }, [cartItems]);

  // Check if product is in cart
  const isInCart = useCallback((productId) => {
    return cartItems.some(item => item.id === productId);
  }, [cartItems]);

  // Calculate cart totals
  const cartTotals = useCallback(() => {
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const tax = subtotal * 0.1; // 10% tax
    const shipping = subtotal > 500000 ? 0 : 25000; // Free shipping over 500k IDR
    const total = subtotal + tax + shipping;

    return {
      subtotal,
      tax,
      shipping,
      total,
      itemCount
    };
  }, [cartItems]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    cartItems,
    loading,
    error,
    syncing,
    isEmpty: cartItems.length === 0,
    itemCount: cartItems.reduce((total, item) => total + item.quantity, 0),
    
    // Methods
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    loadCartFromSupabase,
    syncCartToSupabase,
    
    // Utilities
    getCartItem,
    isInCart,
    cartTotals: cartTotals(),
    clearError
  };
};