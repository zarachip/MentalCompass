import { MusicRecommendationsResponse, MusicTrack } from '@/types';
import { apiRequest } from './queryClient';

/**
 * Get music recommendations based on the user's mood
 * @param moodId The ID of the analyzed mood
 * @returns Promise with recommended music tracks
 */
export async function getMusicRecommendations(moodId: number): Promise<MusicRecommendationsResponse> {
  return await apiRequest({
    method: 'POST',
    url: '/api/music/recommendations',
    data: { moodId },
  });
}

/**
 * Get all available music tracks
 * @returns Promise with all music tracks
 */
export async function getAllMusicTracks(): Promise<{ tracks: MusicTrack[] }> {
  return await apiRequest({
    method: 'GET',
    url: '/api/music/tracks',
  });
}

/**
 * Get an appropriate music icon based on genre
 * @param genre The music genre
 * @returns The icon string
 */
export function getMusicIcon(genre: string): string {
  switch (genre.toLowerCase()) {
    case 'pop':
      return '🎵';
    case 'rock':
      return '🎸';
    case 'jazz':
      return '🎷';
    case 'classical':
      return '🎻';
    case 'electronic':
      return '🎧';
    case 'ambient':
      return '🌊';
    case 'hip hop':
    case 'hip-hop':
      return '🎤';
    case 'country':
      return '🤠';
    case 'new age':
      return '✨';
    default:
      return '🎵';
  }
}

/**
 * Get an appropriate color for the music mood
 * @param mood The mood of the music
 * @returns A CSS color class
 */
export function getMusicMoodColor(mood: string): string {
  switch (mood.toLowerCase()) {
    case 'happy':
      return 'bg-yellow-500';
    case 'sad':
      return 'bg-blue-500';
    case 'anxious':
      return 'bg-purple-500';
    case 'calm':
      return 'bg-green-500';
    case 'neutral':
      return 'bg-gray-500';
    default:
      return 'bg-gray-500';
  }
}