import { create } from 'zustand';
import { Appointment } from '../types';

// Mock data for demonstration purposes
const initialAppointments: Appointment[] = [
  {
    id: 'app1',
    patientId: 'p1',
    doctorId: 'd1',
    date: '2025-01-15',
    startTime: '09:00',
    endTime: '09:30',
    status: 'scheduled',
    type: 'Konsultacja',
    notes: '',
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-01-01T10:00:00Z',
  },
  {
    id: 'app2',
    patientId: 'p1',
    doctorId: 'd1',
    date: '2025-01-20',
    startTime: '14:30',
    endTime: '15:00',
    status: 'confirmed',
    type: 'Badanie kontrolne',
    notes: '',
    createdAt: '2025-01-05T12:00:00Z',
    updatedAt: '2025-01-05T14:30:00Z',
  },
];

interface AppointmentState {
  appointments: Appointment[];
  getAppointmentsByPatient: (patientId: string) => Appointment[];
  getAppointmentsByDoctor: (doctorId: string) => Appointment[];
  getAppointmentById: (id: string) => Appointment | undefined;
  createAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => Appointment;
  updateAppointment: (id: string, data: Partial<Appointment>) => Appointment | undefined;
  cancelAppointment: (id: string) => Appointment | undefined;
}

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  appointments: initialAppointments,
  
  getAppointmentsByPatient: (patientId: string) => {
    return get().appointments.filter(app => app.patientId === patientId);
  },
  
  getAppointmentsByDoctor: (doctorId: string) => {
    return get().appointments.filter(app => app.doctorId === doctorId);
  },
  
  getAppointmentById: (id: string) => {
    return get().appointments.find(app => app.id === id);
  },
  
  createAppointment: (appointmentData) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: `app${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    set(state => ({
      appointments: [...state.appointments, newAppointment]
    }));
    
    return newAppointment;
  },
  
  updateAppointment: (id, data) => {
    let updatedAppointment: Appointment | undefined;
    
    set(state => {
      const updatedAppointments = state.appointments.map(app => {
        if (app.id === id) {
          updatedAppointment = {
            ...app,
            ...data,
            updatedAt: new Date().toISOString()
          };
          return updatedAppointment;
        }
        return app;
      });
      
      return { appointments: updatedAppointments };
    });
    
    return updatedAppointment;
  },
  
  cancelAppointment: (id) => {
    return get().updateAppointment(id, { status: 'canceled' });
  }
}));