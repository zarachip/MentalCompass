import { apiRequest } from "./queryClient";
import { MoodAnalysisResponse, ChatResponse, ActivityRecommendationsResponse } from "@/types";

export async function analyzeMood(text: string): Promise<MoodAnalysisResponse> {
  return apiRequest<MoodAnalysisResponse>({
    method: "POST",
    url: "/api/mood/analyze",
    data: { text }
  });
}

export async function sendChatMessage(
  message: string, 
  conversation?: { role: "user" | "assistant"; content: string }[]
): Promise<ChatResponse> {
  return apiRequest<ChatResponse>({
    method: "POST",
    url: "/api/chat/message",
    data: { message, conversation }
  });
}

export async function getActivityRecommendations(moodId: number): Promise<ActivityRecommendationsResponse> {
  return apiRequest<ActivityRecommendationsResponse>({
    method: "POST",
    url: "/api/activities/recommendations",
    data: { moodId }
  });
}

export async function completeActivity(activityId: number): Promise<any> {
  return apiRequest<any>({
    method: "POST",
    url: "/api/activities/complete",
    data: { activityId }
  });
}

export default {
  analyzeMood,
  sendChatMessage,
  getActivityRecommendations,
  completeActivity
};
