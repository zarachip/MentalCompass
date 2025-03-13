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
