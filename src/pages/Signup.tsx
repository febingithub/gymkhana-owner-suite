import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Dumbbell, Building2, User, Mail, Phone, KeyRound, MapPin, Building } from 'lucide-react';
import { apiService } from '@/services/api';

type SignupType = 'member' | 'admin';

interface MemberSignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  gymCode?: string;
}

interface AdminSignupData {
  name: string;
  email: string;
  phone: string;
  gymName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  password: string;
  confirmPassword: string;
}

const Signup = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [signupType, setSignupType] = useState<SignupType>('member');
  const [isLoading, setIsLoading] = useState(false);
  
  // Member signup state
  const [memberData, setMemberData] = useState<MemberSignupData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gymCode: ''
  });
  
  // Admin signup state
  const [adminData, setAdminData] = useState<AdminSignupData>({
    name: '',
    email: '',
    phone: '',
    gymName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    password: '',
    confirmPassword: ''
  });

  // Redirect if already logged in
  if (user) {
    const redirectTo = user.role === 'OWNER' ? '/dashboard' : '/member-dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleMemberSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!memberData.name || !memberData.email || !memberData.phone || !memberData.password) {
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

    if (!validatePassword(memberData.password)) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters long',
        variant: 'destructive',
      });
      return;
    }

    if (memberData.password !== memberData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
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
        description: 'Member account created successfully. Please login to continue.',
      });
      
      // Reset form
      setMemberData({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        gymCode: ''
      });
      
    } catch (error: any) {
      toast({
        title: 'Signup Failed',
        description: error.message || 'Failed to create account. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!adminData.name || !adminData.email || !adminData.phone || !adminData.gymName || 
        !adminData.address || !adminData.city || !adminData.state || !adminData.pincode || 
        !adminData.password) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (!validateEmail(adminData.email)) {
      toast({
        title: 'Error',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }

    if (!validatePhone(adminData.phone)) {
      toast({
        title: 'Error',
        description: 'Please enter a valid phone number',
        variant: 'destructive',
      });
      return;
    }

    if (!validatePassword(adminData.password)) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters long',
        variant: 'destructive',
      });
      return;
    }

    if (adminData.password !== adminData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await apiService.signupOwner({
        phone: adminData.phone,
        email: adminData.email,
        name: adminData.name
      });
      
      toast({
        title: 'Success!',
        description: 'Admin account created successfully. Please login to continue.',
      });
      
      // Reset form
      setAdminData({
        name: '',
        email: '',
        phone: '',
        gymName: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        password: '',
        confirmPassword: ''
      });
      
    } catch (error: any) {
      toast({
        title: 'Signup Failed',
        description: error.message || 'Failed to create account. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo and branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <Dumbbell className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Join Gymkhana</h1>
          <p className="text-muted-foreground mt-2">Create your account to get started</p>
        </div>

        <Card className="shadow-lg">
          <Tabs value={signupType} onValueChange={(value) => setSignupType(value as SignupType)}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="member" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Gym Member
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Gym Admin
              </TabsTrigger>
            </TabsList>

            <TabsContent value="member">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-semibold text-center">Member Sign Up</CardTitle>
                <CardDescription className="text-center">
                  Join gyms and manage your fitness journey
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleMemberSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="member-name">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="member-name"
                        type="text"
                        placeholder="Enter your full name"
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
                        placeholder="Enter your email"
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
                        placeholder="Enter your phone number"
                        value={memberData.phone}
                        onChange={(e) => setMemberData(prev => ({ ...prev, phone: e.target.value }))}
                        disabled={isLoading}
                        className="h-11 pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="member-gym-code">Gym Code (Optional)</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="member-gym-code"
                        type="text"
                        placeholder="Enter gym code if joining existing gym"
                        value={memberData.gymCode}
                        onChange={(e) => setMemberData(prev => ({ ...prev, gymCode: e.target.value }))}
                        disabled={isLoading}
                        className="h-11 pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="member-password">Password *</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="member-password"
                        type="password"
                        placeholder="Create a password (min 6 chars)"
                        value={memberData.password}
                        onChange={(e) => setMemberData(prev => ({ ...prev, password: e.target.value }))}
                        disabled={isLoading}
                        className="h-11 pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="member-confirm-password">Confirm Password *</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="member-confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        value={memberData.confirmPassword}
                        onChange={(e) => setMemberData(prev => ({ ...prev, confirmPassword: e.target.value }))}
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
                        Creating Account...
                      </>
                    ) : (
                      'Create Member Account'
                    )}
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary hover:underline">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="admin">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-semibold text-center">Admin Sign Up</CardTitle>
                <CardDescription className="text-center">
                  Register your gym and start managing memberships
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleAdminSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-name">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="admin-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={adminData.name}
                        onChange={(e) => setAdminData(prev => ({ ...prev, name: e.target.value }))}
                        disabled={isLoading}
                        className="h-11 pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="admin-email"
                        type="email"
                        placeholder="Enter your email"
                        value={adminData.email}
                        onChange={(e) => setAdminData(prev => ({ ...prev, email: e.target.value }))}
                        disabled={isLoading}
                        className="h-11 pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin-phone">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="admin-phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={adminData.phone}
                        onChange={(e) => setAdminData(prev => ({ ...prev, phone: e.target.value }))}
                        disabled={isLoading}
                        className="h-11 pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gym-name">Gym Name *</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="gym-name"
                        type="text"
                        placeholder="Enter your gym name"
                        value={adminData.gymName}
                        onChange={(e) => setAdminData(prev => ({ ...prev, gymName: e.target.value }))}
                        disabled={isLoading}
                        className="h-11 pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gym-address">Gym Address *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="gym-address"
                        type="text"
                        placeholder="Enter gym address"
                        value={adminData.address}
                        onChange={(e) => setAdminData(prev => ({ ...prev, address: e.target.value }))}
                        disabled={isLoading}
                        className="h-11 pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gym-city">City *</Label>
                      <Input
                        id="gym-city"
                        type="text"
                        placeholder="City"
                        value={adminData.city}
                        onChange={(e) => setAdminData(prev => ({ ...prev, city: e.target.value }))}
                        disabled={isLoading}
                        className="h-11"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gym-state">State *</Label>
                      <Input
                        id="gym-state"
                        type="text"
                        placeholder="State"
                        value={adminData.state}
                        onChange={(e) => setAdminData(prev => ({ ...prev, state: e.target.value }))}
                        disabled={isLoading}
                        className="h-11"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gym-pincode">Pincode *</Label>
                    <Input
                      id="gym-pincode"
                      type="text"
                      placeholder="Enter pincode"
                      value={adminData.pincode}
                      onChange={(e) => setAdminData(prev => ({ ...prev, pincode: e.target.value }))}
                      disabled={isLoading}
                      className="h-11"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password *</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="admin-password"
                        type="password"
                        placeholder="Create a password (min 6 chars)"
                        value={adminData.password}
                        onChange={(e) => setAdminData(prev => ({ ...prev, password: e.target.value }))}
                        disabled={isLoading}
                        className="h-11 pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin-confirm-password">Confirm Password *</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="admin-confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        value={adminData.confirmPassword}
                        onChange={(e) => setAdminData(prev => ({ ...prev, confirmPassword: e.target.value }))}
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
                        Creating Account...
                      </>
                    ) : (
                      'Create Admin Account'
                    )}
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary hover:underline">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Signup;