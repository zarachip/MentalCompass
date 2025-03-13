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
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActivityCard } from "@/components/mood-booster/ActivityCard";
import { Loader2 } from "lucide-react";

// Sample data - in a real app, this would come from the API
const activities = [
  {
    id: "1",
    title: "Five-Minute Meditation",
    description: "Take a short break to clear your mind with this guided meditation exercise.",
    category: "Mindfulness",
    duration: "5 minutes",
    icon: "🧘",
    type: "mindfulness"
  },
  {
    id: "2",
    title: "Nature Walk",
    description: "Go outside for a short walk and focus on the natural elements around you.",
    category: "Physical",
    duration: "15 minutes",
    icon: "🌳",
    type: "physical"
  },
  {
    id: "3",
    title: "Gratitude Journaling",
    description: "Write down three things you're grateful for today.",
    category: "Creative",
    duration: "10 minutes",
    icon: "✏️",
    type: "creative"
  },
  {
    id: "4",
    title: "Deep Breathing Exercise",
    description: "Practice the 4-7-8 breathing technique to reduce stress and anxiety.",
    category: "Mindfulness",
    duration: "3 minutes",
    icon: "🌬️",
    type: "mindfulness"
  },
  {
    id: "5",
    title: "Quick Stretching Routine",
    description: "Loosen up with these easy stretches you can do at your desk.",
    category: "Physical",
    duration: "5 minutes",
    icon: "🤸",
    type: "physical"
  },
  {
    id: "6",
    title: "Doodle Session",
    description: "Let your creativity flow with some mindless doodling.",
    category: "Creative",
    duration: "10 minutes",
    icon: "🎨",
    type: "creative"
  }
];

export default function MoodBooster() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [filteredActivities, setFilteredActivities] = useState(activities);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (activeTab === "all") {
      setFilteredActivities(activities);
    } else {
      setFilteredActivities(activities.filter(activity => activity.type === activeTab));
    }
  }, [activeTab]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="animate-fade-in"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-neutral-900">Mood Booster Activities</h2>
        <p className="text-muted-foreground">
          Try these activities to enhance your mood and wellbeing.
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Activities</TabsTrigger>
            <TabsTrigger value="mindfulness">Mindfulness</TabsTrigger>
            <TabsTrigger value="physical">Physical</TabsTrigger>
            <TabsTrigger value="creative">Creative</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  title={activity.title}
                  description={activity.description}
                  category={activity.category}
                  duration={activity.duration}
                  icon={activity.icon}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </motion.div>
  );
}
