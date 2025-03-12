import { MusicTrack, MusicRecommendationsResponse } from "@/types";
import { apiRequest } from "./queryClient";

export async function getMusicRecommendations(moodId: number): Promise<MusicRecommendationsResponse> {
  return apiRequest<MusicRecommendationsResponse>({
    url: "/api/music/recommendations",
    method: "POST",
    data: { moodId },
  });
}

export async function getAllMusicTracks(): Promise<{ tracks: MusicTrack[] }> {
  return apiRequest<{ tracks: MusicTrack[] }>({
    url: "/api/music/tracks",
    method: "GET",
  });
}

export function getMusicMoodColor(mood: string): string {
  switch (mood.toLowerCase()) {
    case "happy":
      return "bg-yellow-100 text-yellow-800";
    case "sad":
      return "bg-blue-100 text-blue-800";
    case "anxious":
      return "bg-purple-100 text-purple-800";
    case "calm":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function getMusicMoodEmoji(mood: string): string {
  switch (mood.toLowerCase()) {
    case "happy":
      return "😊";
    case "sad":
      return "😢";
    case "anxious":
      return "😰";
    case "calm":
      return "😌";
    default:
      return "😐";
  }
}

export function getGenreIcon(genre: string): string {
  switch (genre.toLowerCase()) {
    case "rock":
      return "🎸";
    case "pop":
      return "🎤";
    case "electronic":
    case "edm":
      return "🎧";
    case "classical":
      return "🎻";
    case "jazz":
      return "🎷";
    case "ambient":
    case "new age":
      return "🌊";
    case "country":
      return "🤠";
    case "hip hop":
    case "rap":
      return "🎙️";
    default:
      return "🎵";
  }
}