import { DharmaWheel } from "@/components/ornaments";

interface ChapterCompletionProps {
  title: string;
  text: string;
  onReturn: () => void;
  onReplay: () => void;
  onNext?: () => void;
}

export function ChapterCompletion({
  title,
  text,
  onReturn,
  onReplay,
  onNext,
}: ChapterCompletionProps) {
  return (
    <div className="completion-panel">
      <p className="reward-panel__eyebrow">CHAPTER COMPLETE</p>
      <DharmaWheel className="completion-panel__wheel" />
      <h2>{title}</h2>
      <p>{text}</p>
      <div className="completion-panel__actions">
        <button className="button button--ghost" onClick={onReturn} type="button">
          返回章节页
        </button>
        <button className="button button--primary" onClick={onReplay} type="button">
          重温本章
        </button>
        <button
          className="button button--ghost"
          disabled={!onNext}
          onClick={onNext}
          type="button"
        >
          {onNext ? "继续下一章" : "下一章 · 敬请期待"}
        </button>
      </div>
    </div>
  );
}
