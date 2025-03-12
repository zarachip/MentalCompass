import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import openaiService from "@/lib/openai-service";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";

interface RecommendationsCardProps {
  activities: Activity[];
  isLoading: boolean;
}

export function RecommendationsCard({ activities, isLoading }: RecommendationsCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const handleCompleteActivity = async (activity: Activity) => {
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
  
  if (isLoading) {
    return (
      <Card className="bg-white rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Recommendations for You</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border border-neutral-200 rounded-lg p-4 animate-pulse">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-neutral-100 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-neutral-100 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-neutral-100 rounded w-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="bg-white rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Recommendations for You</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activities.map((activity) => (
              <div 
                key={activity.id} 
                className="border border-neutral-200 rounded-lg p-4 hover:border-primary transition-all cursor-pointer"
                onClick={() => handleCompleteActivity(activity)}
              >
                <div className="flex items-start">
                  <div className="text-4xl leading-none mr-3">
                    {activity.emoji}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{activity.title}</h4>
                    <p className="text-sm text-neutral-600">{activity.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <Button 
              variant="link" 
              className="text-primary hover:text-primary/80 font-medium transition-all flex items-center p-0"
            >
              <span>See more recommendations</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
