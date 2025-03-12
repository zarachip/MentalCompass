import { apiRequest } from "./queryClient";
import { MoodAnalysisResponse, ChatResponse, ActivityRecommendationsResponse } from "@/types";

export async function analyzeMood(text: string): Promise<MoodAnalysisResponse> {
  const response = await apiRequest("POST", "/api/mood/analyze", { text });
  return await response.json();
}

export async function sendChatMessage(
  message: string, 
  conversation?: { role: "user" | "assistant"; content: string }[]
): Promise<ChatResponse> {
  const response = await apiRequest("POST", "/api/chat/message", { 
    message, 
    conversation 
  });
  return await response.json();
}

export async function getActivityRecommendations(moodId: number): Promise<ActivityRecommendationsResponse> {
  const response = await apiRequest("POST", "/api/activities/recommendations", { moodId });
  return await response.json();
}

export async function completeActivity(activityId: number): Promise<any> {
  const response = await apiRequest("POST", "/api/activities/complete", { activityId });
  return await response.json();
}

export default {
  analyzeMood,
  sendChatMessage,
  getActivityRecommendations,
  completeActivity
};
