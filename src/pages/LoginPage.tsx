import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: string) => {
    setIsLoading(true);
    let demoEmail = '';
    let demoPassword = '';

    switch (role) {
      case 'patient':
        demoEmail = 'pacjent@example.com';
        demoPassword = 'pacjent123';
        break;
      case 'doctor':
        demoEmail = 'lekarz@example.com';
        demoPassword = 'lekarz123';
        break;
      case 'receptionist':
        demoEmail = 'recepcja@example.com';
        demoPassword = 'recepcja123';
        break;
      case 'administrator':
        demoEmail = 'admin@example.com';
        demoPassword = 'admin123';
        break;
    }

    try {
      await login(demoEmail, demoPassword);
      navigate('/dashboard');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Logowanie</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-error-50 text-error-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="twoj@email.pl"
            icon={<Mail className="h-5 w-5 text-neutral-400" />}
          />

          <Input
            label="Hasło"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            icon={<Lock className="h-5 w-5 text-neutral-400" />}
          />

          <Button
            type="submit"
            className="w-full mt-4"
            isLoading={isLoading}
          >
            Zaloguj się
          </Button>
        </form>

        <div className="mt-6">
          <p className="text-center text-sm text-neutral-600 mb-4">
            Demo - szybkie logowanie
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDemoLogin('patient')}
              disabled={isLoading}
            >
              Pacjent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDemoLogin('doctor')}
              disabled={isLoading}
            >
              Lekarz
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDemoLogin('receptionist')}
              disabled={isLoading}
            >
              Recepcja
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDemoLogin('administrator')}
              disabled={isLoading}
            >
              Administrator
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;