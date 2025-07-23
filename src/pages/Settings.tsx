import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database,
  Save,
  AlertTriangle
} from 'lucide-react';

const Settings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock settings data
  const [settings, setSettings] = useState({
    // Profile settings
    ownerName: 'John Smith',
    email: 'john.smith@powerhousefitness.com',
    phone: '+1 (555) 123-4567',
    
    // Notification settings
    emailNotifications: true,
    membershipAlerts: true,
    reviewNotifications: true,
    maintenanceReminders: false,
    
    // Security settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    
    // Theme settings
    darkMode: false,
    compactView: false,
    
    // Business settings
    autoApproveMembers: false,
    allowOnlinePayments: true,
    requireMedicalForms: true,
  });

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    toast({
      title: 'Settings Saved',
      description: 'Your settings have been updated successfully.',
    });
  };

  const handleResetPassword = () => {
    toast({
      title: 'Password Reset',
      description: 'Password reset instructions have been sent to your email.',
    });
  };

  const handleExportData = () => {
    toast({
      title: 'Data Export',
      description: 'Your data export will be ready shortly. You\'ll receive an email when complete.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <SettingsIcon className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Settings
            </CardTitle>
            <CardDescription>
              Update your personal information and contact details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ownerName">Full Name</Label>
              <Input
                id="ownerName"
                value={settings.ownerName}
                onChange={(e) => handleInputChange('ownerName', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={settings.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
            
            <Separator />
            
            <Button variant="outline" onClick={handleResetPassword}>
              Reset Password
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
              <Switch
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="membershipAlerts">Membership Alerts</Label>
                <p className="text-sm text-muted-foreground">New membership requests</p>
              </div>
              <Switch
                id="membershipAlerts"
                checked={settings.membershipAlerts}
                onCheckedChange={(checked) => handleInputChange('membershipAlerts', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="reviewNotifications">Review Notifications</Label>
                <p className="text-sm text-muted-foreground">New reviews and ratings</p>
              </div>
              <Switch
                id="reviewNotifications"
                checked={settings.reviewNotifications}
                onCheckedChange={(checked) => handleInputChange('reviewNotifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="maintenanceReminders">Maintenance Reminders</Label>
                <p className="text-sm text-muted-foreground">Equipment maintenance alerts</p>
              </div>
              <Switch
                id="maintenanceReminders"
                checked={settings.maintenanceReminders}
                onCheckedChange={(checked) => handleInputChange('maintenanceReminders', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>
              Manage your account security preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Add extra security to your account</p>
              </div>
              <Switch
                id="twoFactorAuth"
                checked={settings.twoFactorAuth}
                onCheckedChange={(checked) => handleInputChange('twoFactorAuth', checked)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                min="5"
                max="480"
              />
              <p className="text-sm text-muted-foreground">
                Automatically log out after inactivity
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize the look and feel of your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="darkMode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Use dark theme</p>
              </div>
              <Switch
                id="darkMode"
                checked={settings.darkMode}
                onCheckedChange={(checked) => handleInputChange('darkMode', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="compactView">Compact View</Label>
                <p className="text-sm text-muted-foreground">Reduce spacing and padding</p>
              </div>
              <Switch
                id="compactView"
                checked={settings.compactView}
                onCheckedChange={(checked) => handleInputChange('compactView', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Business Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Business Settings
            </CardTitle>
            <CardDescription>
              Configure your gym's operational preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoApproveMembers">Auto-approve Members</Label>
                <p className="text-sm text-muted-foreground">Automatically approve new memberships</p>
              </div>
              <Switch
                id="autoApproveMembers"
                checked={settings.autoApproveMembers}
                onCheckedChange={(checked) => handleInputChange('autoApproveMembers', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="allowOnlinePayments">Online Payments</Label>
                <p className="text-sm text-muted-foreground">Accept payments through the platform</p>
              </div>
              <Switch
                id="allowOnlinePayments"
                checked={settings.allowOnlinePayments}
                onCheckedChange={(checked) => handleInputChange('allowOnlinePayments', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="requireMedicalForms">Require Medical Forms</Label>
                <p className="text-sm text-muted-foreground">Members must submit health information</p>
              </div>
              <Switch
                id="requireMedicalForms"
                checked={settings.requireMedicalForms}
                onCheckedChange={(checked) => handleInputChange('requireMedicalForms', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Management
            </CardTitle>
            <CardDescription>
              Export or manage your gym data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-800">Data Export</h4>
                  <p className="text-sm text-orange-700">
                    Export all your gym data including member information, attendance records, and reviews.
                  </p>
                </div>
              </div>
            </div>
            
            <Button variant="outline" onClick={handleExportData}>
              Export All Data
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? (
            <>
              <Save className="mr-2 h-4 w-4 animate-pulse" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save All Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Settings;