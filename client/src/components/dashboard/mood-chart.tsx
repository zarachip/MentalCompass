import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mood } from "@/types";
import { getMoodColor } from "@/lib/activity-service";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface MoodChartProps {
  moods: Mood[];
}

export function MoodChart({ moods }: MoodChartProps) {
  const chartData = useMemo(() => {
    const now = new Date();
    const days = [];
    
    // Create array of last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      days.push({
        date,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        score: 0,
        mood: "neutral"
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
      }
    });
    
    return days.map(day => ({
      day: day.day,
      score: day.score,
      mood: day.mood
    }));
  }, [moods]);
  
  const moodScoreToPct = (score: number) => {
    // Convert 1-5 scale to percentage height (20%-100%)
    return score * 20;
  };
  
  const CustomTooltip = ({ active, payload }: any) => {
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
  
  return (
    <Card className="bg-white rounded-xl shadow-sm mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Mood History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
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
                hide
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="score" 
                radius={[4, 4, 0, 0]}
                barSize={30}
                fill="var(--primary)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
