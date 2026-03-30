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
  activeClassName,
  inactiveClassName,
}: SegmentedToggleProps<T>) {
  const isDark = theme === "dark";
  const sizeClass =
    size === "compact"
      ? "px-2.5 py-1.5 rounded-full text-sm font-medium"
      : "px-4 py-1.5 rounded-full text-sm font-medium";
  const defaultInactiveClass = isDark
    ? "bg-transparent text-gray-300 hover:bg-white/6"
    : "bg-transparent text-stone-600 hover:bg-stone-200/80";
  const defaultActiveClass = isDark
    ? "bg-sky-600 text-white shadow-[0_8px_24px_-16px_rgba(2,132,199,0.55)]"
    : "bg-sky-500 text-white";

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border p-1 ${
        isDark ? "border-white/10 bg-white/5" : "border-stone-200 bg-stone-200/80"
      }`}
    >
      {options.map((option) => {
        const selected = option.value === value;
        const label = option.label ?? String(option.value);
        return (
          <button
            key={String(option.value)}
            type="button"
            onClick={() => onChange(option.value)}
            className={`${buttonWidthClass ?? ""} ${sizeClass} transform-gpu transition-all motion-safe:duration-200 motion-safe:ease-out ${
              selected
                ? (activeClassName ?? defaultActiveClass)
                : (inactiveClassName ?? defaultInactiveClass)
            } ${selected ? "motion-safe:-translate-y-px motion-safe:scale-[1.02]" : "motion-safe:scale-100"}`}
            aria-pressed={selected}
          >
            {option.icon ?? label}
          </button>
        );
      })}
    </div>
  );
}
