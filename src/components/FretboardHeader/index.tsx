import { useTranslation } from "react-i18next";
import "../../i18n";
import type { Accidental, BaseLabelMode, Theme } from "../../types";
import { SegmentedToggle } from "../ui/SegmentedToggle";
import { NOTES_SHARP, NOTES_FLAT } from "../../logic/fretboard";

interface StepperProps {
  value: number | string;
  onPrev: () => void;
  onNext: () => void;
  theme: Theme;
  disabled?: boolean;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  width?: string;
}

function Stepper({
  value,
  onPrev,
  onNext,
  theme,
  disabled = false,
  prevDisabled = false,
  nextDisabled = false,
  width = "w-6",
}: StepperProps) {
  const btnBase = `flex h-11 min-w-[2.75rem] items-center justify-center rounded-full px-2 transition-all text-lg ${
    theme === "dark"
      ? "text-gray-400 hover:bg-white/8 hover:text-white active:bg-white/10"
      : "text-stone-500 hover:bg-white hover:text-stone-900 active:bg-stone-100"
  }`;
  const disabledClass = "opacity-40 pointer-events-none cursor-not-allowed";

  const isPrevDisabled = disabled || prevDisabled;
  const isNextDisabled = disabled || nextDisabled;

  return (
    <span className="inline-flex items-center">
      <button
        className={`${btnBase} ${isPrevDisabled ? disabledClass : ""}`}
        onClick={isPrevDisabled ? undefined : onPrev}
        disabled={isPrevDisabled}
      >
        ‹
      </button>
      <span
        className={`text-sm sm:text-base font-bold ${width} text-center ${
          disabled
            ? theme === "dark"
              ? "text-gray-500"
              : "text-stone-400"
            : theme === "dark"
              ? "text-white"
              : "text-stone-900"
        }`}
      >
        {value}
      </span>
      <button
        className={`${btnBase} ${isNextDisabled ? disabledClass : ""}`}
        onClick={isNextDisabled ? undefined : onNext}
        disabled={isNextDisabled}
      >
        ›
      </button>
    </span>
  );
}

interface FretboardHeaderProps {
  theme: Theme;
  rootNote: string;
  accidental: Accidental;
  baseLabelMode: BaseLabelMode;
  showQuiz: boolean;
  rootChangeDisabled?: boolean;
  onBaseLabelModeChange: (mode: BaseLabelMode) => void;
  onRootNoteChange: (note: string) => void;
}

export default function FretboardHeader({
  theme,
  rootNote,
  accidental,
  baseLabelMode,
  showQuiz,
  rootChangeDisabled = false,
  onBaseLabelModeChange,
  onRootNoteChange,
}: FretboardHeaderProps) {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language === "en";

  const notes: string[] = [...(accidental === "sharp" ? NOTES_SHARP : NOTES_FLAT)];
  const currentIndex = notes.indexOf(rootNote);

  const stepNote = (dir: 1 | -1) => {
    const next = (currentIndex + dir + 12) % 12;
    onRootNoteChange(notes[next]);
  };

  return (
    <div className="mx-auto mb-1 flex w-full max-w-[840px] flex-wrap items-center justify-center gap-x-3 gap-y-2 px-3 py-2.5 sm:mb-2 sm:gap-6 sm:px-4">
      <span
        className={`inline-flex items-center gap-1 text-xs sm:text-sm ${
          theme === "dark" ? "text-gray-400" : "text-stone-600"
        }`}
      >
        {t("header.root")}:{" "}
        <Stepper
          theme={theme}
          value={rootNote}
          width="w-8"
          disabled={rootChangeDisabled}
          onPrev={() => stepNote(-1)}
          onNext={() => stepNote(1)}
        />
      </span>
      {!showQuiz && (
        <SegmentedToggle
          theme={theme}
          value={baseLabelMode}
          onChange={onBaseLabelModeChange}
          options={[
            { value: "note" as BaseLabelMode, label: t("header.note") },
            { value: "degree" as BaseLabelMode, label: t("header.degree") },
          ]}
          size="compact"
          buttonWidthClass={`${isEnglish ? "min-w-[4rem]" : "w-[4rem]"} whitespace-nowrap`}
        />
      )}
    </div>
  );
}
