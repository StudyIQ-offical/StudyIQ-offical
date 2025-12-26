import { ModeCard } from "@/components/ModeCard";
import { ProgressTracker } from "@/components/ProgressTracker";
import { Sparkles, GraduationCap, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import studyiqLogoPath from "@assets/ChatGPT_Image_Dec_25,_2025,_12_11_44_PM_1766683427382.png";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Progress Tracker */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <ProgressTracker />
        </motion.div>
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-sm font-medium text-slate-600 dark:text-slate-300 mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse" />
            Your AI Companion is Online
          </motion.div>

          <motion.img
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            src={studyiqLogoPath}
            alt="StudyIQ Logo"
            className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 drop-shadow-lg"
          />
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-bold text-slate-950 dark:text-white mb-2 tracking-tight"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-600">StudyIQ</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-lg text-slate-600 dark:text-slate-400 mb-6 font-medium"
          >
            Your AI-Powered Learning & Life Coach
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-600 dark:text-slate-200 leading-relaxed font-light"
          >
            Master any subject, crush your goals, and build wealth with AI-powered guidance.
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <ModeCard
            title="Life Assistant"
            description="Daily motivation, planning, confidence boosting, and life advice to keep you on track."
            icon={Sparkles}
            href="/chat/assistant"
            colorClass="bg-blue-600"
            delay={0.3}
          />
          
          <ModeCard
            title="Homework Helper"
            description="Step-by-step explanations for math, science, and essays. Learn how to solve it."
            icon={GraduationCap}
            href="/chat/homework"
            colorClass="bg-amber-500"
            delay={0.4}
          />
          
          <ModeCard
            title="Money Coach"
            description="Budgeting tools, saving tips, and financial education to build your wealth mindset."
            icon={Wallet}
            href="/chat/money"
            colorClass="bg-emerald-600"
            delay={0.5}
          />
        </div>

        {/* Footer decoration */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-24 text-center"
        >
          <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
            Powered by Advanced AI • Secure & Private • Available 24/7
          </p>
        </motion.div>
      </div>
    </div>
  );
}
