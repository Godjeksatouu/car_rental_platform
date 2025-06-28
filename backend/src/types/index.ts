// Type definitions for Car Rental SaaS Platform

export interface PlatformAdmin {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Agency {
  id: string;
  name: string;
  slug: string;
  email: string;
  password_hash: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  website?: string;
  description?: string;
  subscription_plan: 'basic' | 'premium' | 'enterprise';
  subscription_status: 'trial' | 'active' | 'suspended' | 'cancelled';
  subscription_expires_at?: Date;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface AgencySettings {
  id: string;
  agency_id: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  font_family: string;
  custom_css?: string;
  contact_email?: string;
  contact_phone?: string;
  business_hours?: Record<string, { open: string; close: string }>;
  terms_and_conditions?: string;
  privacy_policy?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Client {
  id: string;
  agency_id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone?: string;
  date_of_birth?: Date;
  driver_license_number?: string;
  driver_license_expiry?: Date;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  is_active: boolean;
  email_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CarCategory {
  id: string;
  agency_id: string;
  name: string;
  description?: string;
  created_at: Date;
}

export interface Car {
  id: string;
  agency_id: string;
  category_id?: string;
  brand: string;
  model: string;
  year: number;
  color?: string;
  license_plate?: string;
  vin?: string;
  fuel_type: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  transmission: 'manual' | 'automatic' | 'cvt';
  seats: number;
  doors: number;
  mileage: number;
  price_per_day: number;
  price_per_week?: number;
  price_per_month?: number;
  deposit_amount: number;
  status: 'available' | 'rented' | 'maintenance' | 'unavailable';
  features?: string[];
  description?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CarImage {
  id: string;
  car_id: string;
  image_url: string;
  alt_text?: string;
  is_primary: boolean;
  sort_order: number;
  created_at: Date;
}

export interface Reservation {
  id: string;
  agency_id: string;
  client_id: string;
  car_id: string;
  start_date: Date;
  end_date: Date;
  pickup_time: string;
  return_time: string;
  pickup_location?: string;
  return_location?: string;
  total_days: number;
  daily_rate: number;
  total_amount: number;
  deposit_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'converted_to_rental';
  special_requests?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Rental {
  id: string;
  agency_id: string;
  client_id: string;
  car_id: string;
  reservation_id?: string;
  start_date: Date;
  end_date: Date;
  actual_pickup_date?: Date;
  actual_return_date?: Date;
  pickup_location?: string;
  return_location?: string;
  pickup_mileage?: number;
  return_mileage?: number;
  total_days: number;
  daily_rate: number;
  total_amount: number;
  deposit_amount: number;
  additional_charges: number;
  damage_charges: number;
  final_amount?: number;
  status: 'active' | 'completed' | 'cancelled' | 'overdue';
  contract_url?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface AgencyPayment {
  id: string;
  agency_id: string;
  amount: number;
  currency: string;
  payment_method?: string;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  transaction_id?: string;
  payment_date?: Date;
  billing_period_start?: Date;
  billing_period_end?: Date;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface RentalPayment {
  id: string;
  rental_id: string;
  agency_id: string;
  client_id: string;
  amount: number;
  currency: string;
  payment_method?: string;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  transaction_id?: string;
  payment_date?: Date;
  payment_type: 'deposit' | 'rental_fee' | 'additional_charges' | 'damage_fee';
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ActivityLog {
  id: string;
  user_type: 'platform_admin' | 'agency' | 'client';
  user_id: string;
  agency_id?: string;
  action: string;
  entity_type?: string;
  entity_id?: string;
  description?: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, any>;
  created_at: Date;
}

export interface Notification {
  id: string;
  agency_id?: string;
  recipient_type: 'client' | 'agency' | 'admin';
  recipient_id: string;
  recipient_email?: string;
  recipient_phone?: string;
  notification_type: string;
  subject?: string;
  message: string;
  template_name?: string;
  template_data?: Record<string, any>;
  delivery_method: 'email' | 'sms' | 'push';
  status: 'pending' | 'sent' | 'failed' | 'delivered';
  sent_at?: Date;
  error_message?: string;
  created_at: Date;
}

// API Request/Response types
export interface LoginRequest {
  email: string;
  password: string;
  user_type: 'platform_admin' | 'agency' | 'client';
  agency_slug?: string; // Required for client login
}

export interface LoginResponse {
  user: PlatformAdmin | Agency | Client;
  token: string;
  refresh_token: string;
  expires_in: number;
}

export interface RegisterAgencyRequest {
  name: string;
  slug: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
}

export interface RegisterClientRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  date_of_birth?: string;
  driver_license_number?: string;
  driver_license_expiry?: string;
}

export interface CreateCarRequest {
  category_id?: string;
  brand: string;
  model: string;
  year: number;
  color?: string;
  license_plate?: string;
  vin?: string;
  fuel_type: string;
  transmission: string;
  seats?: number;
  doors?: number;
  mileage?: number;
  price_per_day: number;
  price_per_week?: number;
  price_per_month?: number;
  deposit_amount?: number;
  features?: string[];
  description?: string;
}

export interface CreateReservationRequest {
  car_id: string;
  start_date: string;
  end_date: string;
  pickup_time?: string;
  return_time?: string;
  pickup_location?: string;
  return_location?: string;
  special_requests?: string;
}

export interface UpdateAgencySettingsRequest {
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  font_family?: string;
  custom_css?: string;
  contact_email?: string;
  contact_phone?: string;
  business_hours?: Record<string, { open: string; close: string }>;
  terms_and_conditions?: string;
  privacy_policy?: string;
}

// Dashboard statistics types
export interface AgencyDashboardStats {
  agency_id: string;
  agency_name: string;
  total_cars: number;
  total_clients: number;
  total_reservations: number;
  total_rentals: number;
  available_cars: number;
  pending_reservations: number;
  active_rentals: number;
  total_revenue: number;
}

export interface PlatformAdminStats {
  total_agencies: number;
  active_agencies: number;
  trial_agencies: number;
  total_cars: number;
  total_clients: number;
  total_reservations: number;
  total_rentals: number;
  total_platform_revenue: number;
}

// Error types
export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: any;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}
