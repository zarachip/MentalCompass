import { apiRequest } from "./queryClient";
import { Mood, Message, Activity, ActivityCompletion } from "@/types";

export async function getMoodHistory(): Promise<{ moods: Mood[] }> {
  const response = await apiRequest("GET", "/api/mood/history");
  return await response.json();
}

export async function getChatHistory(): Promise<{ messages: Message[] }> {
  const response = await apiRequest("GET", "/api/chat/history");
  return await response.json();
}

export async function getCompletedActivities(): Promise<{ completions: ActivityCompletion[] }> {
  const response = await apiRequest("GET", "/api/activities/completed");
  return await response.json();
}

export function getMoodEmoji(mood: string): string {
  switch (mood) {
    case "happy":
      return "😊";
    case "sad":
      return "😔";
    case "anxious":
      return "😰";
    case "calm":
      return "😌";
    default:
      return "😐";
  }
}

export function getMoodColor(mood: string): string {
  switch (mood) {
    case "happy":
      return "bg-[#FFD700]";
    case "sad":
      return "bg-[#6A5ACD]";
    case "anxious":
      return "bg-[#FF7F50]";
    case "calm":
      return "bg-[#5F9EA0]";
    default:
      return "bg-[#A9A9A9]";
  }
}

export function getActivityIcon(category: string): string {
  switch (category) {
    case "relaxation":
      return "ri-mental-health-line";
    case "physical":
      return "ri-run-line";
    case "creative":
      return "ri-palette-line";
    case "social":
      return "ri-group-line";
    case "mindfulness":
      return "ri-ghost-smile-line";
    default:
      return "ri-heart-pulse-line";
  }
}

export default {
  getMoodHistory,
  getChatHistory,
  getCompletedActivities,
  getMoodEmoji,
  getMoodColor,
  getActivityIcon
};
