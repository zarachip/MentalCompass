import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getMusicIcon, getMusicMoodColor } from "@/lib/music-service";
import { MusicTrack } from "@/types";
import { ExternalLink, Music } from "lucide-react";
import { useState } from "react";

interface MusicRecommendationsCardProps {
  tracks: MusicTrack[];
  isLoading: boolean;
}

export function MusicRecommendationsCard({ tracks, isLoading }: MusicRecommendationsCardProps) {
  const [activeTrack, setActiveTrack] = useState<MusicTrack | null>(null);

  const handleOpenUrl = (track: MusicTrack) => {
    if (track.externalUrl) {
      window.open(track.externalUrl, '_blank');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Music Recommendations
        </CardTitle>
        <CardDescription>
          Here are some music suggestions to match your current mood
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col space-y-3">
            <div className="h-20 rounded-md bg-gray-100 animate-pulse dark:bg-gray-800"></div>
            <div className="h-20 rounded-md bg-gray-100 animate-pulse dark:bg-gray-800"></div>
            <div className="h-20 rounded-md bg-gray-100 animate-pulse dark:bg-gray-800"></div>
          </div>
        ) : tracks.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No music recommendations available yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tracks.map((track) => (
              <div
                key={track.id}
                className={`p-4 rounded-lg border transition-colors ${
                  activeTrack?.id === track.id ? 'border-primary' : ''
                }`}
                onClick={() => setActiveTrack(track)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${getMusicMoodColor(track.mood)}`}>
                      {getMusicIcon(track.genre)}
                    </div>
                    <div>
                      <h4 className="font-medium">{track.title}</h4>
                      <p className="text-sm text-muted-foreground">{track.artist}</p>
                      <div className="flex items-center mt-1 gap-2">
                        <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                          {track.genre}
                        </span>
                        <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                          {track.mood}
                        </span>
                      </div>
                    </div>
                  </div>
                  {track.externalUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenUrl(track);
                      }}
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">Listen</span>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}