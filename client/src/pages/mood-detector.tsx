import React, { useState } from "react";
import { MoodInputCard } from "@/components/mood-detector/mood-input-card";
import { MoodResultCard } from "@/components/mood-detector/mood-result-card";
import { RecommendationsCard } from "@/components/mood-detector/recommendations-card";
import { MusicRecommendationsCard } from "@/components/mood-detector/music-recommendations-card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import openaiService from "@/lib/openai-service";
import { MoodWithKeywords, Activity, MusicTrack } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function MoodDetector() {
  const [currentMood, setCurrentMood] = useState<MoodWithKeywords | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Mutation for analyzing mood
  const moodMutation = useMutation({
    mutationFn: openaiService.analyzeMood,
    onSuccess: (data) => {
      setCurrentMood({
        ...data.mood,
        keywords: data.keywords
      });
      
      // Get activity recommendations for this mood
      activityRecommendationsMutation.mutate(data.mood.id);
      
      // Get music recommendations for this mood
      musicRecommendationsMutation.mutate(data.mood.id);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to analyze your mood. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Mutation for getting activity recommendations
  const activityRecommendationsMutation = useMutation({
    mutationFn: openaiService.getActivityRecommendations,
  });
  
  // Mutation for getting music recommendations
  const musicRecommendationsMutation = useMutation({
    mutationFn: openaiService.getMusicRecommendations,
  });
  
  const handleAnalyzeMood = (text: string) => {
    moodMutation.mutate(text);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="animate-fade-in"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-neutral-900">How are you feeling today?</h2>
        <p className="text-neutral-600 mt-1">Share your thoughts, and I'll analyze your mood.</p>
      </div>

      <MoodInputCard 
        onAnalyze={handleAnalyzeMood} 
        isLoading={moodMutation.isPending} 
      />
      
      {currentMood && (
        <>
          <MoodResultCard mood={currentMood} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <RecommendationsCard 
              activities={(activityRecommendationsMutation.data?.activities as Activity[]) || []}
              isLoading={activityRecommendationsMutation.isPending}
            />
            
            <MusicRecommendationsCard 
              tracks={(musicRecommendationsMutation.data?.tracks as MusicTrack[]) || []}
              isLoading={musicRecommendationsMutation.isPending}
            />
          </div>
        </>
      )}
    </motion.div>
  );
}
