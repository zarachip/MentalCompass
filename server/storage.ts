import {
  users, moods, messages, activities, activityCompletions, activityRecommendations,
  type User, type InsertUser, 
  type Mood, type InsertMood,
  type Message, type InsertMessage,
  type Activity, type InsertActivity,
  type ActivityCompletion, type InsertActivityCompletion,
  type ActivityRecommendation, type InsertActivityRecommendation
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Mood methods
  getMood(id: number): Promise<Mood | undefined>;
  getMoodsByUserId(userId: number): Promise<Mood[]>;
  createMood(mood: InsertMood): Promise<Mood>;
  
  // Message methods
  getMessage(id: number): Promise<Message | undefined>;
  getMessagesByUserId(userId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Activity methods
  getActivity(id: number): Promise<Activity | undefined>;
  getActivities(): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // Activity completion methods
  getActivityCompletion(id: number): Promise<ActivityCompletion | undefined>;
  getActivityCompletionsByUserId(userId: number): Promise<ActivityCompletion[]>;
  createActivityCompletion(completion: InsertActivityCompletion): Promise<ActivityCompletion>;
  
  // Activity recommendation methods
  getActivityRecommendation(id: number): Promise<ActivityRecommendation | undefined>;
  getActivityRecommendationsByUserId(userId: number): Promise<ActivityRecommendation[]>;
  createActivityRecommendation(recommendation: InsertActivityRecommendation): Promise<ActivityRecommendation>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private moods: Map<number, Mood>;
  private messages: Map<number, Message>;
  private activities: Map<number, Activity>;
  private activityCompletions: Map<number, ActivityCompletion>;
  private activityRecommendations: Map<number, ActivityRecommendation>;
  private userIdCounter: number;
  private moodIdCounter: number;
  private messageIdCounter: number;
  private activityIdCounter: number;
  private activityCompletionIdCounter: number;
  private activityRecommendationIdCounter: number;

  constructor() {
    this.users = new Map();
    this.moods = new Map();
    this.messages = new Map();
    this.activities = new Map();
    this.activityCompletions = new Map();
    this.activityRecommendations = new Map();
    
    this.userIdCounter = 1;
    this.moodIdCounter = 1;
    this.messageIdCounter = 1;
    this.activityIdCounter = 1;
    this.activityCompletionIdCounter = 1;
    this.activityRecommendationIdCounter = 1;
    
    // Create a default user
    this.createUser({
      username: "default",
      password: "password"
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Mood methods
  async getMood(id: number): Promise<Mood | undefined> {
    return this.moods.get(id);
  }
  
  async getMoodsByUserId(userId: number): Promise<Mood[]> {
    return Array.from(this.moods.values())
      .filter(mood => mood.userId === userId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }
  
  async createMood(moodData: InsertMood): Promise<Mood> {
    const id = this.moodIdCounter++;
    const mood: Mood = {
      ...moodData,
      id,
      createdAt: new Date()
    };
    this.moods.set(id, mood);
    return mood;
  }
  
  // Message methods
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }
  
  async getMessagesByUserId(userId: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => message.userId === userId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }
  
  async createMessage(messageData: InsertMessage): Promise<Message> {
    const id = this.messageIdCounter++;
    const message: Message = {
      ...messageData,
      id,
      createdAt: new Date()
    };
    this.messages.set(id, message);
    return message;
  }
  
  // Activity methods
  async getActivity(id: number): Promise<Activity | undefined> {
    return this.activities.get(id);
  }
  
  async getActivities(): Promise<Activity[]> {
    return Array.from(this.activities.values());
  }
  
  async createActivity(activityData: InsertActivity): Promise<Activity> {
    const id = this.activityIdCounter++;
    const activity: Activity = {
      ...activityData,
      id
    };
    this.activities.set(id, activity);
    return activity;
  }
  
  // Activity completion methods
  async getActivityCompletion(id: number): Promise<ActivityCompletion | undefined> {
    return this.activityCompletions.get(id);
  }
  
  async getActivityCompletionsByUserId(userId: number): Promise<ActivityCompletion[]> {
    return Array.from(this.activityCompletions.values())
      .filter(completion => completion.userId === userId)
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
  }
  
  async createActivityCompletion(completionData: InsertActivityCompletion): Promise<ActivityCompletion> {
    const id = this.activityCompletionIdCounter++;
    const completion: ActivityCompletion = {
      ...completionData,
      id,
      completedAt: new Date()
    };
    this.activityCompletions.set(id, completion);
    return completion;
  }
  
  // Activity recommendation methods
  async getActivityRecommendation(id: number): Promise<ActivityRecommendation | undefined> {
    return this.activityRecommendations.get(id);
  }
  
  async getActivityRecommendationsByUserId(userId: number): Promise<ActivityRecommendation[]> {
    return Array.from(this.activityRecommendations.values())
      .filter(recommendation => recommendation.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async createActivityRecommendation(recommendationData: InsertActivityRecommendation): Promise<ActivityRecommendation> {
    const id = this.activityRecommendationIdCounter++;
    const recommendation: ActivityRecommendation = {
      ...recommendationData,
      id,
      createdAt: new Date()
    };
    this.activityRecommendations.set(id, recommendation);
    return recommendation;
  }
}

export const storage = new MemStorage();
