export type UserRole = 'patient' | 'doctor' | 'receptionist' | 'administrator';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phoneNumber?: string;
  isActive: boolean;
}

export interface Patient extends User {
  role: 'patient';
  pesel?: string;
  dateOfBirth?: string;
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
  };
}

export interface Doctor extends User {
  role: 'doctor';
  specialization: string;
  licenseNumber: string;
  about?: string;
}

export interface Receptionist extends User {
  role: 'receptionist';
}

export interface Administrator extends User {
  role: 'administrator';
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string; // ISO date string
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  status: 'scheduled' | 'confirmed' | 'canceled' | 'completed';
  type: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalNote {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  content: string;
  date: string;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  date: string;
  notes?: string;
}

export interface Referral {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  specialization: string;
  urgency: 'normal' | 'urgent';
  reason: string;
  date: string;
  notes?: string;
}

export interface DoctorSchedule {
  doctorId: string;
  workingHours: Array<{
    dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 6 = Saturday
    startTime: string; // HH:MM
    endTime: string; // HH:MM
  }>;
  timeSlotDuration: number; // in minutes
  breaks: Array<{
    dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    startTime: string;
    endTime: string;
  }>;
}