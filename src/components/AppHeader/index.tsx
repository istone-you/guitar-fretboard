import { useState } from "react";
import { useTranslation } from "react-i18next";
import "../../i18n";
import { changeLocale } from "../../i18n";
import type { Theme, Accidental, FretboardDisplaySize } from "../../types";
import { DropdownSelect } from "../ui/DropdownSelect";
import { SegmentedToggle } from "../ui/SegmentedToggle";

interface AppHeaderProps {
  theme: Theme;
  fretboardDisplaySize: FretboardDisplaySize;
  onFretboardDisplaySizeChange: (size: FretboardDisplaySize) => void;
  onThemeChange: () => void;
  accidental: Accidental;
  onAccidentalChange: (mode: Accidental) => void;
  showQuiz: boolean;
  setShowQuiz: (value: boolean) => void;
}

export default function AppHeader({
  theme,
  fretboardDisplaySize,
  onFretboardDisplaySizeChange,
  onThemeChange,
  accidental,
  onAccidentalChange,
  showQuiz,
  setShowQuiz,
}: AppHeaderProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [howToUseOpen, setHowToUseOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const isDark = theme === "dark";

  const fretboardDisplaySizeOptions: { value: FretboardDisplaySize; label: string }[] = [
    { value: "standard", label: t("options.displaySize.standard") },
    { value: "compact", label: t("options.displaySize.compact") },
    { value: "tiny", label: t("options.displaySize.tiny") },
  ];

  const tabs = [
    { value: false, label: t("mode.normal") },
    { value: true, label: t("mode.quiz") },
  ];

  return (
    <div className="relative mx-auto w-full max-w-[840px]">
      {/* タブナビゲーション */}
      <div className={`flex items-end border-b ${isDark ? "border-white/10" : "border-stone-200"}`}>
        {tabs.map((tab) => {
          const isActive = showQuiz === tab.value;
          return (
            <button
              key={String(tab.value)}
              type="button"
              onClick={() => setShowQuiz(tab.value)}
              className={`relative px-4 pb-2.5 pt-1 text-sm font-medium transition-colors ${
                isActive
                  ? isDark
                    ? "text-white"
                    : "text-stone-900"
                  : isDark
                    ? "text-gray-500 hover:text-gray-200"
                    : "text-stone-400 hover:text-stone-700"
              }`}
            >
              {tab.label}
              {isActive && (
                <span
                  className={`absolute bottom-0 left-0 h-0.5 w-full rounded-full ${
                    isDark ? "bg-white" : "bg-stone-800"
                  }`}
                />
              )}
            </button>
          );
        })}

        {/* 設定ボタン（右端） */}
        <div className="ml-auto pb-1.5">
          <button
            onClick={() => setSettingsOpen((prev) => !prev)}
            className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
              isDark
                ? "border-white/10 bg-white/5 text-gray-200 hover:bg-white/10 hover:text-white"
                : "border-stone-200 bg-stone-50/90 text-stone-600 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.2)] hover:border-stone-300 hover:bg-stone-100 hover:text-stone-900"
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
              className="w-4 h-4"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
      </div>

      {/* 設定パネル */}
      {settingsOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setSettingsOpen(false)} />
          <div
            className={`absolute right-0 top-[calc(100%+0.75rem)] z-50 w-72 space-y-4 rounded-[24px] border p-5 shadow-2xl backdrop-blur ${
              isDark
                ? "border-white/10 bg-gray-900/95"
                : "border-stone-200 bg-stone-50/95 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.2)]"
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

            <div className={`border-t ${isDark ? "border-white/10" : "border-stone-200"}`} />
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
                    t("howToUseItems.toggleNotes"),
                    t("howToUseItems.filterNotes"),
                    t("howToUseItems.togglePanel"),
                    t("howToUseItems.colorPicker"),
                    t("howToUseItems.switchMode"),
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
  );
}
