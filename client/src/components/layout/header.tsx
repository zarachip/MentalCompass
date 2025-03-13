import React from "react";

export function Header() {
  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-primary text-2xl">🧠</span>
          <h1 className="text-xl font-semibold text-neutral-900">MoodMate</h1>
        </div>
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
