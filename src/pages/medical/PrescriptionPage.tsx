import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileText, Plus, Trash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAppointmentStore } from '../../store/appointmentStore';
import { useAuthStore } from '../../store/authStore';
import { usePatientStore } from '../../store/patientStore';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

const PrescriptionPage: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getAppointmentById } = useAppointmentStore();
  const { getPatientById } = usePatientStore();
  
  const [medications, setMedications] = useState<Medication[]>([{
    name: '',
    dosage: '',
    frequency: '',
    duration: ''
  }]);
  const [notes, setNotes] = useState('');
  
  if (!user || !appointmentId) return null;
  
  const appointment = getAppointmentById(appointmentId);
  if (!appointment) {
    navigate('/appointments');
    return null;
  }
  
  const patient = getPatientById(appointment.patientId);

  const handleAddMedication = () => {
    setMedications([...medications, {
      name: '',
      dosage: '',
      frequency: '',
      duration: ''
    }]);
  };

  const handleRemoveMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleMedicationChange = (index: number, field: keyof Medication, value: string) => {
    const newMedications = [...medications];
    newMedications[index] = {
      ...newMedications[index],
      [field]: value
    };
    setMedications(newMedications);
  };

  const handleSubmit = () => {
    // In a real app, this would save to the backend
    console.log('Saving prescription:', {
      appointmentId,
      medications,
      notes
    });
    navigate(`/appointments/${appointmentId}`);
  };

  const isValid = medications.every(med => 
    med.name && med.dosage && med.frequency && med.duration
  );

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
          Recepta
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
              <p className="text-sm text-neutral-500">Data wizyty</p>
              <p className="font-medium">{appointment.date}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Leki</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {medications.map((medication, index) => (
            <div key={index} className="space-y-4 p-4 border border-neutral-200 rounded-md">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Lek {index + 1}</h4>
                {medications.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveMedication(index)}
                    icon={<Trash className="h-4 w-4" />}
                  >
                    Usuń
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nazwa leku"
                  value={medication.name}
                  onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                  required
                />
                <Input
                  label="Dawkowanie"
                  value={medication.dosage}
                  onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                  placeholder="np. 1 tabletka"
                  required
                />
                <Input
                  label="Częstotliwość"
                  value={medication.frequency}
                  onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                  placeholder="np. 2 razy dziennie"
                  required
                />
                <Input
                  label="Okres stosowania"
                  value={medication.duration}
                  onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                  placeholder="np. 7 dni"
                  required
                />
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            onClick={handleAddMedication}
            icon={<Plus className="h-4 w-4" />}
          >
            Dodaj lek
          </Button>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Dodatkowe uwagi
            </label>
            <textarea
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Dodatkowe zalecenia lub uwagi..."
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSubmit}
              disabled={!isValid}
            >
              Wystaw receptę
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrescriptionPage;