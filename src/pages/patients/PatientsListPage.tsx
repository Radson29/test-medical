import React, { useState } from 'react';
import { Search, User, Phone, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { usePatientStore } from '../../store/patientStore';
import { Link } from 'react-router-dom';

const PatientsListPage: React.FC = () => {
  const { patients } = usePatientStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(patient => {
    const searchLower = searchTerm.toLowerCase();
    return (
      patient.firstName.toLowerCase().includes(searchLower) ||
      patient.lastName.toLowerCase().includes(searchLower) ||
      patient.pesel?.includes(searchLower) ||
      patient.email.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight flex items-center">
          <User className="h-6 w-6 mr-2" />
          Pacjenci
        </h1>
      </div>

      <Card>
        <CardContent className="p-4">
          <Input
            placeholder="Szukaj pacjenta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="h-4 w-4 text-neutral-400" />}
          />
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredPatients.length === 0 ? (
          <div className="text-center py-8">
            <User className="h-12 w-12 mx-auto text-neutral-400" />
            <h3 className="mt-4 text-lg font-medium">Nie znaleziono pacjentów</h3>
            <p className="mt-1 text-neutral-500">
              Spróbuj zmienić kryteria wyszukiwania
            </p>
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <Card key={patient.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg">
                      {patient.firstName[0]}{patient.lastName[0]}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">
                        {patient.firstName} {patient.lastName}
                      </h3>
                      <p className="text-sm text-neutral-500">
                        PESEL: {patient.pesel}
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center space-x-6 text-sm text-neutral-500">
                    {patient.phoneNumber && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {patient.phoneNumber}
                      </div>
                    )}
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {patient.email}
                    </div>
                    <Link to={`/patients/${patient.id}`}>
                      <Button variant="outline" size="sm">
                        Szczegóły
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default PatientsListPage;