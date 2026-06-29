export type SceneType =
  | "narration"
  | "dialogue"
  | "quiz"
  | "reward"
  | "offering"
  | "ending"
  | "completion";

export interface QuizOption {
  id: string;
  text: string;
}

interface QuizBase {
  id: string;
  question: string;
  hint: string;
  correctFeedback: string;
  wrongFeedback: string;
  explanation?: string;
}

export interface ChoiceQuizData extends QuizBase {
  kind: "choice";
  options: QuizOption[];
  correctAnswerId: string;
}

export interface InputQuizData extends QuizBase {
  kind: "input";
  correctAnswer: string;
  acceptedAnswers?: string[];
}

export type QuizData = ChoiceQuizData | InputQuizData;

export interface OfferingInteractionData {
  kind: "lotusToHalo";
  buttonLabel: string;
  completionText: string;
  image: string;
  requiredPetals: number;
}

export interface EndingSequenceData {
  kind: "finalLotus";
  lotusImage: string;
  dispersalImage: string;
  finalImage: string;
  title: string;
  text: string;
  homeLabel: string;
  chaptersLabel: string;
  replayLabel: string;
}

export interface GameScene {
  id: string;
  type: SceneType;
  title?: string;
  speaker?: string;
  text?: string;
  pali?: string;
  translation?: string;
  backgroundImage?: string;
  backgroundPosition?: string;
  portrait?: string;
  portraitPosition?: string;
  rewardImage?: string;
  rewardId?: string;
  quiz?: QuizData;
  interaction?: OfferingInteractionData;
  ending?: EndingSequenceData;
  lotusPetalsReward?: number;
  nextScene: string | null;
}

export interface Chapter {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  location: string;
  backgroundImage: string;
  backgroundPosition?: string;
  portrait?: string;
  portraitPosition?: string;
  fallbackTheme: "rajagaha" | "nunnery" | "cave";
  scenes: GameScene[];
}

export interface GameConfig {
  title: string;
  subtitle: string;
  totalPetals: number;
  maxSupportedPetals: number;
  openingChapterId: string;
}

export interface GameProgress {
  currentChapter: string;
  currentSceneByChapter: Record<string, string>;
  completedChapters: string[];
  lotusPetals: number;
  answeredQuizIds: string[];
  claimedRewardIds: string[];
  wrongAnswers: Record<string, number>;
  hasOfferedLotus: boolean;
  hasSeenFinalEnding: boolean;
  updatedAt: string | null;
}
