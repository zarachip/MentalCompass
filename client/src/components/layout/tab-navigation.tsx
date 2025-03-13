import React from "react";
import { useLocation, Link } from "wouter";
import { TabItem } from "@/types";

const tabs: TabItem[] = [
  { id: "/", label: "Mood Detector", icon: "ri-emotion-line" },
  { id: "/chat", label: "AI Chat", icon: "ri-message-3-line" },
  { id: "/activities", label: "Mood Booster", icon: "ri-heart-pulse-line" },
  { id: "/dashboard", label: "Dashboard", icon: "ri-bar-chart-box-line" },
];

export function TabNavigation() {
  const [location] = useLocation();

  return (
    <nav className="bg-white py-2 px-4 border-b border-neutral-200">
      <div className="container mx-auto">
        <ul className="flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = location === tab.id;
            return (
              <li key={tab.id} className="py-2">
                <Link href={tab.id}>
                  <div
                    className={`px-4 py-2 rounded-lg font-medium flex items-center whitespace-nowrap cursor-pointer ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-neutral-600 hover:bg-neutral-100 transition-all"
                    }`}
                  >
                    <i className={`${tab.icon} mr-2`}></i>
                    <span>{tab.label}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}


// Landing page component
export function LandingPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to MoodMate!</h1>
      <p className="text-lg mb-8">Your AI companion for managing your mood.</p>
      <Link href="/">
        <button className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700">
          Get Started
        </button>
      </Link>
    </div>
  );
}
import React from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Define the navigation items
const navItems = [
  {
    path: '/',
    label: 'Home',
  },
  {
    path: '/mood',
    label: 'Mood Tracker',
  },
  {
    path: '/chat',
    label: 'Chat',
  },
  {
    path: '/activities',
    label: 'Activities',
  },
  {
    path: '/settings',
    label: 'Settings',
  },
];

export function TabNavigation() {
  const [location] = useLocation();

  return (
    <nav className="border-b mb-6">
      <div className="container mx-auto px-4">
        <ul className="flex space-x-1 overflow-x-auto py-2">
          {navItems.map((item) => (
            <li key={item.path}>
              {/* Use a div as wrapper and apply onClick to navigate */}
              <Button
                variant={location === item.path ? 'default' : 'ghost'}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium',
                  location === item.path
                    ? 'bg-primary text-white'
                    : 'text-muted-foreground hover:bg-muted'
                )}
                asChild
              >
                <Link href={item.path}>{item.label}</Link>
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
