
import { useNavigate } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const [_, navigate] = useNavigate();

  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-[85vh] text-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <span className="text-6xl mb-4 inline-block">🧠</span>
        <h1 className="text-4xl font-bold text-neutral-900 mb-2">MoodMate</h1>
        <p className="text-xl text-neutral-600 mb-6">Your AI-powered mental health companion</p>
      </div>

      <div className="max-w-md mb-12">
        <p className="text-neutral-700 mb-4">
          Track your emotions, get personalized activities, and chat with an AI that helps you navigate your mental well-being journey.
        </p>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-primary/10 p-3 rounded-lg">
            <span className="text-2xl">😊</span>
            <p className="text-sm mt-1">Mood Tracking</p>
          </div>
          <div className="bg-primary/10 p-3 rounded-lg">
            <span className="text-2xl">💬</span>
            <p className="text-sm mt-1">AI Chat Support</p>
          </div>
          <div className="bg-primary/10 p-3 rounded-lg">
            <span className="text-2xl">🏃‍♂️</span>
            <p className="text-sm mt-1">Activity Suggestions</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button 
          size="lg" 
          className="w-full" 
          onClick={() => navigate('/mood-detector')}
        >
          Get Started
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          className="w-full"
          onClick={() => navigate('/dashboard')}
        >
          View Dashboard
        </Button>
      </div>
      
      <p className="text-neutral-500 text-sm mt-8">
        Your mental health data stays private and secure
      </p>
    </motion.div>
  );
}
