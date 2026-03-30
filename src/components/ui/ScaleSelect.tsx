import { useTranslation } from "react-i18next";
import "../../i18n";
import type { Theme, ScaleType } from "../../types";
import { DropdownPanelSelect } from "../ui/DropdownPanelSelect";

interface ScaleSelectProps {
  theme: Theme;
  value: ScaleType;
  onChange: (value: string) => void;
  options: { value: ScaleType; label: string }[];
  groups: { title: string; options: { value: ScaleType; label: string }[] }[];
  direction?: "down" | "up";
  disabled?: boolean;
}

export function ScaleSelect({
  theme,
  value,
  onChange,
  options,
  groups,
  direction = "down",
  disabled = false,
}: ScaleSelectProps) {
  const { t } = useTranslation();
  const selected = options.find((option) => option.value === value) ?? options[0];

  return (
    <DropdownPanelSelect
      theme={theme}
      label={selected.label}
      dialogLabel={t("scaleDialog")}
      triggerClassName="w-44"
      panelClassName="w-64"
      direction={direction}
      disabled={disabled}
    >
      {({ closePanel }) => (
        <div className="space-y-2">
          {groups.map((group) => (
            <div key={group.title} className="space-y-1">
              <div
                className={`px-2 text-xs font-semibold tracking-wide ${
                  theme === "dark" ? "text-gray-400" : "text-stone-500"
                }`}
              >
                {group.title}
              </div>
              <div className="flex flex-wrap gap-1">
                {group.options.map((option) => {
                  const active = option.value === value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        onChange(option.value);
                        closePanel();
                      }}
                      className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                        active
                          ? theme === "dark"
                            ? "border-transparent bg-sky-600 text-white"
                            : "border-transparent bg-sky-500 text-white"
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
            </div>
          ))}
        </div>
      )}
    </DropdownPanelSelect>
  );
}
