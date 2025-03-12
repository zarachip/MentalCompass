import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ActivityCompletion, Activity } from "@/types";
import { getActivityIcon } from "@/lib/activity-service";

interface RecentActivitiesProps {
  completions: {
    completion: ActivityCompletion;
    activity: Activity;
  }[];
}

export function RecentActivities({ completions }: RecentActivitiesProps) {
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
  
  // Display only latest 3 activities
  const recentCompletions = completions.slice(0, 3);
  
  return (
    <Card className="bg-white rounded-xl shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Recent Activities</CardTitle>
          <Button 
            variant="link" 
            className="text-primary hover:text-primary/80"
          >
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {recentCompletions.length > 0 ? (
          <div className="divide-y divide-neutral-200">
            {recentCompletions.map(({ completion, activity }) => (
              <div key={completion.id} className="py-3 flex items-center">
                <div className="bg-neutral-100 p-2 rounded-lg mr-3">
                  <i className={`${getActivityIcon(activity.category)} text-primary text-xl`}></i>
                </div>
                <div className="flex-1">
                  <div className="font-medium">{activity.title}</div>
                  <div className="text-sm text-neutral-600">
                    {getTimeAgo(completion.completedAt)}
                  </div>
                </div>
                <div className="text-[#4CAF50]">+{Math.floor(Math.random() * 8) + 3} points</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-neutral-500">
            <i className="ri-emotion-line text-4xl mb-2 block"></i>
            <p>No activities completed yet</p>
            <p className="text-sm mt-1">Complete some activities to track your progress</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
