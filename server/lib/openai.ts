import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

// Log if OpenAI API key is not set or invalid format
if (!process.env.OPENAI_API_KEY) {
  console.error("WARNING: OPENAI_API_KEY environment variable is not set");
} else if (process.env.OPENAI_API_KEY.length < 20) {
  console.error("WARNING: OPENAI_API_KEY appears to be invalid (too short)");
}

export interface SentimentAnalysisResult {
  sentiment: string;
  score: number;
  analysis: string;
  keywords: string[];
}

export async function analyzeSentiment(text: string): Promise<SentimentAnalysisResult> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a mental health assistant that analyzes the sentiment of user text. " +
            "Analyze the sentiment and provide a response in JSON format with these fields: " +
            "1. sentiment (one of: happy, sad, anxious, calm, neutral) " +
            "2. score (number 1-5, with 5 being most intense) " +
            "3. analysis (2-3 sentences of supportive analysis explaining the detected mood) " +
            "4. keywords (array of 3 mood-related keywords from the text)",
        },
        {
          role: "user",
          content: text,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    return {
      sentiment: result.sentiment || "neutral",
      score: Math.max(1, Math.min(5, Math.round(result.score || 3))),
      analysis: result.analysis || "Unable to analyze mood at this time.",
      keywords: Array.isArray(result.keywords) ? result.keywords : ["general", "mood"],
    };
  } catch (error: any) {
    console.error("Error analyzing sentiment:", error.message);
    return {
      sentiment: "neutral",
      score: 3,
      analysis: "Unable to analyze mood at this time. Please try again later.",
      keywords: ["general", "mood"],
    };
  }
}

export async function getChatResponse(
  conversation: { role: "user" | "assistant"; content: string }[]
): Promise<string> {
  try {
    const messages = [
      {
        role: "system",
        content:
          "You are MoodMate, an empathetic AI mental health assistant designed to provide supportive conversation. " +
          "Respond with empathy, understanding, and helpful advice. Keep responses concise (2-3 sentences) but warm. " +
          "Never diagnose or provide medical advice, instead encourage professional help for serious concerns.",
      },
      ...conversation.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages as any,
      max_tokens: 150,
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't process that right now.";
  } catch (error: any) {
    console.error("Error getting chat response:", error.message);
    return "I'm having trouble responding right now. Please try again in a moment.";
  }
}

export async function getActivityRecommendations(
  mood: string,
  moodText: string
): Promise<{ emoji: string; title: string; description: string }[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a mental health assistant that recommends personalized activities based on mood. " +
            "Provide 4 activity recommendations in JSON format as an array of objects with these fields: " +
            "1. emoji (a single emoji representing the activity) " +
            "2. title (short activity title, 3-5 words) " +
            "3. description (brief 1 sentence description of why this activity helps with the given mood)",
        },
        {
          role: "user",
          content: `The user is feeling ${mood}. Here's what they wrote: "${moodText}". Please suggest appropriate activities to help with this mood.`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    if (Array.isArray(result.recommendations)) {
      return result.recommendations.slice(0, 4);
    } else {
      // Fallback recommendations if format is incorrect
      return [
        { emoji: "🧘‍♀️", title: "5-Minute Meditation", description: "A quick mindfulness break to center yourself." },
        { emoji: "🚶‍♂️", title: "Walk Outside", description: "Fresh air and movement can help shift your perspective." },
        { emoji: "🎵", title: "Listen to Music", description: "Music can effectively change your emotional state." },
        { emoji: "📝", title: "Journal Your Thoughts", description: "Writing helps process emotions and gain clarity." }
      ];
    }
  } catch (error: any) {
    console.error("Error getting activity recommendations:", error.message);
    return [
      { emoji: "🧘‍♀️", title: "5-Minute Meditation", description: "A quick mindfulness break to center yourself." },
      { emoji: "🚶‍♂️", title: "Walk Outside", description: "Fresh air and movement can help shift your perspective." },
      { emoji: "🎵", title: "Listen to Music", description: "Music can effectively change your emotional state." },
      { emoji: "📝", title: "Journal Your Thoughts", description: "Writing helps process emotions and gain clarity." }
    ];
  }
}

export async function getMusicRecommendations(
  mood: string,
  moodText: string
): Promise<{ title: string; artist: string; genre: string; mood: string }[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a music therapy assistant that recommends personalized music based on mood. " +
            "Provide 3 music recommendations in JSON format as an array of objects with these fields: " +
            "1. title (song title) " +
            "2. artist (artist name) " +
            "3. genre (genre of music) " +
            "4. mood (one of: happy, sad, anxious, calm, neutral) representing the mood of the song",
        },
        {
          role: "user",
          content: `The user is feeling ${mood}. Here's what they wrote: "${moodText}". Please suggest appropriate music to help with this mood.`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    if (Array.isArray(result.recommendations)) {
      return result.recommendations.slice(0, 3);
    } else {
      // Fallback based on mood
      const fallbackRecommendations = {
        happy: [
          { title: "Happy", artist: "Pharrell Williams", genre: "Pop", mood: "happy" },
          { title: "Don't Worry Be Happy", artist: "Bobby McFerrin", genre: "Pop", mood: "happy" },
          { title: "Good Vibrations", artist: "The Beach Boys", genre: "Pop", mood: "happy" }
        ],
        sad: [
          { title: "Someone Like You", artist: "Adele", genre: "Pop", mood: "sad" },
          { title: "Hurt", artist: "Johnny Cash", genre: "Country", mood: "sad" },
          { title: "Fix You", artist: "Coldplay", genre: "Rock", mood: "sad" }
        ],
        anxious: [
          { title: "Breathe", artist: "Télépopmusik", genre: "Electronic", mood: "anxious" },
          { title: "Weightless", artist: "Marconi Union", genre: "Ambient", mood: "calm" },
          { title: "Clair de Lune", artist: "Claude Debussy", genre: "Classical", mood: "calm" }
        ],
        calm: [
          { title: "Weightless", artist: "Marconi Union", genre: "Ambient", mood: "calm" },
          { title: "Gymnopédie No.1", artist: "Erik Satie", genre: "Classical", mood: "calm" },
          { title: "Watermark", artist: "Enya", genre: "New Age", mood: "calm" }
        ],
        neutral: [
          { title: "Here Comes the Sun", artist: "The Beatles", genre: "Rock", mood: "happy" },
          { title: "Clocks", artist: "Coldplay", genre: "Rock", mood: "neutral" },
          { title: "Africa", artist: "Toto", genre: "Pop", mood: "neutral" }
        ]
      };
      
      return fallbackRecommendations[mood as keyof typeof fallbackRecommendations] || fallbackRecommendations.neutral;
    }
  } catch (error: any) {
    console.error("Error getting music recommendations:", error.message);
    return [
      { title: "Happy", artist: "Pharrell Williams", genre: "Pop", mood: "happy" },
      { title: "Weightless", artist: "Marconi Union", genre: "Ambient", mood: "calm" },
      { title: "Here Comes the Sun", artist: "The Beatles", genre: "Rock", mood: "happy" }
    ];
  }
}

export default {
  analyzeSentiment,
  getChatResponse,
  getActivityRecommendations,
  getMusicRecommendations,
};
