import { useState } from "react";
import { MusicTrack } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getMusicMoodColor, getMusicMoodEmoji, getGenreIcon } from "@/lib/music-service";
import { FiExternalLink, FiMusic } from "react-icons/fi";

interface MusicRecommendationsCardProps {
  tracks: MusicTrack[];
  isLoading: boolean;
}

export function MusicRecommendationsCard({ tracks, isLoading }: MusicRecommendationsCardProps) {
  const [expanded, setExpanded] = useState(false);

  // Handle opening the external link to play the music
  const handlePlayMusic = (externalUrl: string | null) => {
    if (externalUrl) {
      window.open(externalUrl, "_blank");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-[250px]" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-[300px]" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-md" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!tracks.length) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FiMusic className="text-primary" /> Music Recommendations
        </CardTitle>
        <CardDescription>
          Songs that match your current mood to enhance your emotional well-being
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tracks.slice(0, expanded ? undefined : 3).map((track) => (
            <div key={track.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary/10 text-primary text-xl">
                {getGenreIcon(track.genre)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-medium truncate">{track.title}</h4>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handlePlayMusic(track.externalUrl || null)}
                    className="h-8 px-2"
                    disabled={!track.externalUrl}
                  >
                    <FiExternalLink className="mr-1" /> Listen
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <span>{track.artist}</span>
                  <span>•</span>
                  <span>{track.genre}</span>
                </div>
                <div className="mt-2">
                  <Badge className={`${getMusicMoodColor(track.mood)}`}>
                    {getMusicMoodEmoji(track.mood)} {track.mood}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        {tracks.length > 3 && (
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Show Less" : "Show More"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}