import { useState, useEffect } from "react";

interface ProgressStats {
  totalMessages: number;
  quizzesCompleted: number;
  correctAnswers: number;
  studySessions: number;
  lastSessionDate: string | null;
}

const STORAGE_KEY = "progress_stats";

const defaultStats: ProgressStats = {
  totalMessages: 0,
  quizzesCompleted: 0,
  correctAnswers: 0,
  studySessions: 0,
  lastSessionDate: null,
};

export function useProgressStats() {
  const [stats, setStats] = useState<ProgressStats>(defaultStats);

  // Load stats from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setStats(JSON.parse(stored));
      } catch (e) {
        setStats(defaultStats);
      }
    }
  }, []);

  // Save stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  const addMessage = () => {
    setStats((prev) => ({
      ...prev,
      totalMessages: prev.totalMessages + 1,
    }));
  };

  const addQuizCompletion = (isCorrect: boolean) => {
    setStats((prev) => ({
      ...prev,
      quizzesCompleted: prev.quizzesCompleted + 1,
      correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
    }));
  };

  const recordStudySession = () => {
    const today = new Date().toDateString();
    setStats((prev) => ({
      ...prev,
      studySessions: 
        prev.lastSessionDate === today 
          ? prev.studySessions 
          : prev.studySessions + 1,
      lastSessionDate: today,
    }));
  };

  const getAccuracy = () => {
    if (stats.quizzesCompleted === 0) return 0;
    return Math.round((stats.correctAnswers / stats.quizzesCompleted) * 100);
  };

  const resetStats = () => {
    setStats(defaultStats);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    stats,
    addMessage,
    addQuizCompletion,
    recordStudySession,
    getAccuracy,
    resetStats,
  };
}
