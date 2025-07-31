import React, { useState } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Dumbbell, Building2, User, Phone, KeyRound } from 'lucide-react';

type LoginType = 'owner' | 'member';

const Login = () => {
  const { user, sendOTP, verifyOTP, isLoading } = useAuth();
  const { toast } = useToast();
  const [loginType, setLoginType] = useState<LoginType>('owner');
  
  // Owner login state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Member login state
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  
  const location = useLocation();

  // Redirect based on user type
  if (user) {
    const from = location.state?.from?.pathname || 
      (user.role === 'OWNER' ? '/dashboard' : '/member-dashboard');
    return <Navigate to={from} replace />;
  }

  const handleOwnerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    // For owner login, use phone number in a special format to distinguish from members
    const ownerPhone = `+owner${username}`;
    
    try {
      // Send OTP for owner
      const otpSent = await sendOTP(ownerPhone, 'LOGIN');
      if (otpSent) {
        setOtpSent(true);
        setPhone(ownerPhone);
        // Keep in owner tab, don't switch to member tab
        toast({
          title: 'OTP Sent',
          description: 'Please check your phone for the verification code. Use 123456 for demo.',
        });
      } else {
        toast({
          title: 'Login Failed',
          description: 'Failed to send OTP',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: 'Invalid credentials. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || phone.length < 10) {
      toast({
        title: 'Error',
        description: 'Please enter a valid phone number',
        variant: 'destructive',
      });
      return;
    }

    const success = await sendOTP(phone);
    
    if (success) {
      setOtpSent(true);
      toast({
        title: 'OTP Sent',
        description: 'Please check your phone for the verification code. Use 123456 for demo.',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to send OTP. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleVerifyOwnerOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast({
        title: 'Error',
        description: 'Please enter a valid 6-digit OTP',
        variant: 'destructive',
      });
      return;
    }

    const success = await verifyOTP(phone, otp);
    
    if (success) {
      toast({
        title: 'Welcome!',
        description: 'Successfully logged in to your owner account',
      });
    } else {
      toast({
        title: 'Login Failed',
        description: 'Invalid OTP. Please try again. Use 123456 for demo.',
        variant: 'destructive',
      });
    }
  };

  const handleMemberLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast({
        title: 'Error',
        description: 'Please enter a valid 6-digit OTP',
        variant: 'destructive',
      });
      return;
    }

    const success = await verifyOTP(phone, otp);
    
    if (success) {
      toast({
        title: 'Welcome!',
        description: 'Successfully logged in to your member account',
      });
    } else {
      toast({
        title: 'Login Failed',
        description: 'Invalid OTP. Please try again. Use 123456 for demo.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <Dumbbell className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Gymkhana</h1>
          <p className="text-muted-foreground mt-2">Professional Gym Management Platform</p>
        </div>

        <Card className="shadow-lg">
          <Tabs value={loginType} onValueChange={(value) => setLoginType(value as LoginType)}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="owner" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Gym Owner
              </TabsTrigger>
              <TabsTrigger value="member" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Member
              </TabsTrigger>
            </TabsList>

            <TabsContent value="owner">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-semibold text-center">Owner Sign In</CardTitle>
                <CardDescription className="text-center">
                  Access your gym management dashboard
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {(!otpSent || (loginType === 'owner' && !otpSent)) ? (
                  <form onSubmit={handleOwnerLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={isLoading}
                        className="h-11"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        className="h-11"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-11 mt-6" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOwnerOTP} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="owner-phone-display">Account</Label>
                      <Input
                        id="owner-phone-display"
                        type="text"
                        value={username}
                        disabled
                        className="h-11 bg-muted"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="owner-otp">Verification Code</Label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="owner-otp"
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          disabled={isLoading}
                          maxLength={6}
                          className="h-11 pl-10"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setOtpSent(false);
                          setOtp('');
                        }}
                        disabled={isLoading}
                        className="flex-1"
                      >
                        Back to Login
                      </Button>
                      <Button 
                        type="submit" 
                        className="flex-1 h-11" 
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          'Verify & Login'
                        )}
                      </Button>
                    </div>
                  </form>
                )}

                <div className="mt-6 pt-6 border-t text-center">
                  <p className="text-sm text-muted-foreground">
                    {(!otpSent || (loginType === 'owner' && !otpSent))
                      ? 'Demo: Use any username and password to login'
                      : 'Demo: Use OTP code 123456 to login'
                    }
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-primary hover:underline">
                      Sign up here
                    </Link>
                  </p>
                </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="member">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-semibold text-center">Member Sign In</CardTitle>
                <CardDescription className="text-center">
                  Access your membership and gym information
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {!otpSent ? (
                  <form onSubmit={handleSendOTP} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          disabled={isLoading}
                          className="h-11 pl-10"
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
                          Sending OTP...
                        </>
                      ) : (
                        <>
                          <Phone className="mr-2 h-4 w-4" />
                          Send OTP
                        </>
                      )}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleMemberLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone-display">Phone Number</Label>
                      <Input
                        id="phone-display"
                        type="tel"
                        value={phone}
                        disabled
                        className="h-11 bg-muted"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="otp">Verification Code</Label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="otp"
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          disabled={isLoading}
                          maxLength={6}
                          className="h-11 pl-10"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setOtpSent(false);
                          setOtp('');
                        }}
                        disabled={isLoading}
                        className="flex-1"
                      >
                        Change Number
                      </Button>
                      <Button 
                        type="submit" 
                        className="flex-1 h-11" 
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          'Verify & Login'
                        )}
                      </Button>
                    </div>
                  </form>
                )}

                <div className="mt-6 pt-6 border-t text-center">
                  <p className="text-sm text-muted-foreground">
                    {!otpSent 
                      ? 'Demo: Use any phone number to receive OTP'
                      : 'Demo: Use OTP code 123456 to login'
                    }
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-primary hover:underline">
                      Sign up here
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

export default Login;