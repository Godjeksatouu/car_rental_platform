import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME || 'car_rental_platform',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  charset: 'utf8mb4',
  timezone: '+00:00'
};

// Create connection pool
export const pool = mysql.createPool(dbConfig);

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.execute('SELECT NOW() as now');
    connection.release();
    console.log('✅ Database connected successfully at:', (result as any)[0].now);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

// Database query helper with error handling
export const query = async (text: string, params?: any[]): Promise<any> => {
  const start = Date.now();
  try {
    const [rows, fields] = await pool.execute(text, params);
    const duration = Date.now() - start;

    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Query executed:', { text, duration: `${duration}ms`, rows: Array.isArray(rows) ? rows.length : 0 });
    }

    return { rows, fields };
  } catch (error) {
    console.error('❌ Database query error:', { text, params, error });
    throw error;
  }
};

// Transaction helper
export const transaction = async (callback: (connection: any) => Promise<any>): Promise<any> => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// Database health check
export const healthCheck = async (): Promise<{ status: string; timestamp: string; connections: number }> => {
  try {
    const result = await query('SELECT NOW() as timestamp, (SELECT COUNT(*) FROM information_schema.processlist WHERE db = ?) as connections', [process.env.DB_NAME]);
    return {
      status: 'healthy',
      timestamp: result.rows[0].timestamp,
      connections: parseInt(result.rows[0].connections)
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      connections: 0
    };
  }
};

// Graceful shutdown
export const closePool = async (): Promise<void> => {
  try {
    await pool.end();
    console.log('🔌 Database pool closed');
  } catch (error) {
    console.error('❌ Error closing database pool:', error);
  }
};

// Common database utilities
export const dbUtils = {
  // Check if record exists
  exists: async (table: string, conditions: Record<string, any>): Promise<boolean> => {
    const whereClause = Object.keys(conditions).map((key) => `${key} = ?`).join(' AND ');
    const values = Object.values(conditions);
    const result = await query(`SELECT EXISTS(SELECT 1 FROM ${table} WHERE ${whereClause}) as exists_result`, values);
    return Boolean(result.rows[0].exists_result);
  },

  // Get single record
  findOne: async (table: string, conditions: Record<string, any>, columns = '*'): Promise<any> => {
    const whereClause = Object.keys(conditions).map((key) => `${key} = ?`).join(' AND ');
    const values = Object.values(conditions);
    const result = await query(`SELECT ${columns} FROM ${table} WHERE ${whereClause} LIMIT 1`, values);
    return result.rows[0] || null;
  },

  // Get multiple records
  findMany: async (table: string, conditions: Record<string, any> = {}, columns = '*', orderBy = 'created_at DESC', limit?: number): Promise<any[]> => {
    let queryText = `SELECT ${columns} FROM ${table}`;
    const values: any[] = [];

    if (Object.keys(conditions).length > 0) {
      const whereClause = Object.keys(conditions).map((key) => `${key} = ?`).join(' AND ');
      queryText += ` WHERE ${whereClause}`;
      values.push(...Object.values(conditions));
    }

    queryText += ` ORDER BY ${orderBy}`;

    if (limit) {
      queryText += ` LIMIT ${limit}`;
    }

    const result = await query(queryText, values);
    return result.rows;
  },

  // Insert record
  insert: async (table: string, data: Record<string, any>): Promise<any> => {
    // Generate UUID if not provided
    if (!data.id) {
      data.id = require('uuid').v4();
    }

    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);

    const result = await query(
      `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`,
      values
    );

    // For UUID primary keys, return the record using the provided/generated ID
    if (data.id) {
      const insertedRecord = await dbUtils.findOne(table, { id: data.id });
      return insertedRecord;
    }

    // Fallback for auto-increment IDs
    if (result.rows && (result.rows as any).insertId) {
      const insertedRecord = await dbUtils.findOne(table, { id: (result.rows as any).insertId });
      return insertedRecord;
    }

    return null;
  },

  // Update record
  update: async (table: string, data: Record<string, any>, conditions: Record<string, any>): Promise<any> => {
    const setClause = Object.keys(data).map((key) => `${key} = ?`).join(', ');
    const whereClause = Object.keys(conditions).map((key) => `${key} = ?`).join(' AND ');
    const values = [...Object.values(data), ...Object.values(conditions)];

    await query(
      `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`,
      values
    );

    // Return the updated record
    return await dbUtils.findOne(table, conditions);
  },

  // Delete record (soft delete if has is_active column)
  delete: async (table: string, conditions: Record<string, any>, soft = true): Promise<boolean> => {
    if (soft) {
      // Check if table has is_active column
      const hasIsActive = await query(
        `SELECT column_name FROM information_schema.columns WHERE table_name = ? AND column_name = 'is_active'`,
        [table]
      );

      if (hasIsActive.rows.length > 0) {
        const result = await dbUtils.update(table, { is_active: 0 }, conditions);
        return !!result;
      }
    }

    // Hard delete
    const whereClause = Object.keys(conditions).map((key) => `${key} = ?`).join(' AND ');
    const values = Object.values(conditions);
    const result = await query(`DELETE FROM ${table} WHERE ${whereClause}`, values);
    return (result.rows as any).affectedRows > 0;
  }
};

export default pool;
