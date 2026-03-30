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
      ? "border border-white/10 bg-white/[0.04] text-gray-500 cursor-not-allowed"
      : "border border-stone-200 bg-stone-100/70 text-stone-400 cursor-not-allowed"
    : open
      ? isDark
        ? "border border-white/14 bg-slate-800 text-white shadow-[0_10px_30px_-20px_rgba(15,23,42,0.75)]"
        : "border border-stone-300 bg-stone-100 text-stone-900 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.24)]"
      : isDark
        ? "border border-white/10 bg-white/[0.06] text-white shadow-[0_12px_30px_-24px_rgba(0,0,0,0.8)] hover:border-white/14 hover:bg-white/[0.08]"
        : "border border-stone-200 bg-stone-50/95 text-stone-900 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.18)] hover:border-stone-300 hover:bg-stone-100";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => !disabled && onClick()}
      className={`flex w-full items-center justify-between gap-2 rounded-2xl px-3 py-2 text-left text-sm font-medium transition-all ${cls}`}
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
