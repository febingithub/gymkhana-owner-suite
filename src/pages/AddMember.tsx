import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Mail, Phone, UserPlus } from 'lucide-react';
import { apiService } from '@/services/api';

interface MemberData {
  name: string;
  email: string;
  phone: string;
}

const AddMember = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [memberData, setMemberData] = useState<MemberData>({
    name: '',
    email: '',
    phone: ''
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!memberData.name || !memberData.email || !memberData.phone) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (!validateEmail(memberData.email)) {
      toast({
        title: 'Error',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }

    if (!validatePhone(memberData.phone)) {
      toast({
        title: 'Error',
        description: 'Please enter a valid phone number',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await apiService.signupMember({
        phone: memberData.phone,
        email: memberData.email,
        name: memberData.name
      });
      
      toast({
        title: 'Success!',
        description: 'Member has been added successfully. They will receive login credentials.',
      });
      
      // Reset form
      setMemberData({
        name: '',
        email: '',
        phone: ''
      });
      
    } catch (error: any) {
      toast({
        title: 'Failed to Add Member',
        description: error.message || 'Failed to add member. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Add New Member</h1>
        <p className="text-muted-foreground">
          Add a new member to your gym and manage their access
        </p>
      </div>

      <div className="max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Member Details
            </CardTitle>
            <CardDescription>
              Enter the new member's information below
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="member-name">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="member-name"
                    type="text"
                    placeholder="Enter member's full name"
                    value={memberData.name}
                    onChange={(e) => setMemberData(prev => ({ ...prev, name: e.target.value }))}
                    disabled={isLoading}
                    className="h-11 pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="member-email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="member-email"
                    type="email"
                    placeholder="Enter member's email"
                    value={memberData.email}
                    onChange={(e) => setMemberData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={isLoading}
                    className="h-11 pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="member-phone">Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="member-phone"
                    type="tel"
                    placeholder="Enter member's phone number"
                    value={memberData.phone}
                    onChange={(e) => setMemberData(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={isLoading}
                    className="h-11 pl-10"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 mt-6" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Member...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Member
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddMember;