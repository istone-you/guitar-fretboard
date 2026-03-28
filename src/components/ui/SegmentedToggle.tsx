import type { ReactNode } from "react";
import type { Theme } from "../../types";

interface SegmentedToggleOption<T extends string | boolean> {
  value: T;
  label?: string;
  icon?: ReactNode;
}

interface SegmentedToggleProps<T extends string | boolean> {
  theme: Theme;
  value: T;
  onChange: (value: T) => void;
  options: SegmentedToggleOption<T>[];
  size?: "default" | "compact";
  buttonWidthClass?: string;
  activeClassName?: string;
  inactiveClassName?: string;
}

export function SegmentedToggle<T extends string | boolean>({
  theme,
  value,
  onChange,
  options,
  size = "default",
  buttonWidthClass,
  activeClassName = "bg-indigo-600 text-white",
  inactiveClassName,
}: SegmentedToggleProps<T>) {
  const isDark = theme === "dark";
  const sizeClass =
    size === "compact"
      ? "px-2 py-1 rounded text-sm font-semibold"
      : "px-4 py-1 rounded text-sm font-semibold";
  const defaultInactiveClass = isDark
    ? "bg-gray-700 text-gray-100 hover:bg-gray-600"
    : "bg-white text-stone-600 hover:bg-stone-200";

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-lg p-1 ${isDark ? "bg-gray-800" : "bg-stone-100"}`}
    >
      {options.map((option) => {
        const selected = option.value === value;
        const label = option.label ?? String(option.value);
        return (
          <button
            key={String(option.value)}
            type="button"
            onClick={() => onChange(option.value)}
            className={`${buttonWidthClass ?? ""} ${sizeClass} transition-all ${
              selected ? activeClassName : (inactiveClassName ?? defaultInactiveClass)
            }`}
            aria-pressed={selected}
          >
            {option.icon ?? label}
          </button>
        );
      })}
    </div>
  );
}
