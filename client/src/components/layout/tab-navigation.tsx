import React from "react";
import { useLocation, Link } from "wouter";
import { TabItem } from "@/types";

const tabs: TabItem[] = [
  { id: "/mood-detector", label: "Mood Detector", icon: "ri-emotion-line" },
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
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, MessageCircle, Activity, BarChart2 } from "lucide-react";

export function TabNavigation() {
  const [location] = useLocation();
  
  const tabs = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: Home,
      active: location === "/dashboard",
    },
    {
      href: "/mood-detector",
      label: "Mood",
      icon: BarChart2,
      active: location === "/mood-detector",
    },
    {
      href: "/ai-chat",
      label: "Chat",
      icon: MessageCircle,
      active: location === "/ai-chat",
    },
    {
      href: "/mood-booster",
      label: "Activities",
      icon: Activity,
      active: location === "/mood-booster",
    },
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t bg-background py-2 md:hidden">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={cn(
            "flex flex-1 flex-col items-center justify-center py-2 text-xs",
            tab.active
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <tab.icon className="h-5 w-5 mb-1" />
          <span>{tab.label}</span>
        </Link>
      ))}
    </div>
  );
}
