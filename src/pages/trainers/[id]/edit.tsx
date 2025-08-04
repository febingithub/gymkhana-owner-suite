import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { TrainerForm } from '@/components/trainer/TrainerForm';
import { getTrainer, updateTrainer } from '@/services/trainerService';
import { Loader2, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Trainer, TrainerFormData, Specialization, TrainerCertification } from '@/types';

export default function EditTrainerPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Helper function to convert Trainer to TrainerFormData
  const trainerToFormData = (trainer: Trainer): Partial<TrainerFormData> => {
    return {
      ...trainer,
      // Handle any necessary conversions here
      certifications: [], // This will be handled separately for file uploads
      profilePhoto: trainer.profilePhoto || undefined,
      // Ensure all required fields are present
      firstName: trainer.firstName || '',
      lastName: trainer.lastName || '',
      email: trainer.email || '',
      phone: trainer.phone || '',
      role: trainer.role || 'trainer', // Use lowercase to match TrainerRole type
      status: trainer.status || 'active',
      specialization: trainer.specialization || [],
      emergencyContact: trainer.emergencyContact || undefined,
    };
  };

  useEffect(() => {
    const fetchTrainer = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await getTrainer(id);
        setTrainer(data);
      } catch (error) {
        console.error('Failed to fetch trainer:', error);
        toast({
          title: 'Error',
          description: 'Failed to load trainer details. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrainer();
  }, [id, toast]);

  const handleSubmit = async (data: TrainerFormData) => {
    if (!id || !trainer) return;
    
    try {
      setIsUpdating(true);
      // Create a new object to store the updates
      const updates: Partial<TrainerFormData> = {};
      const formData = new FormData();
      let hasChanges = false;
      
      // Check which fields have changed
      (Object.entries(data) as [keyof TrainerFormData, any][]).forEach(([key, value]) => {
        if (key === 'certifications') {
          // Handle certifications - these are handled as File[] in the form
          const files = value as File[];
          const currentCerts = (trainer.certifications || []) as TrainerCertification[];
          
          // Check if certifications have changed (comparing by name as a simple check)
          const currentCertNames = currentCerts.map(c => c.name).sort();
          const newCertNames = files.map(f => f.name).sort();
          
          if (JSON.stringify(currentCertNames) !== JSON.stringify(newCertNames)) {
            // @ts-ignore - We know this is safe for the API
            updates.certifications = files;
            hasChanges = true;
          }
        } else if (key === 'emergencyContact') {
          // Check if emergency contact has changed
          const contact = value as { name: string; phone: string; relation: string } | null;
          const currentContact = trainer.emergencyContact;
          
          if ((!currentContact && contact) || 
              (currentContact && !contact) ||
              (contact && currentContact && (
                contact.name !== currentContact.name || 
                contact.phone !== currentContact.phone || 
                contact.relation !== currentContact.relation
              ))) {
            updates.emergencyContact = contact;
            hasChanges = true;
          }
        } else if (key === 'specialization') {
          // Check if specialization has changed
          const specializations = value as Specialization[];
          const currentSpecializations = (trainer.specialization || []) as Specialization[];
          
          if (specializations.length !== currentSpecializations.length ||
              !specializations.every((spec, i) => spec === currentSpecializations[i])) {
            // @ts-ignore - We know this is safe for the API
            updates.specialization = specializations;
            hasChanges = true;
          }
        } else if (key === 'profilePhoto' && value) {
          // Handle profile photo upload
          // Store the file separately since profilePhoto in the API expects a string (URL)
          // We'll handle the file upload in the form submission
          if (value instanceof File) {
            // @ts-ignore - We'll handle this specially in the form submission
            updates.profilePhoto = value;
            hasChanges = true;
          }
        } else if (key === 'password' && value) {
          // Only include password if it's being updated
          updates.password = value as string;
          hasChanges = true;
        } else if (key !== 'confirmPassword') { // Skip confirmPassword
          // Handle other fields
          if (trainer[key as keyof Trainer] !== value) {
            // @ts-ignore - We know this is safe for the API
            updates[key] = value;
            hasChanges = true;
          }
        }
      });

      if (!hasChanges) {
        toast({
          title: 'No changes detected',
          description: 'No changes were made to the trainer profile.',
          variant: 'default',
        });
        return;
      }

      // Add all updates to formData
      (Object.entries(updates) as [string, any][]).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'profilePhoto' && value instanceof File) {
            formData.append('profilePhoto', value);
          } else if (key === 'certifications' && Array.isArray(value)) {
            // Handle file uploads for certifications
            (value as File[]).forEach((file: File) => {
              formData.append('certifications', file);
            });
          } else if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      // @ts-ignore - We know the API expects FormData
      await updateTrainer(id, formData);
      
      toast({
        title: 'Success',
        description: 'Trainer updated successfully',
        variant: 'default',
      });
      
      navigate(`/dashboard/trainers/${id}`);
    } catch (error) {
      console.error('Error updating trainer:', error);
      toast({
        title: 'Error',
        description: 'Failed to update trainer. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="container mx-auto py-6">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Trainers
        </Button>
        
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-2xl font-bold mb-2">Trainer Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The trainer you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/dashboard/trainers')}>
            View All Trainers
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <TrainerForm 
        defaultValues={trainerToFormData(trainer)} 
        onSubmit={handleSubmit} 
        isSubmitting={isUpdating}
      />
    </div>
  );
}
