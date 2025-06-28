import express from 'express';
import Joi from 'joi';
import { dbUtils, query } from '../config/database.js';
import { authenticate, authorize, enforceAgencyIsolation, validateRequest, logActivity } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Validation schemas
const updateAgencySchema = Joi.object({
  name: Joi.string().min(2).max(255).optional(),
  phone: Joi.string().optional(),
  address: Joi.string().optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  country: Joi.string().optional(),
  postal_code: Joi.string().optional(),
  website: Joi.string().uri().optional(),
  description: Joi.string().optional()
});

const updateSettingsSchema = Joi.object({
  logo_url: Joi.string().uri().optional(),
  primary_color: Joi.string().pattern(/^#[0-9A-F]{6}$/i).optional(),
  secondary_color: Joi.string().pattern(/^#[0-9A-F]{6}$/i).optional(),
  font_family: Joi.string().optional(),
  custom_css: Joi.string().optional(),
  contact_email: Joi.string().email().optional(),
  contact_phone: Joi.string().optional(),
  business_hours: Joi.object().optional(),
  terms_and_conditions: Joi.string().optional(),
  privacy_policy: Joi.string().optional()
});

// Get agency dashboard statistics
router.get('/dashboard/stats', authorize('agency'), enforceAgencyIsolation, async (req, res) => {
  try {
    const agencyId = req.user!.agency_id;

    // Get comprehensive dashboard stats
    const statsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM cars WHERE agency_id = ? AND is_active = 1) as total_cars,
        (SELECT COUNT(*) FROM cars WHERE agency_id = ? AND is_active = 1 AND status = 'available') as available_cars,
        (SELECT COUNT(*) FROM cars WHERE agency_id = ? AND is_active = 1 AND status = 'rented') as rented_cars,
        (SELECT COUNT(*) FROM clients WHERE agency_id = ? AND is_active = 1) as total_clients,
        (SELECT COUNT(*) FROM reservations WHERE agency_id = ? AND status = 'pending') as pending_reservations,
        (SELECT COUNT(*) FROM reservations WHERE agency_id = ? AND status = 'confirmed') as confirmed_reservations,
        (SELECT COUNT(*) FROM rentals WHERE agency_id = ? AND status = 'active') as active_rentals,
        (SELECT COUNT(*) FROM rentals WHERE agency_id = ? AND status = 'completed') as completed_rentals,
        (SELECT COALESCE(SUM(final_amount), 0) FROM rentals WHERE agency_id = ? AND status = 'completed') as total_revenue,
        (SELECT COALESCE(SUM(total_amount), 0) FROM reservations WHERE agency_id = ? AND status IN ('confirmed', 'pending')) as pending_revenue
    `;

    const result = await query(statsQuery, Array(10).fill(agencyId));
    const stats = result.rows[0];

    // Get recent activity (last 10 reservations)
    const recentReservationsQuery = `
      SELECT 
        r.id,
        r.start_date,
        r.end_date,
        r.total_amount,
        r.status,
        r.created_at,
        CONCAT(c.first_name, ' ', c.last_name) as client_name,
        CONCAT(car.brand, ' ', car.model) as car_name
      FROM reservations r
      JOIN clients c ON r.client_id = c.id
      JOIN cars car ON r.car_id = car.id
      WHERE r.agency_id = ?
      ORDER BY r.created_at DESC
      LIMIT 10
    `;

    const recentReservations = await query(recentReservationsQuery, [agencyId]);

    // Get monthly revenue for the last 6 months
    const monthlyRevenueQuery = `
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COALESCE(SUM(final_amount), 0) as revenue
      FROM rentals 
      WHERE agency_id = ? 
        AND status = 'completed' 
        AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month DESC
    `;

    const monthlyRevenue = await query(monthlyRevenueQuery, [agencyId]);

    res.json({
      stats: {
        cars: {
          total: parseInt(stats.total_cars),
          available: parseInt(stats.available_cars),
          rented: parseInt(stats.rented_cars)
        },
        clients: {
          total: parseInt(stats.total_clients)
        },
        reservations: {
          pending: parseInt(stats.pending_reservations),
          confirmed: parseInt(stats.confirmed_reservations)
        },
        rentals: {
          active: parseInt(stats.active_rentals),
          completed: parseInt(stats.completed_rentals)
        },
        revenue: {
          total: parseFloat(stats.total_revenue),
          pending: parseFloat(stats.pending_revenue)
        }
      },
      recent_reservations: recentReservations.rows,
      monthly_revenue: monthlyRevenue.rows
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to fetch dashboard statistics',
        code: 'DASHBOARD_ERROR'
      }
    });
  }
});

// Get agency profile
router.get('/profile', authorize('agency'), async (req, res) => {
  try {
    const agencyId = req.user!.id;

    const agency = await dbUtils.findOne('agencies', { id: agencyId }, 
      'id, name, slug, email, phone, address, city, state, country, postal_code, website, description, subscription_plan, subscription_status, subscription_expires_at, created_at'
    );

    if (!agency) {
      return res.status(404).json({
        error: {
          message: 'Agency not found',
          code: 'AGENCY_NOT_FOUND'
        }
      });
    }

    // Get agency settings
    const settings = await dbUtils.findOne('agency_settings', { agency_id: agencyId });

    res.json({
      agency,
      settings: settings || {}
    });

  } catch (error) {
    console.error('Get agency profile error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to fetch agency profile',
        code: 'PROFILE_ERROR'
      }
    });
  }
});

// Update agency profile
router.put('/profile', authorize('agency'), validateRequest(updateAgencySchema), logActivity('update_agency_profile'), async (req, res) => {
  try {
    const agencyId = req.user!.id;
    const updateData = { ...req.body, updated_at: new Date() };

    const updatedAgency = await dbUtils.update('agencies', updateData, { id: agencyId });

    if (!updatedAgency) {
      return res.status(404).json({
        error: {
          message: 'Agency not found',
          code: 'AGENCY_NOT_FOUND'
        }
      });
    }

    // Remove password hash from response
    const { password_hash, ...agencyResponse } = updatedAgency;

    res.json({
      message: 'Agency profile updated successfully',
      agency: agencyResponse
    });

  } catch (error) {
    console.error('Update agency profile error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to update agency profile',
        code: 'UPDATE_ERROR'
      }
    });
  }
});

// Get agency settings
router.get('/settings', authorize('agency'), async (req, res) => {
  try {
    const agencyId = req.user!.id;

    const settings = await dbUtils.findOne('agency_settings', { agency_id: agencyId });

    if (!settings) {
      // Create default settings if they don't exist
      const defaultSettings = {
        id: uuidv4(),
        agency_id: agencyId,
        primary_color: '#3B82F6',
        secondary_color: '#1F2937',
        font_family: 'Inter',
        created_at: new Date(),
        updated_at: new Date()
      };

      const newSettings = await dbUtils.insert('agency_settings', defaultSettings);
      return res.json(newSettings);
    }

    res.json(settings);

  } catch (error) {
    console.error('Get agency settings error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to fetch agency settings',
        code: 'SETTINGS_ERROR'
      }
    });
  }
});

// Update agency settings
router.put('/settings', authorize('agency'), validateRequest(updateSettingsSchema), logActivity('update_agency_settings'), async (req, res) => {
  try {
    const agencyId = req.user!.id;
    const updateData = { ...req.body, updated_at: new Date() };

    // Check if settings exist
    const existingSettings = await dbUtils.findOne('agency_settings', { agency_id: agencyId });

    let settings;
    if (existingSettings) {
      settings = await dbUtils.update('agency_settings', updateData, { agency_id: agencyId });
    } else {
      // Create new settings
      const newSettingsData = {
        id: uuidv4(),
        agency_id: agencyId,
        primary_color: '#3B82F6',
        secondary_color: '#1F2937',
        font_family: 'Inter',
        ...updateData,
        created_at: new Date()
      };
      settings = await dbUtils.insert('agency_settings', newSettingsData);
    }

    res.json({
      message: 'Agency settings updated successfully',
      settings
    });

  } catch (error) {
    console.error('Update agency settings error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to update agency settings',
        code: 'UPDATE_ERROR'
      }
    });
  }
});

// Get agency by slug (public endpoint for client registration)
router.get('/public/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const agency = await dbUtils.findOne('agencies', { slug, is_active: 1 }, 
      'id, name, slug, description, website, city, state, country'
    );

    if (!agency) {
      return res.status(404).json({
        error: {
          message: 'Agency not found',
          code: 'AGENCY_NOT_FOUND'
        }
      });
    }

    // Get public settings (branding info)
    const settings = await dbUtils.findOne('agency_settings', { agency_id: agency.id }, 
      'logo_url, primary_color, secondary_color, font_family, contact_email, contact_phone, business_hours'
    );

    res.json({
      agency,
      settings: settings || {}
    });

  } catch (error) {
    console.error('Get public agency error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to fetch agency information',
        code: 'AGENCY_ERROR'
      }
    });
  }
});

export default router;
