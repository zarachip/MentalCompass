import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity } from "@/types";
import { MoodEmoji } from "@/components/ui/mood-emoji";

interface ActivityCategoriesProps {
  activities: Activity[];
}

type CategoryType = "All Categories" | "Relaxation" | "Physical" | "Creative" | "Social" | "Mindfulness";

const CATEGORIES: CategoryType[] = [
  "All Categories",
  "Relaxation",
  "Physical", 
  "Creative", 
  "Social", 
  "Mindfulness"
];

const getCategoryEmoji = (category: string): string => {
  switch(category.toLowerCase()) {
    case "relaxation": return "🧘‍♀️";
    case "physical": return "🚶‍♂️";
    case "creative": return "🎨";
    case "social": return "👥";
    case "mindfulness": return "✨";
    default: return "🌟";
  }
};

const getCategoryColor = (category: string): string => {
  switch(category.toLowerCase()) {
    case "relaxation": return "bg-[#5F9EA0] bg-opacity-20";
    case "physical": return "bg-[#FF7F50] bg-opacity-20";
    case "creative": return "bg-[#6A5ACD] bg-opacity-20";
    case "social": return "bg-[#FFD700] bg-opacity-20";
    case "mindfulness": return "bg-[#4CAF50] bg-opacity-20";
    default: return "bg-primary-light bg-opacity-20";
  }
};

export function ActivityCategories({ activities }: ActivityCategoriesProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("All Categories");
  
  const filteredActivities = activities.filter(
    activity => selectedCategory === "All Categories" || 
    activity.category.toLowerCase() === selectedCategory.toLowerCase()
  );
  
  const displayActivities = filteredActivities.slice(0, 3);
  
  return (
    <Card className="bg-white rounded-xl shadow-sm mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Activity Categories</CardTitle>
          <div className="relative">
            <Select 
              value={selectedCategory} 
              onValueChange={(value) => setSelectedCategory(value as CategoryType)}
            >
              <SelectTrigger className="min-w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {displayActivities.length > 0 ? (
            displayActivities.map((activity) => (
              <div 
                key={activity.id} 
                className={`${getCategoryColor(activity.category)} rounded-lg p-4 cursor-pointer hover:shadow-md transition-all`}
              >
                <div className="flex flex-col items-center text-center">
                  <span className="text-4xl mb-2">{activity.emoji || getCategoryEmoji(activity.category)}</span>
                  <h4 className="font-medium mb-1">{activity.title}</h4>
                  <p className="text-sm text-neutral-600">{activity.description}</p>
                </div>
              </div>
            ))
          ) : (
            // Fallback categories if no activities found
            CATEGORIES.filter(c => c !== "All Categories").slice(0, 3).map(category => (
              <div 
                key={category} 
                className={`${getCategoryColor(category)} rounded-lg p-4 cursor-pointer hover:shadow-md transition-all`}
              >
                <div className="flex flex-col items-center text-center">
                  <span className="text-4xl mb-2">{getCategoryEmoji(category)}</span>
                  <h4 className="font-medium mb-1">{category}</h4>
                  <p className="text-sm text-neutral-600">Activities to promote wellbeing</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
