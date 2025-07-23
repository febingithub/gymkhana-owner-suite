import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gym } from '@/types/gym';
import { Loader2, Building2 } from 'lucide-react';
import { GymCard } from '@/components/GymCard';
import { useToast } from '@/components/ui/use-toast';

// Mock data types
type MembershipStatus = 'Active' | 'Expired' | 'Pending';

interface MemberGym extends Gym {
  status: MembershipStatus;
  visits: number;
  startDate: string;
  endDate: string;
}

const MyGyms = () => {
  const [myGyms, setMyGyms] = useState<MemberGym[]>([]);
  const [discoverGyms, setDiscoverGyms] = useState<Gym[]>([]);
  const [isLoading, setIsLoading] = useState({
    myGyms: true,
    discover: true
  });
  const { toast } = useToast();

  // Mock API calls
  useEffect(() => {
    // Fetch member's gyms
    const fetchMyGyms = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        const mockMyGyms: MemberGym[] = [
          {
            id: '1',
            name: 'Elite Fitness Center',
            status: 'Active',
            visits: 12,
            startDate: '2025-01-15',
            endDate: '2025-07-15',
            monthlyPrice: 89.99,
            amenities: ['Pool', 'Sauna', 'Personal Trainer'],
            rating: 4.7,
            reviewCount: 128,
            imageUrl: '/gym1.jpg'
          },
          // Add more mock data as needed
        ];
        setMyGyms(mockMyGyms);
      } catch (error) {
        console.error('Failed to fetch my gyms:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your gyms. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(prev => ({ ...prev, myGyms: false }));
      }
    };

    // Fetch discoverable gyms
    const fetchDiscoverGyms = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockDiscoverGyms: Gym[] = [
          {
            id: '2',
            name: 'Power House Gym',
            monthlyPrice: 75.99,
            amenities: ['24/7 Access', 'Group Classes', 'Parking'],
            rating: 4.5,
            reviewCount: 95,
            imageUrl: '/gym2.jpg',
            shifts: ['Morning', 'Evening']
          },
          // Add more mock data as needed
        ];
        setDiscoverGyms(mockDiscoverGyms);
      } catch (error) {
        console.error('Failed to fetch discoverable gyms:', error);
        toast({
          title: 'Error',
          description: 'Failed to load gyms. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(prev => ({ ...prev, discover: false }));
      }
    };

    fetchMyGyms();
    fetchDiscoverGyms();
  }, [toast]);

  const handleRequestAccess = async (gymId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      toast({
        title: 'Request Sent',
        description: 'Your request to join the gym has been sent for approval.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send request. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleLeaveReview = (gymId: string) => {
    // Navigate to review page or open modal
    console.log('Leave review for gym:', gymId);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Gyms</h1>
          <p className="text-muted-foreground mt-1">
            Manage your gym memberships and discover new fitness centers
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="my-gyms" className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="my-gyms">My Gyms</TabsTrigger>
            <TabsTrigger value="discover">Discover New Gyms</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="my-gyms">
          <h2 className="text-2xl font-semibold mb-6">My Selected Gyms</h2>
          {isLoading.myGyms ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : myGyms.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {myGyms.map((gym) => (
                <GymCard 
                  key={gym.id}
                  gym={gym}
                  isMember={true}
                  onRequestAccess={handleRequestAccess}
                  onLeaveReview={handleLeaveReview}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 rounded-lg border-2 border-dashed border-muted-foreground/20 p-8">
              <div className="flex justify-center mb-4">
                <Building2 className="h-10 w-10 text-muted-foreground/40" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No gyms yet</h3>
              <p className="text-muted-foreground mb-4">You haven't joined any gyms yet.</p>
              <Button 
                className="mt-4" 
                onClick={() => {
                  const discoverTab = document.querySelector('[value="discover"]') as HTMLElement;
                  if (discoverTab) discoverTab.click();
                }}
              >
                Discover Gyms
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="discover">
          <h2 className="text-2xl font-semibold mb-6">Discover New Gyms</h2>
          {isLoading.discover ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {discoverGyms.map((gym) => (
                <GymCard 
                  key={gym.id}
                  gym={gym}
                  isMember={false}
                  onRequestAccess={handleRequestAccess}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyGyms;
