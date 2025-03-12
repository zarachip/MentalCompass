import React from "react";
import { ChatInterface } from "@/components/ai-chat/chat-interface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import openaiService from "@/lib/openai-service";
import activityService from "@/lib/activity-service";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function AIChat() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Get chat history
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/chat/history'],
    queryFn: activityService.getChatHistory,
  });
  
  // Send chat message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (message: string) => openaiService.sendChatMessage(message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/history'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const handleSendMessage = (message: string) => {
    sendMessageMutation.mutate(message);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-neutral-900">Chat with MoodMate AI</h2>
        <p className="text-neutral-600 mt-1">I'm here to listen and support you.</p>
      </div>

      <ChatInterface 
        messages={data?.messages || []}
        onSendMessage={handleSendMessage}
        isLoading={sendMessageMutation.isPending}
      />
    </motion.div>
  );
}
