"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { getShuffledQuizOptions } from "@/lib/quiz";
import type { QuizData } from "@/types/game";

interface QuizCardProps {
  quiz: QuizData;
  alreadySolved: boolean;
  onCorrect: () => void;
  onWrong: () => void;
  onContinue: () => void;
}

export function QuizCard({
  quiz,
  alreadySolved,
  onCorrect,
  onWrong,
  onContinue,
}: QuizCardProps) {
  const [showHint, setShowHint] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isCorrect, setIsCorrect] = useState(alreadySolved);
  const [feedback, setFeedback] = useState(
    alreadySolved ? quiz.correctFeedback : "",
  );
  const shuffledOptions = useMemo(
    () =>
      quiz.kind === "choice"
        ? getShuffledQuizOptions(quiz.options, quiz.id)
        : [],
    [quiz],
  );

  useEffect(() => {
    setShowHint(false);
    setSelected(null);
    setInput("");
    setIsCorrect(alreadySolved);
    setFeedback(alreadySolved ? quiz.correctFeedback : "");
  }, [quiz.id, alreadySolved, quiz.correctFeedback]);

  const checkChoice = (optionId: string) => {
    if (isCorrect) return;
    if (quiz.kind !== "choice") return;

    if (optionId === quiz.correctAnswerId) {
      setIsCorrect(true);
      setFeedback(quiz.correctFeedback);
      onCorrect();
    } else {
      setFeedback(quiz.wrongFeedback);
      onWrong();
    }
  };

  const checkInput = (answer: string) => {
    if (isCorrect || quiz.kind !== "input") return;
    const normalized = answer.trim().toLocaleLowerCase();
    const accepted = [
      quiz.correctAnswer,
      ...(quiz.acceptedAnswers ?? []),
    ].map((item) => item.trim().toLocaleLowerCase());

    if (accepted.includes(normalized)) {
      setIsCorrect(true);
      setFeedback(quiz.correctFeedback);
      onCorrect();
    } else {
      setFeedback(quiz.wrongFeedback);
      onWrong();
    }
  };

  const submitInput = (event: FormEvent) => {
    event.preventDefault();
    checkInput(input);
  };

  return (
    <div className="quiz-card">
      <div className="quiz-card__heading">
        <span>LANGUAGE PATH</span>
        <button type="button" onClick={() => setShowHint((value) => !value)}>
          {showHint ? "收起提示" : "查看提示"}
        </button>
      </div>

      <h2>{quiz.question}</h2>

      {showHint && (
        <div className="quiz-card__hint">
          <span>提示</span>
          {quiz.hint}
        </div>
      )}

      {quiz.kind === "choice" && (
        <div className="quiz-card__options">
          {shuffledOptions.map((option, index) => {
            const isSelected = selected === option.id;
            const isRightOption =
              isCorrect && option.id === quiz.correctAnswerId;
            return (
              <button
                className={`${isSelected ? "is-selected" : ""} ${
                  isRightOption ? "is-correct" : ""
                }`}
                disabled={isCorrect}
                key={option.id}
                onClick={() => {
                  setSelected(option.id);
                  checkChoice(option.id);
                }}
                type="button"
              >
                <span>{String.fromCharCode(65 + index)}</span>
                {option.text}
              </button>
            );
          })}
        </div>
      )}

      {quiz.kind === "input" && (
        <form className="quiz-card__input" onSubmit={submitInput}>
          <input
            aria-label="输入答案"
            autoComplete="off"
            disabled={isCorrect}
            inputMode="numeric"
            onChange={(event) => {
              setInput(event.target.value);
              if (feedback && !isCorrect) setFeedback("");
            }}
            placeholder="输入数字"
            value={input}
          />
          <button disabled={!input.trim() || isCorrect} type="submit">
            确认
          </button>
        </form>
      )}

      {feedback && (
        <div
          className={`quiz-card__feedback ${
            isCorrect ? "is-correct" : "is-wrong"
          }`}
          role="status"
        >
          <span>{isCorrect ? "✓" : "·"}</span>
          <p>{feedback}</p>
        </div>
      )}

      {isCorrect && quiz.explanation && (
        <div className="quiz-card__explanation">
          <span>简注</span>
          <p>{quiz.explanation}</p>
        </div>
      )}

      {isCorrect && (
        <button className="button button--primary quiz-card__continue" onClick={onContinue}>
          继续故事
          <span aria-hidden="true">→</span>
        </button>
      )}
    </div>
  );
}
