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
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Link } from "wouter";
import { MoveRight } from "lucide-react";

// Sample data - in a real app, this would come from the API
const moodData = [
  { day: "Mon", mood: 70, name: "Happy" },
  { day: "Tue", mood: 85, name: "Excited" },
  { day: "Wed", mood: 60, name: "Content" },
  { day: "Thu", mood: 40, name: "Anxious" },
  { day: "Fri", mood: 55, name: "Neutral" },
  { day: "Sat", mood: 75, name: "Relaxed" },
  { day: "Sun", mood: 65, name: "Content" },
];

const colorMap = (value: number) => {
  if (value >= 75) return "var(--chart-1)";
  if (value >= 60) return "var(--chart-2)";
  if (value >= 45) return "var(--chart-3)";
  if (value >= 30) return "var(--chart-4)";
  return "var(--chart-5)";
};

export default function Dashboard() {
  const today = new Date();
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="animate-fade-in"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-neutral-900">Your Dashboard</h2>
        <p className="text-muted-foreground">
          Track your mood patterns and access your personalized well-being insights.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Current Mood Card */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Mood</CardTitle>
            <CardDescription>How you're feeling right now</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center flex-col">
            <div className="text-6xl mb-2">😊</div>
            <div className="text-xl font-medium">Content</div>
            <Button variant="link" asChild className="mt-2">
              <Link href="/mood-detector">
                Update Mood <MoveRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        {/* Streak Card */}
        <Card>
          <CardHeader>
            <CardTitle>Your Streak</CardTitle>
            <CardDescription>Days of continuous mood tracking</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center flex-col">
            <div className="text-5xl font-bold text-primary mb-2">7</div>
            <div className="text-sm text-muted-foreground">Keep it up!</div>
          </CardContent>
        </Card>
        
        {/* Calendar Card */}
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Your mood tracking calendar</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={today}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Mood History Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your Mood History</CardTitle>
          <CardDescription>
            Track how your mood has changed over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="week">
            <TabsList className="mb-4">
              <TabsTrigger value="week">Last Week</TabsTrigger>
              <TabsTrigger value="month">Last Month</TabsTrigger>
            </TabsList>
            <TabsContent value="week" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={moodData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    formatter={(value, name, props) => [`${props.payload.name} (${value}%)`, 'Mood']}
                    labelFormatter={() => 'Mood'} 
                  />
                  <Bar 
                    dataKey="mood" 
                    fill="#8884d8" 
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                    name="Mood"
                    fill={(entry) => colorMap(entry.mood)}
                  />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="month" className="h-[300px]">
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Month view coming soon</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Activities Card */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Activities you've completed recently
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center">
                  <span className="text-lg mr-2">🧘</span>
                  <span className="text-sm">Five-Minute Meditation</span>
                </div>
                <span className="text-xs text-muted-foreground">Today</span>
              </li>
              <li className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center">
                  <span className="text-lg mr-2">🎵</span>
                  <span className="text-sm">Relaxation Playlist</span>
                </div>
                <span className="text-xs text-muted-foreground">Yesterday</span>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-lg mr-2">🌳</span>
                  <span className="text-sm">Nature Walk</span>
                </div>
                <span className="text-xs text-muted-foreground">2 days ago</span>
              </li>
            </ul>
            <Button variant="link" asChild className="mt-4 w-full">
              <Link href="/mood-booster">
                View All Activities
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        {/* Recent Chats Card */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Conversations</CardTitle>
            <CardDescription>
              Your latest chats with MoodMate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center">
                  <span className="text-sm">Feeling anxious about presentation...</span>
                </div>
                <span className="text-xs text-muted-foreground">2 hours ago</span>
              </li>
              <li className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center">
                  <span className="text-sm">Strategies for better sleep...</span>
                </div>
                <span className="text-xs text-muted-foreground">Yesterday</span>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm">Weekend relaxation techniques...</span>
                </div>
                <span className="text-xs text-muted-foreground">3 days ago</span>
              </li>
            </ul>
            <Button variant="link" asChild className="mt-4 w-full">
              <Link href="/ai-chat">
                Continue Chatting
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
