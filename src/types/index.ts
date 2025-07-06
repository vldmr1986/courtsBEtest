// Basketball Court Types
export interface BasketballCourt {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  isIndoor: boolean;
  surfaceType: string;
  isLighted: boolean;
  playerCount: number;
  skillLevel: number;
  description: string;
}

export interface CreateBasketballCourtRequest {
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  isIndoor: boolean;
  surfaceType: string;
  isLighted: boolean;
  description: string;
}

export interface UpdateCourtPlayersRequest {
  playerCount: number;
}

export interface UpdateCourtSkillRequest {
  skillLevel: number;
}

// Game Types
export enum GameStatus {
  UPCOMING = 'upcoming',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface Game {
  id: string;
  courtId: string;
  courtName: string;
  dateTime: Date;
  playerCount: number;
  skillLevel: number;
  isUpcoming: boolean;
  status: GameStatus;
  createdBy: string;
  players: string[];
  maxPlayers: number;
}

export interface CreateGameRequest {
  courtId: string;
  dateTime: Date;
  skillLevel: number;
  maxPlayers: number;
  createdBy: string;
}

export interface JoinGameRequest {
  userId: string;
}

export interface LeaveGameRequest {
  userId: string;
}

// Statistics Types
export interface GameStats {
  gameId: string;
  courtName: string;
  date: Date;
  result: 'win' | 'loss' | 'draw';
  skillLevel: number;
  duration: number; // in hours
}

export interface SkillDataPoint {
  date: Date;
  skillLevel: number;
}

export interface ActivityDataPoint {
  date: Date;
  gamesPlayed: number;
  hoursPlayed: number;
}

export interface Statistics {
  userId: string;
  totalGames: number;
  totalHours: number;
  winRate: number;
  averageSkillLevel: number;
  favoriteCourt: string;
  gamesPlayed: GameStats[];
  skillProgress: SkillDataPoint[];
  weeklyActivity: ActivityDataPoint[];
  monthlyActivity: ActivityDataPoint[];
  yearlyActivity: ActivityDataPoint[];
}

// User Profile Types
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  skillLevel: number;
  totalGames: number;
  totalHours: number;
  favoriteCourt?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateProfileRequest {
  username?: string;
  email?: string;
  skillLevel?: number;
}

// Filter Types
export interface CourtFilter {
  isIndoor?: boolean;
  skillLevelMin?: number;
  skillLevelMax?: number;
  surfaceType?: string;
  isLighted?: boolean;
  minPlayerCount?: number;
  latitude?: number;
  longitude?: number;
  radius?: number; // in kilometers
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error Types
export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: any;
} 