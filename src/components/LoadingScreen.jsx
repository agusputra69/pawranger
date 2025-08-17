import React from 'react'

/**
 * LoadingScreen component for consistent loading states
 */
function LoadingScreen({ message = "Loading..." }) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  )
}

export default LoadingScreen