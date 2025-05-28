import React from 'react';
import { Link } from 'react-router-dom';
import { Users, UserPlus, FileText, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';

const AdminDashboard: React.FC = () => {
  const { user } = useAuthStore();
  
  if (!user) return null;
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Panel Administratora
        </h1>
        <div className="mt-3 sm:mt-0">
          <Link to="/users/new">
            <Button icon={<UserPlus className="h-4 w-4" />}>
              Dodaj użytkownika
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary-600" />
              Użytkownicy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
            <div className="text-sm text-neutral-500 mt-1">
              Aktywnych kont
            </div>
            <div className="mt-4">
              <Link to="/users">
                <Button variant="outline" size="sm" className="w-full">
                  Zarządzaj
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-secondary-600" />
              Raporty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5</div>
            <div className="text-sm text-neutral-500 mt-1">
              Dostępnych raportów
            </div>
            <div className="mt-4">
              <Link to="/reports">
                <Button variant="outline" size="sm" className="w-full">
                  Zobacz raporty
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2 text-warning-600" />
              Ustawienia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-neutral-700 mt-2">
              Konfiguracja systemu i parametrów rezerwacji
            </div>
            <div className="mt-4">
              <Link to="/settings">
                <Button variant="outline" size="sm" className="w-full">
                  Konfiguruj
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserPlus className="h-5 w-5 mr-2 text-success-600" />
              Nowi użytkownicy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2</div>
            <div className="text-sm text-neutral-500 mt-1">
              W ciągu ostatnich 7 dni
            </div>
            <div className="mt-4">
              <Link to="/users/new">
                <Button variant="outline" size="sm" className="w-full">
                  Dodaj nowego
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Zarządzanie systemem</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to="/users" className="no-underline">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Users className="h-8 w-8 text-primary-500 mb-4" />
                <h3 className="font-medium text-center">Zarządzanie użytkownikami</h3>
                <p className="text-sm text-center text-neutral-500 mt-2">
                  Dodawanie, edycja i dezaktywacja kont
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/reports" className="no-underline">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <FileText className="h-8 w-8 text-secondary-500 mb-4" />
                <h3 className="font-medium text-center">Raporty i statystyki</h3>
                <p className="text-sm text-center text-neutral-500 mt-2">
                  Analiza i eksport danych
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/settings" className="no-underline">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Settings className="h-8 w-8 text-warning-500 mb-4" />
                <h3 className="font-medium text-center">Ustawienia systemu</h3>
                <p className="text-sm text-center text-neutral-500 mt-2">
                  Konfiguracja parametrów systemu
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;