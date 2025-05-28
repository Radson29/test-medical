import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Filter, PlusCircle, Search } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import AppointmentCard from '../../components/appointment/AppointmentCard';
import { useAppointmentStore } from '../../store/appointmentStore';
import { useAuthStore } from '../../store/authStore';
import { useDoctorStore } from '../../store/doctorStore';

const AppointmentsListPage: React.FC = () => {
  const { user } = useAuthStore();
  const { appointments, getAppointmentsByPatient, getAppointmentsByDoctor, cancelAppointment } = useAppointmentStore();
  const { getAllDoctors } = useDoctorStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  if (!user) return null;

  let userAppointments = [];
  
  if (user.role === 'patient') {
    userAppointments = getAppointmentsByPatient(user.id);
  } else if (user.role === 'doctor') {
    userAppointments = getAppointmentsByDoctor(user.id);
  } else if (user.role === 'receptionist') {
    userAppointments = appointments;
  }

  // Filter appointments
  const filteredAppointments = userAppointments.filter(app => {
    let matchesSearch = true;
    let matchesStatus = true;

    // Apply search filter if provided
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const doctor = useDoctorStore().getDoctorById(app.doctorId);
      matchesSearch = 
        app.type.toLowerCase().includes(searchLower) ||
        app.date.includes(searchLower) ||
        app.startTime.includes(searchLower) ||
        (doctor && `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchLower));
    }

    // Apply status filter if provided
    if (statusFilter) {
      matchesStatus = app.status === statusFilter;
    }

    return matchesSearch && matchesStatus;
  });

  // Sort by date and time
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.startTime}`);
    const dateB = new Date(`${b.date}T${b.startTime}`);
    return dateA.getTime() - dateB.getTime();
  });

  const handleCancelAppointment = (id: string) => {
    if (window.confirm('Czy na pewno chcesz anulować tę wizytę?')) {
      cancelAppointment(id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight flex items-center">
          <Calendar className="h-6 w-6 mr-2" />
          Wizyty
        </h1>
        <div className="mt-3 sm:mt-0">
          {(user.role === 'patient' || user.role === 'receptionist') && (
            <Link to="/appointments/new">
              <Button icon={<PlusCircle className="h-4 w-4" />}>
                Nowa wizyta
              </Button>
            </Link>
          )}
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="w-full md:w-1/2">
            <Input
              placeholder="Szukaj wizyt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-4 w-4 text-neutral-400" />}
            />
          </div>
          <Button 
            variant="outline"
            icon={<Filter className="h-4 w-4" />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filtry
          </Button>
        </div>
        
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: '', label: 'Wszystkie' },
                { value: 'scheduled', label: 'Zaplanowane' },
                { value: 'confirmed', label: 'Potwierdzone' },
                { value: 'completed', label: 'Zakończone' },
                { value: 'canceled', label: 'Anulowane' },
              ]}
            />
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedAppointments.length === 0 ? (
          <div className="col-span-3 text-center py-16">
            <Calendar className="h-12 w-12 mx-auto text-neutral-400" />
            <h3 className="mt-4 text-lg font-medium">Nie znaleziono żadnych wizyt</h3>
            {(searchTerm || statusFilter) ? (
              <p className="text-neutral-500 mt-1">Spróbuj zmienić kryteria wyszukiwania</p>
            ) : (
              <p className="text-neutral-500 mt-1">Nie masz jeszcze żadnych wizyt</p>
            )}
            {user.role === 'patient' && (
              <div className="mt-6">
                <Link to="/appointments/new">
                  <Button>Umów nową wizytę</Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          sortedAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onCancel={
                (user.role === 'patient' || user.role === 'receptionist') ? 
                handleCancelAppointment : undefined
              }
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AppointmentsListPage;