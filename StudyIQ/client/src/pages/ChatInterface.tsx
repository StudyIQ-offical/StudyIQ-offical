import { useEffect, useRef, useState } from "react";
import { useRoute, Link } from "wouter";
import { useChatHistory, useSendMessage } from "@/hooks/use-chat";
import { ChatMessage } from "@/components/ChatMessage";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Send, 
  Sparkles, 
  GraduationCap, 
  Wallet, 
  MoreVertical,
  Loader2,
  Upload,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Configuration for each mode
const MODES = {
  assistant: {
    name: "Life Assistant",
    icon: Sparkles,
    theme: "bg-blue-600",
    lightTheme: "bg-blue-50 text-blue-900",
    placeholder: "Ask about your day, goals, or get some motivation...",
    welcome: "Hi! I'm your Life Assistant. How can I help you thrive today?"
  },
  homework: {
    name: "Homework Helper",
    icon: GraduationCap,
    theme: "bg-amber-500",
    lightTheme: "bg-amber-50 text-amber-900",
    placeholder: "Paste a problem or ask for a study guide...",
    welcome: "Ready to study! What subject are we tackling right now?"
  },
  money: {
    name: "Money Coach",
    icon: Wallet,
    theme: "bg-emerald-600",
    lightTheme: "bg-emerald-50 text-emerald-900",
    placeholder: "Ask about budgeting, saving, or side hustles...",
    welcome: "Let's talk money. Need budgeting help or saving tips?"
  }
};

type ModeKey = keyof typeof MODES;

export default function ChatInterface() {
  const [match, params] = useRoute("/chat/:mode");
  const modeKey = (params?.mode as ModeKey) || "assistant";
  const config = MODES[modeKey] || MODES.assistant;
  
  const [inputValue, setInputValue] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messages, isLoading: isLoadingHistory } = useChatHistory(modeKey);
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const base64Data = base64.split(",")[1];
        setImageBase64(base64Data);
        setImagePreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() && !imageBase64) return;
    if (isSending) return;

    sendMessage({
      message: inputValue,
      mode: modeKey,
      imageBase64: imageBase64 || undefined
    });
    setInputValue("");
    setImagePreview(null);
    setImageBase64(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };


  if (!match) return null;

  const Icon = config.icon;

  return (
    <div className="flex flex-col h-screen bg-background dark:bg-slate-950 font-body overflow-hidden">
      {/* Header */}
      <header className="flex-none bg-white dark:bg-slate-950 border-b border-border/50 px-4 py-3 shadow-sm z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </Button>
            </Link>
            
            <div className={cn("p-2 rounded-xl text-white shadow-sm", config.theme)}>
              <Icon className="w-5 h-5" />
            </div>
            
            <div>
              <h1 className="font-display font-bold text-lg leading-tight text-slate-900 dark:text-slate-100">
                {config.name}
              </h1>
              <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                <span className="relative flex h-2 w-2">
                  <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", config.theme)}></span>
                  <span className={cn("relative inline-flex rounded-full h-2 w-2", config.theme)}></span>
                </span>
                Online
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
        <div className="max-w-3xl mx-auto">
          {isLoadingHistory ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className={cn("w-8 h-8 animate-spin", config.theme.replace("bg-", "text-"))} />
            </div>
          ) : (
            <>
              {/* Welcome Message (if no history) */}
              {(!messages || messages.length === 0) && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12 px-4"
                >
                  <div className={cn("w-16 h-16 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg text-white", config.theme)}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 font-display">
                    {config.name}
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    {config.welcome}
                  </p>
                </motion.div>
              )}

              {/* Messages List */}
              <div className="space-y-6">
                <AnimatePresence initial={false}>
                  {messages?.map((msg) => (
                    <ChatMessage 
                      key={msg.id}
                      role={msg.role as "user" | "assistant"}
                      content={msg.content}
                      createdAt={msg.createdAt}
                      modeColorClass={config.theme}
                    />
                  ))}
                </AnimatePresence>
                
                {/* Loading Indicator for AI response */}
                {isSending && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start w-full"
                  >
                    <div className="flex flex-row items-center">
                       <div className={cn(
                        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm mr-3 text-white",
                        config.theme
                      )}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="bg-white dark:bg-slate-800 border border-border/50 dark:border-slate-700 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                        <div className="flex space-x-1.5">
                          <div className={cn("w-2 h-2 rounded-full animate-bounce delay-0", config.theme)} />
                          <div className={cn("w-2 h-2 rounded-full animate-bounce delay-150", config.theme)} />
                          <div className={cn("w-2 h-2 rounded-full animate-bounce delay-300", config.theme)} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </>
          )}
        </div>
      </main>

      {/* Input Area */}
      <footer className="flex-none bg-white dark:bg-slate-950 border-t border-border/50 dark:border-slate-800 p-4 pb-6 z-20">
        <div className="max-w-3xl mx-auto relative">
          {/* Image Preview */}
          {imagePreview && (
            <div className="mb-2 relative inline-block">
              <img 
                src={imagePreview} 
                alt="Math problem" 
                className="h-20 rounded-lg border border-slate-200"
              />
              <button
                onClick={() => {
                  setImagePreview(null);
                  setImageBase64(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          
          <form 
            onSubmit={handleSubmit}
            className={cn(
              "relative flex items-center gap-2 p-2 rounded-2xl border-2 transition-all duration-200 focus-within:ring-4",
              "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus-within:bg-white dark:focus-within:bg-slate-750 focus-within:border-transparent dark:focus-within:border-slate-600",
              modeKey === 'assistant' && "focus-within:ring-blue-500/10",
              modeKey === 'homework' && "focus-within:ring-amber-500/10",
              modeKey === 'money' && "focus-within:ring-emerald-500/10"
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              data-testid="input-image-upload"
            />
            
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
              className="h-10 w-10 rounded-xl text-slate-500 hover:text-slate-700"
              data-testid="button-upload-image"
              title="Upload image"
            >
              <Upload className="w-5 h-5" />
            </Button>
            
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={config.placeholder}
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-4 py-3 text-base text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              disabled={isSending}
              autoFocus
              data-testid="input-message"
            />
            <Button 
              type="submit" 
              size="icon"
              disabled={(!inputValue.trim() && !imageBase64) || isSending}
              className={cn(
                "h-10 w-10 rounded-xl transition-all duration-200",
                config.theme,
                "hover:brightness-110 hover:shadow-md disabled:opacity-50 disabled:shadow-none"
              )}
              data-testid="button-send-message"
            >
              {isSending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5 ml-0.5" />
              )}
            </Button>
          </form>
          
          <div className="text-center mt-2">
            <p className="text-[10px] uppercase tracking-wider text-slate-300 font-semibold">
              AI generated content • Verify important information
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
