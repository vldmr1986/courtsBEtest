import { BasketballCourt, Game, Statistics, UserProfile, GameStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';

// In-memory data stores
class DataStore {
  private courts: Map<string, BasketballCourt> = new Map();
  private games: Map<string, Game> = new Map();
  private statistics: Map<string, Statistics> = new Map();
  private profiles: Map<string, UserProfile> = new Map();

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData(): void {
    // Sample basketball courts
    const sampleCourts: BasketballCourt[] = [
      {
        id: 'court-1',
        name: 'Venice Beach Courts',
        latitude: 33.9850,
        longitude: -118.4695,
        address: '1800 Ocean Front Walk, Venice, CA 90291',
        isIndoor: false,
        surfaceType: 'Concrete',
        isLighted: true,
        playerCount: 12,
        skillLevel: 7.5,
        description: 'Famous outdoor courts with ocean views. Multiple courts available.'
      },
      {
        id: 'court-2',
        name: 'LA Fitness - Santa Monica',
        latitude: 34.0195,
        longitude: -118.4912,
        address: '1234 Wilshire Blvd, Santa Monica, CA 90401',
        isIndoor: true,
        surfaceType: 'Wood',
        isLighted: true,
        playerCount: 8,
        skillLevel: 6.0,
        description: 'Indoor court with professional flooring. Membership required.'
      },
      {
        id: 'court-3',
        name: 'Pan Pacific Park',
        latitude: 34.0762,
        longitude: -118.3614,
        address: '7600 Beverly Blvd, Los Angeles, CA 90036',
        isIndoor: false,
        surfaceType: 'Asphalt',
        isLighted: true,
        playerCount: 15,
        skillLevel: 8.0,
        description: 'Popular outdoor courts with multiple hoops. Great for pickup games.'
      },
      {
        id: 'court-4',
        name: 'YMCA - Downtown LA',
        latitude: 34.0522,
        longitude: -118.2437,
        address: '401 S Hope St, Los Angeles, CA 90071',
        isIndoor: true,
        surfaceType: 'Wood',
        isLighted: true,
        playerCount: 6,
        skillLevel: 5.5,
        description: 'Indoor court with professional equipment. YMCA membership required.'
      },
      {
        id: 'court-5',
        name: 'Echo Park Lake Courts',
        latitude: 34.0778,
        longitude: -118.2608,
        address: '751 Echo Park Ave, Los Angeles, CA 90026',
        isIndoor: false,
        surfaceType: 'Concrete',
        isLighted: false,
        playerCount: 10,
        skillLevel: 6.5,
        description: 'Scenic outdoor courts by the lake. Popular in the evenings.'
      }
    ];

    // Sample games
    const sampleGames: Game[] = [
      {
        id: 'game-1',
        courtId: 'court-1',
        courtName: 'Venice Beach Courts',
        dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        playerCount: 8,
        skillLevel: 7.0,
        isUpcoming: true,
        status: GameStatus.UPCOMING,
        createdBy: 'user-1',
        players: ['user-1', 'user-2', 'user-3'],
        maxPlayers: 10
      },
      {
        id: 'game-2',
        courtId: 'court-3',
        courtName: 'Pan Pacific Park',
        dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
        playerCount: 12,
        skillLevel: 8.0,
        isUpcoming: true,
        status: GameStatus.UPCOMING,
        createdBy: 'user-2',
        players: ['user-2', 'user-4', 'user-5'],
        maxPlayers: 15
      }
    ];

    // Sample user profiles
    const sampleProfiles: UserProfile[] = [
      {
        id: 'user-1',
        username: 'baller23',
        email: 'baller23@example.com',
        skillLevel: 7.5,
        totalGames: 45,
        totalHours: 120,
        favoriteCourt: 'Venice Beach Courts',
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date()
      },
      {
        id: 'user-2',
        username: 'hoopmaster',
        email: 'hoopmaster@example.com',
        skillLevel: 8.0,
        totalGames: 67,
        totalHours: 180,
        favoriteCourt: 'Pan Pacific Park',
        createdAt: new Date('2022-11-20'),
        updatedAt: new Date()
      }
    ];

    // Sample statistics
    const sampleStatistics: Statistics[] = [
      {
        userId: 'user-1',
        totalGames: 45,
        totalHours: 120,
        winRate: 0.65,
        averageSkillLevel: 7.5,
        favoriteCourt: 'Venice Beach Courts',
        gamesPlayed: [
          {
            gameId: 'game-1',
            courtName: 'Venice Beach Courts',
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            result: 'win',
            skillLevel: 7.5,
            duration: 2.5
          }
        ],
        skillProgress: [
          { date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), skillLevel: 7.0 },
          { date: new Date(), skillLevel: 7.5 }
        ],
        weeklyActivity: [
          { date: new Date(), gamesPlayed: 3, hoursPlayed: 8 }
        ],
        monthlyActivity: [
          { date: new Date(), gamesPlayed: 12, hoursPlayed: 32 }
        ],
        yearlyActivity: [
          { date: new Date(), gamesPlayed: 45, hoursPlayed: 120 }
        ]
      }
    ];

    // Initialize data stores
    sampleCourts.forEach(court => this.courts.set(court.id, court));
    sampleGames.forEach(game => this.games.set(game.id, game));
    sampleProfiles.forEach(profile => this.profiles.set(profile.id, profile));
    sampleStatistics.forEach(stats => this.statistics.set(stats.userId, stats));
  }

  // Court methods
  getAllCourts(): BasketballCourt[] {
    return Array.from(this.courts.values());
  }

  getCourtById(id: string): BasketballCourt | undefined {
    return this.courts.get(id);
  }

  createCourt(court: Omit<BasketballCourt, 'id'>): BasketballCourt {
    const newCourt: BasketballCourt = {
      ...court,
      id: uuidv4()
    };
    this.courts.set(newCourt.id, newCourt);
    return newCourt;
  }

  updateCourt(id: string, updates: Partial<BasketballCourt>): BasketballCourt | undefined {
    const court = this.courts.get(id);
    if (!court) return undefined;

    const updatedCourt = { ...court, ...updates };
    this.courts.set(id, updatedCourt);
    return updatedCourt;
  }

  // Game methods
  getAllGames(): Game[] {
    return Array.from(this.games.values());
  }

  getGameById(id: string): Game | undefined {
    return this.games.get(id);
  }

  getUpcomingGames(): Game[] {
    return Array.from(this.games.values()).filter(game => game.isUpcoming);
  }

  createGame(game: Omit<Game, 'id'>): Game {
    const newGame: Game = {
      ...game,
      id: uuidv4()
    };
    this.games.set(newGame.id, newGame);
    return newGame;
  }

  updateGame(id: string, updates: Partial<Game>): Game | undefined {
    const game = this.games.get(id);
    if (!game) return undefined;

    const updatedGame = { ...game, ...updates };
    this.games.set(id, updatedGame);
    return updatedGame;
  }

  // Profile methods
  getProfileById(id: string): UserProfile | undefined {
    return this.profiles.get(id);
  }

  createProfile(profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): UserProfile {
    const newProfile: UserProfile = {
      ...profile,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.profiles.set(newProfile.id, newProfile);
    return newProfile;
  }

  updateProfile(id: string, updates: Partial<UserProfile>): UserProfile | undefined {
    const profile = this.profiles.get(id);
    if (!profile) return undefined;

    const updatedProfile = { ...profile, ...updates, updatedAt: new Date() };
    this.profiles.set(id, updatedProfile);
    return updatedProfile;
  }

  // Statistics methods
  getStatisticsByUserId(userId: string): Statistics | undefined {
    return this.statistics.get(userId);
  }

  updateStatistics(userId: string, updates: Partial<Statistics>): Statistics | undefined {
    const stats = this.statistics.get(userId);
    if (!stats) return undefined;

    const updatedStats = { ...stats, ...updates };
    this.statistics.set(userId, updatedStats);
    return updatedStats;
  }
}

// Export singleton instance
export const dataStore = new DataStore(); 