import request from 'supertest';
import app from '../index';

describe('Courts API', () => {
  describe('GET /api/courts', () => {
    it('should return all courts', async () => {
      const response = await request(app)
        .get('/api/courts')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      
      // Check first court structure
      const firstCourt = response.body.data[0];
      expect(firstCourt).toHaveProperty('id');
      expect(firstCourt).toHaveProperty('name');
      expect(firstCourt).toHaveProperty('latitude');
      expect(firstCourt).toHaveProperty('longitude');
      expect(firstCourt).toHaveProperty('address');
      expect(firstCourt).toHaveProperty('isIndoor');
      expect(firstCourt).toHaveProperty('surfaceType');
      expect(firstCourt).toHaveProperty('isLighted');
      expect(firstCourt).toHaveProperty('playerCount');
      expect(firstCourt).toHaveProperty('skillLevel');
      expect(firstCourt).toHaveProperty('description');
    });
  });

  describe('GET /api/courts/filter', () => {
    it('should filter outdoor courts', async () => {
      const response = await request(app)
        .get('/api/courts/filter?isIndoor=false')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      
      // All returned courts should be outdoor
      response.body.data.forEach((court: any) => {
        expect(court.isIndoor).toBe(false);
      });
    });

    it('should filter by skill level', async () => {
      const response = await request(app)
        .get('/api/courts/filter?skillLevelMin=7.0')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      
      // All returned courts should have skill level >= 7.0
      response.body.data.forEach((court: any) => {
        expect(court.skillLevel).toBeGreaterThanOrEqual(7.0);
      });
    });
  });

  describe('GET /api/courts/:id', () => {
    it('should return a specific court', async () => {
      const response = await request(app)
        .get('/api/courts/court-1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe('court-1');
      expect(response.body.data.name).toBe('Venice Beach Courts');
    });

    it('should return 404 for non-existent court', async () => {
      const response = await request(app)
        .get('/api/courts/non-existent-id')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Court not found');
    });
  });
}); 