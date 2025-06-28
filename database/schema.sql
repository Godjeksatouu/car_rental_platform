-- Car Rental SaaS Platform Database Schema
-- Multi-tenant architecture supporting agencies, clients, and platform admin

-- Enable UUID extension for PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PLATFORM ADMIN TABLES
-- =============================================

-- Platform administrators (super admin)
CREATE TABLE platform_admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'super_admin',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- AGENCY TABLES
-- =============================================

-- Car rental agencies (tenants)
CREATE TABLE agencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL, -- for subdomain/path (e.g., platform.com/agency-slug)
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    website VARCHAR(255),
    description TEXT,
    subscription_plan VARCHAR(50) DEFAULT 'basic', -- basic, premium, enterprise
    subscription_status VARCHAR(50) DEFAULT 'trial', -- trial, active, suspended, cancelled
    subscription_expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agency branding and customization settings
CREATE TABLE agency_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    logo_url VARCHAR(500),
    primary_color VARCHAR(7) DEFAULT '#3B82F6', -- hex color
    secondary_color VARCHAR(7) DEFAULT '#1F2937',
    font_family VARCHAR(100) DEFAULT 'Inter',
    custom_css TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    business_hours JSONB, -- {"monday": {"open": "09:00", "close": "18:00"}, ...}
    terms_and_conditions TEXT,
    privacy_policy TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- CLIENT TABLES
-- =============================================

-- End-users who rent cars from agencies
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    driver_license_number VARCHAR(50),
    driver_license_expiry DATE,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(agency_id, email) -- Email unique per agency
);

-- =============================================
-- CAR MANAGEMENT TABLES
-- =============================================

-- Car categories for better organization
CREATE TABLE car_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cars managed by agencies
CREATE TABLE cars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    category_id UUID REFERENCES car_categories(id) ON DELETE SET NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    color VARCHAR(50),
    license_plate VARCHAR(20),
    vin VARCHAR(50),
    fuel_type VARCHAR(50) NOT NULL, -- gasoline, diesel, electric, hybrid
    transmission VARCHAR(50) NOT NULL, -- manual, automatic, cvt
    seats INTEGER DEFAULT 5,
    doors INTEGER DEFAULT 4,
    mileage INTEGER DEFAULT 0,
    price_per_day DECIMAL(10,2) NOT NULL,
    price_per_week DECIMAL(10,2),
    price_per_month DECIMAL(10,2),
    deposit_amount DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'available', -- available, rented, maintenance, unavailable
    features JSONB, -- ["GPS", "Bluetooth", "Air Conditioning", ...]
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Car images
CREATE TABLE car_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- RESERVATION & RENTAL TABLES
-- =============================================

-- Client reservations
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    pickup_time TIME DEFAULT '09:00:00',
    return_time TIME DEFAULT '18:00:00',
    pickup_location TEXT,
    return_location TEXT,
    total_days INTEGER NOT NULL,
    daily_rate DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    deposit_amount DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, cancelled, completed, converted_to_rental
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Active rentals (confirmed reservations become rentals)
CREATE TABLE rentals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    actual_pickup_date TIMESTAMP,
    actual_return_date TIMESTAMP,
    pickup_location TEXT,
    return_location TEXT,
    pickup_mileage INTEGER,
    return_mileage INTEGER,
    total_days INTEGER NOT NULL,
    daily_rate DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    deposit_amount DECIMAL(10,2) DEFAULT 0,
    additional_charges DECIMAL(10,2) DEFAULT 0,
    damage_charges DECIMAL(10,2) DEFAULT 0,
    final_amount DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'active', -- active, completed, cancelled, overdue
    contract_url VARCHAR(500), -- PDF contract file URL
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- PAYMENT TRACKING TABLES
-- =============================================

-- Payment records for agencies (subscription payments)
CREATE TABLE agency_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50), -- credit_card, bank_transfer, paypal, stripe, manual
    payment_status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed, refunded
    transaction_id VARCHAR(255),
    payment_date TIMESTAMP,
    billing_period_start DATE,
    billing_period_end DATE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment records for client rentals
CREATE TABLE rental_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rental_id UUID NOT NULL REFERENCES rentals(id) ON DELETE CASCADE,
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50), -- cash, credit_card, debit_card, bank_transfer
    payment_status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed, refunded
    transaction_id VARCHAR(255),
    payment_date TIMESTAMP,
    payment_type VARCHAR(50), -- deposit, rental_fee, additional_charges, damage_fee
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- ACTIVITY LOGGING TABLES
-- =============================================

