// Test setup file
// This file is referenced in jest.config.js

// Set test environment variables
process.env['NODE_ENV'] = 'test';
process.env['PORT'] = '3001';
process.env['CORS_ORIGIN'] = 'http://localhost:3001';
process.env['RATE_LIMIT_WINDOW_MS'] = '900000';
process.env['RATE_LIMIT_MAX_REQUESTS'] = '100';
process.env['API_PREFIX'] = '/api';

// Global test timeout
jest.setTimeout(10000); 