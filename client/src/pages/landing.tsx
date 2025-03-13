
import React from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const [_, navigate] = useLocation();
  
  return (
    <div className="container mx-auto p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4">MoodMate</h1>
      
      <div className="max-w-md mb-12">
        <p className="text-neutral-700 mb-4">
          Track your emotions, get personalized activities, and chat with an AI that helps you navigate your mental well-being journey.
        </p>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-primary/10 p-3 rounded-lg">
            <span className="text-2xl">😊</span>
            <p className="text-sm mt-1">Mood Tracking</p>
          </div>
          <div className="bg-primary/10 p-3 rounded-lg">
            <span className="text-2xl">💬</span>
            <p className="text-sm mt-1">AI Chat Support</p>
          </div>
          <div className="bg-primary/10 p-3 rounded-lg">
            <span className="text-2xl">🏃‍♂️</span>
            <p className="text-sm mt-1">Activity Suggestions</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button 
          size="lg" 
          className="w-full" 
          onClick={() => navigate('/mood-detector')}
        >
          Get Started
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          className="w-full"
          onClick={() => navigate('/dashboard')}
        >
          View Dashboard
        </Button>
      </div>
      
      <p className="text-neutral-500 text-sm mt-8">
        Your mental health data stays private and secure
      </p>
    </div>
  );
}
