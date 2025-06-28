-- Additional Database Constraints and Business Rules
-- Car Rental SaaS Platform

-- =============================================
-- BUSINESS LOGIC CONSTRAINTS
-- =============================================

-- Ensure reservation dates are logical
ALTER TABLE reservations ADD CONSTRAINT check_reservation_dates 
CHECK (end_date > start_date);

-- Ensure rental dates are logical
ALTER TABLE rentals ADD CONSTRAINT check_rental_dates 
CHECK (end_date > start_date);

-- Ensure car year is reasonable
ALTER TABLE cars ADD CONSTRAINT check_car_year 
CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1);

-- Ensure positive prices
ALTER TABLE cars ADD CONSTRAINT check_positive_daily_price 
CHECK (price_per_day > 0);

ALTER TABLE cars ADD CONSTRAINT check_positive_weekly_price 
CHECK (price_per_week IS NULL OR price_per_week > 0);

ALTER TABLE cars ADD CONSTRAINT check_positive_monthly_price 
CHECK (price_per_month IS NULL OR price_per_month > 0);

-- Ensure positive amounts in payments
ALTER TABLE agency_payments ADD CONSTRAINT check_positive_payment_amount 
CHECK (amount > 0);

ALTER TABLE rental_payments ADD CONSTRAINT check_positive_rental_payment_amount 
CHECK (amount >= 0); -- Can be 0 for some payment types

-- Ensure valid email formats (basic check)
ALTER TABLE platform_admins ADD CONSTRAINT check_admin_email_format 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE agencies ADD CONSTRAINT check_agency_email_format 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE clients ADD CONSTRAINT check_client_email_format 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Ensure agency slug is URL-friendly
ALTER TABLE agencies ADD CONSTRAINT check_agency_slug_format 
CHECK (slug ~* '^[a-z0-9-]+$' AND LENGTH(slug) >= 3 AND LENGTH(slug) <= 50);

-- Ensure only one primary image per car
CREATE UNIQUE INDEX idx_car_primary_image 
ON car_images (car_id) 
WHERE is_primary = true;

-- =============================================
-- FUNCTIONS FOR BUSINESS LOGIC
-- =============================================

-- Function to check car availability for a date range
CREATE OR REPLACE FUNCTION is_car_available(
    p_car_id UUID,
    p_start_date DATE,
    p_end_date DATE,
    p_exclude_reservation_id UUID DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
    conflict_count INTEGER;
BEGIN
    -- Check if car exists and is active
    IF NOT EXISTS (SELECT 1 FROM cars WHERE id = p_car_id AND is_active = true AND status = 'available') THEN
        RETURN FALSE;
    END IF;
    
    -- Check for conflicting reservations
    SELECT COUNT(*) INTO conflict_count
    FROM reservations r
    WHERE r.car_id = p_car_id
    AND r.status IN ('confirmed', 'pending')
    AND (r.id != p_exclude_reservation_id OR p_exclude_reservation_id IS NULL)
    AND (
        (r.start_date <= p_end_date AND r.end_date >= p_start_date)
    );
    
    -- Check for conflicting rentals
    SELECT COUNT(*) + conflict_count INTO conflict_count
    FROM rentals rt
    WHERE rt.car_id = p_car_id
    AND rt.status = 'active'
    AND (
        (rt.start_date <= p_end_date AND rt.end_date >= p_start_date)
    );
    
    RETURN conflict_count = 0;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate rental total
CREATE OR REPLACE FUNCTION calculate_rental_total(
    p_car_id UUID,
    p_start_date DATE,
    p_end_date DATE
) RETURNS DECIMAL(10,2) AS $$
DECLARE
    daily_rate DECIMAL(10,2);
    total_days INTEGER;
    total_amount DECIMAL(10,2);
BEGIN
    -- Get car daily rate
    SELECT price_per_day INTO daily_rate
    FROM cars
    WHERE id = p_car_id;
    
    IF daily_rate IS NULL THEN
        RETURN 0;
    END IF;
    
    -- Calculate total days
    total_days := p_end_date - p_start_date;
    
    IF total_days <= 0 THEN
        RETURN 0;
    END IF;
    
    -- Calculate total amount
    total_amount := daily_rate * total_days;
    
    RETURN total_amount;
END;
$$ LANGUAGE plpgsql;

-- Function to automatically update car status based on rentals
CREATE OR REPLACE FUNCTION update_car_status_from_rentals()
RETURNS TRIGGER AS $$
BEGIN
    -- If rental is activated, mark car as rented
    IF NEW.status = 'active' AND (OLD.status IS NULL OR OLD.status != 'active') THEN
        UPDATE cars SET status = 'rented' WHERE id = NEW.car_id;
    END IF;
    
    -- If rental is completed or cancelled, check if car should be available
    IF NEW.status IN ('completed', 'cancelled') AND OLD.status = 'active' THEN
        -- Only set to available if no other active rentals exist
        IF NOT EXISTS (
            SELECT 1 FROM rentals 
            WHERE car_id = NEW.car_id 
            AND status = 'active' 
            AND id != NEW.id
        ) THEN
            UPDATE cars SET status = 'available' WHERE id = NEW.car_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger for car status updates
CREATE TRIGGER trigger_update_car_status_from_rentals
    AFTER INSERT OR UPDATE ON rentals
    FOR EACH ROW
    EXECUTE FUNCTION update_car_status_from_rentals();

-- Function to create activity log entry
CREATE OR REPLACE FUNCTION log_activity(
    p_user_type VARCHAR(50),
    p_user_id UUID,
    p_agency_id UUID,
    p_action VARCHAR(100),
    p_entity_type VARCHAR(50) DEFAULT NULL,
    p_entity_id UUID DEFAULT NULL,
    p_description TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO activity_logs (
        user_type, user_id, agency_id, action, entity_type, 
        entity_id, description, metadata
    ) VALUES (
        p_user_type, p_user_id, p_agency_id, p_action, p_entity_type,
        p_entity_id, p_description, p_metadata
    ) RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- DATA CLEANUP PROCEDURES
-- =============================================

-- Procedure to clean up old activity logs (keep last 6 months)
CREATE OR REPLACE FUNCTION cleanup_old_activity_logs()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM activity_logs 
    WHERE created_at < CURRENT_DATE - INTERVAL '6 months';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Procedure to clean up old notifications (keep last 3 months)
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM notifications 
    WHERE created_at < CURRENT_DATE - INTERVAL '3 months'
    AND status IN ('sent', 'delivered', 'failed');
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- SECURITY POLICIES (ROW LEVEL SECURITY)
-- =============================================

-- Enable RLS on tenant-specific tables
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Note: RLS policies should be created based on your application's authentication system
-- Example policy for agencies (agencies can only see their own data):
-- CREATE POLICY agency_isolation ON cars FOR ALL TO app_role USING (agency_id = current_setting('app.current_agency_id')::UUID);

-- =============================================
-- PERFORMANCE OPTIMIZATION
-- =============================================

-- Partial indexes for better performance
CREATE INDEX idx_cars_available ON cars (agency_id, id) WHERE status = 'available' AND is_active = true;
CREATE INDEX idx_reservations_pending ON reservations (agency_id, created_at) WHERE status = 'pending';
CREATE INDEX idx_rentals_active ON rentals (agency_id, start_date, end_date) WHERE status = 'active';
CREATE INDEX idx_notifications_pending ON notifications (created_at) WHERE status = 'pending';

-- Index for date range queries
CREATE INDEX idx_reservations_date_range ON reservations USING GIST (daterange(start_date, end_date, '[]'));
CREATE INDEX idx_rentals_date_range ON rentals USING GIST (daterange(start_date, end_date, '[]'));

-- =============================================
-- BACKUP AND MAINTENANCE RECOMMENDATIONS
-- =============================================

/*
MAINTENANCE SCHEDULE RECOMMENDATIONS:

1. Daily:
   - Monitor active rentals and overdue returns
   - Process pending notifications
   - Check system health metrics

2. Weekly:
   - Review agency payment statuses
   - Analyze platform usage statistics
   - Clean up failed notification attempts

3. Monthly:
   - Run cleanup_old_activity_logs()
   - Run cleanup_old_notifications()
   - Review and optimize database performance
   - Generate monthly revenue reports

4. Quarterly:
   - Full database backup
   - Review and update RLS policies
   - Analyze growth trends and capacity planning

BACKUP STRATEGY:
- Daily incremental backups
- Weekly full backups
- Monthly archive to long-term storage
- Test restore procedures quarterly
*/
