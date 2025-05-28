import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, Clock, User } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Appointment } from '../../types';
import { formatDate } from '../../lib/utils';
import { useDoctorStore } from '../../store/doctorStore';
import { usePatientStore } from '../../store/patientStore';
import { useAuthStore } from '../../store/authStore';

interface AppointmentCardProps {
  appointment: Appointment;
  onCancel?: (id: string) => void;
}

const statusVariants = {
  scheduled: { label: 'Zaplanowana', variant: 'primary' as const },
  confirmed: { label: 'Potwierdzona', variant: 'success' as const },
  canceled: { label: 'Anulowana', variant: 'error' as const },
  completed: { label: 'Zakończona', variant: 'default' as const },
};

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, onCancel }) => {
  const { user } = useAuthStore();
  const { getDoctorById } = useDoctorStore();
  const { getPatientById } = usePatientStore();

  const doctor = getDoctorById(appointment.doctorId);
  const patient = getPatientById(appointment.patientId);

  const status = statusVariants[appointment.status];

  const isUpcoming = new Date(`${appointment.date}T${appointment.startTime}`) > new Date();
  const canCancel = 
    isUpcoming && 
    (appointment.status === 'scheduled' || appointment.status === 'confirmed') &&
    onCancel;

  return (
    <Card className="h-full transition-all duration-200 hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{appointment.type}</CardTitle>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <CalendarClock className="h-4 w-4 mr-2 text-neutral-500" />
            <span>{formatDate(appointment.date, 'EEEE, d MMMM yyyy')}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-neutral-500" />
            <span>
              {appointment.startTime} - {appointment.endTime}
            </span>
          </div>
          {user?.role !== 'patient' && patient && (
            <div className="flex items-center text-sm">
              <User className="h-4 w-4 mr-2 text-neutral-500" />
              <span>
                Pacjent: {patient.firstName} {patient.lastName}
              </span>
            </div>
          )}
          {user?.role !== 'doctor' && doctor && (
            <div className="flex items-center text-sm">
              <User className="h-4 w-4 mr-2 text-neutral-500" />
              <span>
                Lekarz: {doctor.firstName} {doctor.lastName} ({doctor.specialization})
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Link to={`/appointments/${appointment.id}`}>
          <Button variant="outline" size="sm">
            Szczegóły
          </Button>
        </Link>
        {canCancel && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => onCancel?.(appointment.id)}
          >
            Anuluj
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default AppointmentCard;