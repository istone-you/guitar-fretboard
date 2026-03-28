import { useTranslation } from "react-i18next";
import "../i18n";
import type { Accidental, BaseLabelMode, Theme } from "../types";

const NOTES_SHARP = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const NOTES_FLAT = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

interface FretboardHeaderProps {
  theme: Theme;
  rootNote: string;
  accidental: Accidental;
  baseLabelMode: BaseLabelMode;
  onBaseLabelModeChange: (mode: BaseLabelMode) => void;
  onRootNoteChange: (note: string) => void;
}

export default function FretboardHeader({
  theme,
  rootNote,
  accidental,
  baseLabelMode,
  onBaseLabelModeChange,
  onRootNoteChange,
}: FretboardHeaderProps) {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language === "en";

  const notes = accidental === "sharp" ? NOTES_SHARP : NOTES_FLAT;
  const currentIndex = notes.indexOf(rootNote);

  const step = (dir: 1 | -1) => {
    const next = (currentIndex + dir + 12) % 12;
    onRootNoteChange(notes[next]);
  };

  const btnBase = `flex items-center justify-center w-6 h-6 rounded transition-all ${
    theme === "dark"
      ? "text-gray-400 hover:text-white hover:bg-gray-700"
      : "text-stone-500 hover:text-stone-900 hover:bg-stone-200"
  }`;

  return (
    <div className="mb-2 flex flex-wrap items-center justify-center gap-6">
      <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-stone-600"}`}>
        {t("header.root")}:{" "}
        <span className="inline-flex items-center gap-1 ml-1">
          <button className={btnBase} onClick={() => step(-1)} aria-label="previous note">
            ‹
          </button>
          <span
            className={`text-base font-bold w-8 text-center ${theme === "dark" ? "text-white" : "text-stone-900"}`}
          >
            {rootNote}
          </span>
          <button className={btnBase} onClick={() => step(1)} aria-label="next note">
            ›
          </button>
        </span>
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
