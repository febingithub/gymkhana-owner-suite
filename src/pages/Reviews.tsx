import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Star, MessageCircle, ThumbsUp, Filter, TrendingUp } from 'lucide-react';

interface Review {
  id: string;
  memberName: string;
  rating: number;
  comment: string;
  date: string;
  membershipType: string;
  avatar?: string;
  response?: string;
  responded: boolean;
  helpful: number;
}

const Reviews = () => {
  const { toast } = useToast();
  const [responseText, setResponseText] = useState<{ [key: string]: string }>({});
  
  // Mock reviews data
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      memberName: 'Sarah Wilson',
      rating: 5,
      comment: 'Amazing gym with top-notch equipment! The staff is incredibly helpful and the facility is always clean. Highly recommend the personal training sessions.',
      date: '2024-01-10',
      membershipType: 'Premium',
      responded: false,
      helpful: 12
    },
    {
      id: '2',
      memberName: 'Mike Johnson',
      rating: 4,
      comment: 'Great variety of equipment and good atmosphere. The only downside is it can get quite crowded during peak hours, but overall a solid gym.',
      date: '2024-01-08',
      membershipType: 'Standard',
      responded: true,
      response: 'Thank you for your feedback, Mike! We\'re working on expanding our peak hour capacity. Appreciate your understanding!',
      helpful: 8
    },
    {
      id: '3',
      memberName: 'Emily Davis',
      rating: 5,
      comment: 'Love this place! The group classes are fantastic and the instructors are very motivating. The locker rooms are spacious and always clean.',
      date: '2024-01-05',
      membershipType: 'Basic',
      responded: false,
      helpful: 15
    },
    {
      id: '4',
      memberName: 'John Doe',
      rating: 3,
      comment: 'Decent gym but could use more cardio machines. The wait times for treadmills can be long during evening hours.',
      date: '2024-01-03',
      membershipType: 'Standard',
      responded: false,
      helpful: 5
    },
    {
      id: '5',
      memberName: 'Alex Thompson',
      rating: 5,
      comment: 'Excellent gym! The personal trainers are knowledgeable and the equipment is well-maintained. Worth every penny of the membership fee.',
      date: '2024-01-01',
      membershipType: 'Premium',
      responded: true,
      response: 'Thank you so much, Alex! We\'re thrilled that you\'re enjoying your experience with us.',
      helpful: 20
    },
    {
      id: '6',
      memberName: 'Lisa Chen',
      rating: 4,
      comment: 'Good gym with friendly staff. The group classes are well-organized and fun. Would love to see more yoga classes added to the schedule.',
      date: '2023-12-28',
      membershipType: 'Basic',
      responded: false,
      helpful: 7
    }
  ]);

  // Calculate stats
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  const totalReviews = reviews.length;
  const responseRate = (reviews.filter(review => review.responded).length / totalReviews) * 100;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
    const count = reviews.filter(review => review.rating === rating).length;
    const percentage = (count / totalReviews) * 100;
    return { rating, count, percentage };
  });

  const handleResponse = async (reviewId: string) => {
    const response = responseText[reviewId];
    if (!response?.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a response before submitting.',
        variant: 'destructive',
      });
      return;
    }

    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));

    setReviews(prev => 
      prev.map(review => 
        review.id === reviewId 
          ? { ...review, responded: true, response } 
          : review
      )
    );

    setResponseText(prev => ({ ...prev, [reviewId]: '' }));

    toast({
      title: 'Response Sent',
      description: 'Your response has been posted successfully.',
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getMembershipBadge = (type: string) => {
    const variants = {
      'Premium': 'default',
      'Standard': 'secondary',
      'Basic': 'outline'
    } as const;
    
    return <Badge variant={variants[type as keyof typeof variants] || 'outline'}>{type}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Star className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Reviews & Ratings</h1>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-2xl font-bold text-foreground">{averageRating.toFixed(1)}</p>
                  <div className="flex">
                    {renderStars(Math.round(averageRating))}
                  </div>
                </div>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Reviews</p>
                <p className="text-2xl font-bold text-foreground">{totalReviews}</p>
              </div>
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Response Rate</p>
                <p className="text-2xl font-bold text-foreground">{responseRate.toFixed(0)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rating Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
            <CardDescription>
              Breakdown of ratings from your members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-12">
                    <span className="text-sm font-medium">{rating}</span>
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  </div>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reviews List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Member Reviews</CardTitle>
                  <CardDescription>
                    Read and respond to member feedback
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={review.avatar} />
                          <AvatarFallback>
                            {review.memberName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-foreground">{review.memberName}</h4>
                            {getMembershipBadge(review.membershipType)}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {renderStars(review.rating)}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <ThumbsUp className="h-4 w-4" />
                        {review.helpful}
                      </div>
                    </div>

                    <p className="text-foreground mb-3 leading-relaxed">{review.comment}</p>

                    {review.responded && review.response && (
                      <div className="bg-muted/50 rounded-lg p-3 mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-primary-foreground text-xs font-bold">G</span>
                          </div>
                          <span className="text-sm font-medium text-foreground">Gym Response</span>
                        </div>
                        <p className="text-sm text-foreground">{review.response}</p>
                      </div>
                    )}

                    {!review.responded && (
                      <div className="space-y-3">
                        <Textarea
                          placeholder="Write a response to this review..."
                          value={responseText[review.id] || ''}
                          onChange={(e) => setResponseText(prev => ({ 
                            ...prev, 
                            [review.id]: e.target.value 
                          }))}
                          rows={3}
                        />
                        <div className="flex justify-end">
                          <Button 
                            size="sm" 
                            onClick={() => handleResponse(review.id)}
                            disabled={!responseText[review.id]?.trim()}
                          >
                            Post Response
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reviews;