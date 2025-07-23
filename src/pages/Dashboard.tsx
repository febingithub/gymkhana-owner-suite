import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Clock, Star, TrendingUp, Activity } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  // Mock data for dashboard stats
  const stats = [
    {
      title: 'Total Members',
      value: '248',
      description: '+12 from last month',
      icon: Users,
      trend: 'up',
      color: 'text-blue-600'
    },
    {
      title: 'Pending Requests',
      value: '5',
      description: '3 new today',
      icon: UserPlus,
      trend: 'up',
      color: 'text-orange-600'
    },
    {
      title: 'Today\'s Check-ins',
      value: '89',
      description: 'Peak hour: 6-8 PM',
      icon: Clock,
      trend: 'neutral',
      color: 'text-green-600'
    },
    {
      title: 'Average Rating',
      value: '4.8',
      description: 'Based on 156 reviews',
      icon: Star,
      trend: 'up',
      color: 'text-yellow-600'
    },
  ];

  const recentActivities = [
    { type: 'member_joined', message: 'John Doe joined the gym', time: '2 hours ago' },
    { type: 'review', message: 'New 5-star review from Sarah M.', time: '4 hours ago' },
    { type: 'payment', message: 'Monthly subscription renewed by 12 members', time: '6 hours ago' },
    { type: 'equipment', message: 'Treadmill #3 maintenance completed', time: '1 day ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening at {user?.gymName} today.
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
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                {stat.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest updates from your gym
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{activity.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {activity.type.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks you might want to perform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                <h4 className="font-medium text-sm">Review Member Requests</h4>
                <p className="text-xs text-muted-foreground">5 pending applications</p>
              </div>
              <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                <h4 className="font-medium text-sm">Update Gym Profile</h4>
                <p className="text-xs text-muted-foreground">Keep your information current</p>
              </div>
              <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                <h4 className="font-medium text-sm">View Today's Attendance</h4>
                <p className="text-xs text-muted-foreground">89 check-ins so far</p>
              </div>
              <div className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                <h4 className="font-medium text-sm">Respond to Reviews</h4>
                <p className="text-xs text-muted-foreground">3 new reviews to respond to</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;