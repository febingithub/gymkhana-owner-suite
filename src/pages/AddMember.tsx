import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import { format } from 'date-fns';

// Import form components
import {
  PersonalDetails,
  ContactDetails,
  AddressDetails,
  FitnessProfile,
  MembershipInfo
} from '@/components/member-form';

// Import types
import type { MemberFormData } from '@/types';

// Initial form data
const initialFormData: MemberFormData = {
  // Personal Details
  firstName: '',
  lastName: '',
  gender: '',
  dateOfBirth: '',
  profilePhoto: null,
  memberId: `MEM-${Math.floor(10000 + Math.random() * 90000)}`,
  
  // Contact Details
  phone: '',
  alternatePhone: '',
  email: '',
  emergencyContact: {
    name: '',
    phone: '',
    relation: ''
  },
  
  // Address
  address: {
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  },
  
  // Fitness Profile
  height: '',
  weight: '',
  fitnessGoals: [],
  workoutPreferences: [],
  medicalConditions: '',
  dietPreference: '',
  
  // Membership
  membershipType: 'monthly',
  startDate: format(new Date(), 'yyyy-MM-dd'),
  paymentMethod: 'cash',
  amountPaid: '',
  autoRenew: true,
  
  // System fields
  status: 'active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const AddMember = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<MemberFormData>(initialFormData);
  const [activeTab, setActiveTab] = useState('personal');
  const { user } = useAuth();

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    // Handle nested fields (e.g., address.street)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof MemberFormData] as object),
          [child]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Here you would typically make an API call to save the member
      // await apiService.post('/members', formData);
      
      toast({
        title: 'Success',
        description: 'Member added successfully',
      });
      
      // Redirect to members list
      navigate('/dashboard/members');
    } catch (error) {
      console.error('Error adding member:', error);
      toast({
        title: 'Error',
        description: 'Failed to add member. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profilePhoto: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mx-auto px-4 py-6">
      <Tabs 
        value={activeTab} 
        onValueChange={handleTabChange}
        className="space-y-4"
        defaultValue="personal"
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b pb-4">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  {formData.firstName || formData.lastName 
                    ? `${formData.firstName} ${formData.lastName}`.trim() 
                    : 'New Member'}
                </h2>
                {formData.memberId && (
                  <p className="text-sm text-muted-foreground">
                    ID: {formData.memberId}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => navigate('/dashboard/members')}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Cancel
                </Button>
                <Button variant="outline" type="button" onClick={() => window.print()}>
                  Print Profile
                </Button>
                <Button type="submit" disabled={isLoading} className="gap-2">
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save Member
                </Button>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-300"
                style={{ width: '20%' }} // Update this based on form completion
              />
            </div>
            
            {/* Tabs Navigation */}
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
              <TabsTrigger value="fitness">Fitness</TabsTrigger>
              <TabsTrigger value="membership">Membership</TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Tab Contents */}
        <TabsContent value="personal" className="mt-6">
          <PersonalDetails 
            formData={formData} 
            onChange={handleChange} 
            onFileUpload={handleFileUpload}
          />
        </TabsContent>
        
        <TabsContent value="contact" className="mt-6">
          <ContactDetails 
            formData={formData} 
            onChange={handleChange} 
          />
        </TabsContent>
        
        <TabsContent value="address" className="mt-6">
          <AddressDetails 
            formData={formData} 
            onChange={handleChange} 
          />
        </TabsContent>
        
        <TabsContent value="fitness" className="mt-6">
          <FitnessProfile 
            formData={formData} 
            onChange={handleChange} 
          />
        </TabsContent>
        
        <TabsContent value="membership" className="mt-6">
          <MembershipInfo 
            formData={formData} 
            onChange={handleChange} 
          />
        </TabsContent>
      </Tabs>
    </form>
  );
};

export default AddMember;