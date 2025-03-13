import {
  users, moods, messages, activities, activityCompletions, activityRecommendations,
  musicTracks, musicRecommendations,
  type User, type InsertUser, 
  type Mood, type InsertMood,
  type Message, type InsertMessage,
  type Activity, type InsertActivity,
  type ActivityCompletion, type InsertActivityCompletion,
  type ActivityRecommendation, type InsertActivityRecommendation,
  type MusicTrack, type InsertMusicTrack,
  type MusicRecommendation, type InsertMusicRecommendation
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
  
  // Music track methods
  getMusicTrack(id: number): Promise<MusicTrack | undefined>;
  getMusicTracksByMood(mood: string): Promise<MusicTrack[]>;
  getAllMusicTracks(): Promise<MusicTrack[]>;
  createMusicTrack(track: InsertMusicTrack): Promise<MusicTrack>;
  
  // Music recommendation methods
  getMusicRecommendation(id: number): Promise<MusicRecommendation | undefined>;
  getMusicRecommendationsByUserId(userId: number): Promise<MusicRecommendation[]>;
  createMusicRecommendation(recommendation: InsertMusicRecommendation): Promise<MusicRecommendation>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private moods: Map<number, Mood>;
  private messages: Map<number, Message>;
  private activities: Map<number, Activity>;
  private activityCompletions: Map<number, ActivityCompletion>;
  private activityRecommendations: Map<number, ActivityRecommendation>;
  private musicTracks: Map<number, MusicTrack>;
  private musicRecommendations: Map<number, MusicRecommendation>;
  private userIdCounter: number;
  private moodIdCounter: number;
  private messageIdCounter: number;
  private activityIdCounter: number;
  private activityCompletionIdCounter: number;
  private activityRecommendationIdCounter: number;
  private musicTrackIdCounter: number;
  private musicRecommendationIdCounter: number;

  constructor() {
    this.users = new Map();
    this.moods = new Map();
    this.messages = new Map();
    this.activities = new Map();
    this.activityCompletions = new Map();
    this.activityRecommendations = new Map();
    this.musicTracks = new Map();
    this.musicRecommendations = new Map();
    
    this.userIdCounter = 1;
    this.moodIdCounter = 1;
    this.messageIdCounter = 1;
    this.activityIdCounter = 1;
    this.activityCompletionIdCounter = 1;
    this.activityRecommendationIdCounter = 1;
    this.musicTrackIdCounter = 1;
    this.musicRecommendationIdCounter = 1;
    
    // Create a default user
    this.createUser({
      username: "default",
      password: "password"
    });
    
    // Initialize some default music tracks
    this.createMusicTrack({
      title: "Happy",
      artist: "Pharrell Williams",
      genre: "Pop",
      mood: "happy",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b2734c9155bd4737b376d66f6d60",
      externalUrl: "https://www.youtube.com/watch?v=ZbZSe6N_BXs"
    });
    
    this.createMusicTrack({
      title: "Don't Worry, Be Happy",
      artist: "Bobby McFerrin",
      genre: "Pop",
      mood: "happy",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b273b000f34a929ab207bfca1e9e",
      externalUrl: "https://www.youtube.com/watch?v=d-diB65scQU"
    });
    
    this.createMusicTrack({
      title: "Weightless",
      artist: "Marconi Union",
      genre: "Ambient",
      mood: "calm",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b273d0afdcdb6e990f27693f0c98",
      externalUrl: "https://www.youtube.com/watch?v=UfcAVejslrU"
    });
    
    this.createMusicTrack({
      title: "Someone Like You",
      artist: "Adele",
      genre: "Pop",
      mood: "sad",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b273fe4cbed0da5240de3dd69991",
      externalUrl: "https://www.youtube.com/watch?v=hLQl3WQQoQ0"
    });
    
    this.createMusicTrack({
      title: "Breathe",
      artist: "Télépopmusik",
      genre: "Electronic",
      mood: "anxious",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b273d40b993af88c5122e41522d4",
      externalUrl: "https://www.youtube.com/watch?v=vyut3GyQtn0"
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
      id,
      userId: moodData.userId || null,
      text: moodData.text,
      sentiment: moodData.sentiment,
      score: moodData.score,
      analysis: moodData.analysis || null,
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
      id,
      userId: messageData.userId || null,
      content: messageData.content,
      isUser: messageData.isUser,
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
      id,
      userId: completionData.userId || null,
      activityId: completionData.activityId || null,
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
      id,
      userId: recommendationData.userId || null,
      moodId: recommendationData.moodId || null,
      activityIds: Array.isArray(recommendationData.activityIds) ? recommendationData.activityIds : [],
      createdAt: new Date()
    };
    this.activityRecommendations.set(id, recommendation);
    return recommendation;
  }
  
  // Music track methods
  async getMusicTrack(id: number): Promise<MusicTrack | undefined> {
    return this.musicTracks.get(id);
  }
  
  async getMusicTracksByMood(mood: string): Promise<MusicTrack[]> {
    return Array.from(this.musicTracks.values())
      .filter(track => track.mood.toLowerCase() === mood.toLowerCase());
  }
  
  async getAllMusicTracks(): Promise<MusicTrack[]> {
    return Array.from(this.musicTracks.values());
  }
  
  async createMusicTrack(trackData: InsertMusicTrack): Promise<MusicTrack> {
    const id = this.musicTrackIdCounter++;
    const track: MusicTrack = {
      id,
      title: trackData.title,
      artist: trackData.artist,
      genre: trackData.genre,
      mood: trackData.mood,
      imageUrl: trackData.imageUrl || null,
      externalUrl: trackData.externalUrl || null
    };
    this.musicTracks.set(id, track);
    return track;
  }
  
  // Music recommendation methods
  async getMusicRecommendation(id: number): Promise<MusicRecommendation | undefined> {
    return this.musicRecommendations.get(id);
  }
  
  async getMusicRecommendationsByUserId(userId: number): Promise<MusicRecommendation[]> {
    return Array.from(this.musicRecommendations.values())
      .filter(recommendation => recommendation.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async createMusicRecommendation(recommendationData: InsertMusicRecommendation): Promise<MusicRecommendation> {
    const id = this.musicRecommendationIdCounter++;
    const recommendation: MusicRecommendation = {
      id,
      userId: recommendationData.userId || null,
      moodId: recommendationData.moodId || null,
      trackIds: Array.isArray(recommendationData.trackIds) ? recommendationData.trackIds : [],
      createdAt: new Date()
    };
    this.musicRecommendations.set(id, recommendation);
    return recommendation;
  }
}

export const storage = new MemStorage();
