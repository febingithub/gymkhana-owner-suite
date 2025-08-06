import React, { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Check, X, Mail, Phone, Calendar, User } from 'lucide-react';
import styles from '@/styles/scrollbar.module.css';

interface MemberRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  joinDate: string;
  membershipType: string;
  status: 'pending' | 'approved' | 'rejected';
  avatar?: string;
  notes?: string;
}

const MemberRequests = () => {
  const { toast } = useToast();
  
  // Mock data
  const [requests, setRequests] = useState<MemberRequest[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      age: 28,
      joinDate: '2024-01-15',
      membershipType: 'Premium',
      status: 'pending',
      notes: 'Interested in personal training sessions'
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@email.com',
      phone: '+1 (555) 234-5678',
      age: 32,
      joinDate: '2024-01-14',
      membershipType: 'Basic',
      status: 'pending'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@email.com',
      phone: '+1 (555) 345-6789',
      age: 25,
      joinDate: '2024-01-13',
      membershipType: 'Premium',
      status: 'pending',
      notes: 'Referred by existing member'
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '+1 (555) 456-7890',
      age: 29,
      joinDate: '2024-01-12',
      membershipType: 'Standard',
      status: 'pending'
    },
    {
      id: '5',
      name: 'Alex Thompson',
      email: 'alex.thompson@email.com',
      phone: '+1 (555) 567-8901',
      age: 35,
      joinDate: '2024-01-11',
      membershipType: 'Premium',
      status: 'pending',
      notes: 'Previous gym experience'
    },
    {
      id: '6',
      name: 'Jessica Lee',
      email: 'jessica.lee@email.com',
      phone: '+1 (555) 678-9012',
      age: 27,
      joinDate: '2024-01-10',
      membershipType: 'Standard',
      status: 'pending',
      notes: 'Yoga enthusiast'
    },
    {
      id: '7',
      name: 'Michael Brown',
      email: 'michael.brown@email.com',
      phone: '+1 (555) 789-0123',
      age: 31,
      joinDate: '2024-01-09',
      membershipType: 'Premium',
      status: 'pending',
      notes: 'Weight training focus'
    },
    {
      id: '8',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 890-1234',
      age: 24,
      joinDate: '2024-01-08',
      membershipType: 'Basic',
      status: 'pending',
      notes: 'Student discount requested'
    },
    {
      id: '9',
      name: 'David Kim',
      email: 'david.kim@email.com',
      phone: '+1 (555) 901-2345',
      age: 29,
      joinDate: '2024-01-07',
      membershipType: 'Premium',
      status: 'pending',
      notes: 'Personal training interested'
    },
    {
      id: '10',
      name: 'Olivia Wilson',
      email: 'olivia.wilson@email.com',
      phone: '+1 (555) 012-3456',
      age: 33,
      joinDate: '2024-01-06',
      membershipType: 'Standard',
      status: 'pending',
      notes: 'Early morning workouts'
    }
  ]);

  const handleApprove = async (requestId: string) => {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: 'approved' as const } : req
      )
    );
    
    const request = requests.find(r => r.id === requestId);
    toast({
      title: 'Request Approved',
      description: `${request?.name} has been approved for membership.`,
    });
  };

  const handleReject = async (requestId: string) => {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: 'rejected' as const } : req
      )
    );
    
    const request = requests.find(r => r.id === requestId);
    toast({
      title: 'Request Rejected',
      description: `${request?.name}'s membership request has been rejected.`,
      variant: 'destructive',
    });
  };

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const processedRequests = requests.filter(req => req.status !== 'pending');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-success text-success-foreground">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const getMembershipBadge = (type: string) => {
    const variants = {
      'Premium': 'default',
      'Standard': 'secondary',
      'Basic': 'outline'
    } as const;
    
    return <Badge variant={variants[type as keyof typeof variants] || 'outline'}>{type}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <UserPlus className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Member Requests</h1>
        <Badge variant="secondary" className="ml-auto">
          {pendingRequests.length} Pending
        </Badge>
      </div>

      {/* Pending Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Requests</CardTitle>
          <CardDescription>
            Review and approve new membership applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 ? (
            <div className="text-center py-8">
              <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No pending requests</p>
            </div>
          ) : (
            <div className={`space-y-4 ${pendingRequests.length > 3 ? styles.scrollContainer : ''}`}>
              {pendingRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors mr-1">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={request.avatar} />
                        <AvatarFallback>
                          {request.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="space-y-2">
                        <div>
                          <h3 className="font-semibold text-foreground">{request.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              {request.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {request.phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {request.age} years old
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {getMembershipBadge(request.membershipType)}
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Applied: {new Date(request.joinDate).toLocaleDateString()}
                          </span>
                        </div>
                        
                        {request.notes && (
                          <p className="text-sm text-muted-foreground italic">
                            Note: {request.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(request.id)}
                        className="bg-success hover:bg-success/90 text-success-foreground"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(request.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Processed Requests */}
      {processedRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Decisions</CardTitle>
            <CardDescription>
              Previously processed membership requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {processedRequests.slice(0, 5).map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={request.avatar} />
                      <AvatarFallback>
                        {request.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{request.name}</p>
                      <p className="text-sm text-muted-foreground">{request.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getMembershipBadge(request.membershipType)}
                    {getStatusBadge(request.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MemberRequests;