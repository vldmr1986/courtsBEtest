# CourtLA Backend API

A Node.js TypeScript REST API server for the CourtLA basketball court finder mobile application.

## Features

- **Basketball Courts Management**: CRUD operations for basketball courts with real-time data
- **Game Management**: Create, join, leave, and manage basketball games
- **User Statistics**: Track player performance and basketball statistics
- **User Profiles**: Manage user profiles and preferences
- **Advanced Filtering**: Filter courts by location, skill level, surface type, and more
- **Real-time Updates**: Live updates for court player counts and skill levels
- **Location Services**: Find courts near specific coordinates with radius search

## API Endpoints

### Basketball Courts

- `GET /api/courts` - Fetch all basketball courts
- `GET /api/courts/filter` - Filter courts with query parameters
- `GET /api/courts/:id` - Get specific court by ID
- `POST /api/courts` - Create a new court
- `PUT /api/courts/:id/players` - Update court player count
- `PUT /api/courts/:id/skill` - Update court skill level

### Games

- `GET /api/games` - Fetch all games
- `GET /api/games/upcoming` - Fetch upcoming games
- `GET /api/games/:id` - Get specific game by ID
- `POST /api/games` - Create a new game
- `POST /api/games/:id/join` - Join a game
- `POST /api/games/:id/leave` - Leave a game
- `PUT /api/games/:id/status` - Update game status

### Statistics & Profiles

- `GET /api/statistics` - Fetch user statistics (requires userId query param)
- `GET /api/statistics/:userId` - Fetch specific user statistics
- `GET /api/profile` - Fetch user profile (requires userId query param)
- `GET /api/profile/:userId` - Fetch specific user profile
- `POST /api/profile` - Create new user profile
- `PUT /api/profile` - Update user profile (requires userId query param)
- `PUT /api/profile/:userId` - Update specific user profile

### System

- `GET /health` - Health check endpoint
- `GET /` - API information and available endpoints

## Data Models

### BasketballCourt
```typescript
interface BasketballCourt {
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
```

### Game
```typescript
interface Game {
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
```

### Statistics
```typescript
interface Statistics {
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
```

## Installation

### Prerequisites

- Node.js 18.0 or later
- npm or yarn package manager

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd CourtLABackend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp env.example .env
```

4. Configure environment variables in `.env`:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# API Configuration
API_VERSION=v1
API_PREFIX=/api
```

## Development

### Running the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

### Available Scripts

- `npm run dev` - Start development server with auto-reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

### API Testing

The server includes sample data for testing. You can test the API using curl or any API client:

```bash
# Get all courts
curl http://localhost:3000/api/courts

# Filter courts
curl "http://localhost:3000/api/courts/filter?isIndoor=false&skillLevelMin=6.0"

# Get upcoming games
curl http://localhost:3000/api/games/upcoming

# Health check
curl http://localhost:3000/health
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode | `development` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in milliseconds | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |
| `API_PREFIX` | API route prefix | `/api` |

### Rate Limiting

The API includes rate limiting to prevent abuse:
- 100 requests per 15 minutes per IP address
- Configurable via environment variables

### CORS

CORS is configured to allow requests from the specified origin. Update `CORS_ORIGIN` in your environment file for production.

## Sample Data

The server includes sample data for testing:

### Basketball Courts
- Venice Beach Courts (Outdoor, Concrete)
- LA Fitness - Santa Monica (Indoor, Wood)
- Pan Pacific Park (Outdoor, Asphalt)
- YMCA - Downtown LA (Indoor, Wood)
- Echo Park Lake Courts (Outdoor, Concrete)

### Sample Users
- baller23 (Skill Level: 7.5)
- hoopmaster (Skill Level: 8.0)

### Sample Games
- Upcoming games at Venice Beach and Pan Pacific Park

## API Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": {...},
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error description",
  "details": "Optional error details"
}
```

## Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Invalid input data
- **404 Not Found**: Resource not found
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error

## Security Features

- **Helmet.js**: Security headers
- **CORS**: Cross-origin resource sharing protection
- **Rate Limiting**: Request throttling
- **Input Validation**: Request data validation
- **Error Sanitization**: Safe error messages

## Mobile App Integration

Update your iOS app's `APIService.swift` to point to this server:

```swift
private let baseURL = "http://localhost:3000/api" // Development
// private let baseURL = "https://your-production-server.com/api" // Production
```

## Development Notes

### Data Storage

Currently uses in-memory storage for development. For production, consider:
- PostgreSQL for relational data
- Redis for caching
- MongoDB for document storage

### Authentication

This version doesn't include authentication. For production, add:
- JWT token authentication
- User registration/login
- Role-based access control

### Real-time Features

For real-time updates, consider adding:
- WebSocket support
- Server-Sent Events (SSE)
- Push notifications

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 