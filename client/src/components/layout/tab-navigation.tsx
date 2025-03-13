import React from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

interface TabNavigationProps {
  className?: string;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ className }) => {
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      <ul className="flex space-x-4">
        <li>
          <Link href="/">
            <span className="text-sm font-medium transition-colors hover:text-primary cursor-pointer">
              Home
            </span>
          </Link>
        </li>
        <li>
          <Link href="/dashboard">
            <span className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer">
              Dashboard
            </span>
          </Link>
        </li>
        <li>
          <Link href="/settings">
            <span className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer">
              Settings
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default TabNavigation;

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