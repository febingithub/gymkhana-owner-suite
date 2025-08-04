import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getTrainer } from '@/services/trainerService';
import { ArrowLeft, Edit, Phone, Mail, User, Calendar, Award, Clock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import type { Trainer } from '@/types';

export default function TrainerDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [trainer, setTrainer] = useState<Trainer | null>(null);

  useEffect(() => {
    const fetchTrainer = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await getTrainer(id);
        setTrainer(data);
      } catch (err) {
        console.error('Failed to fetch trainer:', err);
        setError(err instanceof Error ? err : new Error('Failed to load trainer'));
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

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Trainers
        </Button>
        
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !trainer) {
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

  const formatRole = (role: string) => {
    return role
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (e) {
      return 'N/A';
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Trainers
        </Button>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => navigate(`/dashboard/trainers/${id}/edit`)}
            className="w-full sm:w-auto"
          >
            <Edit className="mr-2 h-4 w-4" /> Edit Trainer
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center text-2xl font-bold">
            {trainer.firstName[0]}
            {trainer.lastName?.[0]}
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              {trainer.firstName} {trainer.lastName}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={trainer.status === 'active' ? 'default' : 'secondary'}>
                {trainer.status.charAt(0).toUpperCase() + trainer.status.slice(1)}
              </Badge>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">
                {formatRole(trainer.role)}
              </span>
              {trainer.yearsOfExperience && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">
                    {trainer.yearsOfExperience} years experience
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Trainer's personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p>
                    {trainer.firstName} {trainer.lastName}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p>{formatDate(trainer.dateOfBirth)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <p>{formatRole(trainer.role)}</p>
                </div>
              </div>
              
              {trainer.specialization && trainer.specialization.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Specializations</p>
                  <div className="flex flex-wrap gap-1">
                    {trainer.specialization.map((spec) => (
                      <Badge key={spec} variant="secondary">
                        {spec.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Ways to get in touch</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <a
                    href={`tel:${trainer.phone}`}
                    className="hover:underline hover:text-primary"
                  >
                    {trainer.phone}
                  </a>
                </div>
              </div>
              
              {trainer.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <a
                      href={`mailto:${trainer.email}`}
                      className="hover:underline hover:text-primary"
                    >
                      {trainer.email}
                    </a>
                  </div>
                </div>
              )}
              
              {trainer.emergencyContact && (
                <div className="pt-4 mt-4 border-t">
                  <h4 className="font-medium mb-3">Emergency Contact</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p>{trainer.emergencyContact.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <a
                        href={`tel:${trainer.emergencyContact.phone}`}
                        className="hover:underline hover:text-primary"
                      >
                        {trainer.emergencyContact.phone}
                      </a>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Relation</p>
                      <p>{trainer.emergencyContact.relation}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Availability & Notes */}
          <Card className="md:col-span-3 lg:col-span-1">
            <CardHeader>
              <CardTitle>Availability</CardTitle>
              <CardDescription>Trainer's schedule</CardDescription>
            </CardHeader>
            <CardContent>
              {trainer.availability && trainer.availability.length > 0 ? (
                <div className="space-y-4">
                  {trainer.availability
                    .filter(avail => avail.isAvailable)
                    .map((avail, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        <div>
                          <p className="font-medium capitalize">{avail.day}</p>
                          <p className="text-sm text-muted-foreground">
                            {avail.startTime} - {avail.endTime}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No availability information available.
                </p>
              )}
              
              {trainer.notes && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium mb-2">Notes</h4>
                  <p className="text-sm text-muted-foreground">
                    {trainer.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Certifications */}
        {trainer.certifications && trainer.certifications.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Certifications</CardTitle>
              <CardDescription>Trainer's professional certifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {trainer.certifications.map((cert, index) => (
                  <a
                    key={index}
                    href={cert.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border rounded-md p-4 hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-md">
                        <Award className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{cert.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Issued: {formatDate(cert.issueDate)}
                          {cert.expiryDate && ` • Expires: ${formatDate(cert.expiryDate)}`}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
