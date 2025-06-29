import express from 'express';
import Joi from 'joi';
import { dbUtils } from '../config/database.js';
import { jwtUtils, passwordUtils, validateRequest, rateLimit, logActivity } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Validation schemas
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  user_type: Joi.string().valid('platform_admin', 'agency', 'client').required(),
  agency_slug: Joi.string().when('user_type', {
    is: 'client',
    then: Joi.required(),
    otherwise: Joi.optional()
  })
});

const registerAgencySchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  slug: Joi.string().min(3).max(100).pattern(/^[a-z0-9-]+$/).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  phone: Joi.string().optional(),
  address: Joi.string().optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  country: Joi.string().optional(),
  postal_code: Joi.string().optional()
});

const registerClientSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  first_name: Joi.string().min(1).max(100).required(),
  last_name: Joi.string().min(1).max(100).required(),
  phone: Joi.string().optional(),
  date_of_birth: Joi.date().optional(),
  driver_license_number: Joi.string().optional(),
  driver_license_expiry: Joi.date().optional()
});

// Apply rate limiting to auth routes
router.use(rateLimit(20, 15 * 60 * 1000)); // 20 requests per 15 minutes

// Login endpoint
router.post('/login', validateRequest(loginSchema), logActivity('login'), async (req, res) => {
  try {
    const { email, password, user_type, agency_slug } = req.body;

    let user = null;
    let tableName = '';

    // Find user based on type
    switch (user_type) {
      case 'platform_admin':
        tableName = 'platform_admins';
        user = await dbUtils.findOne(tableName, { email, is_active: 1 });
        break;
        
      case 'agency':
        tableName = 'agencies';
        user = await dbUtils.findOne(tableName, { email, is_active: 1 });
        break;
        
      case 'client':
        if (!agency_slug) {
          return res.status(400).json({
            error: {
              message: 'Agency slug is required for client login',
              code: 'MISSING_AGENCY_SLUG'
            }
          });
        }
        
        // First find the agency
        const agency = await dbUtils.findOne('agencies', { slug: agency_slug, is_active: 1 });
        if (!agency) {
          return res.status(404).json({
            error: {
              message: 'Agency not found',
              code: 'AGENCY_NOT_FOUND'
            }
          });
        }
        
        tableName = 'clients';
        user = await dbUtils.findOne(tableName, { email, agency_id: agency.id, is_active: 1 });
        break;
    }

    if (!user) {
      return res.status(401).json({
        error: {
          message: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS'
        }
      });
    }

    // Verify password
    const isValidPassword = await passwordUtils.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        error: {
          message: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS'
        }
      });
    }

    // Generate tokens
    const tokenPayload = {
      id: user.id,
      email: user.email,
      user_type,
      agency_id: user.agency_id || (user_type === 'agency' ? user.id : null)
    };

    const accessToken = jwtUtils.generateAccessToken(tokenPayload);
    const refreshToken = jwtUtils.generateRefreshToken(tokenPayload);

    // Remove password from response
    const { password_hash, ...userResponse } = user;

    res.json({
      message: 'Login successful',
      user: userResponse,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 7 * 24 * 60 * 60 // 7 days in seconds
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: {
        message: 'Login failed',
        code: 'LOGIN_ERROR'
      }
    });
  }
});

