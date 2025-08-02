import React, { useState } from 'react'
import { ArrowLeft, Calendar, Camera, Download, Plus, User, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function ClientProfile() {
  const [activeTab, setActiveTab] = useState('personal')

  // Mock client data
  const clientData = {
    name: 'John Smith',
    memberId: 'GYM-2024-001',
    membershipStatus: 'Active',
    expiryDate: new Date('2024-12-15'),
    currentProgress: { attended: 17, total: 24 },
    profilePhoto: null
  }

  const daysUntilExpiry = Math.ceil((clientData.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  const progressPercentage = (clientData.currentProgress.attended / clientData.currentProgress.total) * 100

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active': return 'default'
      case 'Expired': return 'destructive'
      case 'Frozen': return 'secondary'
      case 'Trial': return 'outline'
      default: return 'default'
    }
  }

  const getExpiryWarning = (days: number) => {
    if (days < 0) return { text: 'Expired', color: 'text-destructive' }
    if (days <= 7) return { text: `Expires in ${days} days`, color: 'text-yellow-600' }
    return { text: `Expires in ${days} days`, color: 'text-muted-foreground' }
  }

  const expiryWarning = getExpiryWarning(daysUntilExpiry)

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={clientData.profilePhoto || ''} />
                  <AvatarFallback>
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold">{clientData.name}</h1>
                  <p className="text-sm text-muted-foreground">Member ID: {clientData.memberId}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusBadgeVariant(clientData.membershipStatus)}>
                    {clientData.membershipStatus}
                  </Badge>
                </div>
                <p className={`text-sm ${expiryWarning.color}`}>
                  {expiryWarning.text}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Progress</p>
                <div className="flex items-center gap-2">
                  <Progress value={progressPercentage} className="w-20" />
                  <span className="text-sm text-muted-foreground">
                    {clientData.currentProgress.attended}/{clientData.currentProgress.total}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Extend
                </Button>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Note
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Print
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="address">Address</TabsTrigger>
            <TabsTrigger value="fitness">Fitness</TabsTrigger>
            <TabsTrigger value="membership">Membership</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="interactions">Interactions</TabsTrigger>
          </TabsList>

          {/* Personal Details Tab */}
          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input id="fullName" defaultValue={clientData.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select defaultValue="male">
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth *</Label>
                    <Input id="dob" type="date" defaultValue="1990-05-15" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input id="age" defaultValue="34" readOnly />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Profile Photo</Label>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={clientData.profilePhoto || ''} />
                      <AvatarFallback>
                        <Camera className="h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline">
                      <Camera className="h-4 w-4 mr-2" />
                      Upload Photo
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="memberId">Member ID</Label>
                  <Input id="memberId" defaultValue={clientData.memberId} readOnly />
                </div>
              </CardContent>
            </Card>
            <div className="flex gap-2">
              <Button>Save Changes</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </TabsContent>

          {/* Contact Details Tab */}
          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue="+1 (555) 123-4567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="altPhone">Alternate Phone</Label>
                    <Input id="altPhone" placeholder="Optional" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="john.smith@email.com" />
                  </div>
                </div>
                <Separator />
                <h3 className="text-lg font-semibold">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyName">Emergency Contact Name</Label>
                    <Input id="emergencyName" defaultValue="Jane Smith" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                    <Input id="emergencyPhone" defaultValue="+1 (555) 987-6543" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex gap-2">
              <Button>Save Changes</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </TabsContent>

          {/* Address Tab */}
          <TabsContent value="address" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Address Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input id="street" defaultValue="123 Main Street, Apt 4B" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" defaultValue="New York" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" defaultValue="NY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input id="pincode" defaultValue="10001" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex gap-2">
              <Button>Save Changes</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </TabsContent>

          {/* Fitness Profile Tab */}
          <TabsContent value="fitness" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Fitness Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input id="height" defaultValue="175" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input id="weight" defaultValue="70" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bmi">BMI</Label>
                    <Input id="bmi" defaultValue="22.9" readOnly />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fitnessGoal">Fitness Goal</Label>
                    <Select defaultValue="weight-loss">
                      <SelectTrigger>
                        <SelectValue placeholder="Select goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weight-loss">Weight Loss</SelectItem>
                        <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                        <SelectItem value="strength">Strength Training</SelectItem>
                        <SelectItem value="endurance">Endurance</SelectItem>
                        <SelectItem value="general">General Fitness</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dietPreference">Diet Preference</Label>
                    <Select defaultValue="balanced">
                      <SelectTrigger>
                        <SelectValue placeholder="Select diet" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="vegan">Vegan</SelectItem>
                        <SelectItem value="keto">Keto</SelectItem>
                        <SelectItem value="paleo">Paleo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medicalConditions">Medical Conditions</Label>
                  <Textarea id="medicalConditions" placeholder="Any medical conditions or injuries..." />
                </div>
              </CardContent>
            </Card>
            <div className="flex gap-2">
              <Button>Save Changes</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </TabsContent>

          {/* Membership Info Tab */}
          <TabsContent value="membership" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Membership Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="membershipType">Membership Type</Label>
                    <Select defaultValue="monthly">
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="annual">Annual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select defaultValue="credit-card">
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit-card">Credit Card</SelectItem>
                        <SelectItem value="debit-card">Debit Card</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input id="startDate" type="date" defaultValue="2024-01-15" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input id="endDate" type="date" defaultValue="2024-12-15" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amountPaid">Amount Paid</Label>
                    <Input id="amountPaid" defaultValue="$99.00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discount">Discount Applied</Label>
                    <Input id="discount" placeholder="Coupon code or discount" />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="autoRenew" defaultChecked />
                  <Label htmlFor="autoRenew">Auto-renew membership</Label>
                </div>
              </CardContent>
            </Card>
            <div className="flex gap-2">
              <Button>Save Changes</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Tracking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold">{clientData.currentProgress.attended}</p>
                    <p className="text-sm text-muted-foreground">Sessions Attended</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold">{clientData.currentProgress.total - clientData.currentProgress.attended}</p>
                    <p className="text-sm text-muted-foreground">Sessions Remaining</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold">2</p>
                    <p className="text-sm text-muted-foreground">Missed Sessions</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Last Check-in</Label>
                  <p className="text-sm">Today, 10:30 AM</p>
                </div>
                <div className="space-y-2">
                  <Label>Attendance Chart</Label>
                  <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Attendance chart would be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex gap-2">
              <Button>Save Changes</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </TabsContent>

          {/* Progress Tracking Tab */}
          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Progress Tracking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Body Measurements</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Chest (inches)</Label>
                      <Input defaultValue="40" />
                    </div>
                    <div>
                      <Label>Waist (inches)</Label>
                      <Input defaultValue="32" />
                    </div>
                    <div>
                      <Label>Arms (inches)</Label>
                      <Input defaultValue="14" />
                    </div>
                    <div>
                      <Label>Thighs (inches)</Label>
                      <Input defaultValue="22" />
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Progress Photos</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                      <Camera className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <Button variant="outline" className="aspect-square">
                      <Plus className="h-8 w-8" />
                    </Button>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Trainer Feedback</h3>
                  <Textarea placeholder="Latest trainer feedback and recommendations..." />
                </div>
              </CardContent>
            </Card>
            <div className="flex gap-2">
              <Button>Save Changes</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </TabsContent>

          {/* Notes & Documents Tab */}
          <TabsContent value="notes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notes & Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="trainerNotes">Trainer Notes</Label>
                  <Textarea 
                    id="trainerNotes" 
                    rows={6}
                    placeholder="Add trainer notes, observations, recommendations..."
                    defaultValue="Client shows good form and dedication. Recommend increasing weights gradually."
                  />
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Consent Form</Label>
                      <div className="mt-2 p-4 border-2 border-dashed rounded-lg text-center">
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Upload Consent Form
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label>Medical Certificate</Label>
                      <div className="mt-2 p-4 border-2 border-dashed rounded-lg text-center">
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Upload Medical Cert
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex gap-2">
              <Button>Save Changes</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </TabsContent>

          {/* Activity Timeline Tab */}
          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { date: '2024-01-15', type: 'signup', text: 'Member signed up for Annual membership' },
                    { date: '2024-01-20', type: 'payment', text: 'Payment received - $99.00' },
                    { date: '2024-02-01', type: 'trainer', text: 'Assigned trainer: Mike Johnson' },
                    { date: '2024-03-15', type: 'assessment', text: 'Fitness assessment completed' },
                    { date: '2024-11-01', type: 'note', text: 'Progress review scheduled' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-b-0">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.text}</p>
                        <p className="text-xs text-muted-foreground">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <div className="flex gap-2">
              <Button>Save Changes</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </TabsContent>

          {/* Interaction Log Tab */}
          <TabsContent value="interactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Interaction Log</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="trainer">Trainer</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Interaction
                  </Button>
                </div>
                <div className="space-y-4">
                  {[
                    { date: '2024-11-01 10:30', type: 'Call', staff: 'Sarah Wilson', summary: 'Follow-up call regarding membership renewal' },
                    { date: '2024-10-28 14:15', type: 'WhatsApp', staff: 'Mike Johnson', summary: 'Workout plan adjustments discussed' },
                    { date: '2024-10-25 09:00', type: 'In-person', staff: 'John Doe', summary: 'Progress review and goal setting session' }
                  ].map((interaction, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{interaction.type}</Badge>
                          <span className="text-sm font-medium">{interaction.staff}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{interaction.date}</span>
                      </div>
                      <p className="text-sm">{interaction.summary}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <div className="flex gap-2">
              <Button>Save Changes</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}