import React, { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Dumbbell, User, Phone, KeyRound, ArrowLeft, RotateCcw } from 'lucide-react';
import { apiService } from '@/services/api';

interface SignupData {
  name: string;
  phone: string;
}

const OTPSignup = () => {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  
  // Step 1 state
  const [signupData, setSignupData] = useState<SignupData>({
    name: '',
    phone: ''
  });
  
  // Step 2 state
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend cooldown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Auto-focus first OTP input when step changes
  useEffect(() => {
    if (step === 2 && otpRefs.current[0]) {
      otpRefs.current[0]?.focus();
    }
  }, [step]);

  // Redirect if already logged in
  if (user) {
    const redirectTo = user.role === 'OWNER' ? '/dashboard' : '/member-dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!signupData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your full name',
        variant: 'destructive',
      });
      return;
    }

    if (!validatePhone(signupData.phone)) {
      toast({
        title: 'Error',
        description: 'Please enter a valid 10-digit phone number',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await apiService.sendSignupOTP({
        name: signupData.name,
        phone: signupData.phone
      });
      
      toast({
        title: 'OTP Sent!',
        description: 'Please check your phone for the verification code. Use 123456 for demo.',
      });
      
      setStep(2);
      setResendCooldown(30); // 30 seconds cooldown
      
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send OTP. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent pasting multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace to move to previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOTPPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    
    if (pastedData.length === 4 || pastedData.length === 6) {
      const newOtp = [...otp];
      for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
        newOtp[i] = pastedData[i] || '';
      }
      setOtp(newOtp);
      
      // Focus the last filled input or next empty input
      const nextIndex = Math.min(pastedData.length, 5);
      otpRefs.current[nextIndex]?.focus();
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpValue = otp.join('');
    
    if (otpValue.length < 4) {
      toast({
        title: 'Error',
        description: 'Please enter a complete OTP',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await apiService.verifySignupOTP({
        phone: signupData.phone,
        otp: otpValue
      });
      
      if (response.success && response.data?.user) {
        setUser(response.data.user);
        toast({
          title: 'Welcome!',
          description: 'Your account has been created successfully',
        });
      }
      
    } catch (error: any) {
      toast({
        title: 'Verification Failed',
        description: error.message || 'Invalid OTP. Please try again. Use 123456 for demo.',
        variant: 'destructive',
      });
      
      // Clear OTP and focus first input
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    
    setIsLoading(true);
    
    try {
      await apiService.sendSignupOTP({
        name: signupData.name,
        phone: signupData.phone
      });
      
      toast({
        title: 'OTP Resent!',
        description: 'A new verification code has been sent to your phone.',
      });
      
      setResendCooldown(30);
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
      
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to resend OTP. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToStep1 = () => {
    setStep(1);
    setOtp(['', '', '', '', '', '']);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <Dumbbell className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Join Gymkhana</h1>
          <p className="text-muted-foreground mt-2">
            {step === 1 ? 'Create your account to get started' : 'Verify your phone number'}
          </p>
        </div>

        <Card className="shadow-lg">
          {step === 1 ? (
            <>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-semibold text-center">Sign Up</CardTitle>
                <CardDescription className="text-center">
                  Enter your details to create an account
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={signupData.name}
                        onChange={(e) => setSignupData(prev => ({ ...prev, name: e.target.value }))}
                        disabled={isLoading}
                        className="h-11 pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter 10-digit phone number"
                        value={signupData.phone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 10) {
                            setSignupData(prev => ({ ...prev, phone: value }));
                          }
                        }}
                        disabled={isLoading}
                        className="h-11 pl-10"
                        maxLength={10}
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      We'll send you a verification code
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-11 mt-6" 
                    disabled={isLoading || !signupData.name.trim() || !validatePhone(signupData.phone)}
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

                <div className="mt-6 pt-6 border-t text-center">
                  <p className="text-sm text-muted-foreground">
                    Demo: Use any 10-digit number except 1234567890
                  </p>
                </div>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-semibold text-center">Verify OTP</CardTitle>
                <CardDescription className="text-center">
                  Enter the verification code sent to {signupData.phone}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Verification Code</Label>
                    <div className="flex justify-center gap-2">
                      {otp.map((digit, index) => (
                        <Input
                          key={index}
                          ref={(el) => (otpRefs.current[index] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOTPChange(index, e.target.value.replace(/\D/g, ''))}
                          onKeyDown={(e) => handleOTPKeyDown(index, e)}
                          onPaste={index === 0 ? handleOTPPaste : undefined}
                          disabled={isLoading}
                          className="w-12 h-12 text-center text-lg font-bold"
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Enter the 4 or 6-digit code from your phone
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBackToStep1}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 h-11" 
                      disabled={isLoading || otp.join('').length < 4}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <KeyRound className="mr-2 h-4 w-4" />
                          Verify & Sign Up
                        </>
                      )}
                    </Button>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleResendOTP}
                    disabled={isLoading || resendCooldown > 0}
                    className="w-full"
                  >
                    {resendCooldown > 0 ? (
                      `Resend OTP in ${resendCooldown}s`
                    ) : (
                      <>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Resend OTP
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t text-center">
                  <p className="text-sm text-muted-foreground">
                    Demo: Use OTP code 123456 or 1234 to complete signup
                  </p>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default OTPSignup;