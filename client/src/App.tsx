import { Switch, Route } from "wouter";
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

function Router() {
  return (
    <Switch>
      <Route path="/" component={MoodDetector} />
      <Route path="/chat" component={AIChat} />
      <Route path="/activities" component={MoodBooster} />
      <Route path="/dashboard" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <TabNavigation />
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
      
      {/* Quick Actions Floating Button */}
      <div className="fixed bottom-6 right-6">
        <button className="bg-primary hover:bg-primary/90 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all">
          <i className="ri-add-line text-2xl"></i>
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Router />
      </Layout>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
