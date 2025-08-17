import { lazy } from 'react';

// Lazy load non-critical components for better performance
export const LazyEcommercePage = lazy(() => import('./EcommercePage'));
export const LazyCheckoutPage = lazy(() => import('./CheckoutPage'));
export const LazyUserDashboard = lazy(() => import('./UserDashboard'));
export const LazyBookingSystem = lazy(() => import('./BookingSystem'));
export const LazyGallery = lazy(() => import('./Gallery'));
export const LazyAbout = lazy(() => import('./About'));