import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import Button from '../ui/Button';
import { Doctor } from '../../types';
import { getInitials } from '../../lib/utils';

interface DoctorCardProps {
  doctor: Doctor;
  onSelect?: (doctorId: string) => void;
  actionLabel?: string;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ 
  doctor, 
  onSelect, 
  actionLabel = 'Wybierz' 
}) => {
  return (
    <Card className="h-full transition-all duration-200 hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg">
            {getInitials(doctor.firstName, doctor.lastName)}
          </div>
          <div className="ml-4">
            <CardTitle className="text-lg">
              {doctor.firstName} {doctor.lastName}
            </CardTitle>
            <p className="text-sm text-neutral-500">{doctor.specialization}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {doctor.about && <p className="text-sm">{doctor.about}</p>}
        <div className="text-sm text-neutral-600">
          <p>Nr licencji: {doctor.licenseNumber}</p>
        </div>
      </CardContent>
      <CardFooter>
        {onSelect && (
          <Button
            onClick={() => onSelect(doctor.id)}
            variant="primary"
            className="w-full"
          >
            {actionLabel}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DoctorCard;