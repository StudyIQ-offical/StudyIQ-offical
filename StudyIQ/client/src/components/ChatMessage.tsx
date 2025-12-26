import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  createdAt?: string | Date;
  modeColorClass: string;
}

export function ChatMessage({ role, content, createdAt, modeColorClass }: ChatMessageProps) {
  const isUser = role === "user";

  // Format content for better display
  const formatContent = (text: string) => {
    return text.split('\n').map((line, idx) => (
      <div key={idx} className="mb-2">
        {line || <br />}
      </div>
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn("flex max-w-[85%] md:max-w-[70%]", isUser ? "flex-row-reverse" : "flex-row")}>
        {/* Avatar */}
        <div className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm mt-1",
          isUser 
            ? "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 ml-3" 
            : cn("text-white", modeColorClass, "mr-3")
        )}>
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>

        {/* Message Bubble */}
        <div className="flex flex-col">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className={cn(
              "px-4 py-3 rounded-xl text-base leading-relaxed",
              isUser
                ? "bg-blue-600 dark:bg-blue-700 text-white rounded-br-none"
                : "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-50 border border-slate-200 dark:border-slate-600 rounded-bl-none"
            )}
          >
            <div className="whitespace-pre-wrap break-words font-[400] text-[15px]">
              {formatContent(content)}
            </div>
          </motion.div>
          
          {/* Timestamp */}
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className={cn(
              "text-xs text-slate-500 dark:text-slate-400 mt-1.5 px-1",
              isUser ? "text-right" : "text-left"
            )}
          >
            {createdAt ? format(new Date(createdAt), "h:mm a") : "Just now"}
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}
