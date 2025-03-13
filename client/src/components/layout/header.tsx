import React from "react";
import { Link } from "wouter";

export function Header() {
  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer">
            <span className="text-primary text-2xl">🧠</span>
            <h1 className="text-xl font-semibold text-neutral-900">MoodMate</h1>
          </div>
        </Link>
        <div className="flex items-center space-x-4">
          <button className="text-neutral-600 hover:text-primary transition-all" aria-label="Notifications">
            <i className="ri-notification-3-line text-xl"></i>
          </button>
          <button 
            className="bg-neutral-100 hover:bg-neutral-200 rounded-full w-8 h-8 flex items-center justify-center transition-all" 
            aria-label="User profile"
          >
            <i className="ri-user-line text-primary"></i>
          </button>
        </div>
      </div>
    </header>
  );
}
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="border-b sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="font-bold text-xl flex items-center">
          <span className="text-primary">Mood</span>Mate
        </Link>
        
        <nav className="ml-auto flex gap-4 items-center">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">Dashboard</Button>
          </Link>
          <Link href="/ai-chat">
            <Button variant="ghost" size="sm">Chat</Button>
          </Link>
          <Link href="/mood-booster">
            <Button variant="ghost" size="sm">Mood Booster</Button>
          </Link>
          <Link href="/mood-detector">
            <Button variant="default" size="sm">Analyze Mood</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
