import { useState } from "react";
import type { Theme } from "../../types";
import { DropdownButton } from "../ui/DropdownButton";

interface QuizKindSelectProps {
  theme: Theme;
  value: string;
  options: { value: string; label: string }[];
  disabled?: boolean;
  onChange: (value: string) => void;
}

export default function QuizKindSelect({
  theme,
  value,
  options,
  disabled = false,
  onChange,
}: QuizKindSelectProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value) ?? options[0];
  const isDark = theme === "dark";

  return (
    <div className="w-56 max-w-[calc(100vw-6rem)]">
      <DropdownButton
        theme={theme}
        label={selected.label}
        open={open && !disabled}
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        ariaHaspopup="dialog"
      />

      {open && !disabled && (
        <>
          <div
            className="fixed inset-0 z-20 bg-black/30"
            onClick={(event) => {
              event.stopPropagation();
              setOpen(false);
            }}
          />
          <div className="fixed inset-0 z-30 flex items-center justify-center p-4 pointer-events-none">
            <div
              role="dialog"
              aria-label="quiz-kind-select"
              onClick={(event) => event.stopPropagation()}
              className="pointer-events-auto"
            >
              <div
                className={`w-full max-w-md overflow-hidden rounded-2xl border p-3 shadow-2xl ${
                  isDark ? "border-gray-700 bg-gray-900" : "border-stone-200 bg-white"
                }`}
              >
                <div className="grid grid-cols-2 gap-2">
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
                        className={`min-w-0 rounded-xl border px-2.5 py-3 text-left text-sm leading-tight whitespace-nowrap transition-colors ${
                          active
                            ? isDark
                              ? "border-transparent bg-sky-600 text-white"
                              : "border-transparent bg-sky-500 text-white"
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
            </div>
          </div>
        </>
      )}
    </div>
  );
}
