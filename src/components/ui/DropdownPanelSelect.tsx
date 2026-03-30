import { useRef, useState } from "react";
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
  const buttonRef = useRef<HTMLDivElement>(null);
  const isDark = theme === "dark";
  const closePanel = () => setOpen(false);

  const getPanelStyle = (): React.CSSProperties => {
    if (!buttonRef.current) return {};
    const rect = buttonRef.current.getBoundingClientRect();
    if (direction === "up") {
      return {
        position: "fixed",
        left: align === "right" ? rect.right - (buttonRef.current.offsetWidth || 0) : rect.left,
        bottom: window.innerHeight - rect.top + 8,
        zIndex: 9999,
      };
    }
    return {
      position: "fixed",
      left: align === "right" ? rect.right - (buttonRef.current.offsetWidth || 0) : rect.left,
      top: rect.bottom + 8,
      zIndex: 9999,
    };
  };

  return (
    <div ref={buttonRef} className={`relative ${triggerClassName ?? ""}`}>
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
            style={getPanelStyle()}
            className={`overflow-auto rounded-2xl border p-2 shadow-2xl backdrop-blur ${
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
