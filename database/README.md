# Car Rental SaaS Platform Database Schema

This database schema supports a multi-tenant SaaS platform for car rental agencies. Each agency gets their own branded sub-site while sharing the same database infrastructure.

## 🏗️ Architecture Overview

The database follows a **multi-tenant architecture** where:
- **Platform Admins** manage the entire platform
- **Agencies** are tenants with their own data isolation
- **Clients** belong to specific agencies
- All data is logically separated by `agency_id`

## 📊 Database Tables

### Core Platform Tables
- `platform_admins` - Super administrators who manage the platform
- `agencies` - Car rental agencies (tenants)
- `agency_settings` - Branding and customization per agency

### User Management
- `clients` - End-users who rent cars from agencies

### Car Management
- `car_categories` - Organize cars into categories (Economy, SUV, etc.)
- `cars` - Vehicle inventory per agency
- `car_images` - Multiple images per car with primary image support

### Booking System
- `reservations` - Client bookings (pending/confirmed)
- `rentals` - Active and completed rentals
- `rental_payments` - Payment tracking for rentals

### Platform Management
- `agency_payments` - Subscription payments from agencies
- `activity_logs` - Audit trail for all user actions
- `notifications` - Email/SMS notification queue

## 🚀 Quick Start

### 1. Create Database
```sql
-- Create database
CREATE DATABASE car_rental_saas;

-- Connect to database
\c car_rental_saas;

-- Run schema
\i database/schema.sql
\i database/constraints.sql
```

### 2. Sample Data
The schema includes sample data for development:
- Platform admin: `admin@platform.com`
- Sample agencies: Premium Car Rentals, Budget Auto Rental
- Car categories for each agency

### 3. Key Features

#### Multi-Tenancy
```sql
-- All agency-specific tables include agency_id
SELECT * FROM cars WHERE agency_id = 'agency-uuid';
SELECT * FROM clients WHERE agency_id = 'agency-uuid';
```

#### Car Availability Check
```sql
-- Check if car is available for date range
SELECT is_car_available(
    'car-uuid',
    '2024-01-15'::DATE,
    '2024-01-20'::DATE
);
```

#### Rental Cost Calculation
```sql
-- Calculate total cost for rental period
SELECT calculate_rental_total(
    'car-uuid',
    '2024-01-15'::DATE,
    '2024-01-20'::DATE
);
```

## 📈 Dashboard Views

### Agency Dashboard
```sql
SELECT * FROM agency_dashboard_stats WHERE agency_id = 'your-agency-id';
```
Returns:
- Total cars, clients, reservations, rentals
- Available cars count
- Pending reservations
- Active rentals
- Total revenue

### Platform Admin Dashboard
```sql
SELECT * FROM platform_admin_stats;
```
Returns:
- Total agencies (active/trial)
- Platform-wide statistics
- Total revenue

### Car Availability
```sql
SELECT * FROM car_availability WHERE agency_id = 'agency-id';
```
Shows real-time availability considering active rentals and confirmed reservations.

## 🔒 Security Features

### Row Level Security (RLS)
- Enabled on all tenant-specific tables
- Agencies can only access their own data
- Implement policies based on your authentication system

### Data Validation
- Email format validation
- Date range validation (end_date > start_date)
- Positive price constraints
- URL-friendly agency slugs

### Activity Logging
```sql
-- Log user actions
SELECT log_activity(
    'agency',           -- user_type
    'user-uuid',        -- user_id
    'agency-uuid',      -- agency_id
    'create_car',       -- action
    'car',              -- entity_type
    'car-uuid',         -- entity_id
    'Added new BMW X5', -- description
    '{"color": "blue"}' -- metadata
);
```

## 🛠️ Business Logic Functions

### Car Status Management
- Automatically updates car status when rentals start/end
- Prevents double-booking
- Handles rental conflicts

### Payment Tracking
- Separate payment tables for agency subscriptions and client rentals
- Support for multiple payment methods
- Payment status tracking

### Notification System
- Queue-based email/SMS notifications
- Template support with dynamic data
- Delivery status tracking

## 📊 Performance Optimizations

### Indexes
- Optimized for common queries (agency_id, status, dates)
- Partial indexes for active records
- GiST indexes for date range queries

### Maintenance Functions
```sql
-- Clean up old logs (run monthly)
SELECT cleanup_old_activity_logs();
SELECT cleanup_old_notifications();
```

## 🔄 Typical Workflows

### 1. Agency Registration
```sql
-- 1. Create agency
INSERT INTO agencies (name, slug, email, password_hash, ...) VALUES (...);

-- 2. Create agency settings
INSERT INTO agency_settings (agency_id, primary_color, ...) VALUES (...);

-- 3. Create default car categories
INSERT INTO car_categories (agency_id, name, description) VALUES (...);
```

### 2. Car Rental Process
```sql
-- 1. Client makes reservation
INSERT INTO reservations (agency_id, client_id, car_id, ...) VALUES (...);

-- 2. Agency confirms reservation
UPDATE reservations SET status = 'confirmed' WHERE id = 'reservation-id';

-- 3. Convert to rental when picked up
INSERT INTO rentals (agency_id, client_id, car_id, reservation_id, ...) VALUES (...);

-- 4. Complete rental when returned
UPDATE rentals SET status = 'completed', actual_return_date = NOW() WHERE id = 'rental-id';
```

### 3. Payment Processing
```sql
-- Record rental payment
INSERT INTO rental_payments (rental_id, agency_id, client_id, amount, payment_method, ...) VALUES (...);

-- Record agency subscription payment
INSERT INTO agency_payments (agency_id, amount, payment_method, billing_period_start, ...) VALUES (...);
```

## 🚨 Important Notes

1. **UUID Primary Keys**: All tables use UUIDs for better scalability and security
2. **Soft Deletes**: Use `is_active` flags instead of hard deletes
3. **Timestamps**: All tables have `created_at` and `updated_at` with automatic triggers
4. **JSON Fields**: Use JSONB for flexible data like car features and metadata
5. **Currency**: All monetary amounts are in DECIMAL(10,2) format

## 📋 Next Steps

1. **Authentication**: Implement JWT-based authentication with role-based access
2. **API Layer**: Build RESTful API endpoints for each table
3. **File Storage**: Set up cloud storage for car images and contracts
4. **Payment Integration**: Integrate with Stripe/PayPal for real payments
5. **Email Service**: Connect notification system to email service provider
6. **Monitoring**: Set up database monitoring and alerting

## 🔧 Environment Setup

### Development
```bash
# PostgreSQL with sample data
psql -d car_rental_saas -f database/schema.sql
psql -d car_rental_saas -f database/constraints.sql
```

### Production
- Enable SSL connections
- Set up read replicas for reporting
- Configure automated backups
- Implement connection pooling
- Set up monitoring and alerting

This schema provides a solid foundation for a scalable car rental SaaS platform with proper multi-tenancy, security, and business logic built-in.
