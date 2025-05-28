import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Users, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAppointmentStore } from '../../store/appointmentStore';
import { useAuthStore } from '../../store/authStore';
import { useDoctorStore } from '../../store/doctorStore';
import { formatDate } from '../../lib/utils';
import AppointmentCard from '../../components/appointment/AppointmentCard';

const ReceptionistDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { appointments, cancelAppointment } = useAppointmentStore();
  const { getAllDoctors } = useDoctorStore();
  const [currentDate] = React.useState(new Date());
  
  if (!user) return null;
  
  const formattedToday = formatDate(currentDate, 'yyyy-MM-dd');
  const doctors = getAllDoctors();
  
  const todaysAppointments = appointments.filter(
    app => app.date === formattedToday && app.status !== 'canceled'
  ).sort((a, b) => 
    a.startTime.localeCompare(b.startTime)
  );

  const upcomingAppointmentsCount = appointments.filter(
    app => new Date(`${app.date}T${app.startTime}`) > currentDate && 
    app.status !== 'canceled'
  ).length;

  const handleCancelAppointment = (id: string) => {
    if (window.confirm('Czy na pewno chcesz anulować tę wizytę?')) {
      cancelAppointment(id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Witaj, {user.firstName}
        </h1>
        <div className="mt-3 sm:mt-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Link to="/appointments/new">
              <Button icon={<PlusCircle className="h-4 w-4" />}>
                Nowa wizyta
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary-600" />
              Dzisiejsze wizyty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{todaysAppointments.length}</div>
            <div className="text-sm text-neutral-500 mt-1">
              Zaplanowanych na dzisiaj
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-secondary-600" />
              Nadchodzące wizyty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{upcomingAppointmentsCount}</div>
            <div className="text-sm text-neutral-500 mt-1">
              Zaplanowanych w przyszłości
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-success-600" />
              Lekarze
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{doctors.length}</div>
            <div className="text-sm text-neutral-500 mt-1">Dostępnych lekarzy</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Dzisiejsze wizyty</h2>
        
        {todaysAppointments.length === 0 ? (
          <div className="text-center py-8">
            <div className="mb-3">
              <Calendar className="h-12 w-12 mx-auto text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900">Brak wizyt na dzisiaj</h3>
            <p className="mt-1 text-neutral-500">Umów nowe wizyty lub sprawdź harmonogram na inne dni</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todaysAppointments.slice(0, 6).map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onCancel={handleCancelAppointment}
              />
            ))}
          </div>
        )}
        
        {todaysAppointments.length > 6 && (
          <div className="flex justify-center mt-4">
            <Link to="/appointments">
              <Button variant="outline">Zobacz wszystkie wizyty</Button>
            </Link>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Szybkie akcje</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/appointments/new" className="no-underline">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Calendar className="h-8 w-8 text-primary-500 mb-2" />
                <h3 className="font-medium text-center">Umów wizytę</h3>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/patients" className="no-underline">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Users className="h-8 w-8 text-secondary-500 mb-2" />
                <h3 className="font-medium text-center">Zarządzaj pacjentami</h3>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/schedule" className="no-underline">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Clock className="h-8 w-8 text-success-500 mb-2" />
                <h3 className="font-medium text-center">Harmonogramy lekarzy</h3>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/appointments" className="no-underline">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Calendar className="h-8 w-8 text-warning-500 mb-2" />
                <h3 className="font-medium text-center">Wszystkie wizyty</h3>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;