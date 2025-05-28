import { create } from 'zustand';
import { UserRole } from '../types';

interface AuthState {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
  } | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// For demo purposes, we'll use hardcoded users
const mockUsers = [
  { id: 'p1', email: 'pacjent@example.com', firstName: 'Jan', lastName: 'Kowalski', password: 'pacjent123', role: 'patient' as UserRole },
  { id: 'd1', email: 'lekarz@example.com', firstName: 'Anna', lastName: 'Nowak', password: 'lekarz123', role: 'doctor' as UserRole },
  { id: 'r1', email: 'recepcja@example.com', firstName: 'Marta', lastName: 'Wiśniewska', password: 'recepcja123', role: 'receptionist' as UserRole },
  { id: 'a1', email: 'admin@example.com', firstName: 'Piotr', lastName: 'Zieliński', password: 'admin123', role: 'administrator' as UserRole },
];

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email, password) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error("Nieprawidłowy email lub hasło");
    }

    const { password: _, ...userWithoutPassword } = user;
    
    set({
      user: userWithoutPassword,
      isAuthenticated: true
    });
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  }
}));