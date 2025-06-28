-- Car Rental SaaS Platform - Database Setup Script
-- Run this script to set up the complete database

-- =============================================
-- DATABASE CREATION (Run as superuser)
-- =============================================

-- Uncomment these lines if creating a new database
-- CREATE DATABASE car_rental_saas;
-- CREATE USER car_rental_app WITH PASSWORD 'your_secure_password';
-- GRANT ALL PRIVILEGES ON DATABASE car_rental_saas TO car_rental_app;

-- Connect to the database
-- \c car_rental_saas;

-- =============================================
-- EXTENSIONS
-- =============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist"; -- For date range indexes

-- =============================================
-- LOAD MAIN SCHEMA
-- =============================================

-- The main schema is in schema.sql
-- \i schema.sql

-- =============================================
-- LOAD CONSTRAINTS AND FUNCTIONS
-- =============================================

-- Additional constraints and business logic
-- \i constraints.sql

-- =============================================
-- INITIAL CONFIGURATION DATA
-- =============================================

-- Default car categories that every agency should have
CREATE TEMP TABLE default_categories (name VARCHAR(100), description TEXT);

INSERT INTO default_categories VALUES
('Economy', 'Fuel-efficient and budget-friendly vehicles perfect for city driving'),
('Compact', 'Small cars ideal for urban environments and easy parking'),
('Mid-size', 'Comfortable vehicles with good balance of space and efficiency'),
('Full-size', 'Spacious cars perfect for longer trips and business travel'),
('SUV', 'Sport Utility Vehicles for families and outdoor adventures'),
('Luxury', 'Premium vehicles with high-end features and comfort'),
('Van/Minivan', 'Large vehicles perfect for groups and cargo transport'),
('Convertible', 'Open-top vehicles for scenic drives and special occasions'),
('Electric', 'Eco-friendly electric vehicles for environmentally conscious drivers'),
('Hybrid', 'Fuel-efficient hybrid vehicles combining gas and electric power');

-- Default notification templates
CREATE TEMP TABLE notification_templates (
    template_name VARCHAR(100),
    subject VARCHAR(255),
    message TEXT
);

INSERT INTO notification_templates VALUES
('reservation_confirmed', 
 'Reservation Confirmed - {{car_brand}} {{car_model}}',
 'Dear {{client_name}},\n\nYour reservation has been confirmed!\n\nDetails:\n- Car: {{car_brand}} {{car_model}} ({{car_year}})\n- Pickup Date: {{start_date}}\n- Return Date: {{end_date}}\n- Total Amount: ${{total_amount}}\n\nReservation ID: {{reservation_id}}\n\nThank you for choosing {{agency_name}}!'),

('rental_reminder', 
 'Rental Pickup Reminder - Tomorrow',
 'Dear {{client_name}},\n\nThis is a reminder that your rental pickup is scheduled for tomorrow.\n\nDetails:\n- Car: {{car_brand}} {{car_model}}\n- Pickup Date: {{start_date}}\n- Pickup Time: {{pickup_time}}\n- Location: {{pickup_location}}\n\nPlease bring your driver''s license and credit card.\n\nSee you tomorrow!\n{{agency_name}}'),

('rental_overdue',
 'Vehicle Return Overdue - {{car_brand}} {{car_model}}',
 'Dear {{client_name}},\n\nYour rental vehicle was due for return on {{end_date}}, but we have not received it yet.\n\nPlease contact us immediately to arrange the return.\n\nLate fees may apply.\n\nContact: {{agency_phone}}\n{{agency_name}}'),

('payment_due',
 'Payment Due - {{agency_name}}',
 'Dear {{agency_name}},\n\nYour subscription payment is due.\n\nAmount: ${{amount}}\nDue Date: {{due_date}}\nPlan: {{subscription_plan}}\n\nPlease update your payment method in the dashboard.\n\nThank you,\nPlatform Team'),

('welcome_agency',
 'Welcome to Car Rental Platform!',
 'Dear {{agency_name}},\n\nWelcome to our car rental platform!\n\nYour agency website is now live at: {{agency_url}}\n\nNext steps:\n1. Upload your logo and customize your branding\n2. Add your car inventory\n3. Configure your business settings\n\nIf you need help, contact our support team.\n\nBest regards,\nPlatform Team'),

('welcome_client',
 'Welcome to {{agency_name}}!',
 'Dear {{client_name}},\n\nWelcome to {{agency_name}}!\n\nYour account has been created successfully. You can now:\n- Browse our car inventory\n- Make reservations online\n- Manage your bookings\n- View your rental history\n\nStart browsing at: {{agency_url}}\n\nHappy driving!\n{{agency_name}}');

-- =============================================
-- HELPER FUNCTIONS FOR SETUP
-- =============================================

-- Function to create default categories for a new agency
CREATE OR REPLACE FUNCTION create_default_categories_for_agency(p_agency_id UUID)
RETURNS INTEGER AS $$
DECLARE
    category_count INTEGER := 0;
    category_record RECORD;
BEGIN
    FOR category_record IN SELECT name, description FROM default_categories LOOP
        INSERT INTO car_categories (agency_id, name, description)
        VALUES (p_agency_id, category_record.name, category_record.description);
        category_count := category_count + 1;
    END LOOP;
    
    RETURN category_count;
