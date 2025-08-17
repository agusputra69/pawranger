/* eslint-disable react-refresh/only-export-components */
import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Default loading component
const DefaultLoader = ({ message = 'Memuat...', size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary-600 mb-2`} />
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  );
};

// Full page loader
export const FullPageLoader = ({ message = 'Memuat aplikasi...' }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-16 h-16 animate-spin text-primary-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Pawranger</h2>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

// Card loader for content areas
export const CardLoader = ({ message = 'Memuat...', className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      <div className="animate-pulse">
        <div className="flex items-center justify-center mb-4">
          <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
      <p className="text-center text-sm text-gray-500 mt-4">{message}</p>
    </div>
  );
};

// Skeleton loader for lists
export const ListSkeleton = ({ items = 3, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Product grid skeleton
export const ProductGridSkeleton = ({ items = 6, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="w-full h-48 bg-gray-200"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Loading boundary component
const LoadingBoundary = ({ 
  children, 
  fallback, 
  message,
  type = 'default'
}) => {
  let LoadingComponent;

  if (fallback) {
    LoadingComponent = fallback;
  } else {
    switch (type) {
      case 'fullpage':
        LoadingComponent = <FullPageLoader message={message} />;
        break;
      case 'card':
        LoadingComponent = <CardLoader message={message} />;
        break;
      case 'list':
        LoadingComponent = <ListSkeleton />;
        break;
      case 'grid':
        LoadingComponent = <ProductGridSkeleton />;
        break;
      default:
        LoadingComponent = <DefaultLoader message={message} />;
    }
  }

  return (
    <Suspense fallback={LoadingComponent}>
      {children}
    </Suspense>
  );
};

// Higher-order component for adding loading boundary
export const withLoadingBoundary = (Component, options = {}) => {
  return function WrappedComponent(props) {
    return (
      <LoadingBoundary {...options}>
        <Component {...props} />
      </LoadingBoundary>
    );
  };
};

// Hook for managing loading states
export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = React.useState(initialState);
  const [error, setError] = React.useState(null);

  const startLoading = React.useCallback(() => {
    setIsLoading(true);
    setError(null);
  }, []);

  const stopLoading = React.useCallback(() => {
    setIsLoading(false);
  }, []);

  const setLoadingError = React.useCallback((error) => {
    setIsLoading(false);
    setError(error);
  }, []);

  const executeAsync = React.useCallback(async (asyncFunction) => {
    try {
      startLoading();
      const result = await asyncFunction();
      stopLoading();
      return result;
    } catch (error) {
      setLoadingError(error);
      throw error;
    }
  }, [startLoading, stopLoading, setLoadingError]);

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    setError: setLoadingError,
    executeAsync
  };
};

export default LoadingBoundary;