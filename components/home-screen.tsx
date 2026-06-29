"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { DharmaWheel, LotusMark } from "@/components/ornaments";
import { useProgress } from "@/context/progress-context";
import { gameConfig } from "@/lib/game-data";

export function HomeScreen() {
  const router = useRouter();
  const { progress, isReady, resetProgress } = useProgress();
  const hasProgress =
    progress.answeredQuizIds.length > 0 ||
    progress.completedChapters.length > 0 ||
    progress.lotusPetals > 0;

  const startGame = () => {
    if (hasProgress) {
      const confirmed = window.confirm(
        "开始新游戏会清除当前进度。确定要重新开始吗？",
      );
      if (!confirmed) return;
    }
    resetProgress();
    router.push(`/play/${gameConfig.openingChapterId}`);
  };

  const reset = () => {
    if (!hasProgress || window.confirm("确定要清除所有剧情与学习进度吗？")) {
      resetProgress();
    }
  };

  return (
    <main className="home-scene">
      <div className="home-scene__mountains" />
      <div className="home-scene__light" />
      <div className="home-scene__grain" />

      <nav className="home-nav" aria-label="主导航">
        <div className="home-nav__brand">
          <DharmaWheel className="h-8 w-8 text-oldgold" />
          <span>YASODHARĀ</span>
        </div>
        <Link className="text-link" href="/chapters">
          章节
        </Link>
      </nav>

      <section className="home-hero">
        <div className="home-hero__eyebrow">
          <span />
          Yasodharātherī-apadāna
          <span />
        </div>
        <LotusMark className="home-hero__lotus" />
        <p className="home-hero__kicker">巴利语剧情学习 · 因缘卷册</p>
        <h1>
          耶输陀罗
          <small>莲华因缘</small>
        </h1>
        <p className="home-hero__subtitle">{gameConfig.subtitle}</p>

        <div className="home-actions">
          <button className="button button--primary" onClick={startGame}>
            <span>开始游戏</span>
            <span aria-hidden="true">→</span>
          </button>
          <button
            className="button button--ghost"
            disabled={!isReady || !hasProgress}
            onClick={() => router.push(`/play/${progress.currentChapter}`)}
          >
            继续游戏
          </button>
        </div>

        <button
          className="home-reset"
          disabled={!isReady || !hasProgress}
          onClick={reset}
        >
          重置进度
        </button>
      </section>

      <div className="home-scene__footer">
        <span>王舍城 · 暮色将至</span>
        <span>以耳倾听，以心记取</span>
      </div>
    </main>
  );
}
