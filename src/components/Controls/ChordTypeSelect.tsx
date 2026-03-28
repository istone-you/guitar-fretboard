import { useState } from "react";
import { useTranslation } from "react-i18next";
import "../../i18n";
import type { Theme, ChordType } from "../../types";
import { DropdownButton } from "../ui/DropdownButton";

interface ChordTypeSelectProps {
  theme: Theme;
  value: ChordType;
  onChange: (value: string) => void;
  options: { value: ChordType; label: string }[];
}

export function ChordTypeSelect({ theme, value, onChange, options }: ChordTypeSelectProps) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const isDark = theme === "dark";
  const selected = options.find((option) => option.value === value) ?? options[0];

  return (
    <div className="relative w-36">
      <DropdownButton
        theme={theme}
        label={selected.label}
        open={open}
        onClick={() => setOpen((prev) => !prev)}
        ariaHaspopup="dialog"
      />

      {open && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          />
          <div
            role="dialog"
            aria-label={t("controls.chordType")}
            onClick={(e) => e.stopPropagation()}
            className={`absolute left-0 top-[calc(100%+0.5rem)] z-30 w-48 overflow-hidden rounded-2xl border p-2 shadow-2xl backdrop-blur ${
              isDark ? "border-gray-700 bg-gray-900/95" : "border-stone-200 bg-white/95"
            }`}
          >
            <div className="flex flex-wrap gap-1">
              {options.map((option) => {
                const active = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                      active
                        ? "border-transparent bg-amber-500 text-white"
                        : isDark
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
        </>
      )}
    </div>
  );
}
