
import React from "react";
import { Link, useLocation } from "wouter";

export function TabNavigation() {
  const [location] = useLocation();

  const tabs = [
    { name: "Mood Detector", path: "/mood-detector" },
    { name: "AI Chat", path: "/chat" },
    { name: "Activities", path: "/activities" },
    { name: "Dashboard", path: "/dashboard" },
  ];

  return (
    <nav className="border-t border-gray-200 fixed bottom-0 w-full bg-white dark:bg-gray-950 z-10">
      <div className="container mx-auto">
        <ul className="flex justify-between px-4 py-2">
          {tabs.map((tab) => (
            <li key={tab.path}>
              <Link href={tab.path}>
                <span
                  className={`flex flex-col items-center p-2 cursor-pointer ${
                    location === tab.path
                      ? "text-primary font-medium"
                      : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
                  }`}
                >
                  {tab.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

// This component was incorrectly placed in tab-navigation.tsx
// It should be in its own file within the pages directory
export function LandingPage() {
  const [_, navigate] = useLocation();
  
  return (
    <div className="container mx-auto p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4">MoodMate</h1>
      <p className="text-lg mb-8">Your AI companion for managing your mood</p>
      <button 
        className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90"
        onClick={() => navigate("/mood-detector")}
      >
        Get Started
      </button>
    </div>
  );
}
