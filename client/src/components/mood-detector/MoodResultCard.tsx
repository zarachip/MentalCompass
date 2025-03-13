
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

export function MoodResultCard({ mood }: { mood: MoodWithKeywords }) {
  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <span className="text-4xl mr-3">{mood.mood.emoji}</span>
          <span>Your Current Mood: {mood.mood.name}</span>
        </CardTitle>
        <CardDescription>
          Based on your text, here's what we detected about your emotional state.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h4 className="font-medium mb-2">Mood Intensity</h4>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="h-2.5 rounded-full" 
              style={{ 
                width: `${mood.mood.intensity}%`,
                backgroundColor: mood.mood.color
              }}
            ></div>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Key Emotions & Themes</h4>
          <div className="flex flex-wrap gap-2">
            {mood.keywords.map((keyword, index) => (
              <Badge key={index} variant="secondary">{keyword}</Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