// Register agency endpoint
router.post('/register/agency', validateRequest(registerAgencySchema), logActivity('register_agency'), async (req, res) => {
  try {
    const { name, slug, email, password, phone, address, city, state, country, postal_code } = req.body;

    // Check if email or slug already exists
    const existingEmail = await dbUtils.exists('agencies', { email });
    if (existingEmail) {
      return res.status(409).json({
        error: {
          message: 'Email already registered',
          code: 'EMAIL_EXISTS'
        }
      });
    }

    const existingSlug = await dbUtils.exists('agencies', { slug });
    if (existingSlug) {
      return res.status(409).json({
        error: {
          message: 'Agency slug already taken',
          code: 'SLUG_EXISTS'
        }
      });
    }

    // Hash password
    const passwordHash = await passwordUtils.hash(password);

    // Create agency
    const agencyId = uuidv4();
    const agencyData = {
      id: agencyId,
      name,
      slug,
      email,
      password_hash: passwordHash,
      phone: phone || null,
      address: address || null,
      city: city || null,
      state: state || null,
      country: country || null,
      postal_code: postal_code || null,
      subscription_plan: 'basic',
      subscription_status: 'trial',
      subscription_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days trial
      is_active: 1,
      created_at: new Date(),
      updated_at: new Date()
    };

    const agency = await dbUtils.insert('agencies', agencyData);

    if (!agency) {
      throw new Error('Failed to create agency record');
    }

    // Create default agency settings
    const settingsData = {
      id: uuidv4(),
      agency_id: agencyId,
      primary_color: '#3B82F6',
      secondary_color: '#1F2937',
      font_family: 'Inter',
      contact_email: email,
      contact_phone: phone || null,
      created_at: new Date(),
      updated_at: new Date()
    };

    await dbUtils.insert('agency_settings', settingsData);

    // Create default car categories
    const defaultCategories = [
      { name: 'Economy', description: 'Fuel-efficient and budget-friendly vehicles' },
      { name: 'Compact', description: 'Small cars perfect for city driving' },
      { name: 'SUV', description: 'Spacious vehicles for families and groups' },
      { name: 'Luxury', description: 'Premium vehicles with high-end features' }
    ];

    for (const category of defaultCategories) {
      await dbUtils.insert('car_categories', {
        id: uuidv4(),
        agency_id: agencyId,
        name: category.name,
        description: category.description,
        created_at: new Date()
      });
    }

    // Generate tokens
    const tokenPayload = {
      id: agencyId,
      email: agency.email,
      user_type: 'agency',
      agency_id: agencyId
    };

    const accessToken = jwtUtils.generateAccessToken(tokenPayload);
    const refreshToken = jwtUtils.generateRefreshToken(tokenPayload);

    // Remove password from response
    const { password_hash, ...agencyResponse } = agency;

    res.status(201).json({
      message: 'Agency registered successfully',
      agency: agencyResponse,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 7 * 24 * 60 * 60,
      agency_url: `${process.env.FRONTEND_URL}/${slug}`
    });

  } catch (error) {
    console.error('Agency registration error:', error);

    // Provide more specific error messages
    let errorMessage = 'Registration failed';
    let errorCode = 'REGISTRATION_ERROR';

    if (error instanceof Error) {
      if (error.message.includes('ER_NO_SUCH_TABLE')) {
        errorMessage = 'Database not set up. Please run the database schema first.';
        errorCode = 'DATABASE_NOT_SETUP';
      } else if (error.message.includes('ER_BAD_DB_ERROR')) {
        errorMessage = 'Database does not exist. Please create the database first.';
        errorCode = 'DATABASE_NOT_EXISTS';
      } else if (error.message.includes('ECONNREFUSED')) {
        errorMessage = 'Cannot connect to database. Please check if MySQL is running.';
        errorCode = 'DATABASE_CONNECTION_ERROR';
      }
    }

    res.status(500).json({
      error: {
        message: errorMessage,
        code: errorCode,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }
    });
  }
});

// Register client endpoint (requires agency_slug in URL)
router.post('/register/client/:agency_slug', validateRequest(registerClientSchema), logActivity('register_client'), async (req, res) => {
  try {
    const { agency_slug } = req.params;
    const { email, password, first_name, last_name, phone, date_of_birth, driver_license_number, driver_license_expiry } = req.body;

    // Find agency
    const agency = await dbUtils.findOne('agencies', { slug: agency_slug, is_active: 1 });
    if (!agency) {
      return res.status(404).json({
        error: {
          message: 'Agency not found',
          code: 'AGENCY_NOT_FOUND'
        }
      });
    }

    // Check if email already exists for this agency
    const existingClient = await dbUtils.exists('clients', { email, agency_id: agency.id });
    if (existingClient) {
      return res.status(409).json({
        error: {
          message: 'Email already registered for this agency',
          code: 'EMAIL_EXISTS'
        }
      });
    }

    // Hash password
    const passwordHash = await passwordUtils.hash(password);

    // Create client
    const clientData = {
      id: uuidv4(),
      agency_id: agency.id,
      email,
      password_hash: passwordHash,
      first_name,
      last_name,
      phone: phone || null,
      date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
      driver_license_number: driver_license_number || null,
      driver_license_expiry: driver_license_expiry ? new Date(driver_license_expiry) : null,
      is_active: 1,
      email_verified: 0,
      created_at: new Date(),
      updated_at: new Date()
    };

    const client = await dbUtils.insert('clients', clientData);

    // Generate tokens
    const tokenPayload = {
      id: client.id,
      email: client.email,
      user_type: 'client',
      agency_id: agency.id
    };

    const accessToken = jwtUtils.generateAccessToken(tokenPayload);
    const refreshToken = jwtUtils.generateRefreshToken(tokenPayload);

    // Remove password from response
    const { password_hash, ...clientResponse } = client;

    res.status(201).json({
      message: 'Client registered successfully',
      client: clientResponse,
      agency: {
        id: agency.id,
        name: agency.name,
        slug: agency.slug
      },
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 7 * 24 * 60 * 60
    });

  } catch (error) {
    console.error('Client registration error:', error);
    res.status(500).json({
      error: {
        message: 'Registration failed',
        code: 'REGISTRATION_ERROR'
      }
    });
  }
});

// Refresh token endpoint
router.post('/refresh', async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({
        error: {
          message: 'Refresh token required',
          code: 'MISSING_REFRESH_TOKEN'
        }
      });
    }

    const decoded = jwtUtils.verifyToken(refresh_token, true);
    
    // Generate new access token
    const newAccessToken = jwtUtils.generateAccessToken({
      id: decoded.id,
      email: decoded.email,
      user_type: decoded.user_type,
      agency_id: decoded.agency_id
    });

    res.json({
      access_token: newAccessToken,
      expires_in: 7 * 24 * 60 * 60
    });

  } catch (error) {
    res.status(401).json({
      error: {
        message: 'Invalid refresh token',
        code: 'INVALID_REFRESH_TOKEN'
      }
    });
  }
});

export default router;
