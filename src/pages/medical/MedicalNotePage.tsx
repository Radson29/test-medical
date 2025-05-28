import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAppointmentStore } from '../../store/appointmentStore';
import { useAuthStore } from '../../store/authStore';
import { usePatientStore } from '../../store/patientStore';

const MedicalNotePage: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getAppointmentById } = useAppointmentStore();
  const { getPatientById } = usePatientStore();
  
  const [content, setContent] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [recommendations, setRecommendations] = useState('');
  
  if (!user || !appointmentId) return null;
  
  const appointment = getAppointmentById(appointmentId);
  if (!appointment) {
    navigate('/appointments');
    return null;
  }
  
  const patient = getPatientById(appointment.patientId);

  const handleSubmit = () => {
    // In a real app, this would save to the backend
    console.log('Saving medical note:', {
      appointmentId,
      content,
      diagnosis,
      recommendations
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
          Notatka medyczna
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dane wizyty</CardTitle>
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
              <p className="text-sm text-neutral-500">Data wizyty</p>
              <p className="font-medium">{appointment.date}</p>
              <p className="text-sm text-neutral-500">
                {appointment.startTime} - {appointment.endTime}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notatka</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Przebieg wizyty
            </label>
            <textarea
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Opisz przebieg wizyty..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Diagnoza
            </label>
            <textarea
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm"
              rows={3}
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="Wpisz diagnozę..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Zalecenia
            </label>
            <textarea
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm"
              rows={3}
              value={recommendations}
              onChange={(e) => setRecommendations(e.target.value)}
              placeholder="Wpisz zalecenia dla pacjenta..."
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSubmit}
              disabled={!content || !diagnosis}
            >
              Zapisz notatkę
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalNotePage;