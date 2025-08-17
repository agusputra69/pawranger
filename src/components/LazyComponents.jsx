import { lazy } from 'react';

// Lazy load heavy components for code splitting
export const LazyEcommercePage = lazy(() => import('./EcommercePage'));
export const LazyBookingSystem = lazy(() => import('./BookingSystem'));
export const LazyCheckoutPage = lazy(() => import('./CheckoutPage'));
export const LazyServices = lazy(() => import('./Services'));
export const LazyShop = lazy(() => import('./Shop'));
export const LazyOrderHistory = lazy(() => import('./OrderHistory'));
export const LazyUserDashboard = lazy(() => import('./UserDashboard'));

// Admin components
export const LazyAdminDashboard = lazy(() => import('../admin/components/AdminDashboard'));
export const LazyOrderManagement = lazy(() => import('../admin/components/OrderManagement'));
export const LazyUserManagement = lazy(() => import('../admin/components/UserManagement'));

// Export all lazy components as default for easy importing
export default {
  EcommercePage: LazyEcommercePage,
  BookingSystem: LazyBookingSystem,
  CheckoutPage: LazyCheckoutPage,
  Services: LazyServices,
  Shop: LazyShop,
  OrderHistory: LazyOrderHistory,
  UserDashboard: LazyUserDashboard,
  AdminDashboard: LazyAdminDashboard,
  OrderManagement: LazyOrderManagement,
  UserManagement: LazyUserManagement
};