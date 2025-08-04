import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  UserCheck, 
  Search, 
  Edit, 
  Pause, 
  Star, 
  Mail, 
  Phone, 
  Calendar,
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Types
interface Member {
  id: string;
  memberId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'paused' | 'expired';
  membershipType: string;
  startDate: string;
  endDate: string;
  lastActive: string;
  profilePhoto?: string;
}

interface MemberRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  requestDate: string;
  membershipType: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface Review {
  rating: number;
  comment: string;
}

const Members = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State
  const [members, setMembers] = useState<Member[]>([]);
  const [memberRequests, setMemberRequests] = useState<MemberRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [reviewData, setReviewData] = useState<Review>({ rating: 5, comment: '' });
  const [showAddMember, setShowAddMember] = useState(false);
  const [showRequests, setShowRequests] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Mock members data
        const mockMembers: Member[] = [
          {
            id: '1',
            memberId: 'MEM-10001',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '+91 98765 43210',
            status: 'active',
            membershipType: 'Premium',
            startDate: '2024-01-15',
            endDate: '2024-07-15',
            lastActive: '2024-01-10'
          },
          {
            id: '2',
            memberId: 'MEM-10002',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com',
            phone: '+91 98765 43211',
            status: 'expired',
            membershipType: 'Basic',
            startDate: '2023-12-01',
            endDate: '2024-01-01',
            lastActive: '2023-12-30'
          },
          {
            id: '3',
            memberId: 'MEM-10003',
            firstName: 'Mike',
            lastName: 'Johnson',
            email: 'mike.johnson@example.com',
            phone: '+91 98765 43212',
            status: 'paused',
            membershipType: 'Premium',
            startDate: '2024-01-01',
            endDate: '2024-07-01',
            lastActive: '2024-01-05'
          }
        ];

        // Mock member requests
        const mockRequests: MemberRequest[] = [
          {
            id: '1',
            firstName: 'Alice',
            lastName: 'Brown',
            email: 'alice.brown@example.com',
            phone: '+91 98765 43213',
            requestDate: '2024-01-12',
            membershipType: 'Basic',
            status: 'pending'
          },
          {
            id: '2',
            firstName: 'Bob',
            lastName: 'Wilson',
            email: 'bob.wilson@example.com',
            phone: '+91 98765 43214',
            requestDate: '2024-01-11',
            membershipType: 'Premium',
            status: 'pending'
          }
        ];

        setMembers(mockMembers);
        setMemberRequests(mockRequests);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch members data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Filter members
  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.includes(searchTerm) ||
      member.memberId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Handle member actions
  const handleEditMember = (member: Member) => {
    navigate(`/dashboard/members/${member.id}/edit`);
  };

  const handlePauseMembership = async (memberId: string) => {
    try {
      // API call to pause membership
      setMembers(prev => 
        prev.map(member => 
          member.id === memberId 
            ? { ...member, status: 'paused' as const }
            : member
        )
      );
      
      toast({
        title: 'Success',
        description: 'Membership paused successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to pause membership',
        variant: 'destructive',
      });
    }
  };

  const handleAddReview = async (memberId: string, review: Review) => {
    try {
      // API call to add review
      toast({
        title: 'Success',
        description: 'Review added successfully',
      });
      setSelectedMember(null);
      setReviewData({ rating: 5, comment: '' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add review',
        variant: 'destructive',
      });
    }
  };

  const handleRequestAction = async (requestId: string, action: 'approve' | 'reject') => {
    try {
      setMemberRequests(prev => 
        prev.map(request => 
          request.id === requestId 
            ? { ...request, status: action === 'approve' ? 'approved' : 'rejected' }
            : request
        )
      );
      
      toast({
        title: 'Success',
        description: `Request ${action}d successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${action} request`,
        variant: 'destructive',
      });
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200',
      paused: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      expired: 'bg-red-100 text-red-800 border-red-200'
    };
    
    return (
      <Badge className={cn('border', variants[status as keyof typeof variants] || variants.inactive)}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Get days until expiry
  const getDaysUntilExpiry = (endDate: string) => {
    const today = new Date();
    const expiry = new Date(endDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading members...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Members Management</h1>
          <p className="text-muted-foreground">
            Manage gym members, requests, and memberships
          </p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Dialog open={showRequests} onOpenChange={setShowRequests}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <UserCheck className="h-4 w-4" />
                Member Requests
                {memberRequests.filter(r => r.status === 'pending').length > 0 && (
                  <Badge variant="destructive" className="ml-1">
                    {memberRequests.filter(r => r.status === 'pending').length}
                  </Badge>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Member Requests</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                {memberRequests.filter(r => r.status === 'pending').length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No pending requests
                  </div>
                ) : (
                  <div className="space-y-3">
                    {memberRequests.filter(r => r.status === 'pending').map((request) => (
                      <Card key={request.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <h3 className="font-medium">
                                {request.firstName} {request.lastName}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {request.email}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {request.phone}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {format(new Date(request.requestDate), 'MMM dd, yyyy')}
                                </span>
                              </div>
                              <Badge variant="outline">{request.membershipType}</Badge>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleRequestAction(request.id, 'approve')}
                                className="gap-1"
                              >
                                <CheckCircle className="h-3 w-3" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRequestAction(request.id, 'reject')}
                                className="gap-1"
                              >
                                <XCircle className="h-3 w-3" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            onClick={() => navigate('/dashboard/members/add')}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search members by name, email, phone, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Members ({filteredMembers.length})</span>
            <div className="flex gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Active: {members.filter(m => m.status === 'active').length}
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Expired: {members.filter(m => m.status === 'expired').length}
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                Paused: {members.filter(m => m.status === 'paused').length}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member ID</TableHead>
                  <TableHead>Member Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Membership</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'No members found matching your filters'
                        : 'No members yet'
                      }
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMembers.map((member) => {
                    const daysUntilExpiry = getDaysUntilExpiry(member.endDate);
                    const isExpiringSoon = daysUntilExpiry <= 7 && daysUntilExpiry > 0;
                    const isExpired = daysUntilExpiry <= 0;
                    
                    return (
                      <TableRow 
                        key={member.id}
                        className={cn(
                          member.status === 'expired' && 'bg-red-50',
                          member.status === 'paused' && 'bg-yellow-50',
                          isExpiringSoon && member.status === 'active' && 'bg-orange-50'
                        )}
                      >
                        <TableCell className="font-medium">{member.memberId}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {member.firstName} {member.lastName}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {member.email}
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {member.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{member.membershipType}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(member.status)}</TableCell>
                        <TableCell>
                          {format(new Date(member.lastActive), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">
                              {format(new Date(member.endDate), 'MMM dd, yyyy')}
                            </div>
                            {isExpired ? (
                              <Badge variant="destructive" className="text-xs">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Expired
                              </Badge>
                            ) : isExpiringSoon ? (
                              <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                                <Clock className="h-3 w-3 mr-1" />
                                {daysUntilExpiry} days left
                              </Badge>
                            ) : (
                              <div className="text-xs text-muted-foreground">
                                {daysUntilExpiry} days left
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditMember(member)}
                              title="Edit Member"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            
                            {member.status === 'active' && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    title="Pause Subscription"
                                  >
                                    <Pause className="h-3 w-3" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Pause Membership</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to pause {member.firstName} {member.lastName}'s membership? This action can be reversed later.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handlePauseMembership(member.id)}
                                    >
                                      Pause Membership
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                            
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setSelectedMember(member)}
                                  title="Add Review"
                                >
                                  <Star className="h-3 w-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    Add Review for {member.firstName} {member.lastName}
                                  </DialogTitle>
                                </DialogHeader>
                                
                                <div className="space-y-4">
                                  <div>
                                    <label className="text-sm font-medium">Rating</label>
                                    <Select
                                      value={reviewData.rating.toString()}
                                      onValueChange={(value) => 
                                        setReviewData(prev => ({ ...prev, rating: parseInt(value) }))
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {[1, 2, 3, 4, 5].map((rating) => (
                                          <SelectItem key={rating} value={rating.toString()}>
                                            {rating} Star{rating !== 1 ? 's' : ''}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  
                                  <div>
                                    <label className="text-sm font-medium">Comment</label>
                                    <Textarea
                                      placeholder="Share your thoughts about this member..."
                                      value={reviewData.comment}
                                      onChange={(e) => 
                                        setReviewData(prev => ({ ...prev, comment: e.target.value }))
                                      }
                                      rows={4}
                                    />
                                  </div>
                                  
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setSelectedMember(null)}>
                                      Cancel
                                    </Button>
                                    <Button 
                                      onClick={() => handleAddReview(member.id, reviewData)}
                                    >
                                      Add Review
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Members;