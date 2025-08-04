import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';
import type { MemberFormData } from '@/types';

// List of Indian states
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
].sort();

interface AddressDetailsProps {
  formData: MemberFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export default function AddressDetails({ formData, onChange }: AddressDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Address Details</CardTitle>
        <p className="text-sm text-muted-foreground">Permanent residential address</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="address.street">Street Address *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="address.street"
                  name="address.street"
                  value={formData.address.street}
                  onChange={onChange}
                  placeholder="House No., Building, Street, Area"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address.city">City / Town *</Label>
              <Input
                id="address.city"
                name="address.city"
                value={formData.address.city}
                onChange={onChange}
                placeholder="City or town name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address.state">State *</Label>
              <Select
                name="address.state"
                value={formData.address.state}
                onValueChange={(value) => {
                  const event = { target: { name: 'address.state', value } } as React.ChangeEvent<HTMLSelectElement>;
                  onChange(event);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {INDIAN_STATES.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address.pincode">PIN Code *</Label>
              <Input
                id="address.pincode"
                name="address.pincode"
                value={formData.address.pincode}
                onChange={onChange}
                placeholder="6-digit PIN code"
                pattern="[0-9]{6}"
                maxLength={6}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address.country">Country</Label>
              <Input
                id="address.country"
                name="address.country"
                value={formData.address.country}
                onChange={onChange}
                disabled
                className="bg-muted/50"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="sameAsPermanent"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="sameAsPermanent" className="text-sm font-medium">
              This is also my communication address
            </label>
          </div>
        </div>
        
        {/* Communication Address (Conditional) */}
        <div className="border-t pt-6 mt-6">
          <h3 className="text-lg font-medium mb-6">Communication Address</h3>
          <p className="text-sm text-muted-foreground mb-6">
            If different from permanent address
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="commAddress.street">Street Address</Label>
              <Input
                id="commAddress.street"
                name="commAddress.street"
                placeholder="House No., Building, Street, Area"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="commAddress.city">City / Town</Label>
              <Input
                id="commAddress.city"
                name="commAddress.city"
                placeholder="City or town name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="commAddress.state">State</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {INDIAN_STATES.map((state) => (
                    <SelectItem key={`comm-${state}`} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="commAddress.pincode">PIN Code</Label>
              <Input
                id="commAddress.pincode"
                name="commAddress.pincode"
                placeholder="6-digit PIN code"
                pattern="[0-9]{6}"
                maxLength={6}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
