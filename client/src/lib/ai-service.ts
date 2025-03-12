
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with API key from the server
// The actual API key will be stored securely on the server
const genAI = new GoogleGenerativeAI("");

export interface MoodAnalysisResult {
  mood: {
    id: string;
    name: string;
    emoji: string;
    intensity: number;
    color: string;
  };
  keywords: string[];
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  icon: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
  link: string;
}

const openaiService = {
  analyzeMood: async (text: string): Promise<MoodAnalysisResult> => {
    try {
      // In a real implementation, this would call the server endpoint
      // which would use the Gemini API securely
      const response = await fetch("/api/analyze-mood", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to analyze mood");
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error analyzing mood:", error);
      throw error;
    }
  },
  
  getActivityRecommendations: async (moodId: string): Promise<Activity[]> => {
    try {
      const response = await fetch(`/api/recommendations?moodId=${moodId}`);
      
      if (!response.ok) {
        throw new Error("Failed to get recommendations");
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error getting recommendations:", error);
      throw error;
    }
  },
  
  sendChatMessage: async (message: string): Promise<string> => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      
      const data = await response.json();
      return data.reply;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }
};

export const getMusicRecommendations = async (moodId: string): Promise<{ tracks: MusicTrack[] }> => {
  try {
    const response = await fetch(`/api/music-recommendations?moodId=${moodId}`);
    
    if (!response.ok) {
      throw new Error("Failed to get music recommendations");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error getting music recommendations:", error);
    throw error;
  }
};

export default openaiService;
