
import React from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

// Navigation links
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/mood-tracker", label: "Mood Tracker" },
  { href: "/chat", label: "Chat" },
  { href: "/settings", label: "Settings" },
];

export function TabNavigation() {
  const [location] = useLocation();

  return (
    <nav className="border-b">
      <div className="container mx-auto">
        <ul className="flex overflow-x-auto">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>
                <span
                  className={cn(
                    "block px-4 py-3 text-sm cursor-pointer",
                    location === link.href
                      ? "border-b-2 border-primary font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
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
        <span className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 cursor-pointer inline-block">
          Get Started
        </span>
      </Link>
    </div>
  );
}