-- System activity logs
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_type VARCHAR(50) NOT NULL, -- platform_admin, agency, client
    user_id UUID NOT NULL,
    agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE, -- null for platform admin actions
    action VARCHAR(100) NOT NULL, -- login, logout, create_car, update_reservation, etc.
    entity_type VARCHAR(50), -- car, reservation, rental, client, etc.
    entity_id UUID,
    description TEXT,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB, -- additional context data
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- NOTIFICATION TABLES
-- =============================================

-- Email/SMS notifications queue
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
    recipient_type VARCHAR(50) NOT NULL, -- client, agency, admin
    recipient_id UUID NOT NULL,
    recipient_email VARCHAR(255),
    recipient_phone VARCHAR(20),
    notification_type VARCHAR(50) NOT NULL, -- reservation_confirmed, rental_reminder, payment_due, etc.
    subject VARCHAR(255),
    message TEXT NOT NULL,
    template_name VARCHAR(100),
    template_data JSONB,
    delivery_method VARCHAR(50) DEFAULT 'email', -- email, sms, push
    status VARCHAR(50) DEFAULT 'pending', -- pending, sent, failed, delivered
    sent_at TIMESTAMP,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Agency indexes
CREATE INDEX idx_agencies_slug ON agencies(slug);
CREATE INDEX idx_agencies_email ON agencies(email);
CREATE INDEX idx_agencies_subscription_status ON agencies(subscription_status);

-- Client indexes
CREATE INDEX idx_clients_agency_email ON clients(agency_id, email);
CREATE INDEX idx_clients_agency_id ON clients(agency_id);

-- Car indexes
CREATE INDEX idx_cars_agency_id ON cars(agency_id);
CREATE INDEX idx_cars_status ON cars(status);
CREATE INDEX idx_cars_agency_status ON cars(agency_id, status);

-- Reservation indexes
CREATE INDEX idx_reservations_agency_id ON reservations(agency_id);
CREATE INDEX idx_reservations_client_id ON reservations(client_id);
CREATE INDEX idx_reservations_car_id ON reservations(car_id);
CREATE INDEX idx_reservations_dates ON reservations(start_date, end_date);
CREATE INDEX idx_reservations_status ON reservations(status);

-- Rental indexes
CREATE INDEX idx_rentals_agency_id ON rentals(agency_id);
CREATE INDEX idx_rentals_client_id ON rentals(client_id);
CREATE INDEX idx_rentals_car_id ON rentals(car_id);
CREATE INDEX idx_rentals_dates ON rentals(start_date, end_date);
CREATE INDEX idx_rentals_status ON rentals(status);

-- Payment indexes
CREATE INDEX idx_agency_payments_agency_id ON agency_payments(agency_id);
CREATE INDEX idx_agency_payments_status ON agency_payments(payment_status);
CREATE INDEX idx_rental_payments_rental_id ON rental_payments(rental_id);
CREATE INDEX idx_rental_payments_agency_id ON rental_payments(agency_id);

