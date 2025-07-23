export interface Gym {
  id: string;
  name: string;
  monthlyPrice: number;
  amenities: string[];
  rating: number;
  reviewCount: number;
  imageUrl?: string;
  shifts?: string[];
}
