import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Search, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import DoctorCard from '../../components/doctor/DoctorCard';
import { useDoctorStore } from '../../store/doctorStore';
import { useAppointmentStore } from '../../store/appointmentStore';
import { useAuthStore } from '../../store/authStore';
import { formatDate } from '../../lib/utils';

const NewAppointmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getAllDoctors } = useDoctorStore();
  const { createAppointment } = useAppointmentStore();
  
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('');
  const [notes, setNotes] = useState('');

  if (!user) return null;

  const doctors = getAllDoctors();
  const filteredDoctors = doctors.filter(doctor => 
    doctor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mock available times for demo
  const availableTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30'
  ];

  const handleSubmit = () => {
    const appointment = {
      patientId: user.id,
      doctorId: selectedDoctor,
      date: selectedDate,
      startTime: selectedTime,
      endTime: selectedTime.split(':').map((part, i) => i === 0 ? String(+part + 1).padStart(2, '0') : part).join(':'),
      status: 'scheduled',
      type: appointmentType,
      notes: notes,
    };

    createAppointment(appointment);
    navigate('/appointments');
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
        <h1 className="text-2xl font-bold tracking-tight">Nowa wizyta</h1>
      </div>

      <div className="space-y-6">
        {step === 1 && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Wybierz lekarza</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Szukaj lekarza..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search className="h-4 w-4 text-neutral-400" />}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDoctors.map((doctor) => (
                    <DoctorCard
                      key={doctor.id}
                      doctor={doctor}
                      onSelect={(id) => {
                        setSelectedDoctor(id);
                        setStep(2);
                      }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {step === 2 && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Wybierz termin</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="date"
                    label="Data wizyty"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={formatDate(new Date(), 'yyyy-MM-dd')}
                    icon={<Calendar className="h-4 w-4 text-neutral-400" />}
                  />
                  
                  <Select
                    label="Godzina wizyty"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    options={availableTimes.map(time => ({
                      value: time,
                      label: time
                    }))}
                    icon={<Clock className="h-4 w-4 text-neutral-400" />}
                  />
                </div>

                <Select
                  label="Typ wizyty"
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value)}
                  options={[
                    { value: 'Konsultacja', label: 'Konsultacja' },
                    { value: 'Badanie kontrolne', label: 'Badanie kontrolne' },
                    { value: 'Zabieg', label: 'Zabieg' },
                  ]}
                />

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Dodatkowe uwagi
                  </label>
                  <textarea
                    className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm"
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Opisz swoje dolegliwości lub dodaj inne istotne informacje..."
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStep(1);
                      setSelectedDoctor('');
                    }}
                  >
                    Wstecz
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!selectedDate || !selectedTime || !appointmentType}
                  >
                    Umów wizytę
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default NewAppointmentPage;