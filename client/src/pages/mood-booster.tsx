import React from "react";
import { ActivityCategories } from "@/components/mood-booster/activity-categories";
import { FeaturedActivity } from "@/components/mood-booster/featured-activity";
import { useQuery } from "@tanstack/react-query";
import activityService from "@/lib/activity-service";
import { Activity, ActivityCompletion } from "@/types";
import { motion } from "framer-motion";

export default function MoodBooster() {
  // Get activities from mood recommendations
  const { data: moodData } = useQuery({
    queryKey: ['/api/mood/history'],
    queryFn: activityService.getMoodHistory,
  });
  
  // Get completed activities for comparison
  const { data: completionsData } = useQuery({
    queryKey: ['/api/activities/completed'],
    queryFn: activityService.getCompletedActivities,
  });
  
  const latestMood = moodData?.moods && moodData.moods.length > 0 
    ? moodData.moods[moodData.moods.length - 1] 
    : null;
  
  // Define default activities if none found
  const defaultActivities: Activity[] = [
    {
      id: 1,
      emoji: "🧘‍♀️",
      title: "Meditation",
      description: "Guided sessions for calm",
      category: "mindfulness"
    },
    {
      id: 2,
      emoji: "📝",
      title: "Journaling",
      description: "Express your thoughts",
      category: "creative"
    },
    {
      id: 3,
      emoji: "🎵",
      title: "Music Therapy",
      description: "Curated playlists",
      category: "relaxation"
    }
  ];
  
  // Get featured activity (newest one that hasn't been completed)
  const featuredActivity = defaultActivities[0];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-neutral-900">Mood Booster Activities</h2>
        <p className="text-neutral-600 mt-1">Discover personalized activities to improve your wellbeing.</p>
      </div>
      
      <ActivityCategories 
        activities={defaultActivities}
      />
      
      <FeaturedActivity 
        activity={featuredActivity} 
      />
    </motion.div>
  );
}
