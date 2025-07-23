import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, Calendar, Search, Filter, Download, TrendingUp } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  memberName: string;
  memberId: string;
  checkIn: string;
  checkOut?: string;
  date: string;
  duration?: number;
  membershipType: string;
  avatar?: string;
}

const Attendance = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Mock attendance data
  const [attendanceRecords] = useState<AttendanceRecord[]>([
    {
      id: '1',
      memberName: 'John Doe',
      memberId: 'M001',
      checkIn: '06:30',
      checkOut: '08:15',
      date: '2024-01-15',
      duration: 105,
      membershipType: 'Premium'
    },
    {
      id: '2',
      memberName: 'Sarah Wilson',
      memberId: 'M002',
      checkIn: '07:00',
      checkOut: '09:00',
      date: '2024-01-15',
      duration: 120,
      membershipType: 'Basic'
    },
    {
      id: '3',
      memberName: 'Mike Johnson',
      memberId: 'M003',
      checkIn: '17:30',
      checkOut: '19:45',
      date: '2024-01-15',
      duration: 135,
      membershipType: 'Premium'
    },
    {
      id: '4',
      memberName: 'Emily Davis',
      memberId: 'M004',
      checkIn: '18:00',
      date: '2024-01-15',
      membershipType: 'Standard'
    },
    {
      id: '5',
      memberName: 'Alex Thompson',
      memberId: 'M005',
      checkIn: '06:00',
      checkOut: '07:30',
      date: '2024-01-15',
      duration: 90,
      membershipType: 'Premium'
    },
    {
      id: '6',
      memberName: 'Lisa Chen',
      memberId: 'M006',
      checkIn: '19:00',
      checkOut: '20:30',
      date: '2024-01-15',
      duration: 90,
      membershipType: 'Standard'
    },
    {
      id: '7',
      memberName: 'David Brown',
      memberId: 'M007',
      checkIn: '12:00',
      checkOut: '13:45',
      date: '2024-01-15',
      duration: 105,
      membershipType: 'Basic'
    },
    {
      id: '8',
      memberName: 'Rachel Green',
      memberId: 'M008',
      checkIn: '16:30',
      date: '2024-01-15',
      membershipType: 'Premium'
    }
  ]);

  // Filter records based on search and date
  const filteredRecords = attendanceRecords.filter(record => {
    const matchesSearch = record.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.memberId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = record.date === selectedDate;
    return matchesSearch && matchesDate;
  });

  // Calculate stats
  const totalCheckIns = filteredRecords.length;
  const currentlyInGym = filteredRecords.filter(record => !record.checkOut).length;
  const averageDuration = filteredRecords
    .filter(record => record.duration)
    .reduce((acc, record) => acc + (record.duration || 0), 0) / 
    filteredRecords.filter(record => record.duration).length || 0;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getMembershipBadge = (type: string) => {
    const variants = {
      'Premium': 'default',
      'Standard': 'secondary',
      'Basic': 'outline'
    } as const;
    
    return <Badge variant={variants[type as keyof typeof variants] || 'outline'}>{type}</Badge>;
  };

  const getStatusBadge = (record: AttendanceRecord) => {
    if (record.checkOut) {
      return <Badge variant="outline" className="text-green-600 border-green-600">Checked Out</Badge>;
    } else {
      return <Badge className="bg-primary text-primary-foreground">In Gym</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Clock className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Attendance Tracker</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Check-ins</p>
                <p className="text-2xl font-bold text-foreground">{totalCheckIns}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Currently in Gym</p>
                <p className="text-2xl font-bold text-foreground">{currentlyInGym}</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Duration</p>
                <p className="text-2xl font-bold text-foreground">
                  {averageDuration ? formatDuration(Math.round(averageDuration)) : 'N/A'}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
          <CardDescription>
            Track member check-ins and check-outs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="search">Search Members</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or member ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="sm:w-48">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            
            <div className="flex items-end gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="space-y-3">
            {filteredRecords.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No attendance records found</p>
              </div>
            ) : (
              filteredRecords.map((record) => (
                <div key={record.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={record.avatar} />
                        <AvatarFallback>
                          {record.memberName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h3 className="font-semibold text-foreground">{record.memberName}</h3>
                        <p className="text-sm text-muted-foreground">ID: {record.memberId}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">Check-in: {record.checkIn}</p>
                        {record.checkOut ? (
                          <p className="text-sm text-muted-foreground">Check-out: {record.checkOut}</p>
                        ) : (
                          <p className="text-sm text-green-600">Still in gym</p>
                        )}
                      </div>
                      
                      {record.duration && (
                        <div className="text-right">
                          <p className="text-sm font-medium text-foreground">Duration</p>
                          <p className="text-sm text-muted-foreground">{formatDuration(record.duration)}</p>
                        </div>
                      )}
                      
                      <div className="flex flex-col gap-2">
                        {getMembershipBadge(record.membershipType)}
                        {getStatusBadge(record)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Attendance;