import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Calendar, CreditCard, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface Gym {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  fees: {
    monthlyFee: number;
    quarterlyFee: number;
    yearlyFee: number;
  };
}

interface Membership {
  id: number;
  totalAmount: number;
  durationMonths: number;
  startDate: string;
  status: string;
  createdAt: string;
  approvalStatus: {
    totalGyms: number;
    approvedGyms: number;
    pendingGyms: number;
    rejectedGyms: number;
  };
  gyms: Array<{
    gymId: number;
    gymName: string;
    individualFee: number;
    status: string;
  }>;
}

const MembershipManagement = () => {
  const [availableGyms, setAvailableGyms] = useState<Gym[]>([]);
  const [myMemberships, setMyMemberships] = useState<Membership[]>([]);
  const [selectedGyms, setSelectedGyms] = useState<number[]>([]);
  const [duration, setDuration] = useState<number>(12);
  const [startDate, setStartDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [gymsResponse, membershipsResponse] = await Promise.all([
        apiService.getAvailableGyms(),
        apiService.getMyMemberships()
      ]);

      if (gymsResponse.success) {
        setAvailableGyms(gymsResponse.data || []);
      }

      if (membershipsResponse.success) {
        setMyMemberships(membershipsResponse.data || []);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive"
      });
    }
  };

  const handleGymSelection = (gymId: number, checked: boolean) => {
    setSelectedGyms(prev => 
      checked 
        ? [...prev, gymId]
        : prev.filter(id => id !== gymId)
    );
  };

  const calculateTotalAmount = () => {
    const selectedGymObjects = availableGyms.filter(gym => selectedGyms.includes(gym.id));
    const feeKey = duration === 12 ? 'yearlyFee' : duration === 3 ? 'quarterlyFee' : 'monthlyFee';
    return selectedGymObjects.reduce((total, gym) => total + gym.fees[feeKey], 0);
  };

  const handleCreateMembership = async () => {
    if (selectedGyms.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one gym",
        variant: "destructive"
      });
      return;
    }

    if (!startDate) {
      toast({
        title: "Error",
        description: "Please select a start date",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiService.createMembership({
        selectedGymIds: selectedGyms,
        durationMonths: duration,
        startDate
      });

      if (response.success) {
        toast({
          title: "Success",
          description: "Membership created successfully! Waiting for gym approvals.",
        });
        
        // Reset form and reload data
        setSelectedGyms([]);
        setStartDate('');
        loadData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create membership",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-green-100 text-green-800 border-green-300"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-800 border-red-300"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Membership Management</h1>
        <p className="text-muted-foreground">Create new memberships and manage existing ones</p>
      </div>

      {/* Create New Membership */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Create New Membership
          </CardTitle>
          <CardDescription>
            Select gyms and create a multi-gym membership
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Membership Duration</Label>
              <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Month</SelectItem>
                  <SelectItem value="3">3 Months</SelectItem>
                  <SelectItem value="12">12 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div>
            <Label>Select Gyms</Label>
            <div className="grid grid-cols-1 gap-4 mt-2">
              {availableGyms.map((gym) => (
                <div key={gym.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                  <Checkbox
                    id={`gym-${gym.id}`}
                    checked={selectedGyms.includes(gym.id)}
                    onCheckedChange={(checked) => handleGymSelection(gym.id, checked as boolean)}
                  />
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{gym.name}</h3>
                        <p className="text-sm text-muted-foreground">{gym.address}</p>
                        <p className="text-xs text-muted-foreground mt-1">{gym.description}</p>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-medium">
                          ₹{gym.fees[duration === 12 ? 'yearlyFee' : duration === 3 ? 'quarterlyFee' : 'monthlyFee'].toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {duration === 12 ? 'Yearly' : duration === 3 ? 'Quarterly' : 'Monthly'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedGyms.length > 0 && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Total Amount</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedGyms.length} gym{selectedGyms.length > 1 ? 's' : ''} • {duration} month{duration > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">₹{calculateTotalAmount().toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          <Button 
            onClick={handleCreateMembership} 
            disabled={isLoading || selectedGyms.length === 0 || !startDate}
            className="w-full"
          >
            {isLoading ? 'Creating...' : 'Create Membership'}
          </Button>
        </CardContent>
      </Card>

      {/* My Memberships */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            My Memberships
          </CardTitle>
          <CardDescription>
            Track your existing memberships and their approval status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {myMemberships.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No memberships found</p>
              <p className="text-sm">Create your first membership above</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myMemberships.map((membership) => (
                <div key={membership.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-medium">Membership #{membership.id}</h3>
                      <p className="text-sm text-muted-foreground">
                        Created on {new Date(membership.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Start Date: {new Date(membership.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-medium">₹{membership.totalAmount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{membership.durationMonths} months</p>
                      <Badge variant={membership.status === 'ACTIVE' ? 'default' : 'secondary'}>
                        {membership.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-center">
                    <div className="bg-green-50 dark:bg-green-950/20 p-2 rounded">
                      <p className="text-lg font-bold text-green-600">{membership.approvalStatus.approvedGyms}</p>
                      <p className="text-xs text-muted-foreground">Approved</p>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-950/20 p-2 rounded">
                      <p className="text-lg font-bold text-yellow-600">{membership.approvalStatus.pendingGyms}</p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                    <div className="bg-red-50 dark:bg-red-950/20 p-2 rounded">
                      <p className="text-lg font-bold text-red-600">{membership.approvalStatus.rejectedGyms}</p>
                      <p className="text-xs text-muted-foreground">Rejected</p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-2 rounded">
                      <p className="text-lg font-bold text-blue-600">{membership.approvalStatus.totalGyms}</p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Gym Status</Label>
                    {membership.gyms.map((gym) => (
                      <div key={gym.gymId} className="flex justify-between items-center p-2 bg-muted/30 rounded">
                        <div>
                          <p className="font-medium text-sm">{gym.gymName}</p>
                          <p className="text-xs text-muted-foreground">₹{gym.individualFee.toLocaleString()}</p>
                        </div>
                        {getStatusBadge(gym.status)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MembershipManagement;