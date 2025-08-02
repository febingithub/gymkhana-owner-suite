import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dumbbell, Ruler, Weight, HeartPulse, Utensils } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { MemberFormData } from '@/types';

// Fitness goals and workout preferences options
const FITNESS_GOALS = [
  'Weight Loss', 'Muscle Gain', 'Strength Training',
  'Endurance', 'Flexibility', 'General Fitness',
  'Sports Performance', 'Rehabilitation', 'Body Toning'
];

const WORKOUT_PREFERENCES = [
  'Cardio', 'Weight Training', 'Yoga', 'Pilates', 'CrossFit',
  'Functional Training', 'Zumba', 'Aerobics', 'Martial Arts',
  'Swimming', 'Cycling', 'Dance', 'HIIT', 'Calisthenics'
];

const DIET_PREFERENCES = [
  'Vegetarian', 'Non-Vegetarian', 'Vegan', 'Keto', 'Paleo',
  'Low-Carb', 'High-Protein', 'Balanced', 'Gluten-Free', 'Dairy-Free'
];

interface FitnessProfileProps {
  formData: MemberFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export default function FitnessProfile({ formData, onChange }: FitnessProfileProps) {
  // Toggle fitness goal selection
  const toggleFitnessGoal = (goal: string) => {
    const updatedGoals = formData.fitnessGoals.includes(goal)
      ? formData.fitnessGoals.filter(g => g !== goal)
      : [...formData.fitnessGoals, goal];
    
    const event = { target: { name: 'fitnessGoals', value: updatedGoals } } as unknown as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
  };

  // Toggle workout preference selection
  const toggleWorkoutPreference = (preference: string) => {
    const updatedPreferences = formData.workoutPreferences.includes(preference)
      ? formData.workoutPreferences.filter(p => p !== preference)
      : [...formData.workoutPreferences, preference];
    
    const event = { target: { name: 'workoutPreferences', value: updatedPreferences } } as unknown as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fitness Profile</CardTitle>
        <p className="text-sm text-muted-foreground">Health and fitness information</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <div className="relative">
              <Ruler className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="height"
                name="height"
                type="number"
                value={formData.height}
                onChange={onChange}
                placeholder="e.g., 175"
                min="100"
                max="250"
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <div className="relative">
              <Weight className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="weight"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={onChange}
                placeholder="e.g., 70"
                min="30"
                max="300"
                step="0.1"
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label>Fitness Goals</Label>
            <div className="flex flex-wrap gap-2">
              {FITNESS_GOALS.map((goal) => (
                <Badge
                  key={goal}
                  variant={formData.fitnessGoals.includes(goal) ? 'default' : 'outline'}
                  className="cursor-pointer px-3 py-1 text-sm font-medium"
                  onClick={() => toggleFitnessGoal(goal)}
                >
                  {goal}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label>Workout Preferences</Label>
            <div className="flex flex-wrap gap-2">
              {WORKOUT_PREFERENCES.map((preference) => (
                <Badge
                  key={preference}
                  variant={formData.workoutPreferences.includes(preference) ? 'default' : 'outline'}
                  className="cursor-pointer px-3 py-1 text-sm font-medium"
                  onClick={() => toggleWorkoutPreference(preference)}
                >
                  {preference}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="dietPreference">Dietary Preference</Label>
            <Select
              name="dietPreference"
              value={formData.dietPreference}
              onValueChange={(value) => {
                const event = { target: { name: 'dietPreference', value } } as React.ChangeEvent<HTMLSelectElement>;
                onChange(event);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select dietary preference" />
              </SelectTrigger>
              <SelectContent>
                {DIET_PREFERENCES.map((diet) => (
                  <SelectItem key={diet} value={diet.toLowerCase().replace(' ', '-')}>
                    {diet}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="medicalConditions">Medical Conditions / Injuries</Label>
            <Textarea
              id="medicalConditions"
              name="medicalConditions"
              value={formData.medicalConditions}
              onChange={onChange}
              placeholder="Any medical conditions, allergies, or injuries we should be aware of"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Please disclose any conditions that might affect your training
            </p>
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label>Health & Safety</Label>
            <div className="space-y-4 rounded-lg border p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <HeartPulse className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <h4 className="font-medium">Medical Clearance</h4>
                  <p className="text-sm text-muted-foreground">
                    Have you been cleared by a doctor for physical activity?
                  </p>
                  <div className="mt-2 flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="medicalClearance"
                        value="yes"
                        className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="ml-2 text-sm">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="medicalClearance"
                        value="no"
                        className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="ml-2 text-sm">No</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="medicalClearance"
                        value="unsure"
                        className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="ml-2 text-sm">Not Sure</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 pt-4 border-t">
                <div className="flex-shrink-0 mt-1">
                  <Dumbbell className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-medium">Experience Level</h4>
                  <p className="text-sm text-muted-foreground">
                    How would you rate your current fitness level?
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {['Beginner', 'Intermediate', 'Advanced', 'Athlete'].map((level) => (
                      <Badge
                        key={level}
                        variant="outline"
                        className="cursor-pointer px-3 py-1"
                      >
                        {level}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
