import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, FileText, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import AppointmentCard from '../../components/appointment/AppointmentCard';
import { useAppointmentStore } from '../../store/appointmentStore';
import { useAuthStore } from '../../store/authStore';

const PatientDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { getAppointmentsByPatient, cancelAppointment } = useAppointmentStore();
  
  if (!user) return null;
  
  const appointments = getAppointmentsByPatient(user.id);
  const upcomingAppointments = appointments.filter(
    app => new Date(`${app.date}T${app.startTime}`) > new Date() && app.status !== 'canceled'
  ).sort((a, b) => 
    new Date(`${a.date}T${a.startTime}`).getTime() - new Date(`${b.date}T${b.startTime}`).getTime()
  );

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
          <Link to="/appointments/new">
            <Button icon={<PlusCircle className="h-4 w-4" />}>
              Umów nową wizytę
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary-600" />
              Nadchodzące wizyty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{upcomingAppointments.length}</div>
            <div className="text-sm text-neutral-500 mt-1">Zaplanowanych wizyt</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-secondary-600" />
              Dokumenty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <div className="text-sm text-neutral-500 mt-1">Dostępnych dokumentów</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Nadchodzące wizyty</h2>
        
        {upcomingAppointments.length === 0 ? (
          <div className="text-center py-8">
            <div className="mb-3">
              <Calendar className="h-12 w-12 mx-auto text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900">Brak nadchodzących wizyt</h3>
            <p className="mt-1 text-neutral-500">Umów swoją pierwszą wizytę już teraz</p>
            <div className="mt-4">
              <Link to="/appointments/new">
                <Button>Umów wizytę</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingAppointments.slice(0, 3).map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onCancel={handleCancelAppointment}
              />
            ))}
          </div>
        )}
        
        {upcomingAppointments.length > 0 && (
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

export default PatientDashboard;