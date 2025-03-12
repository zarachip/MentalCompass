import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MoodInputCardProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
}

export function MoodInputCard({ onAnalyze, isLoading }: MoodInputCardProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAnalyze(text);
    }
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm mb-6">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <Textarea
            className="w-full p-4 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            rows={5}
            placeholder="Type how you're feeling right now..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isLoading}
          />
          <Button 
            type="submit"
            className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg transition-all flex items-center justify-center"
            disabled={!text.trim() || isLoading}
          >
            <i className="ri-emotion-happy-line mr-2"></i>
            <span>{isLoading ? "Analyzing..." : "Analyze My Mood"}</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
