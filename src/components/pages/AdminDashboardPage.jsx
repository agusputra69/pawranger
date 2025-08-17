import React, { Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../LoadingScreen';
import { LazyAdminDashboard } from '../LazyComponents';

function AdminDashboardPageRoute() {
  const navigate = useNavigate();

  const handleNavigateHome = () => {
    navigate('/');
  };

  const handleLogout = () => {
    navigate('/admin');
  };

  return (
    <Suspense fallback={<LoadingScreen message="Loading Admin Dashboard..." />}>
      <LazyAdminDashboard
        onNavigateHome={handleNavigateHome}
        onLogout={handleLogout}
      />
    </Suspense>
  );
}

export default AdminDashboardPageRoute;