import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MoodEmoji } from "@/components/ui/mood-emoji";
import { Mood } from "@/types";

interface DashboardCardsProps {
  moods: Mood[];
}

export function DashboardCards({ moods }: DashboardCardsProps) {
  const latestMood = moods.length > 0 ? moods[moods.length - 1] : null;
  
  // Calculate weekly average mood if there are moods
  const lastWeekMoods = moods.filter(
    mood => new Date(mood.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );
  
  const moodScores: Record<string, number> = {
    "happy": 5,
    "calm": 4,
    "neutral": 3,
    "anxious": 2, 
    "sad": 1
  };
  
  let weeklyAverageMood = "neutral";
  let weeklyAverageScore = 3;
  
  if (lastWeekMoods.length > 0) {
    const avgScore = lastWeekMoods.reduce((sum, mood) => sum + moodScores[mood.sentiment], 0) / lastWeekMoods.length;
    weeklyAverageScore = Math.round(avgScore);
    
    if (weeklyAverageScore >= 5) weeklyAverageMood = "happy";
    else if (weeklyAverageScore === 4) weeklyAverageMood = "calm";
    else if (weeklyAverageScore === 3) weeklyAverageMood = "neutral";
    else if (weeklyAverageScore === 2) weeklyAverageMood = "anxious";
    else weeklyAverageMood = "sad";
  }
  
  // Calculate trend
  let trendDirection = "neutral";
  let trendPercentage = 0;
  
  if (moods.length >= 2) {
    const oldestMoods = moods.slice(0, Math.ceil(moods.length / 2));
    const newestMoods = moods.slice(Math.ceil(moods.length / 2));
    
    const oldAvg = oldestMoods.reduce((sum, mood) => sum + moodScores[mood.sentiment], 0) / oldestMoods.length;
    const newAvg = newestMoods.reduce((sum, mood) => sum + moodScores[mood.sentiment], 0) / newestMoods.length;
    
    trendPercentage = Math.round((newAvg - oldAvg) / oldAvg * 100);
    
    if (trendPercentage > 0) trendDirection = "improving";
    else if (trendPercentage < 0) {
      trendDirection = "declining";
      trendPercentage = Math.abs(trendPercentage);
    }
    else trendDirection = "stable";
  }

  const getTimeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Current Mood Card */}
      <Card className="bg-white rounded-xl shadow-sm">
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-3">Current Mood</h3>
          {latestMood ? (
            <div className="flex items-center">
              <MoodEmoji mood={latestMood.sentiment} size="medium" className="mr-3" />
              <div>
                <div className="text-xl font-semibold capitalize">{latestMood.sentiment}</div>
                <div className="text-sm text-neutral-600">
                  Updated {getTimeAgo(latestMood.createdAt)}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-neutral-500">No mood data available</div>
          )}
        </CardContent>
      </Card>
      
      {/* Weekly Average Card */}
      <Card className="bg-white rounded-xl shadow-sm">
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-3">Weekly Average</h3>
          <div className="flex items-center">
            <MoodEmoji mood={weeklyAverageMood} size="medium" className="mr-3" />
            <div>
              <div className="text-xl font-semibold capitalize">{weeklyAverageMood}</div>
              <div className="text-sm text-neutral-600">
                Based on {lastWeekMoods.length} entries
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Mood Trend Card */}
      <Card className="bg-white rounded-xl shadow-sm">
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-3">Mood Trend</h3>
          <div className="flex items-center justify-between">
            <div className={`text-xl font-semibold ${
              trendDirection === "improving" ? "text-[#4CAF50]" :
              trendDirection === "declining" ? "text-[#f44336]" : "text-neutral-600"
            }`}>
              {trendDirection === "neutral" ? "Not enough data" : 
               trendDirection.charAt(0).toUpperCase() + trendDirection.slice(1)}
            </div>
            {trendDirection !== "neutral" && (
              <i className={`text-2xl ${
                trendDirection === "improving" ? "ri-arrow-up-line text-[#4CAF50]" :
                trendDirection === "declining" ? "ri-arrow-down-line text-[#f44336]" : ""
              }`}></i>
            )}
          </div>
          {trendDirection !== "neutral" && (
            <div className="text-sm text-neutral-600">
              {trendDirection === "stable" ? "No change from last week" : 
               `${trendPercentage > 0 ? "+" : ""}${trendPercentage}% from last period`}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
