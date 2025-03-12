import React, { useState } from "react";
import { DashboardCards } from "@/components/dashboard/dashboard-cards";
import { MoodChart } from "@/components/dashboard/mood-chart";
import { MoodInsights } from "@/components/dashboard/mood-insights";
import { MoodTriggers } from "@/components/dashboard/mood-triggers";
import { RecentActivities } from "@/components/dashboard/recent-activities";
import { useQuery } from "@tanstack/react-query";
import activityService from "@/lib/activity-service";
import { ActivityCompletion, Activity } from "@/types";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const [selectedView, setSelectedView] = useState<"analytics" | "insights">("analytics");
  
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
  
  // Get activities
  const { data: activitiesData, isLoading: activitiesLoading } = useQuery({
    queryKey: ['/api/activities'],
    queryFn: async () => {
      // If we don't have a real API endpoint yet, return a placeholder
      return { activities: [] };
    },
  });
  
  // Combine activity completions with activity details
  const recentActivities = completionsData?.completions.map(completion => {
    // Try to find the corresponding activity
    const activity = activitiesData?.activities?.find(a => a.id === completion.activityId);
    
    return {
      completion,
      activity: activity || {
        id: completion.activityId,
        emoji: "🧘‍♀️",
        title: `Activity ${completion.activityId}`,
        description: "Activity description",
        category: "mindfulness"
      } as Activity
    };
  }) || [];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-neutral-900">Your Mood Dashboard</h2>
        <p className="text-neutral-600 mt-1">Track your emotional wellbeing and gain insights over time.</p>
      </div>
      
      <div className="mb-6">
        <div className="inline-flex bg-neutral-100 p-1 rounded-lg">
          <button
            className={`py-2 px-4 rounded-md text-sm font-medium ${
              selectedView === "analytics" ? "bg-white shadow-sm" : "text-neutral-600"
            }`}
            onClick={() => setSelectedView("analytics")}
          >
            Analytics
          </button>
          <button
            className={`py-2 px-4 rounded-md text-sm font-medium ${
              selectedView === "insights" ? "bg-white shadow-sm" : "text-neutral-600"
            }`}
            onClick={() => setSelectedView("insights")}
          >
            Insights & Patterns
          </button>
        </div>
      </div>
      
      {moodLoading ? (
        <>
          <div className="mb-6">
            <Skeleton className="h-24 w-full" />
          </div>
          <div className="mb-6">
            <Skeleton className="h-72 w-full" />
          </div>
        </>
      ) : (
        <>
          <DashboardCards 
            moods={moodData?.moods || []}
          />
          
          {selectedView === "analytics" ? (
            <>
              <MoodChart 
                moods={moodData?.moods || []}
              />
              
              <RecentActivities 
                completions={recentActivities}
              />
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MoodInsights
                  moods={moodData?.moods || []}
                />
                
                <MoodTriggers
                  moods={moodData?.moods || []}
                />
              </div>
            </>
          )}
        </>
      )}
    </motion.div>
  );
}
