import { getMoodEmoji, getMoodColor } from "@/lib/activity-service";

interface MoodEmojiProps {
  mood: string;
  size?: "small" | "medium" | "large";
  withBackground?: boolean;
  className?: string;
}

export function MoodEmoji({ 
  mood, 
  size = "medium", 
  withBackground = false,
  className = "" 
}: MoodEmojiProps) {
  const emoji = getMoodEmoji(mood);
  const bgColor = getMoodColor(mood);
  
  const sizeClasses = {
    small: "text-xl",
    medium: "text-3xl",
    large: "text-6xl",
  };
  
  if (withBackground) {
    return (
      <div className={`${bgColor} bg-opacity-20 rounded-full p-3 flex items-center justify-center ${className}`}>
        <span className={`${sizeClasses[size]} leading-none`}>{emoji}</span>
      </div>
    );
  }
  
  return <span className={`${sizeClasses[size]} leading-none ${className}`}>{emoji}</span>;
}
