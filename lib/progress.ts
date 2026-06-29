import { activePetalLimit, gameConfig } from "@/lib/game-data";
import type { GameProgress } from "@/types/game";

export const PROGRESS_STORAGE_KEY = "yasodhara-apadana-progress-v1";

const LEGACY_VOLUME_ID = "volume-2";
const LEGACY_VOLUME_PARTS = [
  {
    chapterId: "chapter-4",
    rewardId: "volume-2-part-1-petal",
    scenePrefixes: ["v2-identity"],
  },
  {
    chapterId: "chapter-5",
    rewardId: "volume-2-part-2-petal",
    scenePrefixes: ["v2-miracles"],
  },
  {
    chapterId: "chapter-6",
    rewardId: "volume-2-part-3-petal",
    scenePrefixes: ["v2-attainment", "v2-complete"],
  },
] as const;

export const defaultProgress: GameProgress = {
  currentChapter: gameConfig.openingChapterId,
  currentSceneByChapter: {},
  completedChapters: [],
  lotusPetals: 0,
  answeredQuizIds: [],
  claimedRewardIds: [],
  wrongAnswers: {},
  hasOfferedLotus: false,
  hasSeenFinalEnding: false,
  updatedAt: null,
};

function migrateLegacyVolumeProgress(
  value: Partial<GameProgress>,
): Partial<GameProgress> {
  const sourceLocations = value.currentSceneByChapter ?? {};
  const legacyScene = sourceLocations[LEGACY_VOLUME_ID];
  const activePartIndex = LEGACY_VOLUME_PARTS.findIndex((part) =>
    part.scenePrefixes.some((prefix) => legacyScene?.startsWith(prefix)),
  );
  const claimedRewardIds = value.claimedRewardIds ?? [];
  const lastClaimedPartIndex = LEGACY_VOLUME_PARTS.reduce(
    (lastIndex, part, index) =>
      claimedRewardIds.includes(part.rewardId) ? index : lastIndex,
    -1,
  );
  const completedChapters = new Set(value.completedChapters ?? []);
  const completedLegacyVolume = completedChapters.delete(LEGACY_VOLUME_ID);
  const completedThroughIndex = completedLegacyVolume
    ? LEGACY_VOLUME_PARTS.length - 1
    : Math.max(lastClaimedPartIndex, activePartIndex - 1);

  LEGACY_VOLUME_PARTS.slice(0, completedThroughIndex + 1).forEach((part) =>
    completedChapters.add(part.chapterId),
  );

  const { [LEGACY_VOLUME_ID]: _legacyLocation, ...currentSceneByChapter } =
    sourceLocations;
  const activePart = LEGACY_VOLUME_PARTS[activePartIndex];
  if (activePart && legacyScene) {
    currentSceneByChapter[activePart.chapterId] = legacyScene;
  }

  return {
    ...value,
    currentChapter:
      value.currentChapter === LEGACY_VOLUME_ID
        ? (activePart?.chapterId ?? LEGACY_VOLUME_PARTS[0].chapterId)
        : value.currentChapter,
    currentSceneByChapter,
    completedChapters: [...completedChapters],
  };
}

export function normalizeProgress(value: Partial<GameProgress>): GameProgress {
  const migrated = migrateLegacyVolumeProgress(value);
  return {
    ...defaultProgress,
    ...migrated,
    currentSceneByChapter: migrated.currentSceneByChapter ?? {},
    completedChapters: migrated.completedChapters ?? [],
    answeredQuizIds: migrated.answeredQuizIds ?? [],
    claimedRewardIds: migrated.claimedRewardIds ?? [],
    wrongAnswers: migrated.wrongAnswers ?? {},
    hasSeenFinalEnding: migrated.hasSeenFinalEnding ?? false,
    lotusPetals: Math.min(
      Math.max(migrated.lotusPetals ?? 0, 0),
      activePetalLimit,
    ),
  };
}
