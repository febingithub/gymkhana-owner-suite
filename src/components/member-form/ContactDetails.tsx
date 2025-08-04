import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone, Mail, User as UserIcon } from 'lucide-react';
import type { MemberFormData } from '@/types';

interface ContactDetailsProps {
  formData: MemberFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export default function ContactDetails({ formData, onChange }: ContactDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Details</CardTitle>
        <p className="text-sm text-muted-foreground">Primary contact information</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={onChange}
                placeholder="john.doe@example.com"
                className="pl-10"
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
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={onChange}
                placeholder="+91 98765 43210"
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="alternatePhone">Alternate Phone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="alternatePhone"
                name="alternatePhone"
                type="tel"
                value={formData.alternatePhone}
                onChange={onChange}
                placeholder="+91 98765 43210"
                className="pl-10"
              />
            </div>
          </div>
        </div>
        
        <div className="border-t pt-6 mt-6">
          <h3 className="text-lg font-medium mb-6">Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="emergencyContact.name">Name *</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="emergencyContact.name"
                  name="emergencyContact.name"
                  value={formData.emergencyContact.name}
                  onChange={onChange}
                  placeholder="Emergency contact name"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emergencyContact.phone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="emergencyContact.phone"
                  name="emergencyContact.phone"
                  type="tel"
                  value={formData.emergencyContact.phone}
                  onChange={onChange}
                  placeholder="+91 98765 43210"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emergencyContact.relation">Relation *</Label>
              <Input
                id="emergencyContact.relation"
                name="emergencyContact.relation"
                value={formData.emergencyContact.relation}
                onChange={onChange}
                placeholder="e.g., Spouse, Parent, Sibling"
                required
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
