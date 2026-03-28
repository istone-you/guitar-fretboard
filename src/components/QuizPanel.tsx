import { useTranslation } from "react-i18next";
import "../i18n";
import type { Theme } from "../types";

export type QuizMode = "note" | "degree";

export interface QuizQuestion {
  stringIdx: number;
  fret: number;
  correct: string;
  choices: string[];
}

interface QuizPanelProps {
  theme: Theme;
  mode: QuizMode;
  question: QuizQuestion;
  score: { correct: number; total: number };
  selectedAnswer: string | null;
  rootNote: string;
  onModeChange: (mode: QuizMode) => void;
  onAnswer: (answer: string) => void;
}

export default function QuizPanel({
  theme,
  mode,
  question,
  score,
  selectedAnswer,
  rootNote,
  onModeChange,
  onAnswer,
}: QuizPanelProps) {
  const { t } = useTranslation();
  const isDark = theme === "dark";
  const answered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === question.correct;
  const stringNumber = 6 - question.stringIdx; // 1弦=stringIdx5, 6弦=stringIdx0

  return (
    <div
      className={`rounded-xl p-4 space-y-3 ${
        isDark ? "bg-gray-800" : "bg-stone-50 border border-stone-200"
      }`}
    >
      {/* モード + スコア */}
      <div className="flex items-center justify-between">
        <div
          className={`inline-flex items-center gap-1 rounded-lg p-1 ${
            isDark ? "bg-gray-700" : "bg-stone-200"
          }`}
        >
          {(["note", "degree"] as QuizMode[]).map((m) => (
            <button
              key={m}
              onClick={() => !answered && onModeChange(m)}
              className={`px-3 py-1 rounded text-sm font-semibold transition-all ${
                mode === m
                  ? "bg-indigo-600 text-white"
                  : isDark
                    ? "text-gray-400 hover:text-white"
                    : "text-stone-500 hover:text-stone-900"
              }`}
            >
              {t(`quiz.mode.${m}`)}
            </button>
          ))}
        </div>
        <span className={`text-sm font-mono ${isDark ? "text-gray-400" : "text-stone-500"}`}>
          ✓ {score.correct} / {score.total}
        </span>
      </div>

      {/* 問題文 */}
      <p
        className={`text-center text-base font-semibold ${
          isDark ? "text-white" : "text-stone-900"
        }`}
      >
        {mode === "note"
          ? t("quiz.questionNote", { string: stringNumber, fret: question.fret })
          : t("quiz.questionDegree", {
              string: stringNumber,
              fret: question.fret,
              root: rootNote,
            })}
      </p>

      {/* 選択肢 */}
      <div className="grid grid-cols-2 gap-2">
        {question.choices.map((choice) => {
          let btnClass: string;
          if (!answered) {
            btnClass = isDark
              ? "bg-gray-700 text-white hover:bg-indigo-700"
              : "bg-white text-stone-900 border border-stone-300 hover:bg-indigo-50";
          } else if (choice === question.correct) {
            btnClass = "bg-green-600 text-white";
          } else if (choice === selectedAnswer) {
            btnClass = "bg-red-500 text-white";
          } else {
            btnClass = isDark
              ? "bg-gray-700 text-gray-500"
              : "bg-white text-stone-400 border border-stone-200";
          }
          return (
            <button
              key={choice}
              onClick={() => !answered && onAnswer(choice)}
              className={`py-3 rounded-xl text-base font-bold transition-all ${btnClass}`}
            >
              {choice}
            </button>
          );
        })}
      </div>

      {/* 正誤フィードバック */}
      {answered && (
        <p
          className={`text-center text-sm font-semibold ${
            isCorrect ? "text-green-400" : "text-red-400"
          }`}
        >
          {isCorrect ? t("quiz.correct") : t("quiz.incorrect", { answer: question.correct })}
        </p>
      )}
    </div>
  );
}
