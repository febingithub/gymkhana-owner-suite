import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Clock, Star, TrendingUp, Calendar, CheckCircle, MapPin } from 'lucide-react';

const MemberDashboard = () => {
  const { user } = useAuth();

  // Mock member data
  const membershipDetails = {
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    totalCheckIns: 89,
    monthlyCheckIns: 12,
    plan: 'Premium Membership'
  };

  const approvedGyms = [
    {
      id: '1',
      name: 'PowerHouse Fitness',
      address: '123 Fitness Street, Gym City',
      distance: '1.2 km',
      rating: 4.8,
      lastVisit: '2024-01-14',
      status: 'active'
    },
    {
      id: '2',
      name: 'Elite Gym',
      address: '456 Strength Ave, Fitness Town',
      distance: '2.5 km',
      rating: 4.6,
      lastVisit: '2024-01-10',
      status: 'active'
    }
  ];

  const recentCheckIns = [
    { gym: 'PowerHouse Fitness', date: '2024-01-14', time: '18:30', duration: '1h 45m' },
    { gym: 'PowerHouse Fitness', date: '2024-01-12', time: '07:00', duration: '1h 30m' },
    { gym: 'Elite Gym', date: '2024-01-10', time: '19:15', duration: '2h 00m' },
    { gym: 'PowerHouse Fitness', date: '2024-01-08', time: '18:00', duration: '1h 20m' },
  ];

  const stats = [
    {
      title: 'This Month',
      value: membershipDetails.monthlyCheckIns.toString(),
      description: 'Gym visits',
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      title: 'Total Check-ins',
      value: membershipDetails.totalCheckIns.toString(),
      description: 'Since joining',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Active Gyms',
      value: approvedGyms.length.toString(),
      description: 'Available locations',
      icon: Building2,
      color: 'text-purple-600'
    },
    {
      title: 'Average Duration',
      value: '1h 35m',
      description: 'Per workout',
      icon: Clock,
      color: 'text-orange-600'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-muted-foreground">
          Ready for your next workout? Here's your fitness summary.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Membership Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Active Membership
            </CardTitle>
            <CardDescription>
              Your current membership plan and details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Plan</span>
                <Badge className="bg-primary text-primary-foreground">{membershipDetails.plan}</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Member ID</span>
                <span className="text-sm font-mono">{user?.membershipId}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Valid From</span>
                <span className="text-sm">{new Date(membershipDetails.startDate).toLocaleDateString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Valid Until</span>
                <span className="text-sm">{new Date(membershipDetails.endDate).toLocaleDateString()}</span>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    Leave Review
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Support
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Check-ins */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Your latest gym visits and workouts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentCheckIns.map((checkin, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{checkin.gym}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(checkin.date).toLocaleDateString()} • {checkin.time}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{checkin.duration}</p>
                    <Badge variant="secondary" className="text-xs">Completed</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Approved Gyms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Your Gyms
          </CardTitle>
          <CardDescription>
            Gyms where your membership is active
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {approvedGyms.map((gym) => (
              <div key={gym.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{gym.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {gym.distance} away
                    </p>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Active
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">{gym.address}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{gym.rating}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Last visit: {new Date(gym.lastVisit).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberDashboard;