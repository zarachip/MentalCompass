export interface Mood {
  id: number;
  userId: number;
  text: string;
  sentiment: "happy" | "sad" | "anxious" | "calm" | "neutral";
  score: number;
  analysis: string;
  createdAt: string;
}

export interface MoodWithKeywords extends Mood {
  keywords: string[];
}

export interface Message {
  id: number;
  userId: number;
  content: string;
  isUser: boolean;
  createdAt: string;
}

export interface Activity {
  id: number;
  emoji: string;
  title: string;
  description: string;
  category: string;
}

export interface ActivityCompletion {
  id: number;
  userId: number;
  activityId: number;
  completedAt: string;
}

export interface ActivityWithCompletion extends Activity {
  completed?: boolean;
  completedAt?: string;
}

export interface MusicTrack {
  id: number;
  title: string;
  artist: string;
  genre: string;
  mood: string;
  imageUrl?: string | null;
  externalUrl?: string | null;
}

export interface MoodAnalysisResponse {
  mood: Mood;
  keywords: string[];
}

export interface ChatResponse {
  message: Message;
}

export interface ActivityRecommendationsResponse {
  activities: Activity[];
}

export interface MusicRecommendationsResponse {
  tracks: MusicTrack[];
}

// UI related types
export interface TabItem {
  id: string;
  label: string;
  icon: string;
}
