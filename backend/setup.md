# Car Rental SaaS Backend Setup Guide

## Prerequisites

1. **Node.js** (v18 or higher)
2. **MySQL** (v8.0 or higher)
3. **npm** or **yarn**

## Quick Start

### 1. Database Setup

First, create your MySQL database:

```sql
-- Connect to MySQL as root
mysql -u root -p

-- Create database
CREATE DATABASE car_rental_platform;

-- Create user (optional, you can use root)
CREATE USER 'car_rental_app'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON car_rental_platform.* TO 'car_rental_app'@'localhost';
FLUSH PRIVILEGES;

-- Use the database
USE car_rental_platform;

-- Run your existing schema (the one you provided)
-- Copy and paste your schema here or run it from a file
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env file with your database credentials
# Update these values in .env:
DB_HOST=localhost
DB_PORT=3306
DB_NAME=car_rental_platform
DB_USER=root  # or car_rental_app
DB_PASSWORD=your_mysql_password
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
```

### 3. Start the Server

```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm run build
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Authentication

- `POST /api/v1/auth/login` - Login for all user types
- `POST /api/v1/auth/register/agency` - Register new agency
- `POST /api/v1/auth/register/client/:agency_slug` - Register client for specific agency
- `POST /api/v1/auth/refresh` - Refresh access token

### Agency Management

- `GET /api/v1/agencies/dashboard/stats` - Get dashboard statistics
- `GET /api/v1/agencies/profile` - Get agency profile
- `PUT /api/v1/agencies/profile` - Update agency profile
- `GET /api/v1/agencies/settings` - Get agency settings
- `PUT /api/v1/agencies/settings` - Update agency settings
- `GET /api/v1/agencies/public/:slug` - Get public agency info

## Testing the API

### 1. Health Check

```bash
curl http://localhost:3001/health
```

### 2. Register an Agency

```bash
curl -X POST http://localhost:3001/api/v1/auth/register/agency \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Car Rentals",
    "slug": "premium-cars",
    "email": "admin@premiumcars.com",
    "password": "securepassword123",
    "phone": "+1-555-0101",
    "city": "New York",
    "state": "NY",
    "country": "USA"
  }'
```

### 3. Login as Agency

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@premiumcars.com",
    "password": "securepassword123",
    "user_type": "agency"
  }'
```

### 4. Get Dashboard Stats (requires token)

```bash
curl -X GET http://localhost:3001/api/v1/agencies/dashboard/stats \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

## Environment Variables

Key environment variables you need to set:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=car_rental_platform
DB_USER=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=30d

# Server
PORT=3001
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

## Database Schema

Your existing MySQL schema is already compatible! The backend is configured to work with:

- `CHAR(36)` UUIDs
- `TINYINT(1)` booleans
- `JSON` fields
- MySQL-specific syntax

## Next Steps

1. **Test the basic endpoints** using the curl commands above
2. **Add more API routes** for cars, reservations, rentals
3. **Connect your React frontend** to these endpoints
4. **Add file upload functionality** for car images and logos
5. **Implement email notifications**

## Troubleshooting

### Database Connection Issues

1. Check MySQL is running: `sudo systemctl status mysql`
2. Verify credentials in `.env` file
3. Check database exists: `SHOW DATABASES;`
4. Check user permissions: `SHOW GRANTS FOR 'your_user'@'localhost';`

### Port Already in Use

```bash
# Find process using port 3001
lsof -i :3001

# Kill the process
kill -9 PID
```

### JWT Token Issues

- Make sure `JWT_SECRET` is set in `.env`
- Token expires in 7 days by default
- Use the refresh endpoint to get new tokens

## API Response Format

All API responses follow this format:

**Success Response:**
```json
{
  "message": "Success message",
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Error Response:**
```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "status": 400
  }
}
```

## Security Features

- ✅ JWT authentication with refresh tokens
- ✅ Password hashing with bcrypt
- ✅ Rate limiting on auth endpoints
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Input validation with Joi
- ✅ SQL injection prevention
- ✅ Agency data isolation

The backend is now ready to support your car rental SaaS platform!
