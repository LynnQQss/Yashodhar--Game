"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import { DharmaWheel } from "@/components/ornaments";
import { LotusProgress } from "@/components/lotus-progress";
import { useProgress } from "@/context/progress-context";
import { chapters, gameConfig } from "@/lib/game-data";

export function ChapterSelection() {
  const router = useRouter();
  const { progress, isReady } = useProgress();

  return (
    <main className="chapter-page">
      <div className="chapter-page__atmosphere" />
      <header className="chapter-header">
        <Link className="back-link" href="/">
          ← 返回
        </Link>
        <div className="chapter-header__title">
          <DharmaWheel className="h-9 w-9 text-oldgold" />
          <div>
            <span>旅程卷册</span>
            <h1>故事章节</h1>
          </div>
        </div>
        <LotusProgress
          compact
          current={progress.lotusPetals}
          total={gameConfig.totalPetals}
        />
      </header>

      <section className="chapter-intro">
        <p>王舍城 · 耶输陀罗长老尼譬喻</p>
        <h2>最后一夜，亦是往昔因缘的开端</h2>
      </section>

      <section className="chapter-list" aria-label="章节列表">
        {chapters.map((chapter, index) => {
          const previous = chapters[index - 1];
          const unlocked =
            index === 0 ||
            progress.completedChapters.includes(previous?.id ?? "");
          const completed = progress.completedChapters.includes(chapter.id);
          const inProgress =
            progress.currentChapter === chapter.id &&
            Boolean(progress.currentSceneByChapter[chapter.id]) &&
            !completed;

          return (
            <article
              className={`chapter-card theme-${chapter.fallbackTheme} ${
                !unlocked ? "is-locked" : ""
              }`}
              key={chapter.id}
            >
              <div
                className="chapter-card__image"
                style={
                  {
                    "--chapter-image": `url("${chapter.backgroundImage}")`,
                    backgroundPosition:
                      chapter.backgroundPosition ?? "center center",
                  } as CSSProperties
                }
              />
              <div className="chapter-card__number">
                <span>第</span>
                {index + 1}
                <span>章</span>
              </div>
              <div className="chapter-card__content">
                <div className="chapter-card__status">
                  {completed
                    ? "已完成"
                    : inProgress
                      ? "进行中"
                      : unlocked
                        ? "尚未开始"
                        : "前路未启"}
                </div>
                <p>{chapter.location}</p>
                <h3>{chapter.title}</h3>
                <div className="chapter-card__rule" />
                <p className="chapter-card__subtitle">{chapter.subtitle}</p>
              </div>
              <button
                className="chapter-card__button"
                disabled={!isReady || !unlocked}
                onClick={() => router.push(`/play/${chapter.id}`)}
                aria-label={
                  unlocked ? `进入${chapter.title}` : `${chapter.title}尚未解锁`
                }
              >
                {unlocked ? (completed ? "重温此章" : "进入此章") : "锁定"}
                <span aria-hidden="true">{unlocked ? "→" : "◇"}</span>
              </button>
            </article>
          );
        })}
      </section>

      <footer className="chapter-footer">
        <span>完成故事与语言任务，莲花瓣便会回应你的旅程。</span>
        <span>
          当前进度 {progress.completedChapters.length} / {chapters.length}
        </span>
      </footer>
    </main>
  );
}
