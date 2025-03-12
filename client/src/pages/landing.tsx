import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { MoveRight, HeartPulse, Brain, Sparkles, Activity } from "lucide-react";

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center px-6 py-16 md:py-24 text-center bg-gradient-to-b from-primary/10 to-background">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block mb-4 px-4 py-2 rounded-full bg-primary/20 text-primary font-medium text-sm">
            Your Personal Mental Wellness Companion
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Welcome to <span className="text-primary">MoodMate</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            An AI-powered mental health assistant that helps you track your mood, 
            engage in supportive conversations, and discover personalized activities 
            to improve your wellbeing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/mood-detector">
              <Button size="lg" className="px-6">
                Get Started <MoveRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="px-6">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-6 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-background rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Mood Detection</h3>
              <p className="text-muted-foreground">
                Express how you're feeling and receive AI-powered analysis of your mood, 
                with personalized insights and emotional tracking.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-background rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <HeartPulse className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Companion</h3>
              <p className="text-muted-foreground">
                Chat with an empathetic AI assistant that provides supportive conversation,
                guidance, and a judgment-free space to express yourself.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-background rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Activity Recommendations</h3>
              <p className="text-muted-foreground">
                Discover personalized activities tailored to your current mood and 
                mental state, designed to improve your wellbeing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How MoodMate Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-background font-bold text-lg mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Share Your Feelings</h3>
              <p className="text-muted-foreground">
                Express your current mood and thoughts in the Mood Detector, 
                where our AI analyzes your emotional state.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-background font-bold text-lg mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Personalized Support</h3>
              <p className="text-muted-foreground">
                Receive mood insights and chat with our AI companion for
                supportive conversation and guidance.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-background font-bold text-lg mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Take Action</h3>
              <p className="text-muted-foreground">
                Try the recommended activities designed to boost your mood and 
                track your progress over time in the dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-6 bg-primary/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Start Your Wellness Journey Today</h2>
          <p className="text-lg text-muted-foreground mb-8">
            MoodMate is here to support your mental wellbeing with personalized
            insights and activities tailored just for you.
          </p>
          <Link href="/mood-detector">
            <Button size="lg" className="px-8">
              Begin Now <Sparkles className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 border-t">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} MoodMate. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}