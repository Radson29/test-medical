import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import { useDoctorStore } from '../../store/doctorStore';
import { useAuthStore } from '../../store/authStore';

const weekDays = [
  { value: '1', label: 'Poniedziałek' },
  { value: '2', label: 'Wtorek' },
  { value: '3', label: 'Środa' },
  { value: '4', label: 'Czwartek' },
  { value: '5', label: 'Piątek' },
];

const timeSlots = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return { value: `${hour}:00`, label: `${hour}:00` };
});

const DoctorSchedulePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getDoctorById } = useDoctorStore();
  
  const [schedule, setSchedule] = useState(
    weekDays.map(day => ({
      dayOfWeek: day.value,
      startTime: '09:00',
      endTime: '17:00',
      isWorking: true,
    }))
  );

  if (!user) return null;
  const doctor = user.role === 'doctor' ? getDoctorById(user.id) : null;

  const handleScheduleChange = (dayOfWeek: string, field: string, value: string) => {
    setSchedule(prev =>
      prev.map(day =>
        day.dayOfWeek === dayOfWeek
          ? { ...day, [field]: value }
          : day
      )
    );
  };

  const handleToggleDay = (dayOfWeek: string) => {
    setSchedule(prev =>
      prev.map(day =>
        day.dayOfWeek === dayOfWeek
          ? { ...day, isWorking: !day.isWorking }
          : day
      )
    );
  };

  const handleSave = () => {
    // In a real app, this would save to the backend
    console.log('Saving schedule:', schedule);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight flex items-center">
          <Calendar className="h-6 w-6 mr-2" />
          Harmonogram pracy
        </h1>
        <Button onClick={handleSave}>
          Zapisz zmiany
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Godziny przyjęć
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weekDays.map((day) => {
              const daySchedule = schedule.find(s => s.dayOfWeek === day.value);
              if (!daySchedule) return null;

              return (
                <div key={day.value} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={daySchedule.isWorking}
                      onChange={() => handleToggleDay(day.value)}
                      className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="font-medium">{day.label}</span>
                  </div>
                  
                  <Select
                    value={daySchedule.startTime}
                    onChange={(e) => handleScheduleChange(day.value, 'startTime', e.target.value)}
                    options={timeSlots}
                    disabled={!daySchedule.isWorking}
                  />
                  
                  <div className="text-center">do</div>
                  
                  <Select
                    value={daySchedule.endTime}
                    onChange={(e) => handleScheduleChange(day.value, 'endTime', e.target.value)}
                    options={timeSlots}
                    disabled={!daySchedule.isWorking}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ustawienia harmonogramu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Długość wizyty"
              value="30"
              onChange={() => {}}
              options={[
                { value: '15', label: '15 minut' },
                { value: '30', label: '30 minut' },
                { value: '45', label: '45 minut' },
                { value: '60', label: '60 minut' },
              ]}
            />
            
            <Select
              label="Przerwa między wizytami"
              value="5"
              onChange={() => {}}
              options={[
                { value: '0', label: 'Brak przerwy' },
                { value: '5', label: '5 minut' },
                { value: '10', label: '10 minut' },
                { value: '15', label: '15 minut' },
              ]}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorSchedulePage;