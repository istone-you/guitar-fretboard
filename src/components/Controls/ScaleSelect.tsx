import { useState } from "react";
import { useTranslation } from "react-i18next";
import "../../i18n";
import type { Theme, ScaleType } from "../../types";
import { DropdownButton } from "../ui/DropdownButton";

interface ScaleSelectProps {
  theme: Theme;
  value: ScaleType;
  onChange: (value: string) => void;
  options: { value: ScaleType; label: string }[];
  groups: { title: string; options: { value: ScaleType; label: string }[] }[];
}

export function ScaleSelect({ theme, value, onChange, options, groups }: ScaleSelectProps) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const isDark = theme === "dark";
  const selected = options.find((option) => option.value === value) ?? options[0];

  return (
    <div className="relative w-44">
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
            aria-label={t("scaleDialog")}
            onClick={(e) => e.stopPropagation()}
            className={`absolute left-0 top-[calc(100%+0.5rem)] z-30 w-64 overflow-hidden rounded-2xl border p-2 shadow-2xl backdrop-blur ${
              isDark ? "border-gray-700 bg-gray-900/95" : "border-stone-200 bg-white/95"
            }`}
          >
            <div className="space-y-2">
              {groups.map((group) => (
                <div key={group.title} className="space-y-1">
                  <div
                    className={`px-2 text-xs font-semibold tracking-wide ${
                      isDark ? "text-gray-400" : "text-stone-500"
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
                            setOpen(false);
                          }}
                          className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                            active
                              ? isDark
                                ? "border-transparent bg-emerald-600 text-white"
                                : "border-transparent bg-emerald-600 text-white"
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
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
