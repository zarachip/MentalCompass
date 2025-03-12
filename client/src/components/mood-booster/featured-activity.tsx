import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity } from "@/types";
import { useToast } from "@/hooks/use-toast";
import openaiService from "@/lib/openai-service";
import { useQueryClient } from "@tanstack/react-query";

interface FeaturedActivityProps {
  activity?: Activity;
}

export function FeaturedActivity({ activity }: FeaturedActivityProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const defaultActivity = {
    id: 0,
    emoji: "🧘‍♀️",
    title: "5-Minute Breathing Exercise",
    description: "This simple breathing technique can help reduce anxiety and bring your focus to the present moment. It's perfect when you need a quick mental reset.",
    category: "mindfulness"
  };
  
  const displayActivity = activity || defaultActivity;
  
  const handleCompleteActivity = async () => {
    if (!activity) return;
    
    try {
      await openaiService.completeActivity(activity.id);
      
      toast({
        title: "Activity Completed!",
        description: `You've completed "${activity.title}"`,
      });
      
      // Invalidate completed activities cache
      queryClient.invalidateQueries({ queryKey: ['/api/activities/completed'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark activity as completed",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card className="bg-white rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Featured Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg overflow-hidden relative bg-black h-48 mb-4">
          {/* We're using a gradient overlay instead of an image */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-80"></div>
          
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <span className="text-8xl">{displayActivity.emoji}</span>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <h4 className="text-white font-medium text-lg">{displayActivity.title}</h4>
            <p className="text-white text-opacity-80 text-sm">Take a moment for yourself</p>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-neutral-600 mb-4">{displayActivity.description}</p>
          
          <Button 
            onClick={handleCompleteActivity}
            className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg transition-all flex items-center justify-center w-full md:w-auto"
          >
            <i className="ri-play-circle-line mr-2"></i>
            <span>Start Activity</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
