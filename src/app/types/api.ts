// API Type Definitions matching backend models

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin' | 'vendor';
  vendor_id?: string;
  avatar?: string;
  phone?: string;
  birthday?: string;
  active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  sku?: string;
  price: number;
  original_price?: number;
  price_inr?: number;
  original_price_inr?: number;
  images: string[];
  category: string;
  subcategory: string;
  gender: 'women' | 'men' | 'unisex';
  colors: string[];
  sizes: string[];
  description: string;
  details: string[];
  material: string;
  care?: string;
  featured: boolean;
  new_arrival: boolean;
  on_sale: boolean;
  is_gift?: boolean;
  rating: number;
  reviews: number;
  badge?: string;
  video_url?: string;
  stock: Record<string, number>; // size -> quantity
  vendor_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  gender: 'women' | 'men' | 'unisex';
  subcategories: string[];
  image: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product_id: string;
  product_name: string;
  image: string;
  price: number;
  price_inr?: number;
  size: string;
  quantity: number;
  is_gift?: boolean;
  gift_wrap_color?: string;
  gift_message?: string;
}

export interface Cart {
  id: string;
  user_id: string;
  items: CartItem[];
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  image: string;
  price: number;
  size: string;
  quantity: number;
  is_gift?: boolean;
  gift_wrap_color?: string;
  gift_message?: string;
}

export interface ShippingInfo {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}

export interface PaymentInfo {
  card_number?: string;
  card_name?: string;
  expiry_date?: string;
  cvv?: string;
  upi_id?: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  items: OrderItem[];
  shipping_info: ShippingInfo;
  payment_info: PaymentInfo;
  subtotal: number;
  discount: number;
  shipping_cost: number;
  gift_packing_charge?: number;
  tax: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'failed';
  payment_intent_id?: string;
  tracking_number?: string;
  promotion_code?: string;
  created_at: string;
  updated_at: string;
}

export interface Wishlist {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface Promotion {
  id: string;
  name: string;
  code: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  min_purchase?: number;
  max_discount?: number;
  start_date: string;
  end_date: string;
  usage_count: number;
  usage_limit?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductReview {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  images?: string[];
  verified: boolean;
  helpful: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface ReturnItem {
  order_item_id: string;
  product_id: string;
  product_name: string;
  image: string;
  price: number;
  size: string;
  quantity: number;
}

export interface Return {
  id: string;
  order_id: string;
  order_number: string;
  user_id: string;
  items: ReturnItem[];
  reason: string;
  description: string;
  status: 'requested' | 'approved' | 'rejected' | 'processing' | 'completed';
  refund_amount: number;
  refund_method: string;
  refund_status: 'pending' | 'processed' | 'failed';
  tracking_number?: string;
  created_at: string;
  updated_at: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  carrier: string;
  type: string;
  base_cost: number;
  cost_per_kg?: number;
  free_shipping_threshold?: number;
  estimated_days: number;
  zones: ShippingZone[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShippingZone {
  countries: string[];
  cost: number;
  estimated_days: number;
}

export interface TaxRate {
  id: string;
  country: string;
  state?: string;
  city?: string;
  postal_code?: string;
  rate: number;
  tax_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaymentTransaction {
  id: string;
  order_id: string;
  user_id: string;
  amount: number;
  currency: string;
  gateway: string;
  gateway_transaction_id: string;
  status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  type: 'charge' | 'refund';
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface PaymentIntent {
  id: string;
  client_secret?: string;
  payment_url?: string;
  gateway: 'stripe' | 'paypal';
  amount: number;
  currency: string;
  metadata: Record<string, any>;
}

// Request/Response Types

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token?: string; // Only if not using HttpOnly cookies
}

export interface CreateOrderRequest {
  items: OrderItem[];
  shipping_info: ShippingInfo;
  payment_info: PaymentInfo;
  payment_method: string;
  promotion_code?: string;
  gift_packing_charge?: number;
}

export interface CreatePaymentIntentRequest {
  order_id: string;
  amount: number;
  currency: string;
  gateway: 'stripe' | 'paypal';
}

export interface ProcessPaymentRequest {
  payment_intent_id: string;
  payment_method_id: string;
  gateway: 'stripe' | 'paypal';
}

export interface CreateReviewRequest {
  product_id: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
}

export interface CreateReturnRequest {
  order_id: string;
  items: ReturnItem[];
  reason: string;
  description: string;
}

export interface CalculateShippingRequest {
  country: string;
  state?: string;
  subtotal: number;
  free_shipping?: boolean;
}

export interface CalculateTaxRequest {
  country: string;
  state?: string;
  city?: string;
  postal_code?: string;
  zip_code?: string;
  subtotal: number;
  /** @deprecated use subtotal */
  amount?: number;
}

export interface ApiError {
  error: string;
  message?: string;
  code?: string;
}

export interface PaginatedResponse<T> {
  products?: T[]; // Products API returns 'products' field
  orders?: T[]; // Orders API returns 'orders' field
  data?: T[]; // Some APIs might return 'data' field
  total: number;
  limit: number;
  skip: number;
}
