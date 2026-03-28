import { useState } from "react";
import { useTranslation } from "react-i18next";
import "../../i18n";
import { changeLocale } from "../../i18n";
import type { Theme, Accidental, FretboardDisplaySize } from "../../types";
import { DropdownSelect } from "../ui/DropdownSelect";
import { SegmentedToggle } from "../ui/SegmentedToggle";

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
      <SegmentedToggle
        theme={theme}
        value={showQuiz}
        onChange={setShowQuiz}
        options={[
          { value: false, label: t("mode.normal") },
          { value: true, label: t("mode.quiz") },
        ]}
        activeClassName="bg-indigo-600 text-white"
        inactiveClassName={
          isDark ? "text-gray-400 hover:text-white" : "text-stone-500 hover:text-stone-900"
        }
      />
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
                <SegmentedToggle
                  theme={theme}
                  value={theme}
                  onChange={(value) => {
                    if (value !== theme) onThemeChange();
                  }}
                  options={[
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
                  ]}
                  size="compact"
                  buttonWidthClass="w-10 flex items-center justify-center"
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <span
                  className={`text-sm font-semibold ${isDark ? "text-gray-300" : "text-stone-700"}`}
                >
                  {t("language")}
                </span>
                <SegmentedToggle
                  theme={theme}
                  value={i18n.language as "ja" | "en"}
                  onChange={(value) => changeLocale(value)}
                  options={[
                    { value: "ja", label: "JA" },
                    { value: "en", label: "EN" },
                  ]}
                  size="compact"
                  buttonWidthClass="w-10"
                />
              </div>

              {/* ♯/♭ */}
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`text-sm font-semibold ${isDark ? "text-gray-300" : "text-stone-700"}`}
                >
                  {t("accidental")}
                </span>
                <SegmentedToggle
                  theme={theme}
                  value={accidental}
                  onChange={onAccidentalChange}
                  options={[
                    { value: "sharp" as Accidental, label: "♯" },
                    { value: "flat" as Accidental, label: "♭" },
                  ]}
                  size="compact"
                  buttonWidthClass="w-10"
                />
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
