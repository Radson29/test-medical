import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ClipboardCheck, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import AppointmentCard from '../../components/appointment/AppointmentCard';
import { useAppointmentStore } from '../../store/appointmentStore';
import { useAuthStore } from '../../store/authStore';
import { formatDate } from '../../lib/utils';

const DoctorDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { getAppointmentsByDoctor } = useAppointmentStore();
  const [currentDate] = React.useState(new Date());
  
  if (!user) return null;
  
  const appointments = getAppointmentsByDoctor(user.id);
  const todaysAppointments = appointments.filter(
    app => app.date === formatDate(currentDate, 'yyyy-MM-dd') && 
    app.status !== 'canceled'
  ).sort((a, b) => 
    a.startTime.localeCompare(b.startTime)
  );

  const upcomingAppointmentsCount = appointments.filter(
    app => new Date(`${app.date}T${app.startTime}`) > currentDate && 
    app.status !== 'canceled'
  ).length;

  const totalPatientsCount = [...new Set(appointments.map(app => app.patientId))].length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Witaj, dr {user.lastName}
        </h1>
        <div className="mt-3 sm:mt-0">
          <div className="flex space-x-2">
            <Link to="/schedule">
              <Button variant="outline" icon={<Clock className="h-4 w-4" />}>
                Zarządzaj harmonogramem
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
              Dzisiaj
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{todaysAppointments.length}</div>
            <div className="text-sm text-neutral-500 mt-1">
              Zaplanowanych wizyt na dziś
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ClipboardCheck className="h-5 w-5 mr-2 text-secondary-600" />
              Nadchodzące
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{upcomingAppointmentsCount}</div>
            <div className="text-sm text-neutral-500 mt-1">
              Zaplanowanych wizyt w przyszłości
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-success-600" />
              Pacjenci
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalPatientsCount}</div>
            <div className="text-sm text-neutral-500 mt-1">Łączna liczba pacjentów</div>
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
            <p className="mt-1 text-neutral-500">Możesz odpocząć lub zaktualizować swój harmonogram</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todaysAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
              />
            ))}
          </div>
        )}
        
        {todaysAppointments.length > 0 && (
          <div className="flex justify-center mt-4">
            <Link to="/appointments">
              <Button variant="outline">Zobacz wszystkie wizyty</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;