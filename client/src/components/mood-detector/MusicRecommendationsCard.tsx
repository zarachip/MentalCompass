
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MusicTrack } from "@/lib/ai-service";
import { Loader2 } from "lucide-react";
import { ExternalLink } from "lucide-react";

interface MusicRecommendationsCardProps {
  tracks: MusicTrack[];
  isLoading: boolean;
}

export function MusicRecommendationsCard({ tracks, isLoading }: MusicRecommendationsCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Music for Your Mood</CardTitle>
        <CardDescription>
          Here are some music recommendations that match your current emotional state.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : tracks.length > 0 ? (
          <ul className="space-y-4">
            {tracks.map((track) => (
              <li key={track.id} className="flex items-center">
                <div className="h-12 w-12 mr-3 rounded overflow-hidden flex-shrink-0">
                  <img 
                    src={track.imageUrl} 
                    alt={track.title} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <h4 className="font-medium truncate">{track.title}</h4>
                  <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                </div>
                <a 
                  href={track.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center py-8 text-muted-foreground">
            No music recommendations found. Please try analyzing your mood again.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
