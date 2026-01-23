// Product type definition (compatible with both API and legacy format)
export interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  price_inr?: number;
  original_price_inr?: number;
  // Legacy support
  priceINR?: number;
  originalPrice?: number;
  images: string[];
  // Legacy support
  image?: string;
  category: string;
  subcategory: string;
  gender: 'women' | 'men' | 'unisex';
  colors: string[];
  sizes: string[];
  description: string;
  details: string[];
  material: string;
  featured: boolean;
  new_arrival: boolean;
  on_sale: boolean;
  // Legacy support
  newArrival?: boolean;
  onSale?: boolean;
  rating: number;
  reviews: number;
  badge?: string;
  video_url?: string;
  // Legacy support
  videoURL?: string;
  stock: Record<string, number>;
  vendor_id?: string;
  created_at?: string;
  updated_at?: string;
}
