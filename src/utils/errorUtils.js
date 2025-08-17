import React from 'react';

// Higher-order component for wrapping components with error boundary
export const withErrorBoundary = (Component, fallback) => {
  return function WrappedComponent(props) {
    const ErrorBoundary = React.lazy(() => import('../components/ErrorBoundary'));
    return (
      <React.Suspense fallback={fallback}>
        <ErrorBoundary fallback={fallback}>
          <Component {...props} />
        </ErrorBoundary>
      </React.Suspense>
    );
  };
};

// Hook for error handling in functional components
export const useErrorHandler = () => {
  const [error, setError] = React.useState(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const handleError = React.useCallback((errorParam) => {
    console.error('Error caught by useErrorHandler:', errorParam);
    setError(errorParam);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { handleError, resetError };
};