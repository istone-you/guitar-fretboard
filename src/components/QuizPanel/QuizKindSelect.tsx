import { DropdownPanelSelect } from "../ui/DropdownPanelSelect";
import type { Theme } from "../../types";

interface QuizKindSelectProps {
  theme: Theme;
  value: string;
  options: { value: string; label: string }[];
  disabled?: boolean;
  onChange: (value: string) => void;
}

export default function QuizKindSelect({
  theme,
  value,
  options,
  disabled = false,
  onChange,
}: QuizKindSelectProps) {
  const selected = options.find((option) => option.value === value) ?? options[0];

  return (
    <DropdownPanelSelect
      theme={theme}
      label={selected.label}
      dialogLabel="quiz-kind-select"
      disabled={disabled}
      triggerClassName="w-40 max-w-[calc(100vw-6rem)]"
      panelClassName="w-[min(16rem,calc(100vw-2rem))]"
    >
      {({ closePanel }) => (
        <div className="grid grid-cols-2 gap-1">
          {options.map((option) => {
            const active = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  closePanel();
                }}
                className={`min-w-0 rounded-xl border px-2.5 py-2 text-left text-sm leading-tight whitespace-normal break-words transition-colors ${
                  active
                    ? "border-transparent bg-indigo-600 text-white"
                    : theme === "dark"
                      ? "border-gray-600 bg-gray-800 text-gray-200 hover:border-gray-400"
                      : "border-stone-300 bg-stone-50 text-stone-700 hover:border-stone-500"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </DropdownPanelSelect>
  );
}
