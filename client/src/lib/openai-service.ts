import { apiRequest } from "./queryClient";
import { 
  MoodAnalysisResponse, 
  ChatResponse, 
  ActivityRecommendationsResponse,
  MusicRecommendationsResponse
} from "@/types";

export async function analyzeMood(text: string): Promise<MoodAnalysisResponse> {
  return await apiRequest({
    method: 'POST',
    url: '/api/mood/analyze',
    data: { text }
  });
}

export async function sendChatMessage(
  message: string, 
  conversation?: { role: "user" | "assistant"; content: string }[]
): Promise<ChatResponse> {
  return await apiRequest({
    method: 'POST',
    url: '/api/chat/message',
    data: { message, conversation }
  });
}

export async function getActivityRecommendations(moodId: number): Promise<ActivityRecommendationsResponse> {
  return await apiRequest({
    method: 'POST',
    url: '/api/activities/recommendations',
    data: { moodId }
  });
}

export async function getMusicRecommendations(moodId: number): Promise<MusicRecommendationsResponse> {
  return await apiRequest({
    method: 'POST',
    url: '/api/music/recommendations',
    data: { moodId }
  });
}

export async function completeActivity(activityId: number): Promise<any> {
  return await apiRequest({
    method: 'POST',
    url: '/api/activities/complete',
    data: { activityId }
  });
}

export default {
  analyzeMood,
  sendChatMessage,
  getActivityRecommendations,
  getMusicRecommendations,
  completeActivity
};
