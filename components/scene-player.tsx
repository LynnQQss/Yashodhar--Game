"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { ChapterCompletion } from "@/components/chapter-completion";
import { FinalEndingSequence } from "@/components/final-ending-sequence";
import { LotusProgress } from "@/components/lotus-progress";
import { OfferingInteraction } from "@/components/offering-interaction";
import { CornerFlourish, DharmaWheel, LotusMark } from "@/components/ornaments";
import { QuizCard } from "@/components/quiz-card";
import { useProgress } from "@/context/progress-context";
import {
  chapters,
  gameConfig,
  getChapter,
  getChapterNumber,
  getNextChapter,
} from "@/lib/game-data";
import type { GameScene } from "@/types/game";

const SCENE_PANEL_DELAY_MS = 720;
const SCENE_PANEL_FADE_MS = 90;

function SceneText({
  scene,
  canGoBack,
  onBack,
  onContinue,
}: {
  scene: GameScene;
  canGoBack: boolean;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <div
      className={`story-panel ${
        scene.type === "dialogue" ? "story-panel--dialogue" : ""
      }`}
    >
      <CornerFlourish className="story-panel__corner story-panel__corner--top" />
      <CornerFlourish className="story-panel__corner story-panel__corner--bottom" />
      <div className="story-panel__meta">
        <span>{scene.speaker ?? "旁白"}</span>
        {scene.title && <small>{scene.title}</small>}
      </div>
      {scene.text && <p className="story-panel__text">{scene.text}</p>}
      {scene.translation && (
        <p className="story-panel__translation">{scene.translation}</p>
      )}
      {scene.pali && (
        <blockquote className="story-panel__pali" lang="pi">
          {scene.pali}
        </blockquote>
      )}
      <div className="story-panel__actions">
        <button
          className="story-panel__back"
          disabled={!canGoBack}
          onClick={onBack}
          type="button"
        >
          <span aria-hidden="true">←</span>
          返回
        </button>
        <button
          className="story-panel__continue"
          onClick={onContinue}
          type="button"
        >
          继续
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}

function RewardKeepsake({
  amount,
  collected,
  image,
}: {
  amount: number;
  collected: boolean;
  image?: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [image]);

  const showImage = Boolean(image && !imageFailed);

  return (
    <div
      className={`reward-panel__lotus ${collected ? "is-collected" : ""} ${
        showImage ? "has-image" : ""
      }`}
    >
      {showImage ? (
        <img
          alt=""
          aria-hidden="true"
          onError={() => setImageFailed(true)}
          src={image}
        />
      ) : (
        <LotusMark />
      )}
      <span>+{amount}</span>
    </div>
  );
}

export function ScenePlayer() {
  const params = useParams<{ chapterId: string }>();
  const router = useRouter();
  const chapterId = Array.isArray(params.chapterId)
    ? params.chapterId[0]
    : params.chapterId;
  const chapter = getChapter(chapterId);
  const {
    progress,
    isReady,
    setCurrentChapter,
    setCurrentLocation,
    markQuizCorrect,
    recordWrongAnswer,
    claimReward,
    completeChapter,
    completeFinalEnding,
  } = useProgress();
  const [sceneId, setSceneId] = useState("");
  const [initializedChapter, setInitializedChapter] = useState("");
  const [contentReady, setContentReady] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  const scene = useMemo(
    () => chapter?.scenes.find((item) => item.id === sceneId),
    [chapter, sceneId],
  );
  const sceneIndex =
    chapter?.scenes.findIndex((item) => item.id === sceneId) ?? 0;
  const rewardId = scene?.rewardId ?? scene?.id;
  const rewardCollected = rewardId
    ? progress.claimedRewardIds.includes(rewardId)
    : false;
  const previousStorySceneId = useMemo(() => {
    if (!chapter || sceneIndex <= 0) return undefined;
    for (let index = sceneIndex - 1; index >= 0; index -= 1) {
      const candidate = chapter.scenes[index];
      if (candidate.type === "narration" || candidate.type === "dialogue") {
        return candidate.id;
      }
    }
    return undefined;
  }, [chapter, sceneIndex]);

  useEffect(() => {
    if (!isReady || !chapter || initializedChapter === chapter.id) return;

    const chapterIndex = chapters.findIndex((item) => item.id === chapter.id);
    const previousChapter = chapters[chapterIndex - 1];
    const isUnlocked =
      chapterIndex === 0 ||
      progress.completedChapters.includes(previousChapter?.id ?? "");

    if (!isUnlocked) {
      router.replace("/chapters");
      return;
    }

    const isCompleted = progress.completedChapters.includes(chapter.id);
    const savedScene = progress.currentSceneByChapter[chapter.id];
    const initialScene =
      isCompleted || !chapter.scenes.some((item) => item.id === savedScene)
        ? chapter.scenes[0].id
        : savedScene;

    setSceneId(initialScene);
    setCurrentLocation(chapter.id, initialScene);
    setInitializedChapter(chapter.id);
  }, [
    chapter,
    initializedChapter,
    isReady,
    progress.completedChapters,
    progress.currentSceneByChapter,
    router,
    setCurrentLocation,
  ]);

  useEffect(() => {
    if (!scene) return;
    setContentReady(false);
    setContentVisible(false);
    const readyTimer = window.setTimeout(
      () => setContentReady(true),
      SCENE_PANEL_DELAY_MS,
    );
    const visibleTimer = window.setTimeout(
      () => setContentVisible(true),
      SCENE_PANEL_DELAY_MS + SCENE_PANEL_FADE_MS,
    );
    return () => {
      window.clearTimeout(readyTimer);
      window.clearTimeout(visibleTimer);
    };
  }, [scene?.id]);

  useEffect(() => {
    if (!chapter || scene?.type !== "completion") return;
    completeChapter(chapter.id);
  }, [chapter, completeChapter, scene?.type]);

  if (!chapter) {
    return (
      <main className="missing-page">
        <DharmaWheel className="h-16 w-16 text-oldgold" />
        <h1>这一卷册尚未写成</h1>
        <Link className="button button--primary" href="/chapters">
          返回章节
        </Link>
      </main>
    );
  }

  if (!isReady || !scene) {
    return (
      <main className={`scene-page theme-${chapter.fallbackTheme}`}>
        <div className="scene-loading">
          <DharmaWheel className="h-12 w-12 animate-spin text-oldgold" />
          <span>展开卷册…</span>
        </div>
      </main>
    );
  }

  const moveToScene = (nextSceneId: string) => {
    setContentReady(false);
    setContentVisible(false);
    setSceneId(nextSceneId);
    setCurrentLocation(chapter.id, nextSceneId);
  };

  const continueScene = () => {
    if (scene.nextScene) {
      moveToScene(scene.nextScene);
      return;
    }

    completeChapter(chapter.id);
    const nextChapter = getNextChapter(chapter.id);
    if (nextChapter) {
      setCurrentChapter(nextChapter.id);
    }
    router.push("/chapters");
  };

  const returnToPreviousStoryScene = () => {
    if (!previousStorySceneId) return;
    moveToScene(previousStorySceneId);
  };

  const collectReward = () => {
    claimReward(rewardId ?? scene.id, scene.lotusPetalsReward ?? 0);
    if (!scene.nextScene) {
      completeChapter(chapter.id);
    }
  };

  const leaveRewardScene = () => {
    if (scene.nextScene) {
      moveToScene(scene.nextScene);
      return;
    }
    const nextChapter = getNextChapter(chapter.id);
    if (nextChapter) {
      setCurrentChapter(nextChapter.id);
    }
    router.push("/chapters");
  };

  const activeBackground = scene.backgroundImage ?? chapter.backgroundImage;
  const activeBackgroundPosition =
    scene.backgroundPosition ?? chapter.backgroundPosition ?? "center center";
  const activePortrait =
    scene.portrait ?? (scene.type === "dialogue" ? chapter.portrait : undefined);
  const activePortraitPosition =
    scene.portraitPosition ?? chapter.portraitPosition ?? "center center";
  const progressPercent = ((sceneIndex + 1) / chapter.scenes.length) * 100;

  return (
    <main className={`scene-page theme-${chapter.fallbackTheme}`}>
      <div
        className="scene-page__background"
        key={activeBackground}
        style={
          {
            "--scene-image": `url("${activeBackground}")`,
            backgroundPosition: activeBackgroundPosition,
          } as CSSProperties
        }
      />
      <div className="scene-page__mist" />
      <div className="scene-page__grain" />

      <header className="scene-header">
        <button onClick={() => router.push("/chapters")} type="button">
          <span aria-hidden="true">←</span>
          退出本章
        </button>
        <div className="scene-header__chapter">
          <span>第 {getChapterNumber(chapter.id)} 章</span>
          <strong>{chapter.title}</strong>
        </div>
        <LotusProgress
          compact
          current={progress.lotusPetals}
          total={gameConfig.totalPetals}
          glowing={scene.type === "reward" && rewardCollected}
        />
      </header>

      <div className="scene-location">
        <span />
        {chapter.location}
      </div>

      {activePortrait && (scene.type === "dialogue" || scene.type === "narration") && (
        <div
          aria-label={scene.speaker ? `${scene.speaker}人物画像` : "人物画像"}
          className={`scene-portrait ${
            contentVisible ? "is-visible" : ""
          }`}
          role="img"
          style={{
            backgroundImage: `url("${activePortrait}"), radial-gradient(ellipse at 50% 42%, rgba(205, 170, 111, .38), rgba(34, 30, 26, .05) 55%, transparent 72%)`,
            backgroundPosition: activePortraitPosition,
          }}
        />
      )}

      <section
        className={`scene-content ${contentVisible ? "is-visible" : ""}`}
      >
        {contentReady &&
          (scene.type === "narration" || scene.type === "dialogue") && (
            <SceneText
              canGoBack={Boolean(previousStorySceneId)}
              onBack={returnToPreviousStoryScene}
              onContinue={continueScene}
              scene={scene}
            />
          )}

        {contentReady && scene.type === "quiz" && scene.quiz && (
          <div className="learning-panel">
            <div className="learning-panel__source">
              <span>{scene.title}</span>
              {scene.pali && <strong lang="pi">{scene.pali}</strong>}
              {scene.translation && <p>{scene.translation}</p>}
            </div>
            <QuizCard
              alreadySolved={progress.answeredQuizIds.includes(scene.quiz.id)}
              onContinue={continueScene}
              onCorrect={() => markQuizCorrect(scene.quiz!.id)}
              onWrong={() => recordWrongAnswer(scene.quiz!.id)}
              quiz={scene.quiz}
            />
          </div>
        )}

        {contentReady && scene.type === "reward" && (
          <div className="reward-panel">
            <p className="reward-panel__eyebrow">STORY KEEPSAKE</p>
            <RewardKeepsake
              amount={scene.lotusPetalsReward ?? 0}
              collected={rewardCollected}
              image={scene.rewardImage}
            />
            <h2>{scene.title}</h2>
            <p>
              {scene.text}
              {rewardCollected && (
                <> 这片莲花瓣已获得。你正在重温这一段故事。</>
              )}
            </p>
            {!rewardCollected ? (
              <button
                className="button button--primary"
                onClick={collectReward}
              >
                收下莲花瓣
              </button>
            ) : (
              <button
                className="button button--primary"
                onClick={leaveRewardScene}
              >
                {scene.nextScene ? "继续" : "返回章节"}
                <span aria-hidden="true">→</span>
              </button>
            )}
          </div>
        )}

        {contentReady &&
          scene.type === "offering" &&
          scene.interaction && (
            <OfferingInteraction
              currentPetals={progress.lotusPetals}
              interaction={scene.interaction}
              onContinue={continueScene}
              text={scene.text ?? ""}
              title={scene.title ?? "献上莲花"}
            />
          )}

        {contentReady && scene.type === "completion" && (
          <ChapterCompletion
            onNext={
              getNextChapter(chapter.id)
                ? () => router.push(`/play/${getNextChapter(chapter.id)!.id}`)
                : undefined
            }
            onReplay={() => moveToScene(chapter.scenes[0].id)}
            onReturn={() => router.push("/chapters")}
            text={scene.text ?? ""}
            title={scene.title ?? "本卷结束"}
          />
        )}

      </section>

      {contentReady && scene.type === "ending" && scene.ending && (
        <FinalEndingSequence
          backgroundImage={activeBackground}
          ending={scene.ending}
          onChapters={() => router.push("/chapters")}
          onComplete={() => completeFinalEnding(chapter.id)}
          onHome={() => router.push("/")}
          onReplay={() => moveToScene(chapter.scenes[0].id)}
        />
      )}

      <footer className="scene-progress" aria-label="本章进度">
        <div style={{ width: `${progressPercent}%` }} />
        <span>
          {sceneIndex + 1} / {chapter.scenes.length}
        </span>
      </footer>

    </main>
  );
}
