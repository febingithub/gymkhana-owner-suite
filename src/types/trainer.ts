import type { EmergencyContact } from './member';

export type TrainerStatus = 'active' | 'inactive';
export type TrainerRole = 'trainer' | 'senior_trainer' | 'head_trainer';
export type Specialization = 'crossfit' | 'weight_training' | 'yoga' | 'pilates' | 'cardio' | 'hiit' | 'other';

export interface TrainerCertification {
  id: string;
  name: string;
  fileUrl: string;
  issueDate: string;
  expiryDate?: string;
}

export interface Availability {
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface Trainer {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  dateOfBirth: string;
  profilePhoto?: string;
  role: TrainerRole;
  status: TrainerStatus;
  specialization: Specialization[];
  yearsOfExperience: number;
  certifications: TrainerCertification[];
  emergencyContact: EmergencyContact;
  assignedGymId?: string;
  availability: Availability[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrainerFormData extends Omit<Trainer, 'id' | 'createdAt' | 'updatedAt' | 'certifications' | 'availability'> {
  certifications: File[];
  availability: Omit<Availability, 'isAvailable'>[];
  password?: string;
  confirmPassword?: string;
  sendCredentials: boolean;
  sendMethod: 'sms' | 'whatsapp' | 'email';
}
