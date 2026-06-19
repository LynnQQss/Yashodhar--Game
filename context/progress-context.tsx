"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  defaultProgress,
  normalizeProgress,
  PROGRESS_STORAGE_KEY,
} from "@/lib/progress";
import { activePetalLimit } from "@/lib/game-data";
import type { GameProgress } from "@/types/game";

interface ProgressContextValue {
  progress: GameProgress;
  isReady: boolean;
  setCurrentChapter: (chapterId: string) => void;
  setCurrentLocation: (chapterId: string, sceneId: string) => void;
  markQuizCorrect: (quizId: string) => void;
  recordWrongAnswer: (quizId: string) => void;
  claimReward: (rewardId: string, count: number) => void;
  completeChapter: (chapterId: string) => void;
  completeFinalEnding: (chapterId: string) => void;
  offerLotus: () => void;
  resetProgress: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

function withTimestamp(progress: GameProgress): GameProgress {
  return { ...progress, updatedAt: new Date().toISOString() };
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<GameProgress>(defaultProgress);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (saved) {
        setProgress(normalizeProgress(JSON.parse(saved)));
      }
    } catch {
      window.localStorage.removeItem(PROGRESS_STORAGE_KEY);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isReady) return;
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  }, [isReady, progress]);

  const setCurrentChapter = useCallback((chapterId: string) => {
    setProgress((current) =>
      withTimestamp({
        ...current,
        currentChapter: chapterId,
      }),
    );
  }, []);

  const setCurrentLocation = useCallback(
    (chapterId: string, sceneId: string) => {
      setProgress((current) =>
        withTimestamp({
          ...current,
          currentChapter: chapterId,
          currentSceneByChapter: {
            ...current.currentSceneByChapter,
            [chapterId]: sceneId,
          },
        }),
      );
    },
    [],
  );

  const markQuizCorrect = useCallback((quizId: string) => {
    setProgress((current) => {
      if (current.answeredQuizIds.includes(quizId)) return current;
      return withTimestamp({
        ...current,
        answeredQuizIds: [...current.answeredQuizIds, quizId],
      });
    });
  }, []);

  const recordWrongAnswer = useCallback((quizId: string) => {
    setProgress((current) =>
      withTimestamp({
        ...current,
        wrongAnswers: {
          ...current.wrongAnswers,
          [quizId]: (current.wrongAnswers[quizId] ?? 0) + 1,
        },
      }),
    );
  }, []);

  const claimReward = useCallback((rewardId: string, count: number) => {
    setProgress((current) => {
      if (current.claimedRewardIds.includes(rewardId)) return current;
      return withTimestamp({
        ...current,
        lotusPetals: Math.min(
          current.lotusPetals + count,
          activePetalLimit,
        ),
        claimedRewardIds: [...current.claimedRewardIds, rewardId],
      });
    });
  }, []);

  const completeChapter = useCallback((chapterId: string) => {
    setProgress((current) => {
      if (current.completedChapters.includes(chapterId)) return current;
      return withTimestamp({
        ...current,
        completedChapters: [...current.completedChapters, chapterId],
      });
    });
  }, []);

  const completeFinalEnding = useCallback((chapterId: string) => {
    setProgress((current) => {
      const completedChapters = current.completedChapters.includes(chapterId)
        ? current.completedChapters
        : [...current.completedChapters, chapterId];
      if (
        current.hasSeenFinalEnding &&
        completedChapters === current.completedChapters
      ) {
        return current;
      }
      return withTimestamp({
        ...current,
        completedChapters,
        hasSeenFinalEnding: true,
      });
    });
  }, []);

  const offerLotus = useCallback(() => {
    setProgress((current) =>
      withTimestamp({ ...current, hasOfferedLotus: true }),
    );
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(withTimestamp(defaultProgress));
    window.localStorage.removeItem(PROGRESS_STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      progress,
      isReady,
      setCurrentChapter,
      setCurrentLocation,
      markQuizCorrect,
      recordWrongAnswer,
      claimReward,
      completeChapter,
      completeFinalEnding,
      offerLotus,
      resetProgress,
    }),
    [
      progress,
      isReady,
      setCurrentChapter,
      setCurrentLocation,
      markQuizCorrect,
      recordWrongAnswer,
      claimReward,
      completeChapter,
      completeFinalEnding,
      offerLotus,
      resetProgress,
    ],
  );

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const value = useContext(ProgressContext);
  if (!value) {
    throw new Error("useProgress must be used inside ProgressProvider");
  }
  return value;
}
