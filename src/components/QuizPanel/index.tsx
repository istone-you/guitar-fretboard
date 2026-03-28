import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import "../../i18n";
import type { DegreeName, Theme, ChordType, ScaleType } from "../../types";
import QuizKindSelect from "./QuizKindSelect";
import ChordQuizTypeSelect from "./ChordQuizTypeSelect";
import { ScaleSelect } from "../Controls/ScaleSelect";
import { buildScaleOptions } from "../Controls/scaleOptions";
import { DropdownSelect } from "../ui/DropdownSelect";

export type QuizMode = "note" | "degree" | "chord" | "scale" | "diatonic";
export type QuizType = "choice" | "fretboard" | "all";

export interface DiatonicAnswerEntry {
  degree: string;
  root: string;
  chordType: ChordType;
  label: string;
}

export interface QuizQuestion {
  stringIdx: number;
  fret: number;
  correct: string;
  choices: string[];
  answerLabel?: string;
  promptDegree?: DegreeName;
  promptChordLabel?: string;
  promptChordRoot?: string;
  promptChordType?: ChordType;
  promptScaleRoot?: string;
  promptScaleType?: ScaleType;
  correctNoteNames?: string[];
  promptDiatonicKeyType?: "major" | "natural-minor";
  promptDiatonicChordSize?: "triad" | "seventh";
  diatonicChordTypeOptions?: ChordType[];
  diatonicAnswers?: DiatonicAnswerEntry[];
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
  noteOptions: string[];
  quizSelectedChordRoot: string | null;
  quizSelectedChordType: ChordType | null;
  diatonicSelectedRoot: string | null;
  diatonicSelectedChordType: ChordType | null;
  diatonicAllAnswers: Record<string, { root: string; chordType: ChordType }>;
  diatonicEditingDegree: string | null;
  diatonicQuizKeyType: "major" | "natural-minor";
  diatonicQuizChordSize: "triad" | "seventh";
  chordQuizTypes: ChordType[];
  availableChordQuizTypes: ChordType[];
  scaleType: ScaleType;
  onKindChange: (mode: QuizMode, type: QuizType) => void;
  onChordQuizTypesChange: (value: ChordType[]) => void;
  onScaleTypeChange: (value: ScaleType) => void;
  onDiatonicQuizKeyTypeChange: (value: "major" | "natural-minor") => void;
  onDiatonicQuizChordSizeChange: (value: "triad" | "seventh") => void;
  onAnswer: (answer: string) => void;
  onChordQuizRootSelect: (root: string) => void;
  onChordQuizTypeSelect: (chordType: ChordType) => void;
  onDiatonicAnswerRootSelect: (root: string) => void;
  onDiatonicAnswerTypeSelect: (chordType: ChordType) => void;
  onDiatonicDegreeCardClick: (degree: string) => void;
  onDiatonicSubmitAll: () => void;
  onNextQuestion: () => void;
  onRetryQuestion: () => void;
  fretboardAllStrings: boolean;
  onFretboardAllStringsChange: (value: boolean) => void;
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
  noteOptions,
  quizSelectedChordRoot,
  quizSelectedChordType,
  diatonicSelectedRoot,
  diatonicSelectedChordType,
  diatonicAllAnswers,
  diatonicEditingDegree,
  diatonicQuizKeyType,
  diatonicQuizChordSize,
  chordQuizTypes,
  availableChordQuizTypes,
  scaleType,
  onKindChange,
  onChordQuizTypesChange,
  onScaleTypeChange,
  onDiatonicQuizKeyTypeChange,
  onDiatonicQuizChordSizeChange,
  onAnswer,
  onChordQuizRootSelect,
  onChordQuizTypeSelect,
  onDiatonicAnswerRootSelect,
  onDiatonicAnswerTypeSelect,
  onDiatonicDegreeCardClick,
  onDiatonicSubmitAll,
  onNextQuestion,
  onRetryQuestion,
  fretboardAllStrings,
  onFretboardAllStringsChange,
}: QuizPanelProps) {
  const { t } = useTranslation();
  const isDark = theme === "dark";
  const answered = selectedAnswer !== null;
  const scaleTypeKey = (s: string) => s.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
  const isCorrect = selectedAnswer === question.correct;
  const stringNumber = 6 - question.stringIdx;
  const { options: scaleOptions, groups: scaleGroups } = buildScaleOptions(t);
  const diatonicKeyOptions = [
    { value: "major", label: t("options.diatonicKey.major") },
    { value: "natural-minor", label: t("options.diatonicKey.naturalMinor") },
  ];
  const diatonicChordSizeOptions = [
    { value: "triad", label: t("options.diatonicChordSize.triad") },
    { value: "seventh", label: t("options.diatonicChordSize.seventh") },
  ];
  const currentDiatonicDegree = useMemo(() => {
    if (diatonicEditingDegree != null) return diatonicEditingDegree;
    return (
      question.diatonicAnswers?.find((entry) => diatonicAllAnswers[entry.degree] == null)?.degree ??
      null
    );
  }, [diatonicEditingDegree, diatonicAllAnswers, question.diatonicAnswers]);

  const diatonicAllFilled = useMemo(
    () =>
      question.diatonicAnswers?.every((entry) => diatonicAllAnswers[entry.degree] != null) ?? false,
    [diatonicAllAnswers, question.diatonicAnswers],
  );

  const quizKindValue = `${mode}-${quizType}`;
  const quizKindOptions = [
    { value: "note-choice", label: t("quiz.kind.noteChoice") },
    { value: "note-fretboard", label: t("quiz.kind.noteFretboard") },
    { value: "degree-choice", label: t("quiz.kind.degreeChoice") },
    { value: "degree-fretboard", label: t("quiz.kind.degreeFretboard") },
    { value: "chord-choice", label: t("quiz.kind.chordChoice") },
    { value: "chord-fretboard", label: t("quiz.kind.chordFretboard") },
    { value: "scale-choice", label: t("quiz.kind.scaleChoice") },
    { value: "scale-fretboard", label: t("quiz.kind.scaleFretboard") },
    { value: "diatonic-all", label: t("quiz.kind.diatonicAll") },
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

      {mode === "scale" && (
        <div className="flex items-center justify-center gap-3">
          <span className={`text-sm font-semibold ${isDark ? "text-gray-300" : "text-stone-700"}`}>
            {t("layers.scale")}
          </span>
          <ScaleSelect
            theme={theme}
            value={scaleType}
            onChange={(value) => onScaleTypeChange(value as ScaleType)}
            options={scaleOptions}
            groups={scaleGroups}
            direction="up"
          />
        </div>
      )}

      {quizType === "fretboard" && (mode === "note" || mode === "degree") && (
        <div className="flex items-center justify-center gap-3">
          <DropdownSelect
            theme={theme}
            value={String(fretboardAllStrings)}
            onChange={(v) => !answered && onFretboardAllStringsChange(v === "true")}
            options={[
              { value: "false", label: t("quiz.fretboardMode.singleString") },
              { value: "true", label: t("quiz.fretboardMode.allStrings") },
            ]}
            disabled={answered}
          />
        </div>
      )}

      {mode === "diatonic" && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-semibold ${isDark ? "text-gray-300" : "text-stone-700"}`}
            >
              {t("controls.key")}
            </span>
            <DropdownSelect
              theme={theme}
              value={diatonicQuizKeyType}
              onChange={(value) => onDiatonicQuizKeyTypeChange(value as "major" | "natural-minor")}
              options={diatonicKeyOptions}
              widthClass="w-28"
              disabled={answered}
            />
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-semibold ${isDark ? "text-gray-300" : "text-stone-700"}`}
            >
              {t("controls.chordType")}
            </span>
            <DropdownSelect
              theme={theme}
              value={diatonicQuizChordSize}
              onChange={(value) => onDiatonicQuizChordSizeChange(value as "triad" | "seventh")}
              options={diatonicChordSizeOptions}
              widthClass="w-24"
              disabled={answered}
            />
          </div>
        </div>
      )}

      {/* 問題文 */}
      <p
        className={`text-center text-base font-semibold ${
          isDark ? "text-white" : "text-stone-900"
        }`}
      >
        {quizType === "fretboard"
          ? mode === "degree"
            ? fretboardAllStrings
              ? t("quiz.questionDegreeAllStrings", { degree: question.correct, root: rootNote })
              : t("quiz.questionDegreeFretboard", {
                  string: stringNumber,
                  degree: question.correct,
                  root: rootNote,
                })
            : mode === "diatonic"
              ? ""
              : mode === "scale"
                ? t("quiz.questionScaleFretboard", {
                    root: question.promptScaleRoot,
                    scale: t(`options.scale.${scaleTypeKey(question.promptScaleType ?? "")}`),
                  })
                : mode === "chord"
                  ? t("quiz.questionChordFretboard", {
                      chord: question.promptChordLabel,
                    })
                  : fretboardAllStrings
                    ? t("quiz.questionNoteAllStrings", { note: question.correct })
                    : t("quiz.questionFretboard", { string: stringNumber, note: question.correct })
          : mode === "scale"
            ? t("quiz.questionScale", {
                root: question.promptScaleRoot,
                scale: t(`options.scale.${scaleTypeKey(question.promptScaleType ?? "")}`),
              })
            : mode === "diatonic"
              ? t("quiz.questionDiatonicAll", {
                  root: rootNote,
                  keyType: t(
                    `options.diatonicKey.${question.promptDiatonicKeyType === "major" ? "major" : "naturalMinor"}`,
                  ),
                  chordSize: t(`options.diatonicChordSize.${question.promptDiatonicChordSize}`),
                })
              : mode === "chord"
                ? t("quiz.questionChordIdentify")
                : mode === "note"
                  ? t("quiz.questionNote", { string: stringNumber, fret: question.fret })
                  : t("quiz.questionDegree", {
                      string: stringNumber,
                      fret: question.fret,
                      root: rootNote,
                    })}
      </p>

      {/* 選択肢（choiceモードのみ） */}
      {quizType === "choice" && mode === "chord" ? (
        <div className="space-y-3">
          <div className="flex flex-wrap justify-center gap-2">
            {["A", "B", "C", "D", "E", "F", "G"].map((choice) => {
              const isCorrectChoice = choice === question.promptChordRoot;
              const isSelectedChoice = choice === quizSelectedChordRoot;
              let btnClass: string;

              if (!answered) {
                btnClass = isSelectedChoice
                  ? "bg-indigo-600 text-white"
                  : isDark
                    ? "bg-gray-700 text-white [@media(hover:hover)]:hover:bg-indigo-700"
                    : "bg-white text-stone-900 border border-stone-300 [@media(hover:hover)]:hover:bg-indigo-50";
              } else if (isCorrectChoice) {
                btnClass = "bg-green-600 text-white";
              } else if (isSelectedChoice) {
                btnClass = "bg-red-500 text-white";
              } else {
                btnClass = isDark
                  ? "bg-gray-700 text-gray-500"
                  : "bg-white text-stone-400 border border-stone-200";
              }

              return (
                <button
                  key={choice}
                  type="button"
                  onClick={() => !answered && onChordQuizRootSelect(choice)}
                  className={`min-w-10 rounded-xl px-3 py-2 text-sm font-bold transition-all ${btnClass}`}
                >
                  {choice}
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {chordQuizTypes.map((choice) => {
              const isCorrectChoice = choice === question.promptChordType;
              const isSelectedChoice = choice === quizSelectedChordType;
              let btnClass: string;

              if (!answered) {
                btnClass = isSelectedChoice
                  ? "bg-indigo-600 text-white"
                  : isDark
                    ? "bg-gray-700 text-white [@media(hover:hover)]:hover:bg-indigo-700"
                    : "bg-white text-stone-900 border border-stone-300 [@media(hover:hover)]:hover:bg-indigo-50";
              } else if (isCorrectChoice) {
                btnClass = "bg-green-600 text-white";
              } else if (isSelectedChoice) {
                btnClass = "bg-red-500 text-white";
              } else {
                btnClass = isDark
                  ? "bg-gray-700 text-gray-500"
                  : "bg-white text-stone-400 border border-stone-200";
              }

              return (
                <button
                  key={choice}
                  type="button"
                  disabled={!answered && quizSelectedChordRoot == null}
                  onClick={() => !answered && onChordQuizTypeSelect(choice)}
                  className={`rounded-xl px-3 py-2 text-sm font-bold transition-all ${
                    !answered && quizSelectedChordRoot == null
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  } ${btnClass}`}
                >
                  {choice}
                </button>
              );
            })}
          </div>
        </div>
      ) : quizType === "all" && mode === "diatonic" ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {question.diatonicAnswers?.map((entry) => {
              const answeredEntry = diatonicAllAnswers[entry.degree];
              const label = answeredEntry
                ? `${answeredEntry.root}${
                    answeredEntry.chordType === "Major"
                      ? ""
                      : answeredEntry.chordType === "Minor"
                        ? "m"
                        : answeredEntry.chordType
                  }`
                : "--";
              const isCurrent = !answered && currentDiatonicDegree === entry.degree;
              const isCorrectEntry =
                answered &&
                answeredEntry?.root === entry.root &&
                answeredEntry?.chordType === entry.chordType;
              return (
                <button
                  key={entry.degree}
                  type="button"
                  disabled={answered}
                  onClick={() => !answered && onDiatonicDegreeCardClick(entry.degree)}
                  className={`rounded-xl border px-3 py-2 text-center text-sm transition-all ${
                    isCorrectEntry
                      ? "border-green-500 bg-green-600/20 text-white"
                      : answered && !isCorrectEntry && answeredEntry != null
                        ? "border-red-400 bg-red-900/20 text-white"
                        : isCurrent
                          ? "border-indigo-500 bg-indigo-600/20 text-white"
                          : isDark
                            ? "border-gray-600 bg-gray-700 text-gray-200 [@media(hover:hover)]:hover:border-indigo-400 cursor-pointer"
                            : "border-stone-300 bg-white text-stone-700 [@media(hover:hover)]:hover:border-indigo-400 cursor-pointer"
                  }`}
                >
                  <div className="font-semibold">{entry.degree}</div>
                  <div>{label}</div>
                </button>
              );
            })}
          </div>
          {!answered && (
            <>
              <div className="flex flex-wrap justify-center gap-2">
                {noteOptions.map((choice) => {
                  const active = diatonicSelectedRoot === choice;
                  return (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => onDiatonicAnswerRootSelect(choice)}
                      className={`min-w-10 rounded-xl px-3 py-2 text-sm font-bold transition-all ${
                        active
                          ? "bg-indigo-600 text-white"
                          : isDark
                            ? "bg-gray-700 text-white [@media(hover:hover)]:hover:bg-indigo-700"
                            : "bg-white text-stone-900 border border-stone-300 [@media(hover:hover)]:hover:bg-indigo-50"
                      }`}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {(question.diatonicChordTypeOptions ?? []).map((choice) => (
                  <button
                    key={choice}
                    type="button"
                    disabled={diatonicSelectedRoot == null}
                    onClick={() => onDiatonicAnswerTypeSelect(choice)}
                    className={`rounded-xl px-3 py-2 text-sm font-bold transition-all ${
                      diatonicSelectedRoot == null ? "cursor-not-allowed opacity-50" : ""
                    } ${
                      diatonicSelectedChordType === choice
                        ? "bg-indigo-600 text-white"
                        : isDark
                          ? "bg-gray-700 text-white [@media(hover:hover)]:hover:bg-indigo-700"
                          : "bg-white text-stone-900 border border-stone-300 [@media(hover:hover)]:hover:bg-indigo-50"
                    }`}
                  >
                    {choice}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        quizType === "choice" && (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {question.choices.map((choice) => {
              let btnClass: string;
              if (mode === "scale") {
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
        )
      )}

      {quizType === "fretboard" && (
        <p
          className={`min-h-6 text-center text-sm pb-1 ${
            answered ? "text-transparent" : isDark ? "text-gray-400" : "text-stone-500"
          }`}
        >
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
              : quizType === "fretboard"
                ? t("quiz.incorrectOnly")
                : t("quiz.incorrect", { answer: question.answerLabel ?? question.correct })
            : t("quiz.correct")}
        </p>
        <div className="flex justify-center">
          {mode === "diatonic" && quizType === "all" && !answered ? (
            <button
              type="button"
              onClick={onDiatonicSubmitAll}
              disabled={!diatonicAllFilled}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                diatonicAllFilled
                  ? "bg-indigo-600 text-white hover:bg-indigo-500"
                  : isDark
                    ? "bg-gray-700 text-gray-500"
                    : "bg-stone-200 text-stone-400"
              }`}
            >
              {t("quiz.submit")}
            </button>
          ) : (
            <button
              type="button"
              onClick={mode === "scale" ? onRetryQuestion : onNextQuestion}
              disabled={!answered}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                answered
                  ? "bg-indigo-600 text-white hover:bg-indigo-500"
                  : isDark
                    ? "bg-gray-700 text-gray-500"
                    : "bg-stone-200 text-stone-400"
              }`}
            >
              {mode === "scale" ? t("quiz.retry") : t("quiz.next")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
