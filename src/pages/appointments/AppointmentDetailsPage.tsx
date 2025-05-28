import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  ArrowLeft, 
  Check, 
  X, 
  Edit, 
  Trash, 
  FileEdit, 
  ClipboardList, 
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useAppointmentStore } from '../../store/appointmentStore';
import { useDoctorStore } from '../../store/doctorStore';
import { usePatientStore } from '../../store/patientStore';
import { useAuthStore } from '../../store/authStore';
import { formatDate } from '../../lib/utils';

const statusVariants = {
  scheduled: { label: 'Zaplanowana', variant: 'primary' as const },
  confirmed: { label: 'Potwierdzona', variant: 'success' as const },
  canceled: { label: 'Anulowana', variant: 'error' as const },
  completed: { label: 'Zakończona', variant: 'default' as const },
};

const AppointmentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getAppointmentById, updateAppointment, cancelAppointment } = useAppointmentStore();
  const { getDoctorById } = useDoctorStore();
  const { getPatientById } = usePatientStore();
  
  if (!user || !id) return null;

  const appointment = getAppointmentById(id);
  if (!appointment) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold">Nie znaleziono wizyty</h2>
        <p className="mt-2 text-neutral-500">
          Wizyta o podanym identyfikatorze nie istnieje.
        </p>
        <div className="mt-6">
          <Button variant="outline" onClick={() => navigate('/appointments')}>
            Wróć do listy wizyt
          </Button>
        </div>
      </div>
    );
  }

  const doctor = getDoctorById(appointment.doctorId);
  const patient = getPatientById(appointment.patientId);
  const status = statusVariants[appointment.status];
  
  const isUpcoming = new Date(`${appointment.date}T${appointment.startTime}`) > new Date();
  const canCancel = isUpcoming && 
    (appointment.status === 'scheduled' || appointment.status === 'confirmed');
  
  const canConfirm = isUpcoming && 
    appointment.status === 'scheduled' && 
    (user.role === 'doctor' || user.role === 'receptionist');
  
  const canComplete = 
    (appointment.status === 'confirmed' || appointment.status === 'scheduled') && 
    user.role === 'doctor';

  const handleCancel = () => {
    if (window.confirm('Czy na pewno chcesz anulować tę wizytę?')) {
      cancelAppointment(id);
    }
  };

  const handleConfirm = () => {
    updateAppointment(id, { status: 'confirmed' });
  };

  const handleComplete = () => {
    updateAppointment(id, { status: 'completed' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/appointments')}
          icon={<ArrowLeft className="h-4 w-4" />}
        >
          Powrót
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Szczegóły wizyty</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">
                  {appointment.type}
                </CardTitle>
                <Badge variant={status.variant}>{status.label}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-neutral-500">Termin</p>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-2 text-neutral-600" />
                    <p className="font-medium">
                      {formatDate(appointment.date, 'EEEE, d MMMM yyyy')}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Godzina</p>
                  <div className="flex items-center mt-1">
                    <Clock className="h-4 w-4 mr-2 text-neutral-600" />
                    <p className="font-medium">
                      {appointment.startTime} - {appointment.endTime}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {doctor && (
                    <div>
                      <p className="text-sm text-neutral-500">Lekarz</p>
                      <div className="flex items-center mt-1">
                        <User className="h-4 w-4 mr-2 text-neutral-600" />
                        <div>
                          <p className="font-medium">
                            {doctor.firstName} {doctor.lastName}
                          </p>
                          <p className="text-sm text-neutral-500">
                            {doctor.specialization}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {patient && (
                    <div>
                      <p className="text-sm text-neutral-500">Pacjent</p>
                      <div className="flex items-center mt-1">
                        <User className="h-4 w-4 mr-2 text-neutral-600" />
                        <div>
                          <p className="font-medium">
                            {patient.firstName} {patient.lastName}
                          </p>
                          {patient.pesel && (
                            <p className="text-sm text-neutral-500">
                              PESEL: {patient.pesel}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {appointment.notes && (
                <div className="border-t border-neutral-200 pt-4 mt-4">
                  <p className="text-sm text-neutral-500 mb-1">Notatki</p>
                  <p>{appointment.notes}</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t border-neutral-200 pt-4">
              <div className="flex flex-wrap gap-2">
                {canCancel && (
                  <Button
                    variant="danger"
                    icon={<X className="h-4 w-4" />}
                    onClick={handleCancel}
                  >
                    Anuluj wizytę
                  </Button>
                )}
                
                {canConfirm && (
                  <Button
                    variant="primary"
                    icon={<Check className="h-4 w-4" />}
                    onClick={handleConfirm}
                  >
                    Potwierdź wizytę
                  </Button>
                )}
                
                {canComplete && (
                  <Button
                    variant="success"
                    icon={<Check className="h-4 w-4" />}
                    onClick={handleComplete}
                  >
                    Zakończ wizytę
                  </Button>
                )}
                
                {(user.role === 'doctor' || user.role === 'receptionist') && 
                  isUpcoming && appointment.status !== 'canceled' && (
                  <Link to={`/appointments/${id}/edit`}>
                    <Button
                      variant="outline"
                      icon={<Edit className="h-4 w-4" />}
                    >
                      Edytuj
                    </Button>
                  </Link>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          {user.role === 'doctor' && appointment.status === 'completed' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-primary-600" />
                    Dokumentacja
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link to={`/documents/medical-note/new?appointmentId=${appointment.id}`}>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      icon={<FileEdit className="h-4 w-4" />}
                    >
                      Dodaj notatkę medyczną
                    </Button>
                  </Link>
                  
                  <Link to={`/documents/prescription/new?appointmentId=${appointment.id}`}>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      icon={<ClipboardList className="h-4 w-4" />}
                    >
                      Wystaw receptę
                    </Button>
                  </Link>
                  
                  <Link to={`/documents/referral/new?appointmentId=${appointment.id}`}>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      icon={<ExternalLink className="h-4 w-4" />}
                    >
                      Wystaw skierowanie
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </>
          )}
          
          {user.role === 'patient' && appointment.status === 'completed' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-primary-600" />
                    Dokumentacja
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-600">
                    Przeglądaj dokumentację medyczną wystawioną podczas tej wizyty.
                  </p>
                  <Link to={`/documents?appointmentId=${appointment.id}`}>
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      icon={<FileText className="h-4 w-4" />}
                    >
                      Zobacz dokumenty
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Historia zmian</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex">
                  <div className="mr-4 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-primary-500"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Utworzono wizytę</p>
                    <p className="text-xs text-neutral-500">{formatDate(appointment.createdAt, 'dd MMM yyyy, HH:mm')}</p>
                  </div>
                </div>
                {appointment.createdAt !== appointment.updatedAt && (
                  <div className="flex">
                    <div className="mr-4 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-neutral-400"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Zaktualizowano wizytę</p>
                      <p className="text-xs text-neutral-500">{formatDate(appointment.updatedAt, 'dd MMM yyyy, HH:mm')}</p>
                    </div>
                  </div>
                )}
                {appointment.status === 'canceled' && (
                  <div className="flex">
                    <div className="mr-4 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-error-500"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Anulowano wizytę</p>
                      <p className="text-xs text-neutral-500">{formatDate(appointment.updatedAt, 'dd MMM yyyy, HH:mm')}</p>
                    </div>
                  </div>
                )}
                {appointment.status === 'completed' && (
                  <div className="flex">
                    <div className="mr-4 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-success-500"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Zakończono wizytę</p>
                      <p className="text-xs text-neutral-500">{formatDate(appointment.updatedAt, 'dd MMM yyyy, HH:mm')}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailsPage;