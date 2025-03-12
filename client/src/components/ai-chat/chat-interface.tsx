import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Message } from "@/types";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function ChatInterface({ messages, onSendMessage, isLoading }: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    onSendMessage(newMessage);
    setNewMessage("");
  };

  // Auto scroll to bottom on new messages
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle enter key to send message
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm mb-6">
      <div 
        ref={chatContainerRef}
        className="h-[500px] md:h-[calc(100vh-16rem)] overflow-y-auto flex flex-col space-y-4 p-4"
      >
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-neutral-400">
            <div className="text-center">
              <i className="ri-chat-smile-2-line text-4xl mb-2"></i>
              <p>Start a conversation with MoodMate AI</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <motion.div 
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start ${message.isUser ? "justify-end" : "max-w-3/4"}`}
            >
              <div 
                className={`rounded-lg p-3 ${
                  message.isUser 
                    ? "bg-primary text-white rounded-tr-none" 
                    : "bg-neutral-100 text-neutral-900 rounded-tl-none"
                }`}
              >
                <p>{message.content}</p>
              </div>
            </motion.div>
          ))
        )}
        
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start max-w-3/4"
          >
            <div className="bg-neutral-100 rounded-lg p-3 rounded-tl-none">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-neutral-300 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      <div className="p-4 border-t border-neutral-200">
        <form onSubmit={handleSubmit} className="flex items-center">
          <Textarea 
            className="flex-1 p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none min-h-10 max-h-32"
            placeholder="Type your message here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={1}
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || isLoading}
            className="ml-3 bg-primary hover:bg-primary/90 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all"
          >
            <i className="ri-send-plane-fill"></i>
          </Button>
        </form>
      </div>
    </Card>
  );
}
