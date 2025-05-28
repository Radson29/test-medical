import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import { useAppointmentStore } from '../../store/appointmentStore';
import { useAuthStore } from '../../store/authStore';
import { usePatientStore } from '../../store/patientStore';

const specializations = [
  'Kardiologia',
  'Neurologia',
  'Ortopedia',
  'Dermatologia',
  'Okulistyka',
  'Laryngologia',
  'Endokrynologia',
  'Urologia',
  'Ginekologia',
  'Psychiatria',
].map(spec => ({ value: spec.toLowerCase(), label: spec }));

const ReferralPage: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getAppointmentById } = useAppointmentStore();
  const { getPatientById } = usePatientStore();
  
  const [specialization, setSpecialization] = useState('');
  const [urgency, setUrgency] = useState<'normal' | 'urgent'>('normal');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  
  if (!user || !appointmentId) return null;
  
  const appointment = getAppointmentById(appointmentId);
  if (!appointment) {
    navigate('/appointments');
    return null;
  }
  
  const patient = getPatientById(appointment.patientId);

  const handleSubmit = () => {
    // In a real app, this would save to the backend
    console.log('Saving referral:', {
      appointmentId,
      specialization,
      urgency,
      reason,
      notes
    });
    navigate(`/appointments/${appointmentId}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/appointments/${appointmentId}`)}
        >
          Powrót
        </Button>
        <h1 className="text-2xl font-bold tracking-tight flex items-center">
          <FileText className="h-6 w-6 mr-2" />
          Skierowanie
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dane pacjenta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-neutral-500">Pacjent</p>
              <p className="font-medium">
                {patient?.firstName} {patient?.lastName}
              </p>
              {patient?.pesel && (
                <p className="text-sm text-neutral-500">PESEL: {patient.pesel}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-neutral-500">Data wystawienia</p>
              <p className="font-medium">{appointment.date}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Szczegóły skierowania</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            label="Specjalizacja"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            options={specializations}
            required
          />

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Tryb skierowania
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="normal"
                  checked={urgency === 'normal'}
                  onChange={(e) => setUrgency(e.target.value as 'normal')}
                  className="mr-2"
                />
                Planowy
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="urgent"
                  checked={urgency === 'urgent'}
                  onChange={(e) => setUrgency(e.target.value as 'urgent')}
                  className="mr-2"
                />
                Pilny
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Cel skierowania
            </label>
            <textarea
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Opisz cel skierowania..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Dodatkowe informacje
            </label>
            <textarea
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Dodatkowe informacje dla specjalisty..."
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSubmit}
              disabled={!specialization || !reason}
            >
              Wystaw skierowanie
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralPage;