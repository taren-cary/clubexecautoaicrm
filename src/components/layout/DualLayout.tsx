import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Navigation } from './Navigation';

export function DualLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine current interface (B2B or B2C)
  const isB2B = location.pathname.startsWith('/b2b');
  const isB2C = location.pathname.startsWith('/b2c');

  // If no specific route, default to B2C
  React.useEffect(() => {
    if (!isB2B && !isB2C) {
      navigate('/b2c/calls');
    }
  }, [isB2B, isB2C, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
} 