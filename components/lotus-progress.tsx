import type { CSSProperties } from "react";
import { LotusMark } from "@/components/ornaments";

interface LotusProgressProps {
  current: number;
  total: number;
  compact?: boolean;
  glowing?: boolean;
}

export function LotusProgress({
  current,
  total,
  compact = false,
  glowing = false,
}: LotusProgressProps) {
  const safeTotal = Math.max(1, Math.min(total, 8));
  const petalImages = [
    "/images/petals/petal-pink.png",
    "/images/petals/petal-blue.png",
    "/images/petals/petal-purple.png",
    "/images/petals/petal-gold.png",
    "/images/petals/petal-teal.png",
    "/images/petals/petal-dusk-blue.png",
    "/images/petals/petal-purple-low-quality.png",
    "/images/petals/petal-gold.png",
  ];

  return (
    <div
      className={`lotus-progress ${compact ? "lotus-progress--compact" : ""} ${
        glowing ? "lotus-progress--glowing" : ""
      }`}
      aria-label={`已获得 ${current} 片，共 ${total} 片莲花瓣`}
    >
      <div className="lotus-progress__flower" aria-hidden="true">
        {Array.from({ length: safeTotal }).map((_, index) => {
          const angle = (360 / safeTotal) * index;
          const petalImage = petalImages[index];
          return (
            <span
              className={`lotus-progress__petal ${
                index < current ? "is-collected" : ""
              }`}
              key={index}
              style={
                {
                  "--petal-image": petalImage
                    ? `url("${petalImage}")`
                    : undefined,
                  transform: `rotate(${angle}deg) translateY(-18px)`,
                } as CSSProperties
              }
            />
          );
        })}
        <span className="lotus-progress__center" />
      </div>
      <div className="lotus-progress__copy">
        {!compact && <LotusMark className="h-5 w-8 text-oldgold" />}
        <span>莲花瓣</span>
        <strong>
          {Math.min(current, total)} / {total}
        </strong>
      </div>
    </div>
  );
}
