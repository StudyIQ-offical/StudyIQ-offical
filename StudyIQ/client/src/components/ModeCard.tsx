import { Link } from "wouter";
import { motion } from "framer-motion";
import { LucideIcon, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModeCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  colorClass: string; // e.g., "bg-blue-500"
  delay?: number;
}

export function ModeCard({ title, description, icon: Icon, href, colorClass, delay = 0 }: ModeCardProps) {
  return (
    <Link href={href}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay, ease: "easeOut" }}
        whileHover={{ y: -5, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "group relative overflow-hidden rounded-3xl p-8 h-full cursor-pointer",
          "bg-white dark:bg-slate-800 border border-border/50 dark:border-slate-700 shadow-lg shadow-black/5 dark:shadow-black/20",
          "hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30 transition-all duration-300"
        )}
      >
        <div className={cn(
          "absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full opacity-10 transition-transform duration-500 group-hover:scale-150",
          colorClass
        )} />
        
        <div className="relative z-10 flex flex-col h-full">
          <div className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm",
            "text-white",
            colorClass
          )}>
            <Icon className="w-7 h-7" />
          </div>
          
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 font-display">
            {title}
          </h3>
          
          <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed mb-8 flex-grow">
            {description}
          </p>
          
          <div className={cn(
            "flex items-center font-semibold text-sm tracking-wide uppercase mt-auto",
            "text-slate-700 dark:text-slate-300 transition-colors duration-200",
          )}>
            <span className="opacity-70 group-hover:opacity-100 transition-opacity">Start Session</span>
            <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
