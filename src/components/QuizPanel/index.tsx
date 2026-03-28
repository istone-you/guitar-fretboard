import { useTranslation } from "react-i18next";
import "../../i18n";
import type { DegreeName, Theme, ChordType } from "../../types";
import QuizKindSelect from "./QuizKindSelect";
import ChordQuizTypeSelect from "./ChordQuizTypeSelect";

export type QuizMode = "note" | "degree" | "relative" | "chord";
export type QuizType = "choice" | "fretboard";

export interface QuizQuestion {
  stringIdx: number;
  fret: number;
  correct: string;
  choices: string[];
  answerLabel?: string;
  promptRoot?: string;
  promptDegree?: DegreeName;
  promptChordLabel?: string;
  correctNoteNames?: string[];
}

interface QuizPanelProps {
  theme: Theme;
  mode: QuizMode;
  quizType: QuizType;
  question: QuizQuestion;
  score: { correct: number; total: number };
  selectedAnswer: string | null;
  rootNote: string;
  quizSelectedChoices: string[];
  chordQuizTypes: ChordType[];
  availableChordQuizTypes: ChordType[];
  onKindChange: (mode: QuizMode, type: QuizType) => void;
  onChordQuizTypesChange: (value: ChordType[]) => void;
  onAnswer: (answer: string) => void;
  onNextQuestion: () => void;
}

export default function QuizPanel({
  theme,
  mode,
  quizType,
  question,
  score,
  selectedAnswer,
  rootNote,
  quizSelectedChoices,
  chordQuizTypes,
  availableChordQuizTypes,
  onKindChange,
  onChordQuizTypesChange,
  onAnswer,
  onNextQuestion,
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
    { value: "chord-choice", label: t("quiz.kind.chordChoice") },
    { value: "chord-fretboard", label: t("quiz.kind.chordFretboard") },
  ];

  const handleKindChange = (value: string) => {
    if (answered) return;
    const [newMode, newType] = value.split("-") as [QuizMode, QuizType];
    onKindChange(newMode, newType);
  };

  const handleChordTypeToggle = (value: ChordType) => {
    if (answered) return;
    if (chordQuizTypes.includes(value)) {
      if (chordQuizTypes.length === 1) return;
      onChordQuizTypesChange(chordQuizTypes.filter((chordType) => chordType !== value));
      return;
    }
    onChordQuizTypesChange([...chordQuizTypes, value]);
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

      {mode === "chord" && (
        <div className="flex items-center justify-center gap-3">
          <span className={`text-sm font-semibold ${isDark ? "text-gray-300" : "text-stone-700"}`}>
            {t("quiz.chordTypes.label")}
          </span>
          <ChordQuizTypeSelect
            theme={theme}
            value={chordQuizTypes}
            options={availableChordQuizTypes}
            disabled={answered}
            onToggle={handleChordTypeToggle}
          />
        </div>
      )}

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
            : mode === "chord"
              ? t("quiz.questionChordFretboard", {
                  chord: question.promptChordLabel,
                })
              : t("quiz.questionFretboard", { string: stringNumber, note: question.correct })
          : mode === "relative"
            ? t("quiz.questionRelative", {
                root: question.promptRoot,
                degree: question.promptDegree,
              })
            : mode === "chord"
              ? t("quiz.questionChordFretboard", {
                  chord: question.promptChordLabel,
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
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {question.choices.map((choice) => {
            let btnClass: string;
            if (mode === "chord") {
              const isSelectedCorrect = quizSelectedChoices.includes(choice);
              const isCorrectChoice = question.correctNoteNames?.includes(choice);

              if (!answered) {
                btnClass = isSelectedCorrect
                  ? "bg-green-600 text-white"
                  : isDark
                    ? "bg-gray-700 text-white [@media(hover:hover)]:hover:bg-indigo-700"
                    : "bg-white text-stone-900 border border-stone-300 [@media(hover:hover)]:hover:bg-indigo-50";
              } else if (isCorrectChoice) {
                btnClass = "bg-green-600 text-white";
              } else if (choice === selectedAnswer) {
                btnClass = "bg-red-500 text-white";
              } else {
                btnClass = isDark
                  ? "bg-gray-700 text-gray-500"
                  : "bg-white text-stone-400 border border-stone-200";
              }
            } else if (!answered) {
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

      <div className="space-y-3">
        <p
          className={`min-h-5 text-center text-sm font-semibold ${
            answered ? (isCorrect ? "text-green-400" : "text-red-400") : "text-transparent"
          }`}
        >
          {answered
            ? isCorrect
              ? t("quiz.correct")
              : t("quiz.incorrect", { answer: question.answerLabel ?? question.correct })
            : t("quiz.correct")}
        </p>
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onNextQuestion}
            disabled={!answered}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
              answered
                ? "bg-indigo-600 text-white hover:bg-indigo-500"
                : isDark
                  ? "bg-gray-700 text-gray-500"
                  : "bg-stone-200 text-stone-400"
            }`}
          >
            {t("quiz.next")}
          </button>
        </div>
      </div>
    </div>
  );
}
