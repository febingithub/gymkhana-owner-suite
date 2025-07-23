import { Gym } from '@/types/gym';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, CheckCircle2, Clock, Calendar, Users, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

type GymCardProps = {
  gym: Gym & {
    status?: 'Active' | 'Expired' | 'Pending';
    visits?: number;
    startDate?: string;
    endDate?: string;
  };
  isMember: boolean;
  onRequestAccess?: (gymId: string) => void;
  onLeaveReview?: (gymId: string) => void;
};

export const GymCard = ({ gym, isMember, onRequestAccess, onLeaveReview }: GymCardProps) => {
  const statusColors = {
    Active: 'bg-green-100 text-green-800',
    Expired: 'bg-red-100 text-red-800',
    Pending: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative">
        <img 
          src={gym.imageUrl || '/images/gym-placeholder.jpg'} 
          alt={gym.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/gym-placeholder.jpg';
          }}
        />
        {isMember && gym.status && (
          <div 
            className={cn(
              'absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium',
              statusColors[gym.status] || 'bg-gray-100 text-gray-800'
            )}
          >
            {gym.status}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{gym.name}</h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
            <span className="font-medium">{gym.rating?.toFixed(1)}</span>
            <span className="text-muted-foreground text-sm ml-1">({gym.reviewCount})</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <Zap className="h-4 w-4 mr-1" />
            <span>${gym.monthlyPrice}/month</span>
          </div>
          
          {isMember && gym.visits !== undefined && (
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <Users className="h-4 w-4 mr-1" />
              <span>{gym.visits} visits</span>
            </div>
          )}

          {isMember && gym.startDate && gym.endDate && (
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <Calendar className="h-4 w-4 mr-1" />
              <span>
                {new Date(gym.startDate).toLocaleDateString()} - {new Date(gym.endDate).toLocaleDateString()}
              </span>
            </div>
          )}

          {gym.shifts && gym.shifts.length > 0 && (
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <Clock className="h-4 w-4 mr-1" />
              <span>{gym.shifts.join(', ')} Shifts</span>
            </div>
          )}

          {gym.amenities && gym.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {gym.amenities.map((amenity, index) => (
                <div key={index} className="text-xs border rounded-full px-2 py-0.5">
                  {amenity}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          {isMember ? (
            <>
              <Button variant="outline" className="w-full" onClick={() => onLeaveReview?.(gym.id)}>
                Leave Review
              </Button>
              <Button className="w-full">
                View Details
              </Button>
            </>
          ) : (
            <Button 
              className="w-full" 
              onClick={() => onRequestAccess?.(gym.id)}
            >
              Request Access
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GymCard;
