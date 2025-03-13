
import React from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export function TabNavigation() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/mood-detector", label: "Mood Detector" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/chat", label: "Chat" },
    { href: "/activities", label: "Activities" },
  ];

  return (
    <nav className="border-b">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <ul className="flex gap-4">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <span
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary cursor-pointer",
                    location === item.href
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
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
