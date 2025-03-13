import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

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

export default {
  analyzeSentiment,
  getChatResponse,
  getActivityRecommendations,
};
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key',
});

// Function to analyze sentiment of text
export async function analyzeSentiment(text: string) {
  // For development without API key, return mock data
  if (!process.env.OPENAI_API_KEY) {
    return mockSentimentAnalysis(text);
  }
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a mood analysis expert. Analyze the sentiment of the provided text and return a JSON object with the following keys: 'sentiment' (one of: happy, sad, anxious, angry, neutral, calm), 'score' (1-5 representing intensity), 'analysis' (a brief explanation), and 'keywords' (array of emotion-related words from the text)." },
        { role: "user", content: text }
      ],
      response_format: { type: "json_object" }
    });
    
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content in OpenAI response");
    }
    
    return JSON.parse(content);
  } catch (error) {
    console.error("Error in OpenAI sentiment analysis:", error);
    return mockSentimentAnalysis(text);
  }
}

// Function to get chat response
export async function getChatResponse(messages: Array<{role: string, content: string}>) {
  // For development without API key, return mock data
  if (!process.env.OPENAI_API_KEY) {
    return mockChatResponse(messages);
  }
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an empathetic AI assistant that helps users improve their mood and mental wellbeing. Provide supportive, understanding responses with concrete suggestions when appropriate." },
        ...messages
      ],
    });
    
    return response.choices[0]?.message?.content || "I'm not sure how to respond to that.";
  } catch (error) {
    console.error("Error in OpenAI chat:", error);
    return mockChatResponse(messages);
  }
}

// Function to get activity recommendations
export async function getActivityRecommendations(mood: string, context: string) {
  // For development without API key, return mock data
  if (!process.env.OPENAI_API_KEY) {
    return mockActivityRecommendations(mood);
  }
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a wellness expert. Based on the user's mood and context, suggest 3 activities that might help improve their wellbeing. Return a JSON array of objects, each with 'emoji', 'title', and 'description' keys." },
        { role: "user", content: `Mood: ${mood}\nContext: ${context}` }
      ],
      response_format: { type: "json_object" }
    });
    
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content in OpenAI response");
    }
    
    const parsed = JSON.parse(content);
    return parsed.activities || [];
  } catch (error) {
    console.error("Error in OpenAI activity recommendations:", error);
    return mockActivityRecommendations(mood);
  }
}

// Mock functions for development without API key
function mockSentimentAnalysis(text: string) {
  const sentiments = ["happy", "sad", "anxious", "angry", "neutral", "calm"];
  const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
  const score = Math.floor(Math.random() * 5) + 1;
  
  return {
    sentiment,
    score,
    analysis: `This text appears to express ${sentiment} emotions with an intensity of ${score}/5.`,
    keywords: ["mood", "emotion", "feeling"]
  };
}

function mockChatResponse(messages: Array<{role: string, content: string}>) {
  const lastMessage = messages[messages.length - 1]?.content || "";
  
  const responses = [
    "I understand how you're feeling. What might help is taking a moment to breathe deeply.",
    "That sounds challenging. Remember that it's okay to feel this way, and these feelings will pass.",
    "I appreciate you sharing that with me. Would you like to talk more about it or would you prefer some suggestions?",
    "It sounds like you're going through a lot right now. What's one small thing you could do today to take care of yourself?",
    "I'm here to support you. Sometimes just acknowledging our emotions can help us process them better."
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

function mockActivityRecommendations(mood: string) {
  const activities = {
    "happy": [
      { emoji: "🏃‍♂️", title: "Go for a run", description: "Channel your positive energy into physical exercise." },
      { emoji: "🎨", title: "Creative project", description: "Use your upbeat mood to create something beautiful." },
      { emoji: "🧘‍♀️", title: "Mindful meditation", description: "Savor and extend your positive feelings through meditation." }
    ],
    "sad": [
      { emoji: "📝", title: "Journal your feelings", description: "Write down your thoughts to help process emotions." },
      { emoji: "🌳", title: "Nature walk", description: "Spending time in nature can help lift your mood." },
      { emoji: "🎵", title: "Music therapy", description: "Listen to uplifting music that resonates with you." }
    ],
    "anxious": [
      { emoji: "🧘‍♂️", title: "Deep breathing", description: "Practice 4-7-8 breathing to calm your nervous system." },
      { emoji: "🚶‍♀️", title: "Mindful walking", description: "Focus on each step to ground yourself in the present." },
      { emoji: "🫖", title: "Herbal tea break", description: "Take a moment to enjoy a calming cup of chamomile or lavender tea." }
    ],
    "angry": [
      { emoji: "🥊", title: "Physical release", description: "Exercise to release tension through movement." },
      { emoji: "✍️", title: "Write it out", description: "Express your feelings in writing without judgment." },
      { emoji: "🛁", title: "Cool down", description: "Take a cool shower or splash water on your face to reset." }
    ],
    "neutral": [
      { emoji: "📚", title: "Read something new", description: "Expand your horizons with an interesting book or article." },
      { emoji: "👥", title: "Connect with others", description: "Reach out to a friend or family member for a chat." },
      { emoji: "🧩", title: "Puzzle time", description: "Engage your mind with a challenging puzzle or game." }
    ],
    "calm": [
      { emoji: "🧠", title: "Learn something", description: "Use this clear-headed state to acquire new knowledge." },
      { emoji: "✏️", title: "Plan and organize", description: "Take advantage of clarity to plan future goals." },
      { emoji: "🧶", title: "Creative flow", description: "Engage in a creative activity that requires focus." }
    ]
  };
  
  return activities[mood as keyof typeof activities] || activities["neutral"];
}