-- Activity log indexes
CREATE INDEX idx_activity_logs_user ON activity_logs(user_type, user_id);
CREATE INDEX idx_activity_logs_agency ON activity_logs(agency_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- =============================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at columns
CREATE TRIGGER update_agencies_updated_at BEFORE UPDATE ON agencies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agency_settings_updated_at BEFORE UPDATE ON agency_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cars_updated_at BEFORE UPDATE ON cars FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rentals_updated_at BEFORE UPDATE ON rentals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agency_payments_updated_at BEFORE UPDATE ON agency_payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rental_payments_updated_at BEFORE UPDATE ON rental_payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- USEFUL VIEWS FOR REPORTING
-- =============================================

-- Agency dashboard summary view
CREATE VIEW agency_dashboard_stats AS
SELECT
    a.id as agency_id,
    a.name as agency_name,
    COUNT(DISTINCT c.id) as total_cars,
    COUNT(DISTINCT cl.id) as total_clients,
    COUNT(DISTINCT r.id) as total_reservations,
    COUNT(DISTINCT rt.id) as total_rentals,
    COUNT(DISTINCT CASE WHEN c.status = 'available' THEN c.id END) as available_cars,
    COUNT(DISTINCT CASE WHEN r.status = 'pending' THEN r.id END) as pending_reservations,
    COUNT(DISTINCT CASE WHEN rt.status = 'active' THEN rt.id END) as active_rentals,
    COALESCE(SUM(CASE WHEN rt.status = 'completed' THEN rt.final_amount END), 0) as total_revenue
FROM agencies a
LEFT JOIN cars c ON a.id = c.agency_id AND c.is_active = true
LEFT JOIN clients cl ON a.id = cl.agency_id AND cl.is_active = true
LEFT JOIN reservations r ON a.id = r.agency_id
LEFT JOIN rentals rt ON a.id = rt.agency_id
WHERE a.is_active = true
GROUP BY a.id, a.name;

-- Platform admin dashboard view
CREATE VIEW platform_admin_stats AS
SELECT
    COUNT(DISTINCT a.id) as total_agencies,
    COUNT(DISTINCT CASE WHEN a.subscription_status = 'active' THEN a.id END) as active_agencies,
    COUNT(DISTINCT CASE WHEN a.subscription_status = 'trial' THEN a.id END) as trial_agencies,
    COUNT(DISTINCT c.id) as total_cars,
    COUNT(DISTINCT cl.id) as total_clients,
    COUNT(DISTINCT r.id) as total_reservations,
    COUNT(DISTINCT rt.id) as total_rentals,
    COALESCE(SUM(ap.amount), 0) as total_platform_revenue
FROM agencies a
LEFT JOIN cars c ON a.id = c.agency_id AND c.is_active = true
LEFT JOIN clients cl ON a.id = cl.agency_id AND cl.is_active = true
LEFT JOIN reservations r ON a.id = r.agency_id
LEFT JOIN rentals rt ON a.id = rt.agency_id
LEFT JOIN agency_payments ap ON a.id = ap.agency_id AND ap.payment_status = 'completed'
WHERE a.is_active = true;

-- Car availability view
CREATE VIEW car_availability AS
SELECT
    c.id as car_id,
    c.agency_id,
    c.brand,
    c.model,
    c.year,
    c.price_per_day,
    c.status,
    CASE
        WHEN c.status != 'available' THEN false
        WHEN EXISTS (
            SELECT 1 FROM rentals rt
            WHERE rt.car_id = c.id
            AND rt.status = 'active'
            AND CURRENT_DATE BETWEEN rt.start_date AND rt.end_date
        ) THEN false
        WHEN EXISTS (
            SELECT 1 FROM reservations r
            WHERE r.car_id = c.id
            AND r.status = 'confirmed'
            AND CURRENT_DATE BETWEEN r.start_date AND r.end_date
        ) THEN false
        ELSE true
    END as is_available_now
FROM cars c
WHERE c.is_active = true;

-- =============================================
-- SAMPLE DATA (OPTIONAL - FOR DEVELOPMENT)
-- =============================================

-- Insert sample platform admin
INSERT INTO platform_admins (email, password_hash, first_name, last_name) VALUES
('admin@platform.com', '$2b$12$LQv3c1yqBw2fNKjPMF6vLOEqr5d5QQ5vJ5J5J5J5J5J5J5J5J5J5J', 'Platform', 'Admin');

-- Insert sample agencies
INSERT INTO agencies (name, slug, email, password_hash, phone, address, city, state, country) VALUES
('Premium Car Rentals', 'premium-cars', 'admin@premiumcars.com', '$2b$12$LQv3c1yqBw2fNKjPMF6vLOEqr5d5QQ5vJ5J5J5J5J5J5J5J5J5J5J', '+1-555-0101', '123 Main St', 'New York', 'NY', 'USA'),
('Budget Auto Rental', 'budget-auto', 'admin@budgetauto.com', '$2b$12$LQv3c1yqBw2fNKjPMF6vLOEqr5d5QQ5vJ5J5J5J5J5J5J5J5J5J5J', '+1-555-0102', '456 Oak Ave', 'Los Angeles', 'CA', 'USA');

-- Insert agency settings
INSERT INTO agency_settings (agency_id, primary_color, secondary_color, contact_email, contact_phone)
SELECT id, '#2563EB', '#1F2937', email, phone FROM agencies;

-- Insert sample car categories
INSERT INTO car_categories (agency_id, name, description)
SELECT id, 'Economy', 'Fuel-efficient and budget-friendly vehicles' FROM agencies
UNION ALL
SELECT id, 'Compact', 'Small cars perfect for city driving' FROM agencies
UNION ALL
SELECT id, 'SUV', 'Spacious vehicles for families and groups' FROM agencies
UNION ALL
SELECT id, 'Luxury', 'Premium vehicles with high-end features' FROM agencies;
