import { useState } from "react";
import { useTranslation } from "react-i18next";
import "../i18n";
import { changeLocale } from "../i18n";
import type { Theme, Accidental, FretboardDisplaySize } from "../types";

interface SettingsMenuProps {
  theme: Theme;
  fretboardDisplaySize: FretboardDisplaySize;
  onFretboardDisplaySizeChange: (size: FretboardDisplaySize) => void;
  onThemeChange: () => void;
  accidental: Accidental;
  onAccidentalChange: (mode: Accidental) => void;
  showQuiz: boolean;
  setShowQuiz: (value: boolean) => void;
}

export default function SettingsMenu({
  theme,
  fretboardDisplaySize,
  onFretboardDisplaySizeChange,
  onThemeChange,
  accidental,
  onAccidentalChange,
  showQuiz,
  setShowQuiz,
}: SettingsMenuProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [howToUseOpen, setHowToUseOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const isDark = theme === "dark";

  const fretboardDisplaySizeOptions: { value: FretboardDisplaySize; label: string }[] = [
    { value: "standard", label: t("options.displaySize.standard") },
    { value: "compact", label: t("options.displaySize.compact") },
    { value: "tiny", label: t("options.displaySize.tiny") },
  ];

  return (
    <div className="flex items-center justify-center relative max-w-[840px] mx-auto w-full">
      <div
        className={`inline-flex items-center gap-1 rounded-lg p-1 ${isDark ? "bg-gray-800" : "bg-stone-100"}`}
      >
        {(
          [
            { value: false, label: t("mode.normal") },
            { value: true, label: t("mode.quiz") },
          ] as { value: boolean; label: string }[]
        ).map(({ value, label }) => (
          <button
            key={String(value)}
            onClick={() => setShowQuiz(value)}
            className={`px-4 py-1 rounded text-sm font-semibold transition-all ${
              showQuiz === value
                ? "bg-indigo-600 text-white"
                : isDark
                  ? "text-gray-400 hover:text-white"
                  : "text-stone-500 hover:text-stone-900"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="absolute right-0">
        <button
          onClick={() => setSettingsOpen((prev) => !prev)}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            isDark ? "text-gray-200 hover:text-white" : "text-stone-600 hover:text-stone-900"
          }`}
          title={t("settings")}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>

        {settingsOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setSettingsOpen(false)} />
            <div
              className={`absolute right-0 top-[calc(100%+0.5rem)] z-50 rounded-2xl border p-4 shadow-2xl backdrop-blur w-64 space-y-4 ${
                isDark ? "border-gray-700 bg-gray-900/95" : "border-stone-200 bg-white/95"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`text-sm font-semibold ${isDark ? "text-gray-300" : "text-stone-700"}`}
                >
                  {t("displaySize")}
                </span>
                <DropdownSelect
                  theme={theme}
                  value={fretboardDisplaySize}
                  onChange={(value) => onFretboardDisplaySizeChange(value as FretboardDisplaySize)}
                  options={fretboardDisplaySizeOptions}
                  widthClass="w-28"
                />
              </div>

              {/* テーマ */}
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`text-sm font-semibold ${isDark ? "text-gray-300" : "text-stone-700"}`}
                >
                  {t("theme")}
                </span>
                <div
                  className={`inline-flex items-center gap-1 rounded-lg p-1 ${isDark ? "bg-gray-800" : "bg-stone-100"}`}
                >
                  {[
                    {
                      value: "light",
                      icon: (
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                          <circle cx="12" cy="12" r="4" />
                          <path
                            d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            fill="none"
                          />
                        </svg>
                      ),
                    },
                    {
                      value: "dark",
                      icon: (
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                      ),
                    },
                  ].map(({ value, icon }) => (
                    <button
                      key={value}
                      onClick={() => {
                        if ((value === "dark") !== isDark) onThemeChange();
                      }}
                      className={`w-10 flex items-center justify-center py-1 rounded text-sm font-semibold transition-all ${
                        (value === "dark") === isDark
                          ? "bg-indigo-600 text-white"
                          : isDark
                            ? "bg-gray-700 text-gray-100 hover:bg-gray-600"
                            : "bg-white text-stone-600 hover:bg-stone-200"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span
                  className={`text-sm font-semibold ${isDark ? "text-gray-300" : "text-stone-700"}`}
                >
                  {t("language")}
                </span>
                <div
                  className={`inline-flex items-center gap-1 rounded-lg p-1 ${isDark ? "bg-gray-800" : "bg-stone-100"}`}
                >
                  {(["ja", "en"] as const).map((value) => (
                    <button
                      key={value}
                      onClick={() => changeLocale(value)}
                      className={`w-10 px-2 py-1 rounded text-sm font-semibold transition-all ${
                        i18n.language === value
                          ? "bg-indigo-600 text-white"
                          : isDark
                            ? "bg-gray-700 text-gray-100 hover:bg-gray-600"
                            : "bg-white text-stone-600 hover:bg-stone-200"
                      }`}
                    >
                      {value.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* ♯/♭ */}
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`text-sm font-semibold ${isDark ? "text-gray-300" : "text-stone-700"}`}
                >
                  {t("accidental")}
                </span>
                <div
                  className={`inline-flex items-center gap-1 rounded-lg p-1 ${isDark ? "bg-gray-800" : "bg-stone-100"}`}
                >
                  {[
                    { value: "sharp" as Accidental, label: "♯" },
                    { value: "flat" as Accidental, label: "♭" },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => onAccidentalChange(value)}
                      className={`w-10 px-2 py-1 rounded text-sm font-semibold transition-all ${
                        accidental === value
                          ? "bg-indigo-600 text-white"
                          : isDark
                            ? "bg-gray-700 text-gray-100 hover:bg-gray-600"
                            : "bg-white text-stone-600 hover:bg-stone-200"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 使い方（折りたたみ） */}
              <div className={`border-t ${isDark ? "border-gray-700" : "border-stone-200"}`} />
              <div>
                <button
                  onClick={() => setHowToUseOpen((prev) => !prev)}
                  className={`w-full flex items-center justify-between text-sm font-semibold transition-colors ${isDark ? "text-gray-300 hover:text-white" : "text-stone-700 hover:text-stone-900"}`}
                >
                  <span>{t("howToUse")}</span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`w-4 h-4 transition-transform ${howToUseOpen ? "rotate-180" : ""}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {howToUseOpen && (
                  <ul
                    className={`mt-2 text-xs space-y-1.5 ${isDark ? "text-gray-400" : "text-stone-600"}`}
                  >
                    {[
                      t("howToUseItems.changeRoot"),
                      t("howToUseItems.switchLabels"),
                      t("howToUseItems.togglePanel"),
                      t("howToUseItems.switchMode"),
                      t("howToUseItems.toggleDegree"),
                      t("howToUseItems.filterOverlay"),
                    ].map((item) => (
                      <li key={item}>・{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export interface DropdownSelectProps {
  theme: Theme;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  accent?: "neutral" | "amber";
  disabled?: boolean;
  widthClass?: string;
  keepOpen?: boolean;
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
}: DropdownSelectProps) {
  const [open, setOpen] = useState(false);
  const isDark = theme === "dark";
  const selected = options.find((option) => option.value === value) ?? options[0];

  const buttonClass = disabled
    ? isDark
      ? "bg-gray-800 text-gray-300 border-gray-600 cursor-not-allowed"
      : "bg-stone-100 text-stone-500 border-stone-300 cursor-not-allowed"
    : isDark
      ? "bg-gray-700/90 text-white border-gray-500 hover:border-gray-300"
      : "bg-white/95 text-stone-900 border-stone-300 hover:border-stone-400";
  const openClass =
    accent === "amber"
      ? isDark
        ? "border-gray-500 bg-gray-700 text-white"
        : "border-stone-400 bg-white text-stone-900"
      : isDark
        ? "border-gray-500 bg-gray-700"
        : "border-stone-400 bg-white";
  const activeOptionClass =
    accent === "amber"
      ? "bg-amber-500 text-white"
      : isDark
        ? "bg-gray-800 text-white"
        : "bg-stone-100 text-stone-900";

  return (
    <div className={`relative ${widthClass}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border px-2.5 py-1.5 text-left text-sm font-medium shadow-sm transition-all ${
          open && !disabled ? openClass : buttonClass
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">{selected?.label}</span>
        <span
          className={`text-xs transition-transform ${open ? "rotate-180" : ""} ${
            isDark ? "text-gray-200" : "text-stone-600"
          }`}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>

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
            className={`absolute left-0 top-[calc(100%+0.5rem)] z-30 w-full overflow-hidden rounded-2xl border p-1.5 shadow-2xl backdrop-blur ${
              isDark ? "border-gray-700 bg-gray-900/95" : "border-stone-200 bg-white/95"
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
                          ? "text-gray-300 hover:bg-gray-800/80"
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
