import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Loader2, Plus, X, Upload, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TrainerFormData, TrainerRole, Specialization } from '@/types';

// Form validation schema
const trainerFormSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  role: z.enum(['trainer', 'senior_trainer', 'head_trainer']),
  specialization: z.array(z.string()).min(1, 'At least one specialization is required'),
  yearsOfExperience: z.number().min(0, 'Must be 0 or more').optional(),
  certifications: z.array(z.instanceof(File)),
  emergencyContact: z.object({
    name: z.string().min(2, 'Name is required'),
    phone: z.string().min(10, 'Valid phone number is required'),
    relation: z.string().min(2, 'Relation is required'),
  }),
  notes: z.string().optional(),
  sendCredentials: z.boolean().default(false),
  sendMethod: z.enum(['sms', 'whatsapp', 'email']).optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  confirmPassword: z.string().optional(),
}).refine(
  (data) => {
    if (data.sendCredentials && !data.password) {
      return false;
    }
    return true;
  },
  {
    message: 'Password is required when sending credentials',
    path: ['password'],
  }
).refine(
  (data) => {
    if (data.password && data.password !== data.confirmPassword) {
      return false;
    }
    return true;
  },
  {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }
);

type TrainerFormValues = z.infer<typeof trainerFormSchema>;

interface TrainerFormProps {
  defaultValues?: Partial<TrainerFormData>;
  onSubmit: (data: TrainerFormData) => Promise<void>;
  isSubmitting: boolean;
}

