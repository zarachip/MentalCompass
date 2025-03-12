
import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import openaiService, { Activity, MusicTrack, getMusicRecommendations } from "@/lib/ai-service";
import { MoodInputCard } from "@/components/mood-detector/MoodInputCard";
import { MoodResultCard } from "@/components/mood-detector/MoodResultCard";
import { RecommendationsCard } from "@/components/mood-detector/RecommendationsCard";
import { MusicRecommendationsCard } from "@/components/mood-detector/MusicRecommendationsCard";
import { MoveRight } from "lucide-react";

interface MoodWithKeywords {
  mood: {
    id: string;
    name: string;
    emoji: string;
    intensity: number;
    color: string;
  };
  keywords: string[];
}

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
      
      // Get recommendations for this mood
      recommendationsMutation.mutate(data.mood.id);
      
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
  const recommendationsMutation = useMutation({
    mutationFn: openaiService.getActivityRecommendations,
  });
  
  // Mutation for getting music recommendations
  const musicRecommendationsMutation = useMutation({
    mutationFn: getMusicRecommendations,
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
        <p className="text-muted-foreground">
          Share your thoughts and feelings, and I'll help you understand your mood.
        </p>
      </div>
      
      <MoodInputCard 
        onAnalyze={handleAnalyzeMood} 
        isLoading={moodMutation.isPending} 
      />
      
      {currentMood && (
        <>
          <MoodResultCard mood={currentMood} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <RecommendationsCard 
              activities={(recommendationsMutation.data?.activities as Activity[]) || []}
              isLoading={recommendationsMutation.isPending}
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
