import type { ReactNode } from "react";
import type { Theme } from "../../types";

interface LayerRowProps {
  label: string;
  color: string;
  active: boolean;
  onToggle: () => void;
  theme: Theme;
  children?: ReactNode;
}

export function LayerRow({ label, color, active, onToggle, theme, children }: LayerRowProps) {
  const isDark = theme === "dark";

  return (
    <div
      className={`w-full rounded-lg px-4 py-3 transition-opacity cursor-pointer ${
        isDark ? "bg-gray-800" : "bg-stone-100"
      } ${active ? "opacity-100" : "opacity-45"}`}
      onClick={(e) => {
        if (!active) {
          onToggle();
          return;
        }
        if (!(e.target as HTMLElement).closest('button, [role="listbox"], [role="option"]'))
          onToggle();
      }}
    >
      <div className="flex flex-col gap-2 sm:relative sm:flex-row sm:items-center">
        <span
          className={`self-center sm:absolute sm:left-0 text-xs font-bold px-2 py-0.5 rounded-full ${active ? `${color} text-white` : isDark ? "bg-gray-700 text-gray-100" : "bg-stone-200 text-stone-700"}`}
        >
          {label}
        </span>
        <div
          className={`w-full flex flex-wrap gap-3 items-center justify-center ${!active ? "pointer-events-none" : ""}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
