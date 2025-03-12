
import { Switch, Route, useLocation } from "wouter";
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
import { queryClient } from "./lib/queryClient";

function App() {
  const [location] = useLocation();
  const isLandingPage = location === "/";

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        {!isLandingPage && <Header />}
        
        <main className={`flex-1 ${!isLandingPage ? 'container mx-auto py-6 px-4' : ''}`}>
          <Switch>
            <Route path="/" component={Landing} />
            <Route path="/mood-detector" component={MoodDetector} />
            <Route path="/ai-chat" component={AIChat} />
            <Route path="/mood-booster" component={MoodBooster} />
            <Route path="/dashboard" component={Dashboard} />
            <Route component={NotFound} />
          </Switch>
        </main>
        
        {!isLandingPage && <TabNavigation />}
      </div>
      
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
