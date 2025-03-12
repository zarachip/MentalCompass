import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoodEmoji } from "@/components/ui/mood-emoji";
import { MoodWithKeywords } from "@/types";
import { motion } from "framer-motion";

interface MoodResultCardProps {
  mood: MoodWithKeywords;
}

export function MoodResultCard({ mood }: MoodResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="bg-white rounded-xl shadow-sm mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6 flex flex-col items-center">
              <MoodEmoji mood={mood.sentiment} size="large" className="mb-2" />
              <div className="text-lg font-medium capitalize">{mood.sentiment}</div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">Mood Analysis</h3>
              <p className="text-neutral-600 mb-4">{mood.analysis}</p>
              <div className="flex flex-wrap gap-2">
                {mood.keywords.map((keyword, index) => (
                  <Badge
                    key={index}
                    className={`px-3 py-1 ${
                      index === 0 
                        ? getMoodBadgeClass(mood.sentiment) 
                        : "bg-neutral-200 text-neutral-800"
                    } rounded-full text-sm`}
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function getMoodBadgeClass(mood: string): string {
  switch (mood) {
    case "happy":
      return "bg-[#FFD700] text-black";
    case "sad":
      return "bg-[#6A5ACD] text-white";
    case "anxious":
      return "bg-[#FF7F50] text-white";
    case "calm":
      return "bg-[#5F9EA0] text-white";
    default:
      return "bg-[#A9A9A9] text-white";
  }
}
