import { useTranslation } from "react-i18next";
import "../../i18n";
import type { ChordType, Theme } from "../../types";
import { DropdownPanelSelect } from "../ui/DropdownPanelSelect";

interface ChordQuizTypeSelectProps {
  theme: Theme;
  value: ChordType[];
  options: ChordType[];
  disabled?: boolean;
  onToggle: (value: ChordType) => void;
}

function getSummaryLabel(
  selectedTypes: ChordType[],
  t: (key: string, options?: Record<string, unknown>) => string,
) {
  if (selectedTypes.length === 0) return t("quiz.chordTypes.select");
  if (selectedTypes.length <= 2) return selectedTypes.join(" / ");
  return t("quiz.chordTypes.selectedCount", { count: selectedTypes.length });
}

export default function ChordQuizTypeSelect({
  theme,
  value,
  options,
  disabled = false,
  onToggle,
}: ChordQuizTypeSelectProps) {
  const { t } = useTranslation();

  return (
    <DropdownPanelSelect
      theme={theme}
      label={getSummaryLabel(value, t)}
      dialogLabel={t("quiz.chordTypes.label")}
      disabled={disabled}
      triggerClassName="w-36"
      panelClassName="w-56"
    >
      <div className="flex flex-wrap gap-1">
        {options.map((option) => {
          const active = value.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                active
                  ? "border-transparent bg-amber-500 text-white"
                  : theme === "dark"
                    ? "border-gray-600 bg-gray-800 text-gray-200 hover:border-gray-400"
                    : "border-stone-300 bg-stone-50 text-stone-700 hover:border-stone-500"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </DropdownPanelSelect>
  );
}
