import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const signUp = async (email, password, userData = {}) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  })
  return { data, error }
}

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

// Database helpers
export const getProducts = async (filters = {}) => {
  let query = supabase
    .from('products')
    .select('*')
    .eq('is_active', true)

  // Apply category filter
  if (filters.category && filters.category !== 'all') {
    query = query.eq('category', filters.category)
  }

  // Apply brand filter
  if (filters.brands && filters.brands.length > 0) {
    query = query.in('brand', filters.brands)
  }

  // Apply price range filter
  if (filters.minPrice !== undefined && filters.minPrice !== null) {
    query = query.gte('price', filters.minPrice)
  }
  if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
    query = query.lte('price', filters.maxPrice)
  }

  // Apply search term filter
  if (filters.searchTerm) {
    query = query.or(`name.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%,brand.ilike.%${filters.searchTerm}%`)
  }

  // Apply sorting
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'price-low':
        query = query.order('price', { ascending: true })
        break
      case 'price-high':
        query = query.order('price', { ascending: false })
        break
      case 'rating':
        query = query.order('rating', { ascending: false })
        break
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
      case 'popular':
      default:
        query = query.order('rating', { ascending: false }).order('review_count', { ascending: false })
        break
    }
  } else {
    // Default sorting by rating and review_count
    query = query.order('rating', { ascending: false }).order('review_count', { ascending: false })
  }

  const { data, error } = await query
  return { data, error }
}

export const getServices = async () => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
  return { data, error }
}

export const createBooking = async (bookingData) => {
  const { data, error } = await supabase
    .from('bookings')
    .insert([bookingData])
    .select()
  return { data, error }
}

export const createOrder = async (orderData) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([orderData])
    .select()
  return { data, error }
}

export const getUserOrders = async (userId) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        product_id,
        quantity,
        unit_price,
        total_price,
        products (
          id,
          name,
          image_url
        )
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data, error }
}

// Cart helpers
export const getCartItems = async () => {
  const { data, error } = await supabase
    .from('cart')
    .select(`
      *,
      products (
        id,
        name,
        price,
        image_url,
        brand,
        category,
        weight,
        stock_quantity
      )
    `)
    .order('created_at', { ascending: false })
  return { data, error }
}

export const addToCart = async (productId, quantity = 1) => {
  // First check if item already exists in cart
  const { data: existingItem, error: checkError } = await supabase
    .from('cart')
    .select('*')
    .eq('product_id', productId)
    .single()

  if (checkError && checkError.code !== 'PGRST116') {
    return { data: null, error: checkError }
  }

  if (existingItem) {
    // Update existing item quantity
    const { data, error } = await supabase
      .from('cart')
      .update({ quantity: existingItem.quantity + quantity })
      .eq('id', existingItem.id)
      .select()
    return { data, error }
  } else {
    // Insert new item
    const { data, error } = await supabase
      .from('cart')
      .insert([{ product_id: productId, quantity }])
      .select()
    return { data, error }
  }
}

export const updateCartItem = async (cartItemId, quantity) => {
  if (quantity <= 0) {
    return removeFromCart(cartItemId)
  }
  
  const { data, error } = await supabase
    .from('cart')
    .update({ quantity })
    .eq('id', cartItemId)
    .select()
  return { data, error }
}

export const removeFromCart = async (cartItemId) => {
  const { data, error } = await supabase
    .from('cart')
    .delete()
    .eq('id', cartItemId)
    .select()
  return { data, error }
}

export const clearCart = async () => {
  const { data, error } = await supabase
    .from('cart')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all items
  return { data, error }
}

export const syncLocalCartToSupabase = async (localCartItems) => {
  if (!localCartItems || localCartItems.length === 0) {
    return { data: [], error: null }
  }

  const results = []
  for (const item of localCartItems) {
    const { data, error } = await addToCart(item.id, item.quantity)
    if (error) {
      console.error('Error syncing cart item:', error)
    } else {
      results.push(data)
    }
  }
  
  return { data: results, error: null }
}

