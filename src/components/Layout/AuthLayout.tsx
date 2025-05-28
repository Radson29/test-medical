import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const AuthLayout: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="flex min-h-screen bg-neutral-50 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-md bg-primary-500 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 6V18" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <path d="M6 12H18" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-neutral-900">
            MedReserve
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-600">
            System rezerwacji wizyt medycznych
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;