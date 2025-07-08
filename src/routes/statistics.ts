import { Router, Request, Response } from 'express';
import { dataStore } from '../data/store';
import { 
  validateUpdateProfile,
  validateIdParam 
} from '../middleware/validation';
import { Statistics, UserProfile, UpdateProfileRequest, ApiResponse } from '../types';

const router = Router();

// GET /api/statistics - Fetch user statistics
router.get('/', async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    const statistics = dataStore.getStatisticsByUserId(userId);
    
    if (!statistics) {
      return res.status(404).json({
        success: false,
        error: 'Statistics not found for this user'
      });
    }

    const response: ApiResponse<Statistics> = {
      success: true,
      data: statistics
    };
    
    res.json(response);
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
    return;
  }
});

// GET /api/statistics/:userId - Fetch specific user statistics
router.get('/:userId', validateIdParam, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }
    const statistics = dataStore.getStatisticsByUserId(userId);
    
    if (!statistics) {
      return res.status(404).json({
        success: false,
        error: 'Statistics not found for this user'
      });
    }

    const response: ApiResponse<Statistics> = {
      success: true,
      data: statistics
    };
    
    res.json(response);
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
    return;
  }
});

// GET /api/profile - Fetch user profile
router.get('/profile', async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    const profile = dataStore.getProfileById(userId);
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }

    const response: ApiResponse<UserProfile> = {
      success: true,
      data: profile
    };
    
    res.json(response);
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile'
    });
    return;
  }
});

// GET /api/profile/:userId - Fetch specific user profile
router.get('/profile/:userId', validateIdParam, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }
    const profile = dataStore.getProfileById(userId);
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }

    const response: ApiResponse<UserProfile> = {
      success: true,
      data: profile
    };
    
    res.json(response);
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile'
    });
    return;
  }
});

// PUT /api/profile - Update user profile
router.put('/profile', validateUpdateProfile, async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    const updateData: UpdateProfileRequest = req.body;
    
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    const updatedProfile = dataStore.updateProfile(userId, updateData);
    
    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }

    const response: ApiResponse<UserProfile> = {
      success: true,
      data: updatedProfile,
      message: 'Profile updated successfully'
    };
    
    res.json(response);
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
    return;
  }
});

// PUT /api/profile/:userId - Update specific user profile
router.put('/profile/:userId', validateUpdateProfile, validateIdParam, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }
    const updateData: UpdateProfileRequest = req.body;

    const updatedProfile = dataStore.updateProfile(userId, updateData);
    
    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }

    const response: ApiResponse<UserProfile> = {
      success: true,
      data: updatedProfile,
      message: 'Profile updated successfully'
    };
    
    res.json(response);
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
    return;
  }
});

// POST /api/profile - Create new user profile
router.post('/profile', async (req: Request, res: Response) => {
  try {
    const { username, email, skillLevel = 5.0 } = req.body;
    
    if (!username || !email) {
      return res.status(400).json({
        success: false,
        error: 'Username and email are required'
      });
    }

    const newProfile = dataStore.createProfile({
      username,
      email,
      skillLevel,
      totalGames: 0,
      totalHours: 0
    });

    const response: ApiResponse<UserProfile> = {
      success: true,
      data: newProfile,
      message: 'Profile created successfully'
    };
    
    res.status(201).json(response);
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create profile'
    });
    return;
  }
});

export default router; 