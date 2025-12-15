"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserProgress, UserCode } from "@/types/curriculum";

interface ProgressState {
  progress: UserProgress;
  userCode: Map<string, UserCode>;
  overallProgress: number;

  // Actions
  markLessonComplete: (lessonId: string) => void;
  updateQuizScore: (lessonId: string, score: number) => void;
  saveQuizResponse: (lessonId: string, response: any) => void;
  updateExerciseAttempts: (lessonId: string) => void;
  updateCheckpointScore: (moduleId: string, score: number) => void;
  saveUserCode: (lessonId: string, code: string) => void;
  getUserCode: (lessonId: string) => string | undefined;
  updateCurrentPosition: (moduleId: string, lessonId: string) => void;
  updateLearningTime: (minutes: number) => void;
  isLessonCompleted: (lessonId: string) => boolean;
  getLessonScore: (lessonId: string) => number | undefined;
  calculateOverallProgress: () => void;
}

const defaultProgress: UserProgress = {
  userId: "default-user",
  completedLessons: new Set(),
  quizScores: new Map(),
  quizResponses: new Map(),
  exerciseAttempts: new Map(),
  currentModule: "module-1",
  currentLesson: "lesson-1-1",
  lastActive: new Date(),
  totalLearningTime: 0,
  checkpointScores: new Map(),
};

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      progress: defaultProgress,
      userCode: new Map(),
      overallProgress: 0,

      markLessonComplete: (lessonId: string) => {
        set((state) => {
          const newProgress = { ...state.progress };
          newProgress.completedLessons.add(lessonId);
          newProgress.lastActive = new Date();
          return { progress: newProgress };
        });
        get().calculateOverallProgress();
      },

      updateQuizScore: (lessonId: string, score: number) => {
        set((state) => {
          const newProgress = { ...state.progress };
          newProgress.quizScores.set(lessonId, score);
          newProgress.lastActive = new Date();
          // Mark as complete if score is passing (>=70%)
          if (score >= 70) {
            newProgress.completedLessons.add(lessonId);
          }
          return { progress: newProgress };
        });
        get().calculateOverallProgress();
      },

      saveQuizResponse: (lessonId: string, response: any) => {
        set((state) => {
          const newProgress = { ...state.progress };
          const existingResponses = newProgress.quizResponses.get(lessonId) || [];
          newProgress.quizResponses.set(lessonId, [...existingResponses, response]);
          newProgress.lastActive = new Date();
          return { progress: newProgress };
        });
      },

      updateExerciseAttempts: (lessonId: string) => {
        set((state) => {
          const newProgress = { ...state.progress };
          const currentAttempts = newProgress.exerciseAttempts.get(lessonId) || 0;
          newProgress.exerciseAttempts.set(lessonId, currentAttempts + 1);
          newProgress.lastActive = new Date();
          return { progress: newProgress };
        });
      },

      updateCheckpointScore: (moduleId: string, score: number) => {
        set((state) => {
          const newProgress = { ...state.progress };
          newProgress.checkpointScores.set(moduleId, score);
          newProgress.lastActive = new Date();
          return { progress: newProgress };
        });
        get().calculateOverallProgress();
      },

      saveUserCode: (lessonId: string, code: string) => {
        set((state) => {
          const newUserCode = new Map(state.userCode);
          newUserCode.set(lessonId, {
            lessonId,
            code,
            lastModified: new Date(),
          });
          return { userCode: newUserCode };
        });
      },

      getUserCode: (lessonId: string) => {
        const code = get().userCode.get(lessonId);
        return code?.code;
      },

      updateCurrentPosition: (moduleId: string, lessonId: string) => {
        set((state) => ({
          progress: {
            ...state.progress,
            currentModule: moduleId,
            currentLesson: lessonId,
            lastActive: new Date(),
          },
        }));
      },

      updateLearningTime: (minutes: number) => {
        set((state) => ({
          progress: {
            ...state.progress,
            totalLearningTime: state.progress.totalLearningTime + minutes,
          },
        }));
      },

      isLessonCompleted: (lessonId: string) => {
        return get().progress.completedLessons.has(lessonId);
      },

      getLessonScore: (lessonId: string) => {
        return get().progress.quizScores.get(lessonId);
      },

      calculateOverallProgress: () => {
        // This is a simplified calculation
        // In a real app, you'd calculate based on total lessons in curriculum
        const completedCount = get().progress.completedLessons.size;
        const totalLessons = 100; // This should come from curriculum data
        const percentage = Math.round((completedCount / totalLessons) * 100);
        set({ overallProgress: percentage });
      },
    }),
    {
      name: "rl-academy-progress",
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;

          const { state } = JSON.parse(str);
          return {
            state: {
              ...state,
              progress: {
                ...state.progress,
                completedLessons: new Set(state.progress.completedLessons || []),
                quizScores: new Map(state.progress.quizScores || []),
                exerciseAttempts: new Map(state.progress.exerciseAttempts || []),
                checkpointScores: new Map(state.progress.checkpointScores || []),
                lastActive: new Date(state.progress.lastActive),
              },
              userCode: new Map(state.userCode || []),
            },
          };
        },
        setItem: (name, value) => {
          const serializedState = {
            state: {
              ...value.state,
              progress: {
                ...value.state.progress,
                completedLessons: Array.from(value.state.progress.completedLessons),
                quizScores: Array.from(value.state.progress.quizScores),
                exerciseAttempts: Array.from(value.state.progress.exerciseAttempts),
                checkpointScores: Array.from(value.state.progress.checkpointScores),
              },
              userCode: Array.from(value.state.userCode),
            },
          };
          localStorage.setItem(name, JSON.stringify(serializedState));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);