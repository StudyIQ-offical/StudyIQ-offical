import { useProgressStats } from "@/hooks/use-progress";
import { Card } from "@/components/ui/card";
import { BookOpen, CheckCircle, MessageSquare, TrendingUp } from "lucide-react";

export function ProgressTracker() {
  const { stats, getAccuracy } = useProgressStats();
  const accuracy = getAccuracy();

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 px-4">
        Your Progress
      </h3>
      
      <div className="grid grid-cols-2 gap-3 px-4">
        {/* Messages Card */}
        <Card className="p-4 dark:bg-slate-800 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Messages</p>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {stats.totalMessages}
              </p>
            </div>
          </div>
        </Card>

        {/* Quizzes Card */}
        <Card className="p-4 dark:bg-slate-800 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
              <CheckCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Quizzes</p>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {stats.quizzesCompleted}
              </p>
            </div>
          </div>
        </Card>

        {/* Study Sessions Card */}
        <Card className="p-4 dark:bg-slate-800 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
              <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Sessions</p>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {stats.studySessions}
              </p>
            </div>
          </div>
        </Card>

        {/* Accuracy Card */}
        <Card className="p-4 dark:bg-slate-800 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Accuracy</p>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {accuracy}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Progress Bar */}
      {stats.quizzesCompleted > 0 && (
        <div className="px-4">
          <div className="bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500"
              style={{ width: `${accuracy}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {stats.correctAnswers} of {stats.quizzesCompleted} answers correct
          </p>
        </div>
      )}
    </div>
  );
}
