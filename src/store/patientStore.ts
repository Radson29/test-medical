import { create } from 'zustand';
import { Patient } from '../types';

// Mock data
const mockPatients: Patient[] = [
  {
    id: 'p1',
    email: 'pacjent@example.com',
    firstName: 'Jan',
    lastName: 'Kowalski',
    role: 'patient',
    phoneNumber: '123456789',
    pesel: '90010112345',
    dateOfBirth: '1990-01-01',
    address: {
      street: 'ul. Przykładowa 1',
      city: 'Warszawa',
      postalCode: '00-001',
    },
    isActive: true,
  },
  {
    id: 'p2',
    email: 'anna.nowak@example.com',
    firstName: 'Anna',
    lastName: 'Nowak',
    role: 'patient',
    phoneNumber: '987654321',
    pesel: '85020223456',
    dateOfBirth: '1985-02-02',
    address: {
      street: 'ul. Testowa 2',
      city: 'Kraków',
      postalCode: '30-001',
    },
    isActive: true,
  }
];

interface PatientState {
  patients: Patient[];
  getPatientById: (id: string) => Patient | undefined;
  updatePatient: (id: string, data: Partial<Patient>) => Patient | undefined;
}

export const usePatientStore = create<PatientState>((set, get) => ({
  patients: mockPatients,
  
  getPatientById: (id: string) => {
    return get().patients.find(patient => patient.id === id);
  },
  
  updatePatient: (id: string, data: Partial<Patient>) => {
    let updatedPatient: Patient | undefined;
    
    set(state => {
      const updatedPatients = state.patients.map(patient => {
        if (patient.id === id) {
          updatedPatient = { ...patient, ...data };
          return updatedPatient;
        }
        return patient;
      });
      
      return { patients: updatedPatients };
    });
    
    return updatedPatient;
  },
}));