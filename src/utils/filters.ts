import { BasketballCourt, CourtFilter } from '../types';

// Calculate distance between two coordinates using Haversine formula
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Filter courts based on criteria
export function filterCourts(courts: BasketballCourt[], filter: CourtFilter): BasketballCourt[] {
  return courts.filter(court => {
    // Indoor/Outdoor filter
    if (filter.isIndoor !== undefined && court.isIndoor !== filter.isIndoor) {
      return false;
    }

    // Skill level range filter
    if (filter.skillLevelMin !== undefined && court.skillLevel < filter.skillLevelMin) {
      return false;
    }
    if (filter.skillLevelMax !== undefined && court.skillLevel > filter.skillLevelMax) {
      return false;
    }

    // Surface type filter
    if (filter.surfaceType !== undefined && court.surfaceType !== filter.surfaceType) {
      return false;
    }

    // Lighting filter
    if (filter.isLighted !== undefined && court.isLighted !== filter.isLighted) {
      return false;
    }

    // Minimum player count filter
    if (filter.minPlayerCount !== undefined && court.playerCount < filter.minPlayerCount) {
      return false;
    }

    // Location-based filter (radius search)
    if (filter.latitude !== undefined && filter.longitude !== undefined && filter.radius !== undefined) {
      const distance = calculateDistance(
        filter.latitude,
        filter.longitude,
        court.latitude,
        court.longitude
      );
      if (distance > filter.radius) {
        return false;
      }
    }

    return true;
  });
}

// Sort courts by distance from a given point
export function sortCourtsByDistance(
  courts: BasketballCourt[],
  latitude: number,
  longitude: number
): BasketballCourt[] {
  return courts.sort((a, b) => {
    const distanceA = calculateDistance(latitude, longitude, a.latitude, a.longitude);
    const distanceB = calculateDistance(latitude, longitude, b.latitude, b.longitude);
    return distanceA - distanceB;
  });
}

// Get unique surface types from courts
export function getSurfaceTypes(courts: BasketballCourt[]): string[] {
  const types = new Set(courts.map(court => court.surfaceType));
  return Array.from(types).sort();
}

// Get skill level range from courts
export function getSkillLevelRange(courts: BasketballCourt[]): { min: number; max: number } {
  if (courts.length === 0) {
    return { min: 0, max: 10 };
  }

  const skillLevels = courts.map(court => court.skillLevel);
  return {
    min: Math.min(...skillLevels),
    max: Math.max(...skillLevels)
  };
} 