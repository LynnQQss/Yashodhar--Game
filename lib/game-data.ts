import chaptersJson from "@/data/chapters.json";
import configJson from "@/data/game-config.json";
import type { Chapter, GameConfig } from "@/types/game";

export const chapters = [...(chaptersJson as Chapter[])].sort(
  (first, second) => first.order - second.order,
);
export const gameConfig = configJson as GameConfig;
export const activePetalLimit = Math.min(
  gameConfig.totalPetals,
  gameConfig.maxSupportedPetals,
);

export function getChapter(chapterId: string) {
  const aliases: Record<string, string> = {
    "volume-2": "chapter-4",
  };
  const resolvedId = aliases[chapterId] ?? chapterId;
  return chapters.find((chapter) => chapter.id === resolvedId);
}

export function getChapterNumber(chapterId: string) {
  const index = chapters.findIndex((chapter) => chapter.id === chapterId);
  return index >= 0 ? index + 1 : undefined;
}

export function getNextChapter(chapterId: string) {
  const currentIndex = chapters.findIndex((chapter) => chapter.id === chapterId);
  return currentIndex >= 0 ? chapters[currentIndex + 1] : undefined;
}
