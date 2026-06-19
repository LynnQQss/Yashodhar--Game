"use client";

import { useState } from "react";
import type { OfferingInteractionData } from "@/types/game";

interface OfferingInteractionProps {
  currentPetals: number;
  interaction: OfferingInteractionData;
  text: string;
  title: string;
  onContinue: () => void;
}

export function OfferingInteraction({
  currentPetals,
  interaction,
  text,
  title,
  onContinue,
}: OfferingInteractionProps) {
  const [hasOffered, setHasOffered] = useState(false);
  const canOffer = currentPetals >= interaction.requiredPetals;

  return (
    <div className={`offering-ritual${hasOffered ? " is-complete" : ""}`}>
      <img
        alt="虹彩莲花"
        className="offering-ritual__lotus"
        src={interaction.image}
      />

      <div className="offering-ritual__copy">
        <p className="reward-panel__eyebrow">THE FIRST VOW</p>
        <h2>{title}</h2>
        <p role={hasOffered ? "status" : undefined}>
          {hasOffered ? interaction.completionText : text}
        </p>

        {!hasOffered && (
          <>
            <button
              className="button button--primary"
              disabled={!canOffer}
              onClick={() => setHasOffered(true)}
              type="button"
            >
              {interaction.buttonLabel}
            </button>
            {!canOffer && (
              <p className="offering-ritual__error" role="alert">
                还需集齐 {interaction.requiredPetals} 片莲花瓣，方可献花。
              </p>
            )}
          </>
        )}

        {hasOffered && (
          <div className="offering-ritual__actions">
            <button
              className="button button--primary"
              onClick={onContinue}
              type="button"
            >
              继续故事
              <span aria-hidden="true">→</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
