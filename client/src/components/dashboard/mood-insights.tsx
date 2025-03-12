import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mood } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

interface MoodInsightsProps {
  moods: Mood[];
}

export function MoodInsights({ moods }: MoodInsightsProps) {
  const insights = useMemo(() => {
    if (moods.length === 0) {
      return {
        topMood: null,
        moodDistribution: {},
        patterns: [],
        longestStreak: {
          mood: "",
          days: 0
        },
        timeOfDayPattern: null
      };
    }

    // Count occurrences of each mood
    const moodCounts: Record<string, number> = {};
    moods.forEach(mood => {
      const sentiment = mood.sentiment;
      moodCounts[sentiment] = (moodCounts[sentiment] || 0) + 1;
    });

    // Find top mood
    let topMood = {
      sentiment: "",
      count: 0,
      percentage: 0
    };

    Object.entries(moodCounts).forEach(([sentiment, count]) => {
      if (count > topMood.count) {
        topMood = {
          sentiment,
          count,
          percentage: Math.round((count / moods.length) * 100)
        };
      }
    });

    // Calculate mood distribution percentages
    const moodDistribution: Record<string, { count: number, percentage: number }> = {};
    Object.entries(moodCounts).forEach(([sentiment, count]) => {
      moodDistribution[sentiment] = {
        count,
        percentage: Math.round((count / moods.length) * 100)
      };
    });

    // Sort moods by date to analyze patterns
    const sortedMoods = [...moods].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    // Find patterns - look for consecutive same moods
    const patterns: { mood: string, count: number }[] = [];
    let currentMood = "";
    let currentCount = 0;

    sortedMoods.forEach(mood => {
      if (mood.sentiment === currentMood) {
        currentCount++;
      } else {
        if (currentCount >= 2) {
          patterns.push({ mood: currentMood, count: currentCount });
        }
        currentMood = mood.sentiment;
        currentCount = 1;
      }
    });

    // Add the last pattern if it exists
    if (currentCount >= 2) {
      patterns.push({ mood: currentMood, count: currentCount });
    }

    // Sort patterns by count (descending)
    patterns.sort((a, b) => b.count - a.count);

    // Find longest streak of the same mood
    let longestStreakMood = "";
    let longestStreakCount = 0;
    let tempMood = "";
    let tempCount = 0;

    sortedMoods.forEach(mood => {
      const moodDate = new Date(mood.createdAt);
      
      if (mood.sentiment === tempMood) {
        tempCount++;
      } else {
        if (tempCount > longestStreakCount) {
          longestStreakCount = tempCount;
          longestStreakMood = tempMood;
        }
        tempMood = mood.sentiment;
        tempCount = 1;
      }
    });

    // Check the last sequence
    if (tempCount > longestStreakCount) {
      longestStreakCount = tempCount;
      longestStreakMood = tempMood;
    }

    // Analyze time of day patterns
    const timeOfDayMoods: Record<string, Record<string, number>> = {
      "morning": {},
      "afternoon": {},
      "evening": {}
    };

    moods.forEach(mood => {
      const date = new Date(mood.createdAt);
      const hour = date.getHours();
      
      let timeOfDay = "";
      if (hour >= 5 && hour < 12) timeOfDay = "morning";
      else if (hour >= 12 && hour < 18) timeOfDay = "afternoon";
      else timeOfDay = "evening";
      
      timeOfDayMoods[timeOfDay][mood.sentiment] = (timeOfDayMoods[timeOfDay][mood.sentiment] || 0) + 1;
    });

    // Find the dominant mood for each time of day
    const timeOfDayPattern: Record<string, { mood: string, count: number }> = {};
    
    Object.entries(timeOfDayMoods).forEach(([timeOfDay, moods]) => {
      let topMood = { mood: "", count: 0 };
      
      Object.entries(moods).forEach(([mood, count]) => {
        if (count > topMood.count) {
          topMood = { mood, count };
        }
      });
      
      if (topMood.count > 0) {
        timeOfDayPattern[timeOfDay] = topMood;
      }
    });

    return {
      topMood,
      moodDistribution,
      patterns: patterns.slice(0, 3), // Return top 3 patterns
      longestStreak: {
        mood: longestStreakMood,
        days: longestStreakCount
      },
      timeOfDayPattern
    };
  }, [moods]);

  const getMoodEmoji = (mood: string): string => {
    switch (mood) {
      case "happy": return "😊";
      case "sad": return "😢";
      case "anxious": return "😰";
      case "calm": return "😌";
      default: return "😐";
    }
  };

  const getMoodColor = (mood: string): string => {
    switch (mood) {
      case "happy": return "bg-green-500";
      case "calm": return "bg-blue-500";
      case "neutral": return "bg-gray-500";
      case "anxious": return "bg-yellow-500";
      case "sad": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getPatternText = (pattern: { mood: string, count: number }): string => {
    if (pattern.count >= 5) {
      return `You felt ${pattern.mood} for ${pattern.count} consecutive entries`;
    } else {
      return `${pattern.count} consecutive ${pattern.mood} entries`;
    }
  };

  const getTimeOfDayText = (time: string, pattern: { mood: string, count: number }) => {
    return `You often feel ${pattern.mood} in the ${time}`;
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Mood Insights</CardTitle>
      </CardHeader>
      <CardContent>
        {moods.length > 0 ? (
          <div className="space-y-6">
            {/* Top Mood Section */}
            {insights.topMood && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-neutral-600 mb-2">Most Common Mood</h3>
                <div className="flex items-center">
                  <span className="text-4xl mr-3">
                    {getMoodEmoji(insights.topMood.sentiment)}
                  </span>
                  <div>
                    <div className="font-medium capitalize text-lg">
                      {insights.topMood.sentiment}
                    </div>
                    <div className="text-sm text-neutral-600">
                      {insights.topMood.percentage}% of your recorded moods
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Separator />

            {/* Mood Distribution */}
            <div>
              <h3 className="text-sm font-medium text-neutral-600 mb-3">Mood Distribution</h3>
              <div className="space-y-3">
                {Object.entries(insights.moodDistribution).map(([mood, data]) => (
                  <div key={mood} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="mr-2">{getMoodEmoji(mood)}</span>
                        <span className="capitalize">{mood}</span>
                      </div>
                      <span className="text-neutral-600 text-sm">{data.percentage}%</span>
                    </div>
                    <Progress value={data.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Patterns Section */}
            <div>
              <h3 className="text-sm font-medium text-neutral-600 mb-3">Patterns & Streaks</h3>
              
              {insights.patterns.length > 0 ? (
                <div className="space-y-2">
                  {insights.patterns.map((pattern, index) => (
                    <div key={index} className="flex items-center">
                      <Badge 
                        className="mr-2 capitalize" 
                        variant="outline"
                      >
                        {pattern.mood}
                      </Badge>
                      <span className="text-sm">{getPatternText(pattern)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-500">No patterns detected yet. Continue tracking your mood to reveal patterns.</p>
              )}
              
              {insights.longestStreak.days >= 3 && (
                <div className="mt-3 p-2 bg-neutral-50 rounded-md">
                  <div className="font-medium text-sm">Longest Streak:</div>
                  <div className="text-sm">
                    {insights.longestStreak.days} consecutive days feeling{" "}
                    <span className="capitalize">{insights.longestStreak.mood}</span>
                  </div>
                </div>
              )}
            </div>
            
            {insights.timeOfDayPattern && Object.keys(insights.timeOfDayPattern).length > 0 && (
              <>
                <Separator />
                
                {/* Time of Day Patterns */}
                <div>
                  <h3 className="text-sm font-medium text-neutral-600 mb-3">Time of Day Patterns</h3>
                  <div className="space-y-2">
                    {Object.entries(insights.timeOfDayPattern).map(([timeOfDay, pattern]) => (
                      <div key={timeOfDay} className="flex items-center">
                        <div className="w-20 text-sm capitalize">{timeOfDay}:</div>
                        <div className="flex items-center">
                          <span className="mr-1">{getMoodEmoji(pattern.mood)}</span>
                          <span className="text-sm">{getTimeOfDayText(timeOfDay, pattern)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="py-8 text-center text-neutral-500">
            <i className="ri-line-chart-line text-4xl mb-2 block"></i>
            <p>No mood data available</p>
            <p className="text-sm mt-1">Track your mood to see insights</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}