import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import AuthLayout from './components/Layout/AuthLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import AppointmentsListPage from './pages/appointments/AppointmentsListPage';
import AppointmentDetailsPage from './pages/appointments/AppointmentDetailsPage';
import NewAppointmentPage from './pages/appointments/NewAppointmentPage';
import AppointmentRatingPage from './pages/appointments/AppointmentRatingPage';
import ManualAppointmentPage from './pages/appointments/ManualAppointmentPage';
import DoctorSchedulePage from './pages/schedule/DoctorSchedulePage';
import PatientsListPage from './pages/patients/PatientsListPage';
import MedicalNotePage from './pages/medical/MedicalNotePage';
import PrescriptionPage from './pages/medical/PrescriptionPage';
import ReferralPage from './pages/medical/ReferralPage';
import UsersPage from './pages/admin/UsersPage';
import NewUserPage from './pages/admin/NewUserPage';
import ReportsPage from './pages/admin/ReportsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Protected routes */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          
          {/* Appointment routes */}
          <Route path="/appointments" element={<AppointmentsListPage />} />
          <Route path="/appointments/new" element={<NewAppointmentPage />} />
          <Route path="/appointments/manual" element={<ManualAppointmentPage />} />
          <Route path="/appointments/:id" element={<AppointmentDetailsPage />} />
          <Route path="/appointments/:id/rate" element={<AppointmentRatingPage />} />
          
          {/* Schedule routes */}
          <Route path="/schedule" element={<DoctorSchedulePage />} />
          
          {/* Patient routes */}
          <Route path="/patients" element={<PatientsListPage />} />
          
          {/* Medical documentation routes */}
          <Route path="/medical-note/:appointmentId" element={<MedicalNotePage />} />
          <Route path="/prescription/:appointmentId" element={<PrescriptionPage />} />
          <Route path="/referral/:appointmentId" element={<ReferralPage />} />
          
          {/* Admin routes */}
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/new" element={<NewUserPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          
          {/* Redirects */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;