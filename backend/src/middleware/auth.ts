import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { dbUtils } from '../config/database.js';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        user_type: 'platform_admin' | 'agency' | 'client';
        agency_id?: string;
      };
    }
  }
}

// JWT utilities
export const jwtUtils = {
  // Generate access token
  generateAccessToken: (payload: any): string => {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
  },

  // Generate refresh token
  generateRefreshToken: (payload: any): string => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
    });
  },

  // Verify token
  verifyToken: (token: string, isRefresh = false): any => {
    const secret = isRefresh ? process.env.JWT_REFRESH_SECRET! : process.env.JWT_SECRET!;
    return jwt.verify(token, secret);
  }
};

// Password utilities
export const passwordUtils = {
  // Hash password
  hash: async (password: string): Promise<string> => {
    const rounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
    return await bcrypt.hash(password, rounds);
  },

  // Compare password
  compare: async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
  }
};

// Authentication middleware
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: {
          message: 'Access token required',
          code: 'MISSING_TOKEN'
        }
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    try {
      const decoded = jwtUtils.verifyToken(token);
      
      // Verify user still exists and is active
      let user = null;
      switch (decoded.user_type) {
        case 'platform_admin':
          user = await dbUtils.findOne('platform_admins', { id: decoded.id, is_active: 1 });
          break;
        case 'agency':
          user = await dbUtils.findOne('agencies', { id: decoded.id, is_active: 1 });
          break;
        case 'client':
          user = await dbUtils.findOne('clients', { id: decoded.id, is_active: 1 });
          break;
      }

      if (!user) {
        return res.status(401).json({
          error: {
            message: 'Invalid or expired token',
            code: 'INVALID_TOKEN'
          }
        });
      }

      // Add user info to request
      req.user = {
        id: user.id,
        email: user.email,
        user_type: decoded.user_type,
        agency_id: user.agency_id || user.id // For agencies, agency_id is their own id
      };

      next();
    } catch (jwtError) {
      return res.status(401).json({
        error: {
          message: 'Invalid or expired token',
          code: 'INVALID_TOKEN'
        }
      });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      error: {
        message: 'Authentication failed',
        code: 'AUTH_ERROR'
      }
    });
  }
};

// Authorization middleware for different user types
export const authorize = (...allowedUserTypes: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: {
          message: 'Authentication required',
          code: 'NOT_AUTHENTICATED'
        }
      });
    }

    if (!allowedUserTypes.includes(req.user.user_type)) {
      return res.status(403).json({
        error: {
          message: 'Insufficient permissions',
          code: 'FORBIDDEN'
        }
      });
    }

    next();
  };
};

// Agency isolation middleware - ensures agencies can only access their own data
export const enforceAgencyIsolation = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      error: {
        message: 'Authentication required',
        code: 'NOT_AUTHENTICATED'
      }
    });
  }

  // Platform admins can access all data
  if (req.user.user_type === 'platform_admin') {
    return next();
  }

  // For agencies and clients, ensure they can only access their own agency's data
  if (req.user.user_type === 'agency' || req.user.user_type === 'client') {
    // Add agency_id to query parameters or body for filtering
    if (req.method === 'GET') {
      req.query.agency_id = req.user.agency_id;
    } else if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      if (req.body && typeof req.body === 'object') {
        req.body.agency_id = req.user.agency_id;
      }
    }
  }

  next();
};

// Rate limiting middleware (basic implementation)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const rateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || 'unknown';
    const now = Date.now();
    
    const userRequests = requestCounts.get(key);
    
    if (!userRequests || now > userRequests.resetTime) {
      requestCounts.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    if (userRequests.count >= maxRequests) {
      return res.status(429).json({
        error: {
          message: 'Too many requests',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: Math.ceil((userRequests.resetTime - now) / 1000)
        }
      });
    }
    
    userRequests.count++;
    next();
  };
};

// Validation middleware
export const validateRequest = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: error.details.map((detail: any) => ({
            field: detail.path.join('.'),
            message: detail.message
          }))
        }
      });
    }
    
    next();
  };
};

// Activity logging middleware
export const logActivity = (action: string, entityType?: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user) {
        const logData = {
          id: generateUUID(),
          user_type: req.user.user_type,
          user_id: req.user.id,
          agency_id: req.user.agency_id || null,
          action,
          entity_type: entityType || null,
          entity_id: req.params.id || null,
          description: `${action} ${entityType || 'resource'}`,
          ip_address: req.ip,
          user_agent: req.get('User-Agent'),
          metadata: JSON.stringify({
            method: req.method,
            path: req.path,
            query: req.query,
            body: req.method !== 'GET' ? req.body : undefined
          }),
          created_at: new Date()
        };

        await dbUtils.insert('activity_logs', logData);
      }
    } catch (error) {
      console.error('Activity logging error:', error);
      // Don't fail the request if logging fails
    }
    
    next();
  };
};

// UUID generator (simple implementation)
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
