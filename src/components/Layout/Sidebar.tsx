import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Calendar, 
  ClipboardList, 
  Home, 
  Users, 
  FileText, 
  Settings, 
  PlusCircle,
  User,
  LineChart,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { UserRole } from '../../types';

type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  roles: UserRole[];
};

const navItems: NavItem[] = [
  {
    title: 'Strona główna',
    path: '/dashboard',
    icon: <Home size={20} />,
    roles: ['patient', 'doctor', 'receptionist', 'administrator'],
  },
  {
    title: 'Wizyty',
    path: '/appointments',
    icon: <Calendar size={20} />,
    roles: ['patient', 'doctor', 'receptionist'],
  },
  {
    title: 'Harmonogram',
    path: '/schedule',
    icon: <ClipboardList size={20} />,
    roles: ['doctor', 'receptionist'],
  },
  {
    title: 'Pacjenci',
    path: '/patients',
    icon: <Users size={20} />,
    roles: ['doctor', 'receptionist'],
  },
  {
    title: 'Dokumentacja',
    path: '/documents',
    icon: <FileText size={20} />,
    roles: ['patient', 'doctor'],
  },
  {
    title: 'Użytkownicy',
    path: '/users',
    icon: <User size={20} />,
    roles: ['administrator'],
  },
  {
    title: 'Raporty',
    path: '/reports',
    icon: <LineChart size={20} />,
    roles: ['administrator'],
  },
  {
    title: 'Ustawienia',
    path: '/settings',
    icon: <Settings size={20} />,
    roles: ['administrator'],
  },
];

const Sidebar: React.FC = () => {
  const { user } = useAuthStore();

  if (!user) {
    return null;
  }

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user.role)
  );

  return (
    <aside className="w-64 bg-white shadow-md h-screen fixed left-0 top-16 hidden md:block">
      <div className="py-6 px-3">
        <nav className="space-y-1">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-neutral-700 hover:bg-neutral-50 hover:text-primary-600'
                }`
              }
            >
              <span className="mr-3">{item.icon}</span>
              {item.title}
            </NavLink>
          ))}
        </nav>

        {(user.role === 'patient') && (
          <div className="mt-10">
            <NavLink
              to="/appointments/new"
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Nowa wizyta
            </NavLink>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;