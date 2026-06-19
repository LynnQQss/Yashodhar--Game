"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { EndingSequenceData } from "@/types/game";

const SEQUENCE_DURATION_MS = 7600;
const PETAL_IMAGES = [
  "/images/petals/petal-pink.png",
  "/images/petals/petal-blue.png",
  "/images/petals/petal-gold.png",
  "/images/petals/petal-purple.png",
  "/images/petals/petal-teal.png",
];

const PETAL_PARTICLES = Array.from({ length: 32 }, (_, index) => {
  const angle = (index * 137.5 * Math.PI) / 180;
  const distance = 42 + (index % 7) * 8;
  return {
    delay: `${(index % 8) * 0.09}s`,
    image: PETAL_IMAGES[index % PETAL_IMAGES.length],
    rotate: `${90 + index * 29}deg`,
    scale: `${2.4 + (index % 5) * 0.55}`,
    x: `${Math.cos(angle) * distance}vw`,
    y: `${Math.sin(angle) * distance}vh`,
  };
});

interface FinalEndingSequenceProps {
  ending: EndingSequenceData;
  backgroundImage: string;
  onChapters: () => void;
  onComplete: () => void;
  onHome: () => void;
  onReplay: () => void;
}

export function FinalEndingSequence({
  ending,
  backgroundImage,
  onChapters,
  onComplete,
  onHome,
  onReplay,
}: FinalEndingSequenceProps) {
  const [sequenceComplete, setSequenceComplete] = useState(false);
  const completionCallback = useRef(onComplete);

  useEffect(() => {
    completionCallback.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const timer = window.setTimeout(
      () => {
        setSequenceComplete(true);
        completionCallback.current();
      },
      reduceMotion ? 50 : SEQUENCE_DURATION_MS,
    );
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="final-ending" role="region" aria-label="故事尾声">
      <div
        className="final-ending__farewell"
        style={{ backgroundImage: `url("${backgroundImage}")` }}
      />
      <img
        alt=""
        aria-hidden="true"
        className="final-ending__source-lotus"
        src={ending.lotusImage}
      />
      <div
        className="final-ending__dispersal"
        style={{ backgroundImage: `url("${ending.dispersalImage}")` }}
      />
      <div className="final-ending__petals" aria-hidden="true">
        {PETAL_PARTICLES.map((petal, index) => (
          <img
            alt=""
            key={`${petal.image}-${index}`}
            src={petal.image}
            style={
              {
                "--petal-delay": petal.delay,
                "--petal-rotate": petal.rotate,
                "--petal-scale": petal.scale,
                "--petal-x": petal.x,
                "--petal-y": petal.y,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className="final-ending__petal-veil" aria-hidden="true" />
      <div className="final-ending__blackout" aria-hidden="true" />
      <div
        className="final-ending__final-lotus"
        style={{ backgroundImage: `url("${ending.finalImage}")` }}
      />

      <section
        aria-live="polite"
        className={`final-ending__copy ${
          sequenceComplete ? "is-visible" : ""
        }`}
      >
        <p>YASODHARĀ · THE LOTUS REMEMBERS</p>
        <h1>{ending.title}</h1>
        <span>{ending.text}</span>
        <div className="final-ending__actions">
          <button className="button button--primary" onClick={onHome} type="button">
            {ending.homeLabel}
          </button>
          <button className="button button--ghost" onClick={onChapters} type="button">
            {ending.chaptersLabel}
          </button>
          <button className="button button--ghost" onClick={onReplay} type="button">
            {ending.replayLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
