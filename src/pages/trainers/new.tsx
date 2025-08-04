import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { TrainerForm } from '@/components/trainer/TrainerForm';
import { createTrainer } from '@/services/trainerService';
import type { TrainerFormData } from '@/types';

export default function AddTrainerPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: TrainerFormData) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      
      // Append all fields to formData
      (Object.entries(data) as [keyof TrainerFormData, any][]).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          return; // Skip null/undefined/empty values
        }
        
        if (key === 'certifications' && Array.isArray(value)) {
          // Handle file uploads for certifications
          (value as File[]).forEach((file: File) => {
            formData.append('certifications', file);
          });
        } else if (key === 'emergencyContact' && value !== null) {
          // Handle nested emergency contact
          formData.append('emergencyContact', JSON.stringify(value));
        } else if (key === 'specialization' && Array.isArray(value)) {
          // Handle array of specializations
          (value as string[]).forEach((spec: string) => {
            formData.append('specialization', spec);
          });
        } else if (value instanceof File) {
          // Handle file uploads
          formData.append(key, value);
        } else if (typeof value === 'object') {
          // Stringify other objects
          formData.append(key, JSON.stringify(value));
        } else {
          // Handle all other fields
          formData.append(key, String(value));
        }
      });

      // @ts-ignore - We know the API expects FormData
      await createTrainer(formData);
      
      toast({
        title: 'Success',
        description: 'Trainer added successfully',
      });
      
      navigate('/dashboard/trainers');
    } catch (error) {
      console.error('Error creating trainer:', error);
      toast({
        title: 'Error',
        description: 'Failed to create trainer. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <TrainerForm
        onSubmit={handleSubmit}
        isSubmitting={isLoading}
      />
    </div>
  );
}
