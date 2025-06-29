-- Car Rental SaaS Platform - MySQL Schema
-- Compatible with MySQL 8.0+

-- =============================================
-- DATABASE SETUP
-- =============================================

-- Create database (run as root)
-- CREATE DATABASE car_rental_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE car_rental_platform;

-- =============================================
-- PLATFORM ADMIN TABLES
-- =============================================

-- Platform administrators (super users)
CREATE TABLE platform_admins (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- AGENCY TABLES
-- =============================================

-- Car rental agencies (tenants)
CREATE TABLE agencies (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
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
    subscription_plan ENUM('trial', 'basic', 'professional', 'enterprise') DEFAULT 'trial',
    subscription_status ENUM('trial', 'active', 'suspended', 'cancelled') DEFAULT 'trial',
    subscription_expires_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Agency branding and customization settings
CREATE TABLE agency_settings (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    agency_id VARCHAR(36) NOT NULL,
    logo_url VARCHAR(500),
    primary_color VARCHAR(7) DEFAULT '#3B82F6',
    secondary_color VARCHAR(7) DEFAULT '#1F2937',
    font_family VARCHAR(100) DEFAULT 'Inter',
    custom_css TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    business_hours JSON,
    terms_and_conditions TEXT,
    privacy_policy TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agency_id) REFERENCES agencies(id) ON DELETE CASCADE
);

-- =============================================
-- CLIENT TABLES
-- =============================================

-- End-users who rent cars from agencies
CREATE TABLE clients (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    agency_id VARCHAR(36) NOT NULL,
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
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agency_id) REFERENCES agencies(id) ON DELETE CASCADE,
    UNIQUE KEY unique_agency_email (agency_id, email)
);

-- =============================================
-- CAR MANAGEMENT TABLES
-- =============================================

-- Car categories for better organization
CREATE TABLE car_categories (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    agency_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agency_id) REFERENCES agencies(id) ON DELETE CASCADE
);

-- Cars managed by agencies
CREATE TABLE cars (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    agency_id VARCHAR(36) NOT NULL,
    category_id VARCHAR(36),
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    color VARCHAR(50),
    license_plate VARCHAR(20),
    vin VARCHAR(50),
    fuel_type ENUM('gasoline', 'diesel', 'electric', 'hybrid') DEFAULT 'gasoline',
    transmission ENUM('manual', 'automatic', 'cvt') DEFAULT 'automatic',
    seats INT DEFAULT 5,
    doors INT DEFAULT 4,
    daily_rate DECIMAL(10,2) NOT NULL,
    weekly_rate DECIMAL(10,2),
    monthly_rate DECIMAL(10,2),
    mileage INT DEFAULT 0,
    features JSON,
    status ENUM('available', 'rented', 'maintenance', 'retired') DEFAULT 'available',
    location VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agency_id) REFERENCES agencies(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES car_categories(id) ON DELETE SET NULL
);

-- Car images with support for multiple images per car
CREATE TABLE car_images (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    car_id VARCHAR(36) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
);

-- =============================================
-- BOOKING SYSTEM TABLES
-- =============================================

-- Client reservations
CREATE TABLE reservations (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    agency_id VARCHAR(36) NOT NULL,
    client_id VARCHAR(36) NOT NULL,
    car_id VARCHAR(36) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    pickup_time TIME DEFAULT '09:00:00',
    return_time TIME DEFAULT '17:00:00',
    pickup_location VARCHAR(255),
    return_location VARCHAR(255),
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agency_id) REFERENCES agencies(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
);

-- Active rentals (confirmed reservations become rentals)
CREATE TABLE rentals (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    agency_id VARCHAR(36) NOT NULL,
    client_id VARCHAR(36) NOT NULL,
    car_id VARCHAR(36) NOT NULL,
    reservation_id VARCHAR(36),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    actual_start_date DATE,
    actual_return_date DATE,
    pickup_mileage INT,
    return_mileage INT,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('active', 'completed', 'overdue', 'cancelled') DEFAULT 'active',
    damage_notes TEXT,
    late_fees DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agency_id) REFERENCES agencies(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
    FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE SET NULL
);

-- =============================================
-- PAYMENT TRACKING TABLES
-- =============================================

-- Payment records for agencies (subscription payments)
CREATE TABLE agency_payments (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    agency_id VARCHAR(36) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50),
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    transaction_id VARCHAR(255),
    billing_period_start DATE,
    billing_period_end DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agency_id) REFERENCES agencies(id) ON DELETE CASCADE
);

-- Payment records for client rentals
CREATE TABLE rental_payments (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    rental_id VARCHAR(36) NOT NULL,
    agency_id VARCHAR(36) NOT NULL,
    client_id VARCHAR(36) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50),
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    transaction_id VARCHAR(255),
    payment_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rental_id) REFERENCES rentals(id) ON DELETE CASCADE,
    FOREIGN KEY (agency_id) REFERENCES agencies(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- =============================================
-- ACTIVITY LOGGING TABLES
-- =============================================

-- System activity logs
CREATE TABLE activity_logs (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_type ENUM('platform_admin', 'agency', 'client') NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    agency_id VARCHAR(36),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id VARCHAR(36),
    description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agency_id) REFERENCES agencies(id) ON DELETE CASCADE
);

-- =============================================
-- NOTIFICATION SYSTEM
-- =============================================

-- Email/SMS notifications queue
CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    agency_id VARCHAR(36),
    recipient_type ENUM('client', 'agency', 'admin') NOT NULL,
    recipient_id VARCHAR(36) NOT NULL,
    recipient_email VARCHAR(255),
    recipient_phone VARCHAR(20),
    notification_type VARCHAR(50) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    template_name VARCHAR(100),
    template_data JSON,
    delivery_method ENUM('email', 'sms', 'push') NOT NULL,
    status ENUM('pending', 'sent', 'failed', 'delivered') DEFAULT 'pending',
    sent_at TIMESTAMP NULL,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agency_id) REFERENCES agencies(id) ON DELETE CASCADE
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
CREATE INDEX idx_cars_category ON cars(category_id);

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

-- Activity log indexes
CREATE INDEX idx_activity_logs_agency_id ON activity_logs(agency_id);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_type, user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- =============================================
-- SAMPLE DATA FOR DEVELOPMENT
-- =============================================

-- Insert sample platform admin
INSERT INTO platform_admins (email, password_hash, first_name, last_name) VALUES
('admin@platform.com', '$2b$12$LQv3c1yqBw2fNKjPMF6vLOEqr5d5QQ5vJ5J5J5J5J5J5J5J5J5J5J', 'Platform', 'Admin');

-- Insert sample agencies
INSERT INTO agencies (name, slug, email, password_hash, phone, address, city, state, country) VALUES
('Premium Car Rentals', 'premium-cars', 'admin@premiumcars.com', '$2b$12$LQv3c1yqBw2fNKjPMF6vLOEqr5d5QQ5vJ5J5J5J5J5J5J5J5J5J5J', '+1-555-0101', '123 Main St', 'New York', 'NY', 'USA'),
('Budget Auto Rental', 'budget-auto', 'admin@budgetauto.com', '$2b$12$LQv3c1yqBw2fNKjPMF6vLOEqr5d5QQ5vJ5J5J5J5J5J5J5J5J5J5J', '+1-555-0102', '456 Oak Ave', 'Los Angeles', 'CA', 'USA');
