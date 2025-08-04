import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Pencil, Trash2, Eye, ToggleLeft, ToggleRight, Phone, Mail } from 'lucide-react';
import { getTrainers, toggleTrainerStatus } from '@/services/trainerService';
import type { Trainer, TrainerStatus } from '@/types';
import { useToast } from '@/components/ui/use-toast';

export default function TrainersPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<TrainerStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const fetchTrainers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getTrainers({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: searchQuery || undefined,
      });
      setTrainers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch trainers:', error);
      setError('Failed to load trainers. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to load trainers. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, [statusFilter, searchQuery]);

  const handleStatusChange = async (id: string, currentStatus: TrainerStatus) => {
    try {
      await toggleTrainerStatus(id, currentStatus === 'active' ? 'inactive' : 'active');
      toast({
        title: 'Success',
        description: 'Trainer status updated successfully',
      });
      fetchTrainers(); // Refresh the list
    } catch (error) {
      console.error('Failed to update trainer status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update trainer status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Trainers</h1>
          <p className="text-muted-foreground">
            Manage your gym's trainers and their details
          </p>
        </div>
        <Button onClick={() => navigate('/dashboard/trainers/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Trainer
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search trainers..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as TrainerStatus | 'all')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trainer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <span className="ml-2">Loading trainers...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-red-500">
                  {error}
                </TableCell>
              </TableRow>
            ) : !trainers || trainers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                  No trainers found. Try adjusting your search or filters.
                </TableCell>
              </TableRow>
            ) : (
              trainers.map((trainer) => (
                <TableRow key={trainer.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      {trainer.profilePhoto ? (
                        <img
                          src={trainer.profilePhoto}
                          alt={`${trainer.firstName} ${trainer.lastName}`}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          {trainer.firstName[0]}
                          {trainer.lastName?.[0]}
                        </div>
                      )}
                      <div>
                        <div className="font-medium">
                          {trainer.firstName} {trainer.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ID: {trainer.id.slice(0, 6)}...
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{trainer.phone}</span>
                      </div>
                      {trainer.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {trainer.email}
                          </span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {trainer.role.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {trainer.specialization.map((spec) => (
                        <Badge key={spec} variant="secondary">
                          {spec.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={trainer.status === 'active' ? 'default' : 'secondary'}>
                      {trainer.status.charAt(0).toUpperCase() + trainer.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/dashboard/trainers/${trainer.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/dashboard/trainers/${trainer.id}/edit`)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleStatusChange(trainer.id, trainer.status)}
                      >
                        {trainer.status === 'active' ? (
                          <ToggleLeft className="h-4 w-4 text-destructive" />
                        ) : (
                          <ToggleRight className="h-4 w-4 text-success" />
                        )}
                        <span className="sr-only">
                          {trainer.status === 'active' ? 'Deactivate' : 'Activate'}
                        </span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
