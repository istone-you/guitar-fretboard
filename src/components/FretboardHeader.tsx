import { useTranslation } from "react-i18next";
import "../i18n";
import type { Accidental, BaseLabelMode, Theme } from "../types";

const NOTES_SHARP = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const NOTES_FLAT = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const FRET_MAX = 14;

interface FretboardHeaderProps {
  theme: Theme;
  rootNote: string;
  accidental: Accidental;
  baseLabelMode: BaseLabelMode;
  fretRange: [number, number];
  onBaseLabelModeChange: (mode: BaseLabelMode) => void;
  onRootNoteChange: (note: string) => void;
  onFretRangeChange: (range: [number, number]) => void;
}

export default function FretboardHeader({
  theme,
  rootNote,
  accidental,
  baseLabelMode,
  fretRange,
  onBaseLabelModeChange,
  onRootNoteChange,
  onFretRangeChange,
}: FretboardHeaderProps) {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language === "en";

  const notes = accidental === "sharp" ? NOTES_SHARP : NOTES_FLAT;
  const currentIndex = notes.indexOf(rootNote);

  const stepNote = (dir: 1 | -1) => {
    const next = (currentIndex + dir + 12) % 12;
    onRootNoteChange(notes[next]);
  };

  const stepFret = (side: "min" | "max", dir: 1 | -1) => {
    const [min, max] = fretRange;
    if (side === "min") {
      const next = min + dir;
      if (next >= 0 && next < max) onFretRangeChange([next, max]);
    } else {
      const next = max + dir;
      if (next > min && next <= FRET_MAX) onFretRangeChange([min, next]);
    }
  };

  const btnBase = `flex items-center justify-center min-w-[2.75rem] h-11 px-2 rounded transition-all text-lg ${
    theme === "dark"
      ? "text-gray-400 hover:text-white active:bg-gray-700"
      : "text-stone-500 hover:text-stone-900 active:bg-stone-200"
  }`;

  const Stepper = ({
    value,
    onPrev,
    onNext,
    width = "w-6",
  }: {
    value: number | string;
    onPrev: () => void;
    onNext: () => void;
    width?: string;
  }) => (
    <span className="inline-flex items-center">
      <button className={btnBase} onClick={onPrev}>
        ‹
      </button>
      <span
        className={`text-base font-bold ${width} text-center ${theme === "dark" ? "text-white" : "text-stone-900"}`}
      >
        {value}
      </span>
      <button className={btnBase} onClick={onNext}>
        ›
      </button>
    </span>
  );

  return (
    <div className="mb-2 flex flex-wrap items-center justify-center gap-6">
      <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-stone-600"}`}>
        {t("header.root")}:{" "}
        <Stepper
          value={rootNote}
          width="w-8"
          onPrev={() => stepNote(-1)}
          onNext={() => stepNote(1)}
        />
      </span>
      <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-stone-600"}`}>
        {t("header.fret")}:{" "}
        <Stepper
          value={fretRange[0]}
          onPrev={() => stepFret("min", -1)}
          onNext={() => stepFret("min", 1)}
        />
        <span className={`mx-1 ${theme === "dark" ? "text-gray-500" : "text-stone-400"}`}>〜</span>
        <Stepper
          value={fretRange[1]}
          onPrev={() => stepFret("max", -1)}
          onNext={() => stepFret("max", 1)}
        />
      </span>
      <div
        className={`inline-flex items-center gap-2 rounded-lg p-1 ${
          theme === "dark" ? "bg-gray-800" : "bg-stone-100"
        }`}
      >
        {[
          { value: "note" as BaseLabelMode, label: t("header.note") },
          { value: "degree" as BaseLabelMode, label: t("header.degree") },
        ].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onBaseLabelModeChange(value)}
            className={`${isEnglish ? "min-w-[4rem]" : "w-[4rem]"} whitespace-nowrap rounded px-2.5 py-1 text-sm font-semibold transition-all ${
              baseLabelMode === value
                ? "bg-indigo-600 text-white"
                : theme === "dark"
                  ? "bg-gray-700 text-gray-400 hover:bg-gray-600"
                  : "bg-white text-stone-600 hover:bg-stone-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
