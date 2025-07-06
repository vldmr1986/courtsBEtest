import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';

// Validation error handler
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// Court validation rules
export const validateCreateCourt = [
  body('name').isString().trim().isLength({ min: 1, max: 100 }).withMessage('Name must be between 1 and 100 characters'),
  body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
  body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
  body('address').isString().trim().isLength({ min: 1, max: 200 }).withMessage('Address must be between 1 and 200 characters'),
  body('isIndoor').isBoolean().withMessage('isIndoor must be a boolean'),
  body('surfaceType').isString().trim().isLength({ min: 1, max: 50 }).withMessage('Surface type must be between 1 and 50 characters'),
  body('isLighted').isBoolean().withMessage('isLighted must be a boolean'),
  body('description').optional().isString().trim().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  handleValidationErrors
];

export const validateUpdateCourtPlayers = [
  param('id').isString().trim().isLength({ min: 1 }).withMessage('Court ID is required'),
  body('playerCount').isInt({ min: 0, max: 100 }).withMessage('Player count must be between 0 and 100'),
  handleValidationErrors
];

export const validateUpdateCourtSkill = [
  param('id').isString().trim().isLength({ min: 1 }).withMessage('Court ID is required'),
  body('skillLevel').isFloat({ min: 0, max: 10 }).withMessage('Skill level must be between 0 and 10'),
  handleValidationErrors
];

// Game validation rules
export const validateCreateGame = [
  body('courtId').isString().trim().isLength({ min: 1 }).withMessage('Court ID is required'),
  body('dateTime').isISO8601().withMessage('DateTime must be a valid ISO 8601 date'),
  body('skillLevel').isFloat({ min: 0, max: 10 }).withMessage('Skill level must be between 0 and 10'),
  body('maxPlayers').isInt({ min: 2, max: 20 }).withMessage('Max players must be between 2 and 20'),
  body('createdBy').isString().trim().isLength({ min: 1 }).withMessage('Created by user ID is required'),
  handleValidationErrors
];

export const validateJoinGame = [
  param('id').isString().trim().isLength({ min: 1 }).withMessage('Game ID is required'),
  body('userId').isString().trim().isLength({ min: 1 }).withMessage('User ID is required'),
  handleValidationErrors
];

export const validateLeaveGame = [
  param('id').isString().trim().isLength({ min: 1 }).withMessage('Game ID is required'),
  body('userId').isString().trim().isLength({ min: 1 }).withMessage('User ID is required'),
  handleValidationErrors
];

// Profile validation rules
export const validateUpdateProfile = [
  body('username').optional().isString().trim().isLength({ min: 1, max: 50 }).withMessage('Username must be between 1 and 50 characters'),
  body('email').optional().isEmail().withMessage('Email must be a valid email address'),
  body('skillLevel').optional().isFloat({ min: 0, max: 10 }).withMessage('Skill level must be between 0 and 10'),
  handleValidationErrors
];

// Filter validation rules
export const validateCourtFilter = [
  query('isIndoor').optional().isBoolean().withMessage('isIndoor must be a boolean'),
  query('skillLevelMin').optional().isFloat({ min: 0, max: 10 }).withMessage('Skill level min must be between 0 and 10'),
  query('skillLevelMax').optional().isFloat({ min: 0, max: 10 }).withMessage('Skill level max must be between 0 and 10'),
  query('surfaceType').optional().isString().trim().isLength({ min: 1, max: 50 }).withMessage('Surface type must be between 1 and 50 characters'),
  query('isLighted').optional().isBoolean().withMessage('isLighted must be a boolean'),
  query('minPlayerCount').optional().isInt({ min: 0, max: 100 }).withMessage('Min player count must be between 0 and 100'),
  query('latitude').optional().isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
  query('longitude').optional().isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
  query('radius').optional().isFloat({ min: 0, max: 100 }).withMessage('Radius must be between 0 and 100 kilometers'),
  handleValidationErrors
];

// ID parameter validation
export const validateIdParam = [
  param('id').isString().trim().isLength({ min: 1 }).withMessage('ID parameter is required'),
  handleValidationErrors
]; 