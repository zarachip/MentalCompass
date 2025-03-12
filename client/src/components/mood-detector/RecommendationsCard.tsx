
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "@/lib/ai-service";
import { Loader2 } from "lucide-react";

interface RecommendationsCardProps {
  activities: Activity[];
  isLoading: boolean;
}

export function RecommendationsCard({ activities, isLoading }: RecommendationsCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recommended Activities</CardTitle>
        <CardDescription>
          Based on your mood, here are some activities that might help.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : activities.length > 0 ? (
          <ul className="space-y-4">
            {activities.map((activity) => (
              <li key={activity.id} className="flex items-start">
                <div className="mr-3 text-xl">{activity.icon}</div>
                <div>
                  <h4 className="font-medium">{activity.title}</h4>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <div className="mt-1 flex items-center text-xs text-muted-foreground">
                    <span className="mr-3">{activity.category}</span>
                    <span>{activity.duration}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center py-8 text-muted-foreground">
            No activities found. Please try analyzing your mood again.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
