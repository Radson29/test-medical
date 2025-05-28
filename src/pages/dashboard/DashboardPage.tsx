import React from 'react';
import { useAuthStore } from '../../store/authStore';
import PatientDashboard from './PatientDashboard';
import DoctorDashboard from './DoctorDashboard';
import ReceptionistDashboard from './ReceptionistDashboard';
import AdminDashboard from './AdminDashboard';

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  if (!user) {
    return null;
  }

  switch (user.role) {
    case 'patient':
      return <PatientDashboard />;
    case 'doctor':
      return <DoctorDashboard />;
    case 'receptionist':
      return <ReceptionistDashboard />;
    case 'administrator':
      return <AdminDashboard />;
    default:
      return null;
  }
};

export default DashboardPage;