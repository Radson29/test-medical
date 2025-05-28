import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Search, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useDoctorStore } from '../../store/doctorStore';
import { useAppointmentStore } from '../../store/appointmentStore';
import { formatDate } from '../../lib/utils';

const ManualAppointmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { getAllDoctors } = useDoctorStore();
  const { createAppointment } = useAppointmentStore();
  
  const [patientData, setPatientData] = useState({
    firstName: '',
    lastName: '',
    pesel: '',
    phoneNumber: '',
    email: '',
  });
  
  const [appointmentData, setAppointmentData] = useState({
    doctorId: '',
    date: '',
    time: '',
    type: '',
    notes: '',
  });

  const doctors = getAllDoctors();
  
  // Mock available times for demo
  const availableTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30'
  ];

  const handleSubmit = () => {
    const appointment = {
      patientId: 'temp-' + patientData.pesel, // In a real app, you'd create a patient first
      doctorId: appointmentData.doctorId,
      date: appointmentData.date,
      startTime: appointmentData.time,
      endTime: appointmentData.time.split(':').map((part, i) => i === 0 ? String(+part + 1).padStart(2, '0') : part).join(':'),
      status: 'scheduled',
      type: appointmentData.type,
      notes: appointmentData.notes,
    };

    createAppointment(appointment);
    navigate('/appointments');
  };

  const isFormValid = () => {
    return (
      patientData.firstName &&
      patientData.lastName &&
      patientData.pesel &&
      appointmentData.doctorId &&
      appointmentData.date &&
      appointmentData.time &&
      appointmentData.type
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/appointments')}
        >
          Powrót
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Umów wizytę manualnie</h1>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Dane pacjenta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Imię"
                value={patientData.firstName}
                onChange={(e) => setPatientData({ ...patientData, firstName: e.target.value })}
                required
              />
              <Input
                label="Nazwisko"
                value={patientData.lastName}
                onChange={(e) => setPatientData({ ...patientData, lastName: e.target.value })}
                required
              />
            </div>
            
            <Input
              label="PESEL"
              value={patientData.pesel}
              onChange={(e) => setPatientData({ ...patientData, pesel: e.target.value })}
              required
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Telefon"
                type="tel"
                value={patientData.phoneNumber}
                onChange={(e) => setPatientData({ ...patientData, phoneNumber: e.target.value })}
              />
              <Input
                label="Email"
                type="email"
                value={patientData.email}
                onChange={(e) => setPatientData({ ...patientData, email: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Szczegóły wizyty</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              label="Lekarz"
              value={appointmentData.doctorId}
              onChange={(e) => setAppointmentData({ ...appointmentData, doctorId: e.target.value })}
              options={doctors.map(doctor => ({
                value: doctor.id,
                label: `${doctor.firstName} ${doctor.lastName} (${doctor.specialization})`
              }))}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="date"
                label="Data wizyty"
                value={appointmentData.date}
                onChange={(e) => setAppointmentData({ ...appointmentData, date: e.target.value })}
                min={formatDate(new Date(), 'yyyy-MM-dd')}
                icon={<Calendar className="h-4 w-4 text-neutral-400" />}
                required
              />
              
              <Select
                label="Godzina wizyty"
                value={appointmentData.time}
                onChange={(e) => setAppointmentData({ ...appointmentData, time: e.target.value })}
                options={availableTimes.map(time => ({
                  value: time,
                  label: time
                }))}
                icon={<Clock className="h-4 w-4 text-neutral-400" />}
                required
              />
            </div>

            <Select
              label="Typ wizyty"
              value={appointmentData.type}
              onChange={(e) => setAppointmentData({ ...appointmentData, type: e.target.value })}
              options={[
                { value: 'Konsultacja', label: 'Konsultacja' },
                { value: 'Badanie kontrolne', label: 'Badanie kontrolne' },
                { value: 'Zabieg', label: 'Zabieg' },
              ]}
              required
            />

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Dodatkowe uwagi
              </label>
              <textarea
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm"
                rows={4}
                value={appointmentData.notes}
                onChange={(e) => setAppointmentData({ ...appointmentData, notes: e.target.value })}
                placeholder="Dodatkowe informacje o wizycie..."
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={handleSubmit}
                disabled={!isFormValid()}
              >
                Umów wizytę
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManualAppointmentPage;