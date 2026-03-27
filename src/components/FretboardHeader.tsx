import type { BaseLabelMode, Theme } from "../types";

interface FretboardHeaderProps {
  theme: Theme;
  rootNote: string;
  baseLabelMode: BaseLabelMode;
  onBaseLabelModeChange: (mode: BaseLabelMode) => void;
}

export default function FretboardHeader({
  theme,
  rootNote,
  baseLabelMode,
  onBaseLabelModeChange,
}: FretboardHeaderProps) {
  return (
    <div className="mb-2 flex flex-wrap items-center justify-center gap-3">
      <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-stone-600"}`}>
        ルート:{" "}
        <span
          className={`text-base font-bold ${theme === "dark" ? "text-white" : "text-stone-900"}`}
        >
          {rootNote}
        </span>
      </span>
      <div
        className={`inline-flex items-center gap-2 rounded-lg p-1 ${
          theme === "dark" ? "bg-gray-800" : "bg-stone-100"
        }`}
      >
        <span
          className={`w-12 px-2 text-sm font-semibold ${
            theme === "dark" ? "text-gray-300" : "text-stone-700"
          }`}
        >
          表示
        </span>
        {[
          { value: "note" as BaseLabelMode, label: "音名" },
          { value: "degree" as BaseLabelMode, label: "度数" },
        ].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onBaseLabelModeChange(value)}
            className={`w-[4rem] whitespace-nowrap rounded px-2.5 py-1 text-sm font-semibold transition-all ${
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
