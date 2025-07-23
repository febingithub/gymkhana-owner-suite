import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Building2, Clock, MapPin, Phone, Mail, Camera, Save } from 'lucide-react';

const GymProfile = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock gym data
  const [gymData, setGymData] = useState({
    name: 'PowerHouse Fitness',
    address: '123 Fitness Street, Gym City, GC 12345',
    phone: '+1 (555) 123-4567',
    email: 'contact@powerhousefitness.com',
    description: 'A modern fitness facility with state-of-the-art equipment and expert trainers.',
    amenities: {
      parking: true,
      locker_rooms: true,
      personal_training: true,
      group_classes: true,
      sauna: false,
      pool: false,
      juice_bar: true,
      wifi: true,
      air_conditioning: true,
      showers: true
    },
    shifts: {
      monday: { open: '06:00', close: '22:00', closed: false },
      tuesday: { open: '06:00', close: '22:00', closed: false },
      wednesday: { open: '06:00', close: '22:00', closed: false },
      thursday: { open: '06:00', close: '22:00', closed: false },
      friday: { open: '06:00', close: '22:00', closed: false },
      saturday: { open: '08:00', close: '20:00', closed: false },
      sunday: { open: '08:00', close: '18:00', closed: false }
    }
  });

  const amenityOptions = [
    { key: 'parking', label: 'Free Parking' },
    { key: 'locker_rooms', label: 'Locker Rooms' },
    { key: 'personal_training', label: 'Personal Training' },
    { key: 'group_classes', label: 'Group Classes' },
    { key: 'sauna', label: 'Sauna' },
    { key: 'pool', label: 'Swimming Pool' },
    { key: 'juice_bar', label: 'Juice Bar' },
    { key: 'wifi', label: 'Free WiFi' },
    { key: 'air_conditioning', label: 'Air Conditioning' },
    { key: 'showers', label: 'Showers' }
  ];

  const dayNames = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
  };

  const handleInputChange = (field: string, value: string) => {
    setGymData(prev => ({ ...prev, [field]: value }));
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setGymData(prev => ({
      ...prev,
      amenities: { ...prev.amenities, [amenity]: checked }
    }));
  };

  const handleShiftChange = (day: string, field: string, value: string | boolean) => {
    setGymData(prev => ({
      ...prev,
      shifts: {
        ...prev.shifts,
        [day]: { ...prev.shifts[day as keyof typeof prev.shifts], [field]: value }
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsLoading(false);
    toast({
      title: 'Profile Updated',
      description: 'Your gym profile has been successfully updated.',
    });
  };

  const handleImageUpload = () => {
    // Mock image upload
    toast({
      title: 'Image Upload',
      description: 'Image upload feature coming soon!',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Building2 className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Gym Profile</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Update your gym's basic details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Gym Name</Label>
                <Input
                  id="name"
                  value={gymData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter gym name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={gymData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={gymData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={gymData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter full address"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={gymData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your gym"
                rows={3}
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Gym Images</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">Upload gym photos</p>
                <Button type="button" variant="outline" onClick={handleImageUpload}>
                  Choose Files
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card>
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
            <CardDescription>
              Select the amenities and facilities available at your gym
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {amenityOptions.map(({ key, label }) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={gymData.amenities[key as keyof typeof gymData.amenities]}
                    onCheckedChange={(checked) => handleAmenityChange(key, checked as boolean)}
                  />
                  <Label htmlFor={key} className="text-sm font-normal">
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Operating Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Operating Hours
            </CardTitle>
            <CardDescription>
              Set your gym's opening and closing times for each day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(dayNames).map(([day, label]) => {
                const shift = gymData.shifts[day as keyof typeof gymData.shifts];
                return (
                  <div key={day} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="w-20">
                      <Badge variant="outline">{label}</Badge>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`${day}-closed`}
                        checked={shift.closed}
                        onCheckedChange={(checked) => handleShiftChange(day, 'closed', checked as boolean)}
                      />
                      <Label htmlFor={`${day}-closed`} className="text-sm">
                        Closed
                      </Label>
                    </div>

                    {!shift.closed && (
                      <>
                        <div className="flex items-center gap-2">
                          <Label className="text-sm">Open:</Label>
                          <Input
                            type="time"
                            value={shift.open}
                            onChange={(e) => handleShiftChange(day, 'open', e.target.value)}
                            className="w-32"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-sm">Close:</Label>
                          <Input
                            type="time"
                            value={shift.close}
                            onChange={(e) => handleShiftChange(day, 'close', e.target.value)}
                            className="w-32"
                          />
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? (
              <>
                <Save className="mr-2 h-4 w-4 animate-pulse" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GymProfile;