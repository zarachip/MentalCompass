
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ExternalLink } from "lucide-react";
import { useState } from "react";

interface ActivityCardProps {
  title: string;
  description: string;
  category: string;
  duration: string;
  icon: string;
  link?: string;
}

export function ActivityCard({ title, description, category, duration, icon, link }: ActivityCardProps) {
  const [completed, setCompleted] = useState(false);
  
  return (
    <Card className={`w-full transition-all ${completed ? 'bg-primary/10' : ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <span className="text-2xl mr-2">{icon}</span>
            <span>{title}</span>
          </CardTitle>
          <div className="text-sm rounded-full px-3 py-1 bg-secondary text-secondary-foreground">
            {category}
          </div>
        </div>
        <CardDescription>{duration}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{description}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant={completed ? "outline" : "default"}
          onClick={() => setCompleted(!completed)}
          className="gap-2"
        >
          {completed ? (
            <>
              <Check className="h-4 w-4" />
              Completed
            </>
          ) : (
            "Mark as Completed"
          )}
        </Button>
        
        {link && (
          <Button variant="ghost" size="icon" asChild>
            <a href={link} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
