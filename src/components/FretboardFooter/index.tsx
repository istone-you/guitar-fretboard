import { useTranslation } from "react-i18next";
import "../../i18n";
import type { BaseLabelMode, Theme } from "../../types";

interface FretboardFooterProps {
  theme: Theme;
  baseLabelMode: BaseLabelMode;
  showQuiz: boolean;
  allNotes: string[];
  overlayNotes: string[];
  highlightedOverlayNotes: Set<string>;
  highlightedDegrees: Set<string>;
  onAutoFilter: () => void;
  onResetOrHighlightAll: () => void;
  onSetOverlayNoteHighlights: (notes: string[]) => void;
  onToggleOverlayNoteHighlight: (note: string) => void;
  onToggleDegree: (name: string) => void;
}

const DEGREE_CHIPS = [
  "P1",
  "m2",
  "M2",
  "m3",
  "M3",
  "P4",
  "b5",
  "P5",
  "m6",
  "M6",
  "m7",
  "M7",
] as const;

interface FilterChipGroupProps {
  theme: Theme;
  items: string[];
  activeItems: Set<string>;
  onToggle: (value: string) => void;
}

function FilterChipGroup({ theme, items, activeItems, onToggle }: FilterChipGroupProps) {
  return (
    <div className="flex min-h-8 flex-wrap justify-center gap-2">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onToggle(item)}
          className={`rounded-full border px-3 py-1 text-xs font-medium ${
            activeItems.has(item)
              ? theme === "dark"
                ? "border-sky-600 bg-sky-600 text-white"
                : "border-sky-500 bg-sky-500 text-white"
              : theme === "dark"
                ? "border-gray-700 bg-gray-800 text-gray-200"
                : "border-stone-300 bg-stone-50 text-stone-700"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export default function FretboardFooter({
  theme,
  baseLabelMode,
  showQuiz,
  allNotes,
  overlayNotes,
  highlightedOverlayNotes,
  highlightedDegrees,
  onAutoFilter,
  onResetOrHighlightAll,
  onSetOverlayNoteHighlights,
  onToggleOverlayNoteHighlight,
  onToggleDegree,
}: FretboardFooterProps) {
  const { t } = useTranslation();
  const hasHighlightedNotes = highlightedOverlayNotes.size > 0;
  const footerHeightClass =
    "mx-auto mt-4 w-full max-w-[840px] min-h-[6.25rem] px-3 py-3 sm:min-h-[5.75rem] sm:px-4";

  if (showQuiz) {
    return <div className={footerHeightClass} />;
  }

  return (
    <div className={footerHeightClass}>
      {baseLabelMode === "note" && (
        <>
          <div className="mb-3 flex items-center justify-center gap-2">
            <h3 className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-stone-600"}`}>
              {t("noteFilter.title")}
            </h3>
            <button
              type="button"
              onClick={() => onSetOverlayNoteHighlights(overlayNotes)}
              title={t("noteFilter.filterTitle")}
              className={`rounded-full border px-2 py-0.5 text-xs transition-all ${
                theme === "dark"
                  ? "border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-400 hover:text-gray-100"
                  : "border-stone-300 bg-white text-stone-600 hover:border-stone-400 hover:text-stone-800"
              }`}
            >
              {t("noteFilter.filter")}
            </button>
            <button
              type="button"
              onClick={() => onSetOverlayNoteHighlights(hasHighlightedNotes ? [] : allNotes)}
              className={`rounded-full border px-2 py-0.5 text-xs transition-all ${
                theme === "dark"
                  ? "border-sky-600 bg-gray-800 text-sky-400 hover:bg-sky-600/20"
                  : "border-sky-400 bg-white text-sky-600 hover:bg-sky-50"
              }`}
            >
              {hasHighlightedNotes ? t("noteFilter.reset") : t("noteFilter.highlightAll")}
            </button>
          </div>
          <FilterChipGroup
            theme={theme}
            items={allNotes}
            activeItems={highlightedOverlayNotes}
            onToggle={onToggleOverlayNoteHighlight}
          />
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
                  ? "border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-400 hover:text-gray-100"
                  : "border-stone-300 bg-white text-stone-600 hover:border-stone-400 hover:text-stone-800"
              }`}
            >
              {t("degreeFilter.filter")}
            </button>
            <button
              onClick={onResetOrHighlightAll}
              className={`rounded-full border px-2 py-0.5 text-xs transition-all ${
                theme === "dark"
                  ? "border-sky-600 bg-gray-800 text-sky-400 hover:bg-sky-600/20"
                  : "border-sky-400 bg-white text-sky-600 hover:bg-sky-50"
              }`}
            >
              {highlightedDegrees.size > 0
                ? t("degreeFilter.reset")
                : t("degreeFilter.highlightAll")}
            </button>
          </div>
          <FilterChipGroup
            theme={theme}
            items={[...DEGREE_CHIPS]}
            activeItems={highlightedDegrees}
            onToggle={onToggleDegree}
          />
        </>
      )}
    </div>
  );
}
