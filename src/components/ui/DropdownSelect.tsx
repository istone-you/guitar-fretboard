import { useState } from "react";
import type { Theme } from "../../types";
import { DropdownButton } from "./DropdownButton";

export interface DropdownSelectProps {
  theme: Theme;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  accent?: "neutral" | "amber" | "sky";
  disabled?: boolean;
  widthClass?: string;
  keepOpen?: boolean;
  direction?: "down" | "up";
  align?: "start" | "end";
}

export function DropdownSelect({
  theme,
  value,
  onChange,
  options,
  accent = "neutral",
  disabled = false,
  widthClass = "w-32",
  keepOpen = false,
  direction = "down",
  align = "start",
}: DropdownSelectProps) {
  const [open, setOpen] = useState(false);
  const isDark = theme === "dark";
  const selected = options.find((option) => option.value === value) ?? options[0];

  const activeOptionClass =
    accent === "amber"
      ? "bg-amber-500 text-white"
      : accent === "sky"
        ? isDark
          ? "bg-sky-600 text-white"
          : "bg-sky-500 text-white"
        : isDark
          ? "bg-slate-800 text-white"
          : "bg-stone-100 text-stone-900";

  return (
    <div className={`relative ${widthClass}`}>
      <DropdownButton
        theme={theme}
        label={selected?.label ?? ""}
        open={open && !disabled}
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        ariaHaspopup="listbox"
      />

      {open && !disabled && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          />
          <div
            onClick={(e) => e.stopPropagation()}
            className={`absolute z-30 overflow-hidden rounded-[20px] border p-1.5 shadow-2xl backdrop-blur ${
              direction === "up" ? "bottom-[calc(100%+0.5rem)]" : "top-[calc(100%+0.5rem)]"
            } ${align === "end" ? "right-0" : "left-0"} ${
              isDark
                ? "border-white/8 bg-gray-900/95"
                : "border-stone-200 bg-stone-50/95 shadow-[0_20px_60px_-32px_rgba(15,23,42,0.24)]"
            }`}
          >
            <div role="listbox" className="space-y-1">
              {options.map((option) => {
                const active = option.value === value;
                return (
                  <button
                    key={String(option.value)}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      if (!keepOpen) setOpen(false);
                    }}
                    className={`flex w-full items-center rounded-xl px-3 py-2 text-sm transition-colors ${
                      active
                        ? activeOptionClass
                        : isDark
                          ? "text-gray-300 hover:bg-white/[0.06]"
                          : "text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    <span>{option.label}</span>
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