END;
$$ LANGUAGE plpgsql;

-- Function to setup a new agency with defaults
CREATE OR REPLACE FUNCTION setup_new_agency(
    p_name VARCHAR(255),
    p_slug VARCHAR(100),
    p_email VARCHAR(255),
    p_password_hash VARCHAR(255),
    p_phone VARCHAR(20) DEFAULT NULL,
    p_address TEXT DEFAULT NULL,
    p_city VARCHAR(100) DEFAULT NULL,
    p_state VARCHAR(100) DEFAULT NULL,
    p_country VARCHAR(100) DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    new_agency_id UUID;
BEGIN
    -- Create agency
    INSERT INTO agencies (name, slug, email, password_hash, phone, address, city, state, country)
    VALUES (p_name, p_slug, p_email, p_password_hash, p_phone, p_address, p_city, p_state, p_country)
    RETURNING id INTO new_agency_id;
    
    -- Create agency settings with defaults
    INSERT INTO agency_settings (agency_id, contact_email, contact_phone)
    VALUES (new_agency_id, p_email, p_phone);
    
    -- Create default car categories
    PERFORM create_default_categories_for_agency(new_agency_id);
    
    -- Log the agency creation
    PERFORM log_activity(
        'platform_admin',
        (SELECT id FROM platform_admins LIMIT 1), -- Assume first admin created it
        new_agency_id,
        'create_agency',
        'agency',
        new_agency_id,
        'New agency created: ' || p_name,
        json_build_object('agency_name', p_name, 'agency_slug', p_slug)::jsonb
    );
    
    RETURN new_agency_id;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- DATA VALIDATION FUNCTIONS
-- =============================================

-- Function to validate database integrity
CREATE OR REPLACE FUNCTION validate_database_integrity()
RETURNS TABLE(check_name TEXT, status TEXT, details TEXT) AS $$
BEGIN
    -- Check for agencies without settings
    RETURN QUERY
    SELECT 
        'agencies_without_settings'::TEXT,
        CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END::TEXT,
        'Agencies without settings: ' || COUNT(*)::TEXT
    FROM agencies a
    LEFT JOIN agency_settings s ON a.id = s.agency_id
    WHERE s.id IS NULL AND a.is_active = true;
    
    -- Check for cars without categories
    RETURN QUERY
    SELECT 
        'cars_without_categories'::TEXT,
        CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'WARN' END::TEXT,
        'Cars without categories: ' || COUNT(*)::TEXT
    FROM cars c
    WHERE c.category_id IS NULL AND c.is_active = true;
    
    -- Check for reservations with invalid dates
    RETURN QUERY
    SELECT 
        'invalid_reservation_dates'::TEXT,
        CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END::TEXT,
        'Reservations with invalid dates: ' || COUNT(*)::TEXT
    FROM reservations
    WHERE end_date <= start_date;
    
    -- Check for rentals with invalid dates
    RETURN QUERY
    SELECT 
        'invalid_rental_dates'::TEXT,
        CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END::TEXT,
        'Rentals with invalid dates: ' || COUNT(*)::TEXT
    FROM rentals
    WHERE end_date <= start_date;
    
    -- Check for orphaned records
    RETURN QUERY
    SELECT 
        'orphaned_clients'::TEXT,
        CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END::TEXT,
        'Clients without valid agency: ' || COUNT(*)::TEXT
    FROM clients c
    LEFT JOIN agencies a ON c.agency_id = a.id
    WHERE a.id IS NULL;
    
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- PERFORMANCE MONITORING
-- =============================================

-- Function to get database statistics
CREATE OR REPLACE FUNCTION get_database_stats()
RETURNS TABLE(
    table_name TEXT,
    row_count BIGINT,
    table_size TEXT,
    index_size TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        schemaname||'.'||tablename as table_name,
        n_tup_ins - n_tup_del as row_count,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as table_size,
        pg_size_pretty(pg_indexes_size(schemaname||'.'||tablename)) as index_size
    FROM pg_stat_user_tables
    WHERE schemaname = 'public'
    ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- CLEANUP PROCEDURES
-- =============================================

-- Drop temporary tables
DROP TABLE IF EXISTS default_categories;
DROP TABLE IF EXISTS notification_templates;

-- =============================================
-- FINAL SETUP VERIFICATION
-- =============================================

-- Verify setup
DO $$
BEGIN
    RAISE NOTICE 'Database setup completed successfully!';
    RAISE NOTICE 'Tables created: %', (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public');
    RAISE NOTICE 'Functions created: %', (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public');
    RAISE NOTICE 'Indexes created: %', (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public');
END $$;

-- Show validation results
SELECT * FROM validate_database_integrity();

-- =============================================
-- USAGE EXAMPLES
-- =============================================

/*
-- Create a new agency with defaults:
SELECT setup_new_agency(
    'Luxury Car Rentals',
    'luxury-cars',
    'admin@luxurycars.com',
    '$2b$12$hashed_password_here',
    '+1-555-0123',
    '789 Premium Ave',
    'Miami',
    'FL',
    'USA'
);

-- Check database integrity:
SELECT * FROM validate_database_integrity();

-- Get database statistics:
SELECT * FROM get_database_stats();

-- Clean up old data:
SELECT cleanup_old_activity_logs();
SELECT cleanup_old_notifications();
*/
