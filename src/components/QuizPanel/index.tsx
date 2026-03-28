import { useTranslation } from "react-i18next";
import "../../i18n";
import type { DegreeName, Theme } from "../../types";
import QuizKindSelect from "./QuizKindSelect";

export type QuizMode = "note" | "degree" | "relative";
export type QuizType = "choice" | "fretboard";

export interface QuizQuestion {
  stringIdx: number;
  fret: number;
  correct: string;
  choices: string[];
  promptRoot?: string;
  promptDegree?: DegreeName;
}

interface QuizPanelProps {
  theme: Theme;
  mode: QuizMode;
  quizType: QuizType;
  question: QuizQuestion;
  score: { correct: number; total: number };
  selectedAnswer: string | null;
  rootNote: string;
  onKindChange: (mode: QuizMode, type: QuizType) => void;
  onAnswer: (answer: string) => void;
}

export default function QuizPanel({
  theme,
  mode,
  quizType,
  question,
  score,
  selectedAnswer,
  rootNote,
  onKindChange,
  onAnswer,
}: QuizPanelProps) {
  const { t } = useTranslation();
  const isDark = theme === "dark";
  const answered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === question.correct;
  const stringNumber = 6 - question.stringIdx;

  const quizKindValue = `${mode}-${quizType}`;
  const quizKindOptions = [
    { value: "note-choice", label: t("quiz.kind.noteChoice") },
    { value: "note-fretboard", label: t("quiz.kind.noteFretboard") },
    { value: "degree-choice", label: t("quiz.kind.degreeChoice") },
    { value: "degree-fretboard", label: t("quiz.kind.degreeFretboard") },
    { value: "relative-choice", label: t("quiz.kind.relativeChoice") },
    { value: "relative-fretboard", label: t("quiz.kind.relativeFretboard") },
  ];

  const handleKindChange = (value: string) => {
    if (answered) return;
    const [newMode, newType] = value.split("-") as [QuizMode, QuizType];
    onKindChange(newMode, newType);
  };

  return (
    <div
      className={`rounded-xl p-4 space-y-3 ${
        isDark ? "bg-gray-800" : "bg-stone-50 border border-stone-200"
      }`}
    >
      {/* 種別 + スコア */}
      <div className="flex items-center justify-between gap-2 min-w-0">
        <QuizKindSelect
          theme={theme}
          value={quizKindValue}
          options={quizKindOptions}
          disabled={answered}
          onChange={handleKindChange}
        />
        <span
          className={`shrink-0 text-xs font-mono sm:text-sm ${isDark ? "text-gray-400" : "text-stone-500"}`}
        >
          ✓ {score.correct} / {score.total}
        </span>
      </div>

      {/* 問題文 */}
      <p
        className={`text-center text-base font-semibold ${
          isDark ? "text-white" : "text-stone-900"
        }`}
      >
        {quizType === "fretboard"
          ? mode === "relative"
            ? t("quiz.questionRelativeFretboard", {
                root: question.promptRoot,
                degree: question.promptDegree,
              })
            : t("quiz.questionFretboard", { string: stringNumber, note: question.correct })
          : mode === "relative"
            ? t("quiz.questionRelative", {
                root: question.promptRoot,
                degree: question.promptDegree,
              })
            : mode === "note"
              ? t("quiz.questionNote", { string: stringNumber, fret: question.fret })
              : t("quiz.questionDegree", {
                  string: stringNumber,
                  fret: question.fret,
                  root: rootNote,
                })}
      </p>

      {/* 選択肢（choiceモードのみ） */}
      {quizType === "choice" && (
        <div className="grid grid-cols-2 gap-2">
          {question.choices.map((choice) => {
            let btnClass: string;
            if (!answered) {
              btnClass = isDark
                ? "bg-gray-700 text-white [@media(hover:hover)]:hover:bg-indigo-700"
                : "bg-white text-stone-900 border border-stone-300 [@media(hover:hover)]:hover:bg-indigo-50";
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
      )}

      {/* 指板モード: タップ指示 */}
      {quizType === "fretboard" && !answered && (
        <p className={`text-center text-sm pb-3 ${isDark ? "text-gray-400" : "text-stone-500"}`}>
          {t("quiz.tapInstruction")}
        </p>
      )}

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
