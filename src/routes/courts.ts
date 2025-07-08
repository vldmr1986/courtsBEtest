import { Router, Request, Response } from 'express';
import { dataStore } from '../data/store';
import { filterCourts, sortCourtsByDistance } from '../utils/filters';
import { 
  validateCreateCourt, 
  validateUpdateCourtPlayers, 
  validateUpdateCourtSkill, 
  validateCourtFilter,
  validateIdParam 
} from '../middleware/validation';
import { BasketballCourt, CourtFilter, ApiResponse } from '../types';

const router = Router();

// GET /api/courts - Fetch all basketball courts
router.get('/', async (_req: Request, res: Response) => {
  try {
    const courts = dataStore.getAllCourts();
    
    const response: ApiResponse<BasketballCourt[]> = {
      success: true,
      data: courts
    };
    
    res.json(response);
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch courts'
    });
    return;
  }
});

// GET /api/courts/filter - Filter courts with query parameters
router.get('/filter', validateCourtFilter, async (req: Request, res: Response) => {
  try {
    const courts = dataStore.getAllCourts();
    
    // Parse filter parameters
    const filter: CourtFilter = {};
    
    if (req.query['isIndoor'] !== undefined) {
      filter.isIndoor = req.query['isIndoor'] === 'true';
    }
    if (req.query['skillLevelMin'] !== undefined) {
      filter.skillLevelMin = parseFloat(req.query['skillLevelMin'] as string);
    }
    if (req.query['skillLevelMax'] !== undefined) {
      filter.skillLevelMax = parseFloat(req.query['skillLevelMax'] as string);
    }
    if (req.query['surfaceType'] !== undefined) {
      filter.surfaceType = req.query['surfaceType'] as string;
    }
    if (req.query['isLighted'] !== undefined) {
      filter.isLighted = req.query['isLighted'] === 'true';
    }
    if (req.query['minPlayerCount'] !== undefined) {
      filter.minPlayerCount = parseInt(req.query['minPlayerCount'] as string);
    }
    if (req.query['latitude'] !== undefined) {
      filter.latitude = parseFloat(req.query['latitude'] as string);
    }
    if (req.query['longitude'] !== undefined) {
      filter.longitude = parseFloat(req.query['longitude'] as string);
    }
    if (req.query['radius'] !== undefined) {
      filter.radius = parseFloat(req.query['radius'] as string);
    }

    // Apply filters
    let filteredCourts = filterCourts(courts, filter);

    // Sort by distance if coordinates provided
    if (filter.latitude !== undefined && filter.longitude !== undefined) {
      filteredCourts = sortCourtsByDistance(filteredCourts, filter.latitude, filter.longitude);
    }

    const response: ApiResponse<BasketballCourt[]> = {
      success: true,
      data: filteredCourts
    };
    
    res.json(response);
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to filter courts'
    });
    return;
  }
});

// GET /api/courts/:id - Get specific court by ID
router.get('/:id', validateIdParam, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid court ID'
      });
    }
    const court = dataStore.getCourtById(id);
    
    if (!court) {
      return res.status(404).json({
        success: false,
        error: 'Court not found'
      });
    }

    const response: ApiResponse<BasketballCourt> = {
      success: true,
      data: court
    };
    
    res.json(response);
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch court'
    });
    return;
  }
});

// POST /api/courts - Create a new court
router.post('/', validateCreateCourt, async (req: Request, res: Response) => {
  try {
    const courtData = req.body;
    const newCourt = dataStore.createCourt({
      ...courtData,
      playerCount: 0,
      skillLevel: 5.0 // Default skill level
    });

    const response: ApiResponse<BasketballCourt> = {
      success: true,
      data: newCourt,
      message: 'Court created successfully'
    };
    
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create court'
    });
  }
});

// PUT /api/courts/:id/players - Update court player count
router.put('/:id/players', validateUpdateCourtPlayers, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid court ID'
      });
    }
    const { playerCount } = req.body;
    
    const updatedCourt = dataStore.updateCourt(id, { playerCount });
    
    if (!updatedCourt) {
      return res.status(404).json({
        success: false,
        error: 'Court not found'
      });
    }

    const response: ApiResponse<BasketballCourt> = {
      success: true,
      data: updatedCourt,
      message: 'Court player count updated successfully'
    };
    
    res.json(response);
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update court player count'
    });
    return;
  }
});

// PUT /api/courts/:id/skill - Update court skill level
router.put('/:id/skill', validateUpdateCourtSkill, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid court ID'
      });
    }
    const { skillLevel } = req.body;
    
    const updatedCourt = dataStore.updateCourt(id, { skillLevel });
    
    if (!updatedCourt) {
      return res.status(404).json({
        success: false,
        error: 'Court not found'
      });
    }

    const response: ApiResponse<BasketballCourt> = {
      success: true,
      data: updatedCourt,
      message: 'Court skill level updated successfully'
    };
    
    res.json(response);
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update court skill level'
    });
    return;
  }
});

export default router; 