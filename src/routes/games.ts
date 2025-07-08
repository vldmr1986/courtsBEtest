import { Router, Request, Response } from 'express';
import { dataStore } from '../data/store';
import { 
  validateCreateGame, 
  validateJoinGame, 
  validateLeaveGame,
  validateIdParam 
} from '../middleware/validation';
import { Game, CreateGameRequest, JoinGameRequest, LeaveGameRequest, ApiResponse, GameStatus } from '../types';

const router = Router();

// GET /api/games - Fetch all games
router.get('/', async (_req: Request, res: Response) => {
  try {
    const games = dataStore.getAllGames();
    
    const response: ApiResponse<Game[]> = {
      success: true,
      data: games
    };
    
    res.json(response);
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch games'
    });
    return;
  }
});

// GET /api/games/upcoming - Fetch upcoming games
router.get('/upcoming', async (_req: Request, res: Response) => {
  try {
    const upcomingGames = dataStore.getUpcomingGames();
    
    const response: ApiResponse<Game[]> = {
      success: true,
      data: upcomingGames
    };
    
    res.json(response);
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch upcoming games'
    });
    return;
  }
});

// GET /api/games/:id - Get specific game by ID
router.get('/:id', validateIdParam, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid game ID'
      });
    }
    const game = dataStore.getGameById(id);
    
    if (!game) {
      return res.status(404).json({
        success: false,
        error: 'Game not found'
      });
    }

    const response: ApiResponse<Game> = {
      success: true,
      data: game
    };
    
    res.json(response);
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch game'
    });
    return;
  }
});

// POST /api/games - Create a new game
router.post('/', validateCreateGame, async (req: Request, res: Response) => {
  try {
    const gameData: CreateGameRequest = req.body;
    
    // Get court name for the game
    const court = dataStore.getCourtById(gameData.courtId);
    if (!court) {
      return res.status(404).json({
        success: false,
        error: 'Court not found'
      });
    }

    const newGame = dataStore.createGame({
      ...gameData,
      courtName: court.name,
      playerCount: 1, // Creator is the first player
      isUpcoming: new Date(gameData.dateTime) > new Date(),
      status: GameStatus.UPCOMING,
      players: [gameData.createdBy]
    });

    const response: ApiResponse<Game> = {
      success: true,
      data: newGame,
      message: 'Game created successfully'
    };
    
    res.status(201).json(response);
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create game'
    });
    return;
  }
});

// POST /api/games/:id/join - Join a game
router.post('/:id/join', validateJoinGame, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid game ID'
      });
    }
    const { userId }: JoinGameRequest = req.body;
    
    const game = dataStore.getGameById(id);
    if (!game) {
      return res.status(404).json({
        success: false,
        error: 'Game not found'
      });
    }

    // Check if game is full
    if (game.players.length >= game.maxPlayers) {
      return res.status(400).json({
        success: false,
        error: 'Game is full'
      });
    }

    // Check if user is already in the game
    if (game.players.includes(userId)) {
      return res.status(400).json({
        success: false,
        error: 'User is already in the game'
      });
    }

    // Add user to the game
    const updatedPlayers = [...game.players, userId];
    const updatedGame = dataStore.updateGame(id, {
      players: updatedPlayers,
      playerCount: updatedPlayers.length
    });

    if (!updatedGame) {
      return res.status(500).json({
        success: false,
        error: 'Failed to update game'
      });
    }

    const response: ApiResponse<Game> = {
      success: true,
      data: updatedGame,
      message: 'Successfully joined the game'
    };
    
    res.json(response);
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to join game'
    });
    return;
  }
});

// POST /api/games/:id/leave - Leave a game
router.post('/:id/leave', validateLeaveGame, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid game ID'
      });
    }
    const { userId }: LeaveGameRequest = req.body;
    
    const game = dataStore.getGameById(id);
    if (!game) {
      return res.status(404).json({
        success: false,
        error: 'Game not found'
      });
    }

    // Check if user is in the game
    if (!game.players.includes(userId)) {
      return res.status(400).json({
        success: false,
        error: 'User is not in the game'
      });
    }

    // Remove user from the game
    const updatedPlayers = game.players.filter(playerId => playerId !== userId);
    const updatedGame = dataStore.updateGame(id, {
      players: updatedPlayers,
      playerCount: updatedPlayers.length
    });

    if (!updatedGame) {
      return res.status(500).json({
        success: false,
        error: 'Failed to update game'
      });
    }

    const response: ApiResponse<Game> = {
      success: true,
      data: updatedGame,
      message: 'Successfully left the game'
    };
    
    res.json(response);
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to leave game'
    });
    return;
  }
});

// PUT /api/games/:id/status - Update game status
router.put('/:id/status', validateIdParam, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid game ID'
      });
    }
    const { status } = req.body;
    
    // Validate status
    if (!Object.values(GameStatus).includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid game status'
      });
    }

    const updatedGame = dataStore.updateGame(id, { 
      status,
      isUpcoming: status === GameStatus.UPCOMING
    });
    
    if (!updatedGame) {
      return res.status(404).json({
        success: false,
        error: 'Game not found'
      });
    }

    const response: ApiResponse<Game> = {
      success: true,
      data: updatedGame,
      message: 'Game status updated successfully'
    };
    
    res.json(response);
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update game status'
    });
    return;
  }
});

export default router; 