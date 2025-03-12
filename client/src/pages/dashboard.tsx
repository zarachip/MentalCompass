import React from "react";
import { DashboardCards } from "@/components/dashboard/dashboard-cards";
import { MoodChart } from "@/components/dashboard/mood-chart";
import { RecentActivities } from "@/components/dashboard/recent-activities";
import { useQuery } from "@tanstack/react-query";
import activityService from "@/lib/activity-service";
import { ActivityCompletion, Activity } from "@/types";
import { motion } from "framer-motion";

export default function Dashboard() {
  // Get mood history
  const { data: moodData, isLoading: moodLoading } = useQuery({
    queryKey: ['/api/mood/history'],
    queryFn: activityService.getMoodHistory,
  });
  
  // Get completed activities
  const { data: completionsData, isLoading: completionsLoading } = useQuery({
    queryKey: ['/api/activities/completed'],
    queryFn: activityService.getCompletedActivities,
  });
  
  // Mock combined data for activity completions with activity details
  // In a real app, we would fetch the activities associated with the completions
  const recentActivities = completionsData?.completions.map(completion => ({
    completion,
    activity: {
      id: completion.activityId,
      emoji: "🧘‍♀️",
      title: `Activity ${completion.activityId}`,
      description: "Activity description",
      category: "mindfulness"
    } as Activity
  })) || [];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-neutral-900">Your Mood Dashboard</h2>
        <p className="text-neutral-600 mt-1">Track your emotional wellbeing over time.</p>
      </div>
      
      <DashboardCards 
        moods={moodData?.moods || []}
      />
      
      <MoodChart 
        moods={moodData?.moods || []}
      />
      
      <RecentActivities 
        completions={recentActivities}
      />
    </motion.div>
  );
}
