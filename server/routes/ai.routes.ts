
import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();

// For a real application, this would be securely stored in environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Sample data for mood categories
const moodCategories = [
  { id: "happy", name: "Happy", emoji: "😊", color: "#4CAF50" },
  { id: "sad", name: "Sad", emoji: "😔", color: "#2196F3" },
  { id: "anxious", name: "Anxious", emoji: "😰", color: "#FF9800" },
  { id: "angry", name: "Angry", emoji: "😠", color: "#F44336" },
  { id: "neutral", name: "Neutral", emoji: "😐", color: "#9E9E9E" },
  { id: "excited", name: "Excited", emoji: "🤩", color: "#E91E63" },
  { id: "tired", name: "Tired", emoji: "😴", color: "#673AB7" },
  { id: "calm", name: "Calm", emoji: "😌", color: "#009688" },
];

// Sample activity recommendations
const activityRecommendations = {
  "happy": [
    { id: "h1", title: "Gratitude Journaling", description: "Write down three things you're thankful for today to amplify your positive feelings.", category: "Mindfulness", duration: "10 minutes", icon: "✏️" },
    { id: "h2", title: "Share Your Joy", description: "Reach out to a friend or family member to share your happiness.", category: "Social", duration: "15 minutes", icon: "📱" },
    { id: "h3", title: "Creative Project", description: "Channel your positive energy into a creative project you've been meaning to start.", category: "Creative", duration: "30+ minutes", icon: "🎨" },
  ],
  "sad": [
    { id: "s1", title: "Gentle Movement", description: "Take a slow, mindful walk or do some gentle stretching to shift your energy.", category: "Physical", duration: "15 minutes", icon: "🚶" },
    { id: "s2", title: "Comfort Media", description: "Watch a favorite uplifting movie or listen to music that soothes you.", category: "Relaxation", duration: "30+ minutes", icon: "🎬" },
    { id: "s3", title: "Expressive Writing", description: "Write about your feelings without judgment to process your emotions.", category: "Emotional", duration: "20 minutes", icon: "📝" },
  ],
  "anxious": [
    { id: "a1", title: "4-7-8 Breathing", description: "Try this calming breathing technique: inhale for 4, hold for 7, exhale for 8.", category: "Mindfulness", duration: "5 minutes", icon: "🌬️" },
    { id: "a2", title: "Progressive Relaxation", description: "Tense and relax each muscle group from toes to head to release physical tension.", category: "Relaxation", duration: "10 minutes", icon: "🧘" },
    { id: "a3", title: "Organize Your Space", description: "Create order in your immediate environment to help calm your mind.", category: "Practical", duration: "15+ minutes", icon: "✨" },
  ],
  "angry": [
    { id: "an1", title: "Physical Release", description: "Do a quick high-intensity workout to channel the energy constructively.", category: "Physical", duration: "15 minutes", icon: "🏃" },
    { id: "an2", title: "Cooling Visualization", description: "Imagine a cool blue light flowing through your body, calming the heat of anger.", category: "Mindfulness", duration: "5 minutes", icon: "❄️" },
    { id: "an3", title: "Time-Out", description: "Step away from the triggering situation and take time to cool down before responding.", category: "Emotional", duration: "10+ minutes", icon: "⏱️" },
  ],
  "neutral": [
    { id: "n1", title: "Try Something New", description: "Explore a new hobby or activity to engage your curiosity and interest.", category: "Growth", duration: "30+ minutes", icon: "🌱" },
    { id: "n2", title: "Nature Connection", description: "Spend time outdoors observing nature's details to increase present-moment awareness.", category: "Mindfulness", duration: "20 minutes", icon: "🌳" },
    { id: "n3", title: "Learning Session", description: "Dedicate time to learning something new that interests you.", category: "Intellectual", duration: "25+ minutes", icon: "📚" },
  ],
  "excited": [
    { id: "e1", title: "Channel Creativity", description: "Direct your enthusiasm into a creative project like art, music, or writing.", category: "Creative", duration: "30+ minutes", icon: "🎵" },
    { id: "e2", title: "Social Connection", description: "Share your excitement with friends or family who will appreciate your energy.", category: "Social", duration: "Varies", icon: "👋" },
    { id: "e3", title: "Action Planning", description: "Use this energetic state to plan and take action on an important goal.", category: "Productivity", duration: "20+ minutes", icon: "📋" },
  ],
  "tired": [
    { id: "t1", title: "Power Nap", description: "Take a short 15-20 minute nap to refresh your energy levels.", category: "Rest", duration: "20 minutes", icon: "💤" },
    { id: "t2", title: "Gentle Yoga", description: "Do some gentle stretching or restorative yoga poses to revitalize.", category: "Physical", duration: "15 minutes", icon: "🧘" },
    { id: "t3", title: "Nature Break", description: "Get some fresh air and sunlight to naturally boost your energy.", category: "Wellness", duration: "10+ minutes", icon: "☀️" },
  ],
  "calm": [
    { id: "c1", title: "Meditation Session", description: "Deepen your calm state with a guided or silent meditation practice.", category: "Mindfulness", duration: "15 minutes", icon: "🧘" },
    { id: "c2", title: "Gentle Creativity", description: "Engage in flowing creative activities like drawing, coloring, or playing music.", category: "Creative", duration: "25+ minutes", icon: "🎨" },
    { id: "c3", title: "Mindful Reading", description: "Read something meaningful or inspirational that nurtures your inner peace.", category: "Intellectual", duration: "20+ minutes", icon: "📖" },
  ],
};

// Sample music recommendations
const musicRecommendations = {
  "happy": [
    { id: "mh1", title: "Happy", artist: "Pharrell Williams", imageUrl: "https://via.placeholder.com/150", link: "https://open.spotify.com" },
    { id: "mh2", title: "Good Vibrations", artist: "The Beach Boys", imageUrl: "https://via.placeholder.com/150", link: "https://open.spotify.com" },
    { id: "mh3", title: "Walking on Sunshine", artist: "Katrina & The Waves", imageUrl: "https://via.placeholder.com/150", link: "https://open.spotify.com" },
  ],
  "sad": [
    { id: "ms1", title: "Someone Like You", artist: "Adele", imageUrl: "https://via.placeholder.com/150", link: "https://open.spotify.com" },
    { id: "ms2", title: "Fix You", artist: "Coldplay", imageUrl: "https://via.placeholder.com/150", link: "https://open.spotify.com" },
    { id: "ms3", title: "Hurt", artist: "Johnny Cash", imageUrl: "https://via.placeholder.com/150", link: "https://open.spotify.com" },
  ],
  "anxious": [
    { id: "ma1", title: "Weightless", artist: "Marconi Union", imageUrl: "https://via.placeholder.com/150", link: "https://open.spotify.com" },
    { id: "ma2", title: "Breathe", artist: "Télépopmusik", imageUrl: "https://via.placeholder.com/150", link: "https://open.spotify.com" },
    { id: "ma3", title: "Gymnopedie No. 1", artist: "Erik Satie", imageUrl: "https://via.placeholder.com/150", link: "https://open.spotify.com" },
  ],
  "angry": [
    { id: "man1", title: "Break Stuff", artist: "Limp Bizkit", imageUrl: "https://via.placeholder.com/150", link: "https://open.spotify.com" },
    { id: "man2", title: "Killing In The Name", artist: "Rage Against The Machine", imageUrl: "https://via.placeholder.com/150", link: "https://open.spotify.com" },
    { id: "man3", title: "Given Up", artist: "Linkin Park", imageUrl: "https://via.placeholder.com/150", link: "https://open.spotify.com" },
  ],
  "neutral": [
    { id: "mn1", title: "Intro", artist: "The xx", imageUrl: "https://via.placeholder.com/150", link: "https://open.spotify.com" },
    { id: "mn2", title: "Porcelain", artist: "Moby", imageUrl: "https://via.placeholder.com/150", link: "https://open.spotify.com" },
    { id: "mn3", title: "Teardrop", artist: "Massive Attack", imageUrl: "https://via.placeholder.com/150", link: "https://open.spotify.com" },
  ],
  "excited": [
    { id: "me1", title: "Can't Stop the Feeling!", artist: "Justin Timberlake", imageUrl: "https://via.placeholder.com/150", link: "https://open.spotify.com" },
    { id: "me2", title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", imageUrl: "https://via.placeholder.com/150", link: "https://open.spotify.com" },
    { id: "me3", title: "I Gotta Feeling", artist: "Black Eyed Peas", imageUrl: "https://via.placeholder.com/150", link: "https://open.spotify.com" },
  ],
  "tired": [
    { id: "mt1", title: "Clair de Lune", artist: "Claude Debussy", imageUrl: "https://via.placeholder.com/150", link: "https://open.spotify.com" },
    { id: "mt2", title: "Sleeping At Last", artist: "Saturn", imageUrl: "https://via.placeholder.com/150", link: "https://open.spotify.com" },
    { id: "mt3", title: "Experience", artist: "Ludovico Einaudi", imageUrl: "https://via.placeholder.com/150", link: "https://open.spotify.com" },
  ],
  "calm": [
    { id: "mc1", title: "Photograph", artist: "Ed Sheeran", imageUrl: "https://via.placeholder.com/150", link: "https://open.spotify.com" },
    { id: "mc2", title: "Ocean", artist: "John Butler Trio", imageUrl: "https://via.placeholder.com/150", link: "https://open.spotify.com" },
    { id: "mc3", title: "Here Comes the Sun", artist: "The Beatles", imageUrl: "https://via.placeholder.com/150", link: "https://open.spotify.com" },
  ],
};

// Analyze mood route
router.post("/analyze-mood", async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Text is required" });
    }
    
    // In a production app, this would use the Gemini API
    // For now, we'll do some basic keyword matching for demo purposes
    let moodId = "neutral"; // Default mood
    const textLower = text.toLowerCase();
    
    if (textLower.includes("happy") || textLower.includes("joy") || textLower.includes("great")) {
      moodId = "happy";
    } else if (textLower.includes("sad") || textLower.includes("down") || textLower.includes("blue")) {
      moodId = "sad";
    } else if (textLower.includes("anxious") || textLower.includes("worry") || textLower.includes("stress")) {
      moodId = "anxious";
    } else if (textLower.includes("angry") || textLower.includes("mad") || textLower.includes("furious")) {
      moodId = "angry";
    } else if (textLower.includes("excited") || textLower.includes("thrilled") || textLower.includes("eager")) {
      moodId = "excited";
    } else if (textLower.includes("tired") || textLower.includes("exhausted") || textLower.includes("sleepy")) {
      moodId = "tired";
    } else if (textLower.includes("calm") || textLower.includes("peaceful") || textLower.includes("relaxed")) {
      moodId = "calm";
    }
    
    const selectedMood = moodCategories.find(mood => mood.id === moodId);
    
    // Extract keywords (in a real app, this would use the Gemini API)
    const keywords = ['emotional', 'reflective', 'seeking support'];
    
    // Add random intensity for demo purposes
    const intensity = Math.floor(Math.random() * 50) + 30; // 30-80%
    
    res.json({
      mood: {
        ...selectedMood,
        intensity,
      },
      keywords,
    });
  } catch (error) {
    console.error("Error analyzing mood:", error);
    res.status(500).json({ error: "Failed to analyze mood" });
  }
});

// Get activity recommendations
router.get("/recommendations", (req, res) => {
  try {
    const { moodId } = req.query;
    
    if (!moodId || typeof moodId !== "string") {
      return res.status(400).json({ error: "Mood ID is required" });
    }
    
    // Get recommendations for the mood
    const activities = activityRecommendations[moodId as keyof typeof activityRecommendations] || [];
    
    res.json({ activities });
  } catch (error) {
    console.error("Error getting recommendations:", error);
    res.status(500).json({ error: "Failed to get recommendations" });
  }
});

// Get music recommendations
router.get("/music-recommendations", (req, res) => {
  try {
    const { moodId } = req.query;
    
    if (!moodId || typeof moodId !== "string") {
      return res.status(400).json({ error: "Mood ID is required" });
    }
    
    // Get music recommendations for the mood
    const tracks = musicRecommendations[moodId as keyof typeof musicRecommendations] || [];
    
    res.json({ tracks });
  } catch (error) {
    console.error("Error getting music recommendations:", error);
    res.status(500).json({ error: "Failed to get music recommendations" });
  }
});

// Send chat message
router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }
    
    // In a production app, this would use the Gemini API
    // For now, we'll return predefined responses for demo purposes
    
    const responses = [
      "I understand how you're feeling. Would you like to talk more about what's causing these emotions?",
      "Thank you for sharing that with me. Have you noticed any patterns in when these feelings occur?",
      "I appreciate you opening up. What do you find helps when you're feeling this way?",
      "That sounds challenging. How have you been coping with these feelings so far?",
      "I'm here to listen. Would it help to explore some strategies that might help with what you're experiencing?",
    ];
    
    const reply = responses[Math.floor(Math.random() * responses.length)];
    
    res.json({ reply });
  } catch (error) {
    console.error("Error sending chat message:", error);
    res.status(500).json({ error: "Failed to process chat message" });
  }
});

export default router;
