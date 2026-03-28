import { useState } from "react";
import type { ReactNode } from "react";
import type { Theme } from "../../types";
import { DropdownButton } from "./DropdownButton";

interface DropdownPanelSelectProps {
  theme: Theme;
  label: string;
  dialogLabel: string;
  disabled?: boolean;
  triggerClassName?: string;
  panelClassName?: string;
  align?: "left" | "right";
  direction?: "down" | "up";
  children: ReactNode | ((args: { closePanel: () => void }) => ReactNode);
}

export function DropdownPanelSelect({
  theme,
  label,
  dialogLabel,
  disabled = false,
  triggerClassName,
  panelClassName,
  align = "left",
  direction = "down",
  children,
}: DropdownPanelSelectProps) {
  const [open, setOpen] = useState(false);
  const isDark = theme === "dark";
  const closePanel = () => setOpen(false);

  return (
    <div className={`relative ${triggerClassName ?? ""}`}>
      <DropdownButton
        theme={theme}
        label={label}
        open={open && !disabled}
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        ariaHaspopup="dialog"
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
            role="dialog"
            aria-label={dialogLabel}
            onClick={(e) => e.stopPropagation()}
            className={`absolute z-30 overflow-hidden rounded-2xl border p-2 shadow-2xl backdrop-blur ${
              direction === "up" ? "bottom-[calc(100%+0.5rem)]" : "top-[calc(100%+0.5rem)]"
            } ${align === "right" ? "right-0" : "left-0"} ${
              isDark ? "border-gray-700 bg-gray-900/95" : "border-stone-200 bg-white/95"
            } ${panelClassName ?? ""}`}
          >
            {typeof children === "function" ? children({ closePanel }) : children}
          </div>
        </>
      )}
    </div>
  );
}
