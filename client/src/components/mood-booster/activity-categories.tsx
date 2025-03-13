
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Activity } from "@/types";

// Category types and utility functions
type CategoryType = "All Categories" | "Social" | "Creative" | "Physical" | "Relaxation" | "Mindfulness";

const CATEGORIES: CategoryType[] = [
  "All Categories",
  "Social",
  "Creative",
  "Physical", 
  "Relaxation",
  "Mindfulness"
];

interface ActivityCategoriesProps {
  activities: Activity[];
}

const getCategoryEmoji = (category: string): string => {
  switch (category.toLowerCase()) {
    case "social": return "👥";
    case "creative": return "🎨";
    case "physical": return "🏃‍♂️";
    case "relaxation": return "🧘‍♀️";
    case "mindfulness": return "🧠";
    default: return "✨";
  }
};

const getCategoryColor = (category: string): string => {
  switch (category.toLowerCase()) {
    case "social": return "bg-blue-100 text-blue-800 bg-opacity-20";
    case "creative": return "bg-purple-100 text-purple-800 bg-opacity-20";
    case "physical": return "bg-green-100 text-green-800 bg-opacity-20";
    case "relaxation": return "bg-yellow-100 text-yellow-800 bg-opacity-20";
    case "mindfulness": return "bg-indigo-100 text-indigo-800 bg-opacity-20";
    default: return "bg-gray-100 text-gray-800 bg-opacity-20";
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
