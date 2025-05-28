import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAppointmentStore } from '../../store/appointmentStore';

const AppointmentRatingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAppointmentById, updateAppointment } = useAppointmentStore();
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  
  if (!id) return null;
  
  const appointment = getAppointmentById(id);
  if (!appointment) {
    navigate('/appointments');
    return null;
  }

  const handleSubmit = () => {
    updateAppointment(id, {
      rating,
      ratingComment: comment
    });
    navigate(`/appointments/${id}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/appointments/${id}`)}
        >
          Powrót
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Oceń wizytę</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Twoja opinia jest dla nas ważna</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Ocena
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => setRating(value)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 ${
                      value <= rating
                        ? 'fill-warning-400 text-warning-400'
                        : 'text-neutral-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Komentarz
            </label>
            <textarea
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Podziel się swoją opinią na temat wizyty..."
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSubmit}
              disabled={!rating}
            >
              Zapisz ocenę
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentRatingPage;