import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertMoodSchema,
  insertMessageSchema,
  insertActivityCompletionSchema,
} from "@shared/schema";
import * as openai from "./lib/openai";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Mood analysis endpoint
  app.post("/api/mood/analyze", async (req, res) => {
    try {
      const { text } = req.body;
      
      if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "Text is required" });
      }
      
      // Check if OpenAI API key is set
      if (!process.env.OPENAI_API_KEY) {
        console.error("OpenAI API key is not set");
        return res.status(500).json({ error: "OpenAI API key is missing" });
      }

      try {
        const result = await openai.analyzeSentiment(text);
        
        // Store mood in database (with dummy userId for now)
        const mood = await storage.createMood({
          userId: 1, // Using default user ID since we don't have auth yet
          text,
          sentiment: result.sentiment,
          score: result.score,
          analysis: result.analysis,
        });
        
        return res.json({
          mood,
          keywords: result.keywords
        });
      } catch (openaiError: any) {
        console.error("OpenAI API error:", openaiError.message);
        
        // Create a fallback mood analysis for UI to display
        const mood = await storage.createMood({
          userId: 1,
          text,
          sentiment: "neutral",
          score: 3,
          analysis: "I'm having trouble analyzing your mood right now. Please try again later.",
        });
        
        return res.json({
          mood,
          keywords: ["mood", "analysis", "unavailable"],
          error: openaiError.message
        });
      }
    } catch (error: any) {
      console.error("Error analyzing mood:", error.message);
      return res.status(500).json({ error: "Failed to analyze mood" });
    }
  });

  // Chat endpoint
  app.post("/api/chat/message", async (req, res) => {
    try {
      const { message, conversation } = req.body;
      
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }
      
      // Check if OpenAI API key is set
      if (!process.env.OPENAI_API_KEY) {
        console.error("OpenAI API key is not set");
        return res.status(500).json({ error: "OpenAI API key is missing" });
      }
      
      // Store user message
      const userMessage = await storage.createMessage({
        userId: 1, // Using default user ID
        content: message,
        isUser: true,
      });
      
      // Get conversation history or use provided conversation
      let chatHistory = conversation || [];
      if (!chatHistory.length) {
        const messageHistory = await storage.getMessagesByUserId(1);
        chatHistory = messageHistory.map((msg: { isUser: boolean; content: string }) => ({
          role: msg.isUser ? "user" : "assistant",
          content: msg.content
        }));
      }
      
      // Add current message if not in history
      if (!chatHistory.some((msg: { role: string; content: string }) => msg.role === "user" && msg.content === message)) {
        chatHistory.push({ role: "user", content: message });
      }
      
      try {
        // Get response from OpenAI
        const response = await openai.getChatResponse(chatHistory);
        
        // Store AI response
        const aiMessage = await storage.createMessage({
          userId: 1,
          content: response,
          isUser: false,
        });
        
        return res.json({
          message: aiMessage
        });
      } catch (openaiError: any) {
        console.error("OpenAI API error:", openaiError.message);
        
        // Store error message
        const errorMessage = await storage.createMessage({
          userId: 1,
          content: "I'm having trouble connecting to my AI brain right now. Please try again later.",
          isUser: false,
        });
        
        return res.json({
          message: errorMessage,
          error: openaiError.message
        });
      }
    } catch (error: any) {
      console.error("Error in chat:", error.message);
      return res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  // Get activity recommendations
  app.post("/api/activities/recommendations", async (req, res) => {
    try {
      const { moodId } = req.body;
      
      if (!moodId) {
        return res.status(400).json({ error: "Mood ID is required" });
      }

      // Get mood data
      const mood = await storage.getMood(moodId);
      if (!mood) {
        return res.status(404).json({ error: "Mood not found" });
      }
      
      // Get recommendations from OpenAI
      const recommendations = await openai.getActivityRecommendations(
        mood.sentiment,
        mood.text
      );
      
      // Store recommendations
      const activities = [];
      for (const rec of recommendations) {
        const activity = await storage.createActivity({
          emoji: rec.emoji,
          title: rec.title,
          description: rec.description,
          category: getCategoryFromMood(mood.sentiment),
        });
        activities.push(activity);
      }
      
      // Store recommendation group
      const activityIds = activities.map(a => a.id);
      await storage.createActivityRecommendation({
        userId: 1,
        moodId,
        activityIds,
      });
      
      return res.json({ activities });
    } catch (error: any) {
      console.error("Error getting recommendations:", error.message);
      return res.status(500).json({ error: "Failed to get activity recommendations" });
    }
  });

  // Get mood history
  app.get("/api/mood/history", async (req, res) => {
    try {
      const moods = await storage.getMoodsByUserId(1);
      return res.json({ moods });
    } catch (error: any) {
      console.error("Error getting mood history:", error.message);
      return res.status(500).json({ error: "Failed to get mood history" });
    }
  });

  // Get chat history
  app.get("/api/chat/history", async (req, res) => {
    try {
      const messages = await storage.getMessagesByUserId(1);
      return res.json({ messages });
    } catch (error: any) {
      console.error("Error getting chat history:", error.message);
      return res.status(500).json({ error: "Failed to get chat history" });
    }
  });

  // Complete activity
  app.post("/api/activities/complete", async (req, res) => {
    try {
      const { activityId } = req.body;
      
      if (!activityId) {
        return res.status(400).json({ error: "Activity ID is required" });
      }
      
      const completion = await storage.createActivityCompletion({
        userId: 1,
        activityId,
      });
      
      return res.json({ completion });
    } catch (error: any) {
      console.error("Error completing activity:", error.message);
      return res.status(500).json({ error: "Failed to complete activity" });
    }
  });

  // Get completed activities
  app.get("/api/activities/completed", async (req, res) => {
    try {
      const completions = await storage.getActivityCompletionsByUserId(1);
      return res.json({ completions });
    } catch (error: any) {
      console.error("Error getting completed activities:", error.message);
      return res.status(500).json({ error: "Failed to get completed activities" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to determine category based on mood
function getCategoryFromMood(mood: string): string {
  switch (mood) {
    case "happy":
      return "social";
    case "sad":
      return "creative";
    case "anxious":
      return "relaxation";
    case "calm":
      return "mindfulness";
    default:
      return "physical";
  }
}
