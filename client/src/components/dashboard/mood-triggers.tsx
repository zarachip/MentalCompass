import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mood } from "@/types";

interface MoodTriggersProps {
  moods: Mood[];
}

export function MoodTriggers({ moods }: MoodTriggersProps) {
  const triggers = useMemo(() => {
    if (!moods || moods.length === 0) {
      return {
        positiveKeywords: [],
        negativeKeywords: [],
        commonPhrases: {}
      };
    }

    // Group moods by sentiment
    const moodsBySentiment: Record<string, Mood[]> = {};
    moods.forEach(mood => {
      if (!moodsBySentiment[mood.sentiment]) {
        moodsBySentiment[mood.sentiment] = [];
      }
      moodsBySentiment[mood.sentiment].push(mood);
    });

    // Extract words from mood texts
    const extractWords = (text: string): string[] => {
      return text.toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .split(/\s+/)
        .filter(word => word.length > 3 && !['this', 'that', 'with', 'from', 'have', 'just', 'because', 'about', 'what'].includes(word));
    };

    // Count word occurrences by mood type
    const wordCounts: Record<string, Record<string, number>> = {
      positive: {},
      negative: {},
      neutral: {}
    };

    // Categorize moods
    const positiveMoods = [...(moodsBySentiment['happy'] || []), ...(moodsBySentiment['calm'] || [])];
    const negativeMoods = [...(moodsBySentiment['sad'] || []), ...(moodsBySentiment['anxious'] || [])];
    const neutralMoods = moodsBySentiment['neutral'] || [];

    // Count words in positive moods
    positiveMoods.forEach(mood => {
      const words = extractWords(mood.text);
      words.forEach(word => {
        wordCounts.positive[word] = (wordCounts.positive[word] || 0) + 1;
      });
    });

    // Count words in negative moods
    negativeMoods.forEach(mood => {
      const words = extractWords(mood.text);
      words.forEach(word => {
        wordCounts.negative[word] = (wordCounts.negative[word] || 0) + 1;
      });
    });

    // Count words in neutral moods
    neutralMoods.forEach(mood => {
      const words = extractWords(mood.text);
      words.forEach(word => {
        wordCounts.neutral[word] = (wordCounts.neutral[word] || 0) + 1;
      });
    });

    // Find most common words in positive moods
    const positiveKeywords = Object.entries(wordCounts.positive)
      .filter(([word, count]) => {
        // Only include words that appear more in positive moods than negative
        const negCount = wordCounts.negative[word] || 0;
        return count > negCount;
      })
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([word]) => word);

    // Find most common words in negative moods
    const negativeKeywords = Object.entries(wordCounts.negative)
      .filter(([word, count]) => {
        // Only include words that appear more in negative moods than positive
        const posCount = wordCounts.positive[word] || 0;
        return count > posCount;
      })
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([word]) => word);

    // Find common phrases related to moods
    const commonPhrases: Record<string, string[]> = {
      happy: [],
      calm: [],
      sad: [],
      anxious: []
    };

    // Extract 2-3 word phrases from texts
    const extractPhrases = (text: string): string[] => {
      const words = text.toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .split(/\s+/)
        .filter(word => word.length > 2);
      
      const phrases: string[] = [];
      for (let i = 0; i < words.length - 1; i++) {
        phrases.push(`${words[i]} ${words[i+1]}`);
        if (i < words.length - 2) {
          phrases.push(`${words[i]} ${words[i+1]} ${words[i+2]}`);
        }
      }
      return phrases;
    };

    // Count phrases by mood
    const phraseCounts: Record<string, Record<string, number>> = {
      happy: {},
      calm: {},
      sad: {},
      anxious: {}
    };

    // Process each mood category
    ['happy', 'calm', 'sad', 'anxious'].forEach(sentiment => {
      const sentimentMoods = moodsBySentiment[sentiment] || [];
      sentimentMoods.forEach(mood => {
        const phrases = extractPhrases(mood.text);
        phrases.forEach(phrase => {
          phraseCounts[sentiment][phrase] = (phraseCounts[sentiment][phrase] || 0) + 1;
        });
      });

      // Get top phrases for this mood
      commonPhrases[sentiment] = Object.entries(phraseCounts[sentiment])
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([phrase]) => phrase);
    });

    return {
      positiveKeywords,
      negativeKeywords,
      commonPhrases
    };
  }, [moods]);

  const moodColors: Record<string, string> = {
    happy: "bg-green-100 text-green-800 hover:bg-green-200",
    calm: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    sad: "bg-red-100 text-red-800 hover:bg-red-200",
    anxious: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Mood Triggers</CardTitle>
      </CardHeader>
      <CardContent>
        {moods.length >= 3 ? (
          <div className="space-y-6">
            {/* Positive Triggers */}
            <div>
              <h3 className="text-sm font-medium text-neutral-600 mb-3">Words associated with positive moods</h3>
              <div className="flex flex-wrap gap-2">
                {triggers.positiveKeywords.length > 0 ? (
                  triggers.positiveKeywords.map((word, index) => (
                    <Badge key={index} variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                      {word}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-neutral-500">No data available yet</p>
                )}
              </div>
            </div>

            <Separator />

            {/* Negative Triggers */}
            <div>
              <h3 className="text-sm font-medium text-neutral-600 mb-3">Words associated with negative moods</h3>
              <div className="flex flex-wrap gap-2">
                {triggers.negativeKeywords.length > 0 ? (
                  triggers.negativeKeywords.map((word, index) => (
                    <Badge key={index} variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-200">
                      {word}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-neutral-500">No data available yet</p>
                )}
              </div>
            </div>

            <Separator />

            {/* Common Phrases */}
            <div>
              <h3 className="text-sm font-medium text-neutral-600 mb-3">Common phrases in your entries</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(triggers.commonPhrases).map(([mood, phrases]) => (
                  phrases.length > 0 && (
                    <div key={mood} className="space-y-2">
                      <h4 className="text-sm font-medium capitalize">{mood} Moods:</h4>
                      <div className="flex flex-wrap gap-2">
                        {phrases.map((phrase, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary" 
                            className={moodColors[mood]}
                          >
                            "{phrase}"
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </div>
              {Object.values(triggers.commonPhrases).every(phrases => phrases.length === 0) && (
                <p className="text-sm text-neutral-500">Add more detailed mood entries to see common phrases</p>
              )}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-neutral-500">
            <i className="ri-mental-health-line text-4xl mb-2 block"></i>
            <p>Not enough mood data</p>
            <p className="text-sm mt-1">Add at least 3 mood entries to see triggers</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}