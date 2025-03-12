
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface MoodInputCardProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
}

export function MoodInputCard({ onAnalyze, isLoading }: MoodInputCardProps) {
  const [text, setText] = useState("");
  
  const handleSubmit = () => {
    if (text.trim()) {
      onAnalyze(text);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Express Your Feelings</CardTitle>
        <CardDescription>
          Share how you're feeling, and our AI will analyze your mood.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="How are you feeling today? What's on your mind?"
          className="min-h-[150px] mb-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSubmit} disabled={isLoading || !text.trim()}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze My Mood"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
