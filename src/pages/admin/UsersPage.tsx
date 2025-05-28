import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, UserPlus, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';

const mockUsers = [
  { id: '1', firstName: 'Jan', lastName: 'Kowalski', email: 'jan@example.com', role: 'patient', isActive: true },
  { id: '2', firstName: 'Anna', lastName: 'Nowak', email: 'anna@example.com', role: 'doctor', isActive: true },
  { id: '3', firstName: 'Piotr', lastName: 'Wiśniewski', email: 'piotr@example.com', role: 'receptionist', isActive: true },
  { id: '4', firstName: 'Maria', lastName: 'Dąbrowska', email: 'maria@example.com', role: 'administrator', isActive: true },
];

const roleLabels = {
  patient: { label: 'Pacjent', variant: 'default' as const },
  doctor: { label: 'Lekarz', variant: 'primary' as const },
  receptionist: { label: 'Recepcja', variant: 'secondary' as const },
  administrator: { label: 'Administrator', variant: 'warning' as const },
};

const UsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showInactive, setShowInactive] = useState(false);

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    const matchesStatus = showInactive ? true : user.isActive;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight flex items-center">
          <Shield className="h-6 w-6 mr-2" />
          Użytkownicy systemu
        </h1>
        <div className="mt-3 sm:mt-0">
          <Link to="/users/new">
            <Button icon={<UserPlus className="h-4 w-4" />}>
              Dodaj użytkownika
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Szukaj użytkownika..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-4 w-4 text-neutral-400" />}
            />
            
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              options={[
                { value: '', label: 'Wszystkie role' },
                { value: 'patient', label: 'Pacjenci' },
                { value: 'doctor', label: 'Lekarze' },
                { value: 'receptionist', label: 'Recepcja' },
                { value: 'administrator', label: 'Administratorzy' },
              ]}
            />

            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showInactive}
                  onChange={(e) => setShowInactive(e.target.checked)}
                  className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500 mr-2"
                />
                <span className="text-sm text-neutral-700">
                  Pokaż nieaktywne konta
                </span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-medium">
                        {user.firstName} {user.lastName}
                      </h3>
                      <Badge variant={roleLabels[user.role as keyof typeof roleLabels].variant}>
                        {roleLabels[user.role as keyof typeof roleLabels].label}
                      </Badge>
                    </div>
                    <p className="text-sm text-neutral-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link to={`/users/${user.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Edytuj
                    </Button>
                  </Link>
                  {user.isActive ? (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        // In a real app, this would deactivate the user
                        console.log('Deactivating user:', user.id);
                      }}
                    >
                      Dezaktywuj
                    </Button>
                  ) : (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => {
                        // In a real app, this would activate the user
                        console.log('Activating user:', user.id);
                      }}
                    >
                      Aktywuj
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UsersPage;