export function TrainerForm({ defaultValues, onSubmit, isSubmitting }: TrainerFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<TrainerFormValues>({
    resolver: zodResolver(trainerFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      role: 'trainer',
      specialization: [],
      certifications: [],
      emergencyContact: {
        name: '',
        phone: '',
        relation: '',
      },
      sendCredentials: false,
      sendMethod: 'sms',
      ...defaultValues,
    },
  });

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = form;
  
  const specializationOptions: Specialization[] = [
    'crossfit',
    'weight_training',
    'yoga',
    'pilates',
    'cardio',
    'hiit',
    'other',
  ];

  const handleSpecializationToggle = (value: string) => {
    const currentSpecializations = watch('specialization') || [];
    if (currentSpecializations.includes(value)) {
      setValue(
        'specialization',
        currentSpecializations.filter((item) => item !== value)
      );
    } else {
      setValue('specialization', [...currentSpecializations, value]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentFiles = watch('certifications') || [];
    setValue('certifications', [...currentFiles, ...files]);
  };

  const removeFile = (index: number) => {
    const currentFiles = [...(watch('certifications') || [])];
    currentFiles.splice(index, 1);
    setValue('certifications', currentFiles);
  };

  const onFormSubmit = async (data: TrainerFormValues) => {
    try {
      await onSubmit(data as TrainerFormData);
      toast({
        title: 'Success',
        description: 'Trainer saved successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save trainer. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            {defaultValues?.id ? 'Edit Trainer' : 'Add New Trainer'}
          </h2>
          <p className="text-muted-foreground">
            {defaultValues?.id 
              ? `Editing ${defaultValues.firstName} ${defaultValues.lastName}`
              : 'Fill in the details below to add a new trainer'}
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Trainer'
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                {...register('firstName')}
                placeholder="John"
                error={errors.firstName?.message}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                {...register('lastName')}
                placeholder="Doe"
                error={errors.lastName?.message}
              />
            </div>
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(new Date(field.value), 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date?.toISOString())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.dateOfBirth && (
                <p className="text-sm text-destructive mt-1">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trainer">Trainer</SelectItem>
                      <SelectItem value="senior_trainer">Senior Trainer</SelectItem>
                      <SelectItem value="head_trainer">Head Trainer</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                {...register('phone')}
                placeholder="+91 98765 43210"
                error={errors.phone?.message}
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="john.doe@example.com"
                error={errors.email?.message}
              />
            </div>
          </div>
        </div>

        {/* Specialization */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Specialization *</h3>
          <div className="flex flex-wrap gap-2">
            {specializationOptions.map((option) => {
              const isSelected = watch('specialization')?.includes(option);
              return (
                <Badge
                  key={option}
                  variant={isSelected ? 'default' : 'outline'}
                  className="cursor-pointer px-3 py-1 text-sm"
                  onClick={() => handleSpecializationToggle(option)}
                >
                  {option.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </Badge>
              );
            })}
          </div>
          {errors.specialization && (
            <p className="text-sm text-destructive">
              {errors.specialization.message}
            </p>
          )}
        </div>

        {/* Experience */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Experience</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="yearsOfExperience">Years of Experience</Label>
              <Input
                id="yearsOfExperience"
                type="number"
                min="0"
                {...register('yearsOfExperience', { valueAsNumber: true })}
                placeholder="5"
                error={errors.yearsOfExperience?.message}
              />
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Certifications</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                id="certifications"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <Label
                htmlFor="certifications"
                className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-accent"
              >
                <Upload className="h-4 w-4" />
                Upload Certifications
              </Label>
              <span className="text-sm text-muted-foreground">
                PDF, JPG, PNG (max 5MB)
              </span>
            </div>
            <div className="space-y-2">
              {watch('certifications')?.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm truncate">
                    {file.name}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="emergencyContact.name">Name *</Label>
              <Input
                id="emergencyContact.name"
                {...register('emergencyContact.name')}
                placeholder="Jane Smith"
                error={errors.emergencyContact?.name?.message}
              />
            </div>
            <div>
              <Label htmlFor="emergencyContact.phone">Phone *</Label>
              <Input
                id="emergencyContact.phone"
                type="tel"
                {...register('emergencyContact.phone')}
                placeholder="+91 98765 43210"
                error={errors.emergencyContact?.phone?.message}
              />
            </div>
            <div>
              <Label htmlFor="emergencyContact.relation">Relation *</Label>
              <Input
                id="emergencyContact.relation"
                {...register('emergencyContact.relation')}
                placeholder="Spouse"
                error={errors.emergencyContact?.relation?.message}
              />
            </div>
          </div>
        </div>

        {/* Login Credentials */}
        {!defaultValues?.id && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Login Credentials</h3>
            <div className="space-y-4 p-4 border rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Send Login Credentials</h4>
                  <p className="text-sm text-muted-foreground">
                    Send temporary login details to the trainer
                  </p>
                </div>
                <Controller
                  name="sendCredentials"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>

              {watch('sendCredentials') && (
                <div className="space-y-4 pt-4 border-t">
                  <div>
                    <Label>Send Via</Label>
                    <div className="flex gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="sendSMS"
                          value="sms"
                          {...register('sendMethod')}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="sendSMS" className="font-normal">
                          SMS
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="sendWhatsApp"
                          value="whatsapp"
                          {...register('sendMethod')}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="sendWhatsApp" className="font-normal">
                          WhatsApp
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="sendEmail"
                          value="email"
                          {...register('sendMethod')}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="sendEmail" className="font-normal">
                          Email
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="password">Temporary Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        {...register('password')}
                        placeholder="Create a password"
                        error={errors.password?.message}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          const randomPassword = Math.random().toString(36).slice(-10);
                          setValue('password', randomPassword);
                          setValue('confirmPassword', randomPassword);
                        }}
                      >
                        Generate Secure Password
                      </Button>
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        {...register('confirmPassword')}
                        placeholder="Confirm password"
                        error={errors.confirmPassword?.message}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Internal Notes</Label>
          <Textarea
            id="notes"
            {...register('notes')}
            placeholder="Any additional notes about this trainer..."
            className="min-h-[100px]"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(-1)}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Trainer'
          )}
        </Button>
      </div>
    </form>
  );
}
