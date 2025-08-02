export interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export type MembershipType = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
export type PaymentMethod = 'cash' | 'card' | 'upi' | 'netbanking' | 'wallet';
export type MemberStatus = 'active' | 'inactive' | 'pending' | 'suspended';

export interface MemberFormData {
  // Personal Details
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  profilePhoto: string | null;
  memberId: string;
  
  // Contact Details
  phone: string;
  alternatePhone: string;
  email: string;
  emergencyContact: EmergencyContact;
  
  // Address
  address: Address;
  
  // Fitness Profile
  height: string;
  weight: string;
  fitnessGoals: string[];
  workoutPreferences: string[];
  medicalConditions: string;
  dietPreference: string;
  
  // Membership
  membershipType: MembershipType;
  startDate: string;
  paymentMethod: PaymentMethod;
  amountPaid: string;
  autoRenew: boolean;
  
  // System fields
  status: MemberStatus;
  createdAt: string;
  updatedAt: string;
}
