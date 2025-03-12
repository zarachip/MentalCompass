import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mood } from "@/types";
import { getMoodColor } from "@/lib/activity-service";
import { 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";

interface MoodChartProps {
  moods: Mood[];
}

export function MoodChart({ moods }: MoodChartProps) {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("week");
  
  const chartData = useMemo(() => {
    const now = new Date();
    const days: Array<{
      date: Date;
      day: string;
      score: number;
      mood: string;
      hasData: boolean;
    }> = [];
    
    let daysToShow = 7;
    if (timeRange === "month") {
      daysToShow = 30;
    }
    
    // Create array of days based on selected range
    if (timeRange !== "all") {
      for (let i = daysToShow - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        days.push({
          date,
          day: date.toLocaleDateString('en-US', { 
            weekday: daysToShow <= 7 ? 'short' : undefined,
            month: daysToShow > 7 ? 'short' : undefined,
            day: 'numeric'
          }),
          score: 0,
          mood: "neutral",
          hasData: false
        });
      }
      
      // Map moods to days
      moods.forEach(mood => {
        const moodDate = new Date(mood.createdAt);
        const dayIndex = days.findIndex(d => 
          d.date.getDate() === moodDate.getDate() && 
          d.date.getMonth() === moodDate.getMonth() &&
          d.date.getFullYear() === moodDate.getFullYear()
        );
        
        if (dayIndex !== -1) {
          // Use the score from the mood entry or convert sentiment to score
          days[dayIndex].score = mood.score;
          days[dayIndex].mood = mood.sentiment;
          days[dayIndex].hasData = true;
        }
      });
      
      return days.map(day => ({
        day: day.day,
        score: day.score,
        mood: day.mood,
        hasData: day.hasData
      }));
    } else {
      // For "all" time range, group by date with proper data
      const sortedMoods = [...moods].sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      
      const allData = sortedMoods.map(mood => {
        const date = new Date(mood.createdAt);
        return {
          day: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          score: mood.score,
          mood: mood.sentiment,
          hasData: true,
          timestamp: date.getTime()
        };
      });
      
      // Group by day to avoid duplicates
      const groupedByDay: Record<string, any> = {};
      allData.forEach(item => {
        if (!groupedByDay[item.day] || item.timestamp > groupedByDay[item.day].timestamp) {
          groupedByDay[item.day] = item;
        }
      });
      
      return Object.values(groupedByDay);
    }
  }, [moods, timeRange]);

  // Generate mood distribution data for pie chart
  const moodDistributionData = useMemo(() => {
    const distribution: Record<string, number> = {
      happy: 0,
      calm: 0,
      neutral: 0,
      anxious: 0,
      sad: 0
    };
    
    // Filter moods based on selected time range
    let filteredMoods = [...moods];
    if (timeRange === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filteredMoods = moods.filter(mood => new Date(mood.createdAt) >= weekAgo);
    } else if (timeRange === "month") {
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);
      filteredMoods = moods.filter(mood => new Date(mood.createdAt) >= monthAgo);
    }
    
    // Count occurrences of each mood
    filteredMoods.forEach(mood => {
      distribution[mood.sentiment] = (distribution[mood.sentiment] || 0) + 1;
    });
    
    // Convert to array format for PieChart
    return Object.entries(distribution)
      .filter(([_, count]) => count > 0)
      .map(([name, value]) => ({ name, value }));
  }, [moods, timeRange]);
  
  // Weekly average line chart data
  const weeklyAverageData = useMemo(() => {
    if (moods.length === 0) return [];
    
    const sortedMoods = [...moods].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    
    // Group moods by week
    const weekGroups: Record<string, Mood[]> = {};
    
    sortedMoods.forEach(mood => {
      const date = new Date(mood.createdAt);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
      
      const weekKey = weekStart.toISOString().slice(0, 10);
      if (!weekGroups[weekKey]) {
        weekGroups[weekKey] = [];
      }
      weekGroups[weekKey].push(mood);
    });
    
    // Calculate average score for each week
    return Object.entries(weekGroups).map(([weekStart, weekMoods]) => {
      const startDate = new Date(weekStart);
      const averageScore = weekMoods.reduce((sum, mood) => sum + mood.score, 0) / weekMoods.length;
      
      return {
        week: startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        average: parseFloat(averageScore.toFixed(1)),
        count: weekMoods.length
      };
    });
  }, [moods]);
  
  const moodColors = {
    happy: "#4CAF50",
    calm: "#2196F3",
    neutral: "#9E9E9E",
    anxious: "#FFC107",
    sad: "#F44336"
  };
  
  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const mood = payload[0].payload.mood;
      return (
        <div className="bg-white p-2 border border-neutral-200 shadow-sm rounded">
          <p className="capitalize">{mood}</p>
          <p>Score: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };
  
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-neutral-200 shadow-sm rounded">
          <p className="capitalize font-medium">{payload[0].name}</p>
          <p>{payload[0].value} entries ({
            Math.round((payload[0].value / moodDistributionData.reduce((sum, item) => sum + item.value, 0)) * 100)
          }%)</p>
        </div>
      );
    }
    return null;
  };
  
  const CustomLineTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-neutral-200 shadow-sm rounded">
          <p className="font-medium">Week of {payload[0].payload.week}</p>
          <p>Average: {payload[0].value.toFixed(1)}</p>
          <p className="text-xs text-neutral-500">Based on {payload[0].payload.count} entries</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className="bg-white rounded-xl shadow-sm mb-6">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <CardTitle className="text-lg font-medium">Mood Analytics</CardTitle>
          <div className="flex items-center">
            <div className="text-sm mr-2">Time Range:</div>
            <div className="grid grid-cols-3 rounded-md overflow-hidden border divide-x">
              <button
                className={`px-3 py-1 text-sm ${timeRange === "week" ? "bg-primary text-white" : "bg-white"}`}
                onClick={() => setTimeRange("week")}
              >
                Week
              </button>
              <button
                className={`px-3 py-1 text-sm ${timeRange === "month" ? "bg-primary text-white" : "bg-white"}`}
                onClick={() => setTimeRange("month")}
              >
                Month
              </button>
              <button
                className={`px-3 py-1 text-sm ${timeRange === "all" ? "bg-primary text-white" : "bg-white"}`}
                onClick={() => setTimeRange("all")}
              >
                All
              </button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="daily">Daily Mood</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily" className="space-y-4">
            <div className="h-64">
              {moods.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <XAxis 
                      dataKey="day" 
                      tick={{ fontSize: 12, fill: '#6E7A8A' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      domain={[0, 5]}
                      tick={{ fontSize: 12, fill: '#6E7A8A' }}
                      tickCount={6}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomBarTooltip />} />
                    <Bar 
                      dataKey="score" 
                      radius={[4, 4, 0, 0]}
                      barSize={30}
                      fill="var(--primary)"
                    >
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.hasData ? (moodColors as any)[entry.mood] || "var(--primary)" : "#E0E0E0"}
                          opacity={entry.hasData ? 1 : 0.5}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-neutral-500">
                  No mood data available
                </div>
              )}
            </div>
            <div className="text-xs text-neutral-500 text-center pt-2">
              {moods.length === 0 
                ? "Track your mood to see your daily mood scores" 
                : `Showing mood scores from ${chartData[0]?.day || ''} to ${chartData[chartData.length-1]?.day || ''}`
              }
            </div>
          </TabsContent>
          
          <TabsContent value="distribution">
            <div className="h-64">
              {moodDistributionData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={moodDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {moodDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={(moodColors as any)[entry.name]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-neutral-500">
                  No mood data available
                </div>
              )}
            </div>
            <div className="text-xs text-neutral-500 text-center pt-2">
              {moodDistributionData.length === 0 
                ? "Track your mood to see distribution" 
                : `Distribution based on ${moodDistributionData.reduce((sum, item) => sum + item.value, 0)} mood entries`
              }
            </div>
          </TabsContent>
          
          <TabsContent value="trends">
            <div className="h-64">
              {weeklyAverageData.length > 1 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={weeklyAverageData}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <XAxis
                      dataKey="week"
                      tick={{ fontSize: 12, fill: '#6E7A8A' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 5]}
                      tick={{ fontSize: 12, fill: '#6E7A8A' }}
                      tickCount={6}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomLineTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="average"
                      stroke="var(--primary)"
                      strokeWidth={2}
                      dot={{ fill: 'var(--primary)', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-neutral-500">
                  {moods.length === 0 
                    ? "No mood data available" 
                    : "Need more data to show trends (at least 2 weeks)"
                  }
                </div>
              )}
            </div>
            <div className="text-xs text-neutral-500 text-center pt-2">
              {weeklyAverageData.length <= 1
                ? "Continue tracking your mood to see weekly trends"
                : "Weekly average mood scores over time"
              }
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
