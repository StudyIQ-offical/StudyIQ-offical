import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizQuestionProps {
  question: string;
  options: string[];
  correctAnswer: string;
  onAnswerSelected: (answer: string) => void;
  isLoading?: boolean;
  themeClass: string;
}

export function QuizQuestion({
  question,
  options,
  correctAnswer,
  onAnswerSelected,
  isLoading = false,
  themeClass
}: QuizQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const isCorrect = selectedAnswer === correctAnswer;

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    setSubmitted(true);
    setTimeout(() => {
      onAnswerSelected(selectedAnswer);
    }, 1500);
  };

  // Extract color from theme class (e.g., "bg-blue-600" -> "blue")
  const themeColor = themeClass.split("-")[1]; // "blue", "amber", "emerald"
  
  const colorMap: Record<string, string> = {
    "blue": "#2563eb",
    "amber": "#d97706", 
    "emerald": "#059669",
  };

  const selectedColor = colorMap[themeColor] || "#2563eb";

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm mb-4">
      <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-4">{question}</h3>
      
      <div className="space-y-2 mb-4">
        {options.map((option, idx) => {
          const isSelected = selectedAnswer === option;
          const isCorrectOption = option === correctAnswer;
          const showCorrect = submitted && isCorrectOption;
          const showIncorrect = submitted && !isCorrectOption && isSelected;

          const isDarkMode = document.documentElement.classList.contains('dark');
          
          let bgColor = isDarkMode ? "#1e293b" : "#ffffff";
          let borderColor = isDarkMode ? "#475569" : "#e2e8f0";
          let textColor = isDarkMode ? "#f1f5f9" : "#1e293b";

          if (submitted && showCorrect) {
            bgColor = isDarkMode ? "#064e3b" : "#f0fdf4";
            borderColor = "#22c55e";
          } else if (submitted && showIncorrect) {
            bgColor = isDarkMode ? "#7f1d1d" : "#fef2f2";
            borderColor = "#ef4444";
          } else if (isSelected && !submitted) {
            bgColor = isDarkMode ? `${selectedColor}20` : `${selectedColor}0f`;
            borderColor = selectedColor;
          }

          return (
            <button
              key={idx}
              onClick={() => !submitted && setSelectedAnswer(option)}
              disabled={submitted || isLoading}
              className={cn(
                "w-full text-left p-3 rounded-lg transition-all cursor-pointer",
                !submitted && "hover:border-slate-400",
                submitted && "cursor-not-allowed"
              )}
              style={{
                border: `2px solid ${borderColor}`,
                backgroundColor: bgColor,
                color: textColor,
              }}
              data-testid={`button-quiz-option-${idx}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium" style={{ color: textColor }}>{option}</span>
                {submitted && showCorrect && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                {submitted && showIncorrect && (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {!submitted && (
        <Button
          onClick={handleSubmit}
          disabled={!selectedAnswer || isLoading}
          className="w-full"
          style={{ backgroundColor: selectedColor }}
          data-testid="button-quiz-submit"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Checking...
            </>
          ) : (
            "Submit Answer"
          )}
        </Button>
      )}

      {submitted && (
        <div
          className="p-4 rounded-lg text-center font-medium"
          style={{
            backgroundColor: isCorrect ? "#f0fdf4" : "#fef2f2",
            color: isCorrect ? "#166534" : "#991b1b",
          }}
          data-testid={isCorrect ? "text-quiz-correct" : "text-quiz-incorrect"}
        >
          {isCorrect ? "Correct! Well done!" : "Not quite right. Try again!"}
        </div>
      )}
    </div>
  );
}
