"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { DharmaWheel, LotusMark } from "@/components/ornaments";
import { useProgress } from "@/context/progress-context";
import { gameConfig } from "@/lib/game-data";

const languageNotes = [
  ["āyu", "寿命"],
  ["gamissāmi", "我将去"],
  ["-tvā", "表示先完成的动作"],
  ["aparādhaṁ khamassu me", "请原谅我的过失"],
  ["iddhi", "神通"],
  ["kaṅkhaṁ chindassu", "断除疑惑"],
];

export function EndingScreen() {
  const router = useRouter();
  const { progress, isReady, resetProgress } = useProgress();

  if (!isReady) {
    return (
      <main className="ending-page">
        <DharmaWheel className="h-12 w-12 animate-spin text-oldgold" />
      </main>
    );
  }

  if (!progress.hasOfferedLotus) {
    return (
      <main className="ending-page ending-page--locked">
        <DharmaWheel className="h-16 w-16 text-oldgold" />
        <h1>莲花尚未献上</h1>
        <p>
          需先集齐 {gameConfig.totalPetals} 片莲花瓣，完成佛前的告别。
        </p>
        <Link className="button button--primary" href="/chapters">
          返回故事
        </Link>
      </main>
    );
  }

  const replay = () => {
    resetProgress();
    router.push(`/play/${gameConfig.openingChapterId}`);
  };

  const reset = () => {
    if (window.confirm("确定要清除全部进度并返回首页吗？")) {
      resetProgress();
      router.push("/");
    }
  };

  return (
    <main className="ending-page">
      <div className="ending-page__halo" />
      <div className="ending-page__grain" />
      <section className="ending-hero">
        <p>第一卷 · 完</p>
        <LotusMark className="ending-hero__lotus" />
        <h1>莲花已献，因缘初成</h1>
        <span>YASODHARĀ · THE LOTUS REMEMBERS</span>
      </section>

      <section className="ending-summary">
        <DharmaWheel className="ending-summary__wheel" />
        <h2>故事小结</h2>
        <p>
          耶输陀罗长老尼已经在佛前陈白自己的最后时刻。佛陀请她示现神通，断除会众疑惑。随后，她讲述久远过去与佛结缘的故事：一朵花、一份供养、一次发愿，成为漫长轮回中不断延续的因缘。第一版故事到此结束，后续将继续展开她的前世因缘、授记与最终解脱。
        </p>
      </section>

      <section className="learning-summary">
        <div>
          <p>LANGUAGE NOTES</p>
          <h2>此行所学</h2>
        </div>
        <dl>
          {languageNotes.map(([term, meaning]) => (
            <div key={term}>
              <dt lang="pi">{term}</dt>
              <dd>{meaning}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="ending-actions">
        <Link className="button button--primary" href="/">
          返回首页
        </Link>
        <button className="button button--ghost" onClick={replay}>
          重玩
        </button>
        <button className="ending-actions__reset" onClick={reset}>
          重置进度
        </button>
      </div>

      <footer>愿此微小的学习，成为理解与善意的因缘。</footer>
    </main>
  );
}
