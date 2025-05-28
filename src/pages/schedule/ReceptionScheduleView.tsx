import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Search, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useDoctorStore } from '../../store/doctorStore';
import { formatDate } from '../../lib/utils';

const timeSlots = Array.from({ length: 18 }, (_, i) => {
  const hour = (8 + Math.floor(i / 2)).toString().padStart(2, '0');
  const minute = i % 2 === 0 ? '00' : '30';
  return `${hour}:${minute}`;
});

const ReceptionScheduleView: React.FC = () => {
  const navigate = useNavigate();
  const { getAllDoctors } = useDoctorStore();
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date(), 'yyyy-MM-dd'));
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const doctors = getAllDoctors();
  const filteredDoctors = doctors.filter(doctor =>
    doctor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mock available slots - in a real app, this would come from the backend
  const getAvailableSlots = (doctorId: string, date: string) => {
    return timeSlots.map(time => ({
      time,
      isAvailable: Math.random() > 0.3, // Random availability for demo
    }));
  };

  const handleBookAppointment = (doctorId: string, time: string) => {
    navigate(`/appointments/manual?doctorId=${doctorId}&date=${selectedDate}&time=${time}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight flex items-center">
          <Calendar className="h-6 w-6 mr-2" />
          Harmonogram przyjęć
        </h1>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Wyszukaj lekarza"
              placeholder="Nazwisko lub specjalizacja..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-4 w-4 text-neutral-400" />}
            />
            
            <Input
              type="date"
              label="Data"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={formatDate(new Date(), 'yyyy-MM-dd')}
              icon={<Calendar className="h-4 w-4 text-neutral-400" />}
            />

            <Select
              label="Lekarz"
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              options={[
                { value: '', label: 'Wszyscy lekarze' },
                ...doctors.map(doctor => ({
                  value: doctor.id,
                  label: `${doctor.firstName} ${doctor.lastName} (${doctor.specialization})`
                }))
              ]}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDoctors
          .filter(doctor => !selectedDoctor || doctor.id === selectedDoctor)
          .map((doctor) => {
            const availableSlots = getAvailableSlots(doctor.id, selectedDate);
            
            return (
              <Card key={doctor.id}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    {doctor.firstName} {doctor.lastName}
                    <span className="text-sm font-normal text-neutral-500 ml-2">
                      ({doctor.specialization})
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-2">
                    {availableSlots.map(({ time, isAvailable }) => (
                      <div key={time} className="text-center">
                        <Button
                          variant={isAvailable ? "outline" : "secondary"}
                          size="sm"
                          className="w-full"
                          disabled={!isAvailable}
                          onClick={() => handleBookAppointment(doctor.id, time)}
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          {time}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
};

export default ReceptionScheduleView;