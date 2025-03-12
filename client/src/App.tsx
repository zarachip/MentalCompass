import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { Header } from "@/components/layout/header";
import { TabNavigation } from "@/components/layout/tab-navigation";
import MoodDetector from "@/pages/mood-detector";
import AIChat from "@/pages/ai-chat";
import MoodBooster from "@/pages/mood-booster";
import Dashboard from "@/pages/dashboard";
import Landing from "@/pages/landing";

function App() {
  const [location] = useLocation();
  const isLandingPage = location === "/";

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen">
        {!isLandingPage && <Header />}
        {!isLandingPage && <TabNavigation />}
        
        <main className={!isLandingPage ? "flex-1 container mx-auto px-4 py-6" : "flex-1"}>
          <Switch>
            <Route path="/" component={Landing} />
            <Route path="/mood-detector" component={MoodDetector} />
            <Route path="/chat" component={AIChat} />
            <Route path="/activities" component={MoodBooster} />
            <Route path="/dashboard" component={Dashboard} />
            <Route component={NotFound} />
          </Switch>
        </main>
        
        {!isLandingPage && (
          <div className="fixed bottom-6 right-6">
            <button className="bg-primary hover:bg-primary/90 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all">
              <i className="ri-add-line text-2xl"></i>
            </button>
          </div>
        )}
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
