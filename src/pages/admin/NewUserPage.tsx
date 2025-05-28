import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

const NewUserPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    specialization: '',
    licenseNumber: '',
    pesel: '',
    phoneNumber: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would create a new user
    console.log('Creating new user:', formData);
    navigate('/users');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/users')}
        >
          Powrót
        </Button>
        <h1 className="text-2xl font-bold tracking-tight flex items-center">
          <UserPlus className="h-6 w-6 mr-2" />
          Nowy użytkownik
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Dane podstawowe</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Imię"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <Input
                label="Nazwisko"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Input
                label="Telefon"
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>

            <Select
              label="Rola"
              name="role"
              value={formData.role}
              onChange={handleChange}
              options={[
                { value: 'patient', label: 'Pacjent' },
                { value: 'doctor', label: 'Lekarz' },
                { value: 'receptionist', label: 'Recepcja' },
                { value: 'administrator', label: 'Administrator' },
              ]}
              required
            />
          </CardContent>
        </Card>

        {formData.role === 'doctor' && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Dane lekarza</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Numer licencji"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                required
              />
              <Select
                label="Specjalizacja"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                options={[
                  { value: 'kardiologia', label: 'Kardiologia' },
                  { value: 'neurologia', label: 'Neurologia' },
                  { value: 'pediatria', label: 'Pediatria' },
                  { value: 'dermatologia', label: 'Dermatologia' },
                ]}
                required
              />
            </CardContent>
          </Card>
        )}

        {formData.role === 'patient' && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Dane pacjenta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="PESEL"
                name="pesel"
                value={formData.pesel}
                onChange={handleChange}
                required
              />
            </CardContent>
          </Card>
        )}

        <div className="mt-6 flex justify-end">
          <Button type="submit">
            Utwórz konto
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewUserPage;