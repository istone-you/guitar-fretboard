import type { Theme } from "../../types";

export interface DropdownButtonProps {
  theme: Theme;
  label: string;
  open: boolean;
  disabled?: boolean;
  onClick: () => void;
  ariaHaspopup?: "listbox" | "dialog";
}

export function DropdownButton({
  theme,
  label,
  open,
  disabled = false,
  onClick,
  ariaHaspopup = "listbox",
}: DropdownButtonProps) {
  const isDark = theme === "dark";
  const cls = disabled
    ? isDark
      ? "border border-gray-700 bg-gray-900 text-gray-500 cursor-not-allowed"
      : "border border-stone-200 bg-stone-50 text-stone-400 cursor-not-allowed"
    : open
      ? isDark
        ? "border border-gray-400 bg-gray-600 text-white shadow-sm"
        : "border border-stone-300 bg-white text-stone-900 shadow-sm"
      : isDark
        ? "border border-gray-500 bg-gray-700 text-white shadow-sm hover:border-gray-400 hover:bg-gray-600"
        : "border border-stone-300 bg-white text-stone-900 shadow-sm hover:border-stone-400 hover:bg-stone-50";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => !disabled && onClick()}
      className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm font-medium transition-all ${cls}`}
      aria-haspopup={ariaHaspopup}
      aria-expanded={open}
    >
      <span className="truncate">{label}</span>
      <span
        className={`text-xs transition-transform ${open ? "rotate-180" : ""} ${isDark ? "text-gray-200" : "text-stone-600"}`}
        aria-hidden="true"
      >
        ▾
      </span>
    </button>
  );
}