// Admin Product Management Functions
export const getAllProductsAdmin = async (filters = {}) => {
  let query = supabase
    .from('products')
    .select('*')

  // Apply category filter
  if (filters.category && filters.category !== 'all') {
    query = query.eq('category', filters.category)
  }

  // Apply active status filter
  if (filters.status !== undefined) {
    query = query.eq('is_active', filters.status)
  }

  // Apply search term filter
  if (filters.searchTerm) {
    query = query.or(`name.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%,brand.ilike.%${filters.searchTerm}%,sku.ilike.%${filters.searchTerm}%`)
  }

  // Apply sorting
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'name':
        query = query.order('name', { ascending: true })
        break
      case 'price-low':
        query = query.order('price', { ascending: true })
        break
      case 'price-high':
        query = query.order('price', { ascending: false })
        break
      case 'stock-low':
        query = query.order('stock_quantity', { ascending: true })
        break
      case 'stock-high':
        query = query.order('stock_quantity', { ascending: false })
        break
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
      case 'oldest':
        query = query.order('created_at', { ascending: true })
        break
      default:
        query = query.order('created_at', { ascending: false })
        break
    }
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const { data, error } = await query
  return { data, error }
}

export const getProductByIdAdmin = async (productId) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single()
  return { data, error }
}

export const createProduct = async (productData) => {
  const { data, error } = await supabase
    .from('products')
    .insert([{
      ...productData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select()
    .single()
  return { data, error }
}

export const updateProduct = async (productId, productData) => {
  const { data, error } = await supabase
    .from('products')
    .update({
      ...productData,
      updated_at: new Date().toISOString()
    })
    .eq('id', productId)
    .select()
    .single()
  return { data, error }
}

export const deleteProduct = async (productId) => {
  const { data, error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)
    .select()
  return { data, error }
}

export const toggleProductStatus = async (productId, isActive) => {
  const { data, error } = await supabase
    .from('products')
    .update({ 
      is_active: isActive,
      updated_at: new Date().toISOString()
    })
    .eq('id', productId)
    .select()
    .single()
  return { data, error }
}

export const updateProductStock = async (productId, stockQuantity) => {
  const { data, error } = await supabase
    .from('products')
    .update({ 
      stock_quantity: stockQuantity,
      updated_at: new Date().toISOString()
    })
    .eq('id', productId)
    .select()
    .single()
  return { data, error }
}

export const getProductCategories = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('category')
    .not('category', 'is', null)
  
  if (error) return { data: [], error }
  
  // Get unique categories
  const categories = [...new Set(data.map(item => item.category))]
  return { data: categories, error: null }
}

export const getProductBrands = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('brand')
    .not('brand', 'is', null)
  
  if (error) return { data: [], error }
  
  // Get unique brands
  const brands = [...new Set(data.map(item => item.brand))]
  return { data: brands, error: null }
}

export const bulkUpdateProducts = async (productIds, updateData) => {
  const { data, error } = await supabase
    .from('products')
    .update({
      ...updateData,
      updated_at: new Date().toISOString()
    })
    .in('id', productIds)
    .select()
  return { data, error }
}

export const getProductStats = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('id, is_active, stock_quantity, category')
  
  if (error) return { data: null, error }
  
  const stats = {
    total: data.length,
    active: data.filter(p => p.is_active).length,
    inactive: data.filter(p => !p.is_active).length,
    lowStock: data.filter(p => p.stock_quantity <= 5).length,
    outOfStock: data.filter(p => p.stock_quantity === 0).length,
    byCategory: {}
  }
  
  // Count by category
  data.forEach(product => {
    if (product.category) {
      stats.byCategory[product.category] = (stats.byCategory[product.category] || 0) + 1
    }
  })
  
  return { data: stats, error: null }
}