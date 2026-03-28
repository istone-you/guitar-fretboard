import { useTranslation } from "react-i18next";
import "../../i18n";
import type { BaseLabelMode, Theme } from "../../types";

interface FretboardFooterProps {
  theme: Theme;
  baseLabelMode: BaseLabelMode;
  showQuiz: boolean;
  overlayNotes: string[];
  hiddenDegrees: Set<string>;
  onAutoFilter: () => void;
  onResetOrHideAll: () => void;
  onToggleDegree: (name: string) => void;
}

const DEGREE_CHIPS = [
  ["P1", "#ef4444"],
  ["m2", "#ec4899"],
  ["M2", "#84cc16"],
  ["m3", "#a855f7"],
  ["M3", "#22c55e"],
  ["P4", "#06b6d4"],
  ["b5", "#6b7280"],
  ["P5", "#3b82f6"],
  ["m6", "#8b5cf6"],
  ["M6", "#10b981"],
  ["m7", "#f97316"],
  ["M7", "#f59e0b"],
] as const;

export default function FretboardFooter({
  theme,
  baseLabelMode,
  showQuiz,
  overlayNotes,
  hiddenDegrees,
  onAutoFilter,
  onResetOrHideAll,
  onToggleDegree,
}: FretboardFooterProps) {
  const { t } = useTranslation();

  if (showQuiz) {
    return <div className="mt-4 min-h-[5.75rem]" />;
  }

  return (
    <div className="mt-4 min-h-[5.75rem]">
      {baseLabelMode === "note" && overlayNotes.length > 0 && (
        <>
          <div className="mb-3 flex items-center justify-center gap-2">
            <h3 className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-stone-600"}`}>
              {t("overlayNotes.title")}
            </h3>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {overlayNotes.map((note) => (
              <span
                key={note}
                className={`rounded-full border px-3 py-1 text-xs font-medium ${
                  theme === "dark"
                    ? "border-gray-700 bg-gray-800 text-gray-200"
                    : "border-stone-300 bg-stone-50 text-stone-700"
                }`}
              >
                {note}
              </span>
            ))}
          </div>
        </>
      )}

      {baseLabelMode === "degree" && (
        <>
          <div className="mb-3 flex items-center justify-center gap-2">
            <h3 className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-stone-600"}`}>
              {t("degreeFilter.title")}
            </h3>
            <button
              onClick={onAutoFilter}
              title={t("degreeFilter.filterTitle")}
              className={`rounded-full border px-2 py-0.5 text-xs transition-all ${
                theme === "dark"
                  ? "border-gray-600 text-gray-400 hover:border-gray-400 hover:text-gray-200"
                  : "border-stone-300 text-stone-500 hover:border-stone-500 hover:text-stone-700"
              }`}
            >
              {t("degreeFilter.filter")}
            </button>
            <button
              onClick={onResetOrHideAll}
              className={`rounded-full border px-2 py-0.5 text-xs transition-all ${
                theme === "dark"
                  ? "border-indigo-500 text-indigo-400 hover:bg-indigo-500/20"
                  : "border-indigo-400 text-indigo-500 hover:bg-indigo-50"
              }`}
            >
              {hiddenDegrees.size > 0 ? t("degreeFilter.reset") : t("degreeFilter.hideAll")}
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {DEGREE_CHIPS.map(([name, color]) => {
              const hidden = hiddenDegrees.has(name);
              return (
                <div
                  key={name}
                  className="flex cursor-pointer select-none items-center gap-1"
                  style={{ opacity: hidden ? 0.3 : 1 }}
                  onClick={() => onToggleDegree(name)}
                >
                  <div className="h-6 w-6 rounded-full" style={{ backgroundColor: color }} />
                  <span
                    className={`text-xs ${theme === "dark" ? "text-gray-300" : "text-stone-700"}`}
                  >
                    {name}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
