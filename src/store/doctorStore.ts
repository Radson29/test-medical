import { create } from 'zustand';
import { Doctor } from '../types';

// Mock data
const mockDoctors: Doctor[] = [
  {
    id: 'd1',
    email: 'lekarz@example.com',
    firstName: 'Anna',
    lastName: 'Nowak',
    role: 'doctor',
    specialization: 'Kardiologia',
    licenseNumber: 'KAR/123456',
    phoneNumber: '123456789',
    about: 'Specjalista w dziedzinie kardiologii z 10-letnim doświadczeniem.',
    isActive: true,
  },
  {
    id: 'd2',
    email: 'jan.kowalczyk@example.com',
    firstName: 'Jan',
    lastName: 'Kowalczyk',
    role: 'doctor',
    specialization: 'Pediatria',
    licenseNumber: 'PED/654321',
    phoneNumber: '987654321',
    about: 'Doświadczony pediatra, specjalizujący się w chorobach wieku dziecięcego.',
    isActive: true,
  },
  {
    id: 'd3',
    email: 'maria.wisniewska@example.com',
    firstName: 'Maria',
    lastName: 'Wiśniewska',
    role: 'doctor',
    specialization: 'Dermatologia',
    licenseNumber: 'DER/789123',
    phoneNumber: '567891234',
    about: 'Specjalista dermatolog z certyfikatami w zakresie dermatologii estetycznej.',
    isActive: true,
  },
];

interface DoctorState {
  doctors: Doctor[];
  getDoctorById: (id: string) => Doctor | undefined;
  getAllDoctors: () => Doctor[];
  getDoctorsBySpecialization: (specialization: string) => Doctor[];
}

export const useDoctorStore = create<DoctorState>((set, get) => ({
  doctors: mockDoctors,
  
  getDoctorById: (id: string) => {
    return get().doctors.find(doctor => doctor.id === id);
  },
  
  getAllDoctors: () => {
    return get().doctors.filter(doctor => doctor.isActive);
  },
  
  getDoctorsBySpecialization: (specialization: string) => {
    return get().doctors.filter(
      doctor => doctor.isActive && doctor.specialization === specialization
    );
  },
}));