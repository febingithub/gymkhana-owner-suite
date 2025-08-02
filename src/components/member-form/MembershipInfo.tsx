import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { format, addMonths, addYears } from 'date-fns';
import { Calendar as CalendarIcon, Clock, CreditCard, Wallet, Smartphone, Landmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import type { MemberFormData } from '@/types';

// Membership plans with their durations and prices
const MEMBERSHIP_PLANS = [
  { id: 'daily', name: 'Daily Pass', duration: 1, durationUnit: 'day', price: 300 },
  { id: 'weekly', name: 'Weekly Pass', duration: 1, durationUnit: 'week', price: 1000 },
  { id: 'monthly', name: 'Monthly', duration: 1, durationUnit: 'month', price: 3000 },
  { id: 'quarterly', name: 'Quarterly', duration: 3, durationUnit: 'months', price: 8000 },
  { id: 'semi-annual', name: '6 Months', duration: 6, durationUnit: 'months', price: 15000 },
  { id: 'annual', name: 'Annual', duration: 12, durationUnit: 'months', price: 28000 },
  { id: 'student', name: 'Student (Annual)', duration: 12, durationUnit: 'months', price: 20000, badge: 'Student ID Required' },
  { id: 'couple', name: 'Couple (Monthly)', duration: 1, durationUnit: 'month', price: 5000, badge: 'For Couples' },
  { id: 'family', name: 'Family (Monthly)', duration: 1, durationUnit: 'month', price: 7000, badge: 'Up to 4 members' },
];

// Payment methods
const PAYMENT_METHODS = [
  { id: 'cash', name: 'Cash', icon: <Wallet className="h-4 w-4" /> },
  { id: 'card', name: 'Credit/Debit Card', icon: <CreditCard className="h-4 w-4" /> },
  { id: 'upi', name: 'UPI', icon: <Smartphone className="h-4 w-4" /> },
  { id: 'netbanking', name: 'Net Banking', icon: <Landmark className="h-4 w-4" /> },
  { id: 'wallet', name: 'Wallet', icon: <Wallet className="h-4 w-4" /> },
];

interface MembershipInfoProps {
  formData: MemberFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export default function MembershipInfo({ formData, onChange }: MembershipInfoProps) {
  // Calculate end date based on membership type
  const calculateEndDate = (startDate: string, membershipType: string) => {
    if (!startDate) return '';
    
    const start = new Date(startDate);
    let endDate;
    
    switch (membershipType) {
      case 'daily':
        endDate = new Date(start);
        endDate.setDate(start.getDate() + 1);
        break;
      case 'weekly':
        endDate = new Date(start);
        endDate.setDate(start.getDate() + 7);
        break;
      case 'monthly':
        endDate = addMonths(start, 1);
        break;
      case 'quarterly':
        endDate = addMonths(start, 3);
        break;
      case 'semi-annual':
        endDate = addMonths(start, 6);
        break;
      case 'annual':
      case 'student':
        endDate = addYears(start, 1);
        break;
      case 'couple':
      case 'family':
        endDate = addMonths(start, 1);
        break;
      default:
        return '';
    }
    
    return format(endDate, 'PPP');
  };

  // Handle membership type change
  const handleMembershipChange = (value: string) => {
    const selectedPlan = MEMBERSHIP_PLANS.find(plan => plan.id === value);
    if (selectedPlan) {
      // Update the amount paid when membership type changes
      const event = { 
        target: { 
          name: 'amountPaid', 
          value: selectedPlan.price.toString() 
        } 
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
      
      // Also update the membership type
      const membershipEvent = { 
        target: { 
          name: 'membershipType', 
          value: selectedPlan.id 
        } 
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(membershipEvent);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Membership Information</CardTitle>
        <p className="text-sm text-muted-foreground">Membership plan and payment details</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="membershipType">Membership Plan *</Label>
            <Select
              name="membershipType"
              value={formData.membershipType}
              onValueChange={handleMembershipChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a membership plan" />
              </SelectTrigger>
              <SelectContent>
                {MEMBERSHIP_PLANS.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    <div className="flex justify-between items-center w-full">
                      <span>{plan.name}</span>
                      <span className="text-muted-foreground ml-2">
                        ₹{plan.price.toLocaleString()}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Membership Start Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.startDate ? (
                    format(new Date(formData.startDate), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.startDate ? new Date(formData.startDate) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      const event = { 
                        target: { 
                          name: 'startDate', 
                          value: date.toISOString().split('T')[0] 
                        } 
                      } as React.ChangeEvent<HTMLInputElement>;
                      onChange(event);
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label>Membership End Date</Label>
            <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                {formData.startDate && formData.membershipType ? (
                  <span>{calculateEndDate(formData.startDate, formData.membershipType)}</span>
                ) : (
                  <span className="text-muted-foreground">Select plan and start date</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method *</Label>
            <Select
              name="paymentMethod"
              value={formData.paymentMethod}
              onValueChange={(value) => {
                const event = { target: { name: 'paymentMethod', value } } as React.ChangeEvent<HTMLSelectElement>;
                onChange(event);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((method) => (
                  <SelectItem key={method.id} value={method.id}>
                    <div className="flex items-center">
                      <span className="mr-2">{method.icon}</span>
                      {method.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amountPaid">Amount Paid (₹) *</Label>
            <Input
              id="amountPaid"
              name="amountPaid"
              type="number"
              value={formData.amountPaid}
              onChange={onChange}
              placeholder="Enter amount"
              min="0"
              step="0.01"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="autoRenew">Auto-Renew Membership</Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="autoRenew"
                checked={formData.autoRenew}
                onCheckedChange={(checked) => {
                  const event = { target: { name: 'autoRenew', checked } } as unknown as React.ChangeEvent<HTMLInputElement>;
                  onChange(event);
                }}
              />
              <span className="text-sm font-medium">
                {formData.autoRenew ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Automatically renew membership before it expires
            </p>
          </div>
        </div>
        
        <div className="border-t pt-6 mt-6">
          <h3 className="text-lg font-medium mb-4">Membership Summary</h3>
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Plan</p>
                <p className="font-medium">
                  {MEMBERSHIP_PLANS.find(p => p.id === formData.membershipType)?.name || 'Not selected'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p className="font-medium">
                  {formData.startDate ? format(new Date(formData.startDate), 'PPP') : 'Not set'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">End Date</p>
                <p className="font-medium">
                  {formData.startDate && formData.membershipType 
                    ? calculateEndDate(formData.startDate, formData.membershipType)
                    : 'Not available'}
                </p>
              </div>
              <div className="md:col-span-3 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-xl font-bold">
                    ₹{formData.amountPaid ? parseFloat(formData.amountPaid).toLocaleString('en-IN', { maximumFractionDigits: 2 }) : '0.00'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
