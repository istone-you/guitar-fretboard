import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import "../i18n";
import {
  NOTES_SHARP,
  NOTES_FLAT,
  CAGED_FORMS,
  CAGED_ORDER,
  DIATONIC_CHORDS,
  TRIAD_STRING_SET_OPTIONS,
  TRIAD_INVERSION_OPTIONS,
  getDiatonicChord,
  getRootIndex,
} from "../logic/fretboard";
import { DropdownSelect } from "./SettingsMenu";
import type { Theme, Accidental, ChordDisplayMode, ScaleType, ChordType } from "../types";

const CHORD_TYPES: ChordType[] = [
  "Major",
  "Minor",
  "7th",
  "maj7",
  "m7",
  "m7(b5)",
  "dim7",
  "m(maj7)",
  "sus2",
  "sus4",
  "6",
  "m6",
  "dim",
  "aug",
];
const TRIAD_CHORD_TYPES = ["Major", "Minor", "Diminished", "Augmented"];

interface ControlsProps {
  theme: Theme;
  rootNote: string;
  accidental: Accidental;
  showChord: boolean;
  setShowChord: (value: boolean) => void;
  chordDisplayMode: ChordDisplayMode;
  setChordDisplayMode: (value: string) => void;
  showScale: boolean;
  setShowScale: (value: boolean) => void;
  scaleType: ScaleType;
  setScaleType: (value: string) => void;
  showCaged: boolean;
  setShowCaged: (value: boolean) => void;
  cagedForms: Set<string>;
  toggleCagedForm: (key: string) => void;
  chordType: ChordType;
  setChordType: (value: string) => void;
  triadStringSet: string;
  setTriadStringSet: (value: string) => void;
  triadInversion: string;
  setTriadInversion: (value: string) => void;
  diatonicKeyType: string;
  setDiatonicKeyType: (value: string) => void;
  diatonicChordSize: string;
  setDiatonicChordSize: (value: string) => void;
  diatonicDegree: string;
  setDiatonicDegree: (value: string) => void;
  showQuiz: boolean;
}

export default function Controls({
  theme,
  rootNote,
  accidental,
  showChord,
  setShowChord,
  chordDisplayMode,
  setChordDisplayMode,
  showScale,
  setShowScale,
  scaleType,
  setScaleType,
  showCaged,
  setShowCaged,
  cagedForms,
  toggleCagedForm,
  chordType,
  setChordType,
  triadStringSet,
  setTriadStringSet,
  triadInversion,
  setTriadInversion,
  diatonicKeyType,
  setDiatonicKeyType,
  diatonicChordSize,
  setDiatonicChordSize,
  diatonicDegree,
  setDiatonicDegree,
  showQuiz,
}: ControlsProps) {
  const { t } = useTranslation();

  const isDark = theme === "dark";
  const NOTES = accidental === "sharp" ? NOTES_SHARP : NOTES_FLAT;
  const chordDisplayOptions: { value: ChordDisplayMode; label: string }[] = [
    { value: "form", label: t("options.chordDisplayMode.form") },
    { value: "power", label: t("options.chordDisplayMode.power") },
    { value: "triad", label: t("options.chordDisplayMode.triad") },
    { value: "diatonic", label: t("options.chordDisplayMode.diatonic") },
  ];
  const diatonicKeyOptions = [
    { value: "major", label: t("options.diatonicKey.major") },
    { value: "natural-minor", label: t("options.diatonicKey.naturalMinor") },
  ];
  const diatonicChordSizeOptions = [
    { value: "triad", label: t("options.diatonicChordSize.triad") },
    { value: "seventh", label: t("options.diatonicChordSize.seventh") },
  ];
  const scaleOptions: { value: ScaleType; label: string }[] = [
    { value: "major", label: t("options.scale.major") },
    { value: "natural-minor", label: t("options.scale.naturalMinor") },
    { value: "major-penta", label: t("options.scale.majorPenta") },
    { value: "minor-penta", label: t("options.scale.minorPenta") },
    { value: "blues", label: t("options.scale.blues") },
    { value: "harmonic-minor", label: t("options.scale.harmonicMinor") },
    { value: "melodic-minor", label: t("options.scale.melodicMinor") },
    { value: "ionian", label: t("options.scale.ionian") },
    { value: "dorian", label: t("options.scale.dorian") },
    { value: "phrygian", label: t("options.scale.phrygian") },
    { value: "lydian", label: t("options.scale.lydian") },
    { value: "mixolydian", label: t("options.scale.mixolydian") },
    { value: "aeolian", label: t("options.scale.aeolian") },
    { value: "locrian", label: t("options.scale.locrian") },
  ];
  const triadStringOptions = TRIAD_STRING_SET_OPTIONS.map(({ value }) => ({
    value,
    label: t(`options.triadStrings.${value}`),
  }));
  const triadInversionOptions = TRIAD_INVERSION_OPTIONS.map(({ value }) => ({
    value,
    label: t(`options.triadInversions.${value}`),
  }));
  const scaleGroups = [
    {
      title: t("scaleGroups.basics"),
      options: scaleOptions.filter((option) =>
        ["major", "natural-minor", "major-penta", "minor-penta", "blues"].includes(option.value),
      ),
    },
    {
      title: t("scaleGroups.minorDerived"),
      options: scaleOptions.filter((option) =>
        ["harmonic-minor", "melodic-minor"].includes(option.value),
      ),
    },
    {
      title: t("scaleGroups.modes"),
      options: scaleOptions.filter((option) =>
        ["ionian", "dorian", "phrygian", "lydian", "mixolydian", "aeolian", "locrian"].includes(
          option.value,
        ),
      ),
    },
  ];
  const rootIndex = getRootIndex(rootNote);
  const diatonicScaleType = `${diatonicKeyType}-${diatonicChordSize}`;
  const diatonicCodeOptions = DIATONIC_CHORDS[diatonicScaleType].map(({ value }) => {
    const chord = getDiatonicChord(rootIndex, diatonicScaleType, value);
    const suffixMap: Record<string, string> = {
      Major: "",
      Minor: "m",
      "7th": "7",
      maj7: "maj7",
      m7: "m7",
      "m7(b5)": "m7(b5)",
      dim7: "dim",
      "m(maj7)": "m(maj7)",
    };
    return {
      value,
      label: `${value} (${NOTES[chord.rootIndex]}${suffixMap[chord.chordType] ?? chord.chordType})`,
    };
  });

  return (
    <div
      className={`space-y-4 pt-4 max-w-[840px] mx-auto ${isDark ? "text-white" : "text-stone-900"}`}
    >
      {!showQuiz && (
        <div className="space-y-3">
          <LayerRow
            label={t("layers.scale")}
            color="bg-emerald-600"
            active={showScale}
            theme={theme}
            onToggle={() => setShowScale(!showScale)}
          >
            <div className="flex flex-wrap gap-2 items-center">
              <ScaleSelect
                theme={theme}
                value={scaleType}
                onChange={setScaleType}
                options={scaleOptions}
                groups={scaleGroups}
              />
            </div>
          </LayerRow>

          <LayerRow
            label={t("layers.caged")}
            color="bg-indigo-500"
            active={showCaged}
            theme={theme}
            onToggle={() => setShowCaged(!showCaged)}
          >
            <div className="flex flex-wrap gap-2 items-center">
              <div className="flex flex-wrap gap-2 items-center">
                {CAGED_ORDER.map((key) => {
                  const active = cagedForms.has(key);
                  return (
                    <button
                      key={key}
                      onClick={() => toggleCagedForm(key)}
                      className={`w-9 h-9 rounded-full text-sm font-bold transition-all border-2
                      ${
                        active
                          ? "text-white border-transparent scale-110 shadow-lg"
                          : isDark
                            ? "bg-gray-700 text-gray-100 border-gray-500 hover:border-gray-300"
                            : "bg-white text-stone-600 border-stone-300 hover:border-stone-500"
                      }`}
                      style={active ? { backgroundColor: CAGED_FORMS[key].color } : {}}
                    >
                      {key}
                    </button>
                  );
                })}
              </div>
            </div>
          </LayerRow>

          <LayerRow
            label={t("layers.chord")}
            color="bg-amber-500"
            active={showChord}
            theme={theme}
            onToggle={() => setShowChord(!showChord)}
          >
            <div className="flex flex-wrap gap-3 items-center justify-center">
              <div className="flex flex-col gap-1 items-center sm:items-start">
                <span
                  className={`text-center sm:text-left text-xs ${isDark ? "text-gray-200" : "text-stone-600"}`}
                >
                  {t("controls.displayMode")}
                </span>
                <DropdownSelect
                  theme={theme}
                  value={chordDisplayMode}
                  onChange={setChordDisplayMode}
                  options={chordDisplayOptions}
                  accent="amber"
                  widthClass="w-36"
                />
              </div>

              <div className="flex flex-col gap-1 items-center sm:items-start">
                <span
                  className={`pl-1 text-xs ${isDark ? "text-gray-200" : "text-stone-600"} ${chordDisplayMode === "power" ? "invisible" : ""}`}
                >
                  {chordDisplayMode === "diatonic" ? t("controls.degree") : t("controls.chord")}
                </span>
                {chordDisplayMode === "form" ? (
                  <ChordTypeSelect
                    theme={theme}
                    value={chordType}
                    onChange={setChordType}
                    options={CHORD_TYPES.map((chord) => ({
                      value: chord,
                      label: chord,
                    }))}
                  />
                ) : (
                  <DropdownSelect
                    theme={theme}
                    value={
                      chordDisplayMode === "triad"
                        ? chordType
                        : chordDisplayMode === "diatonic"
                          ? diatonicDegree
                          : ""
                    }
                    onChange={chordDisplayMode === "diatonic" ? setDiatonicDegree : setChordType}
                    options={
                      chordDisplayMode === "triad"
                        ? TRIAD_CHORD_TYPES.map((chord) => ({
                            value: chord,
                            label: chord,
                          }))
                        : chordDisplayMode === "diatonic"
                          ? diatonicCodeOptions
                          : [{ value: "", label: "--" }]
                    }
                    disabled={chordDisplayMode === "power"}
                    accent="amber"
                    widthClass="w-36"
                  />
                )}
              </div>

              <div className="flex flex-col gap-1 items-center sm:items-start">
                <span
                  className={`pl-1 text-xs ${isDark ? "text-gray-200" : "text-stone-600"} ${chordDisplayMode === "diatonic" || chordDisplayMode === "triad" ? "" : "invisible"}`}
                >
                  {chordDisplayMode === "triad" ? t("controls.strings") : t("controls.key")}
                </span>
                <DropdownSelect
                  theme={theme}
                  value={
                    chordDisplayMode === "diatonic"
                      ? diatonicKeyType
                      : chordDisplayMode === "triad"
                        ? triadStringSet
                        : ""
                  }
                  onChange={chordDisplayMode === "triad" ? setTriadStringSet : setDiatonicKeyType}
                  options={
                    chordDisplayMode === "diatonic"
                      ? diatonicKeyOptions
                      : chordDisplayMode === "triad"
                        ? triadStringOptions
                        : [{ value: "", label: "--" }]
                  }
                  disabled={chordDisplayMode !== "diatonic" && chordDisplayMode !== "triad"}
                  accent="amber"
                  widthClass="w-36"
                />
              </div>

              <div className="flex flex-col gap-1 items-center sm:items-start">
                <span
                  className={`pl-1 text-xs ${isDark ? "text-gray-200" : "text-stone-600"} ${chordDisplayMode === "diatonic" || chordDisplayMode === "triad" ? "" : "invisible"}`}
                >
                  {chordDisplayMode === "triad" ? t("controls.inversion") : t("controls.chordType")}
                </span>
                <DropdownSelect
                  theme={theme}
                  value={
                    chordDisplayMode === "diatonic"
                      ? diatonicChordSize
                      : chordDisplayMode === "triad"
                        ? triadInversion
                        : ""
                  }
                  onChange={chordDisplayMode === "triad" ? setTriadInversion : setDiatonicChordSize}
                  options={
                    chordDisplayMode === "diatonic"
                      ? diatonicChordSizeOptions
                      : chordDisplayMode === "triad"
                        ? triadInversionOptions
                        : [{ value: "", label: "--" }]
                  }
                  disabled={chordDisplayMode !== "diatonic" && chordDisplayMode !== "triad"}
                  accent="amber"
                  widthClass="w-36"
                />
              </div>
            </div>
          </LayerRow>
        </div>
      )}
    </div>
  );
}

interface LayerRowProps {
  label: string;
  color: string;
  active: boolean;
  onToggle: () => void;
  theme: Theme;
  children?: ReactNode;
}

function LayerRow({ label, color, active, onToggle, theme, children }: LayerRowProps) {
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

interface ScaleSelectProps {
  theme: Theme;
  value: ScaleType;
  onChange: (value: string) => void;
  options: { value: ScaleType; label: string }[];
  groups: { title: string; options: { value: ScaleType; label: string }[] }[];
}

function ScaleSelect({ theme, value, onChange, options, groups }: ScaleSelectProps) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const isDark = theme === "dark";
  const selected = options.find((option) => option.value === value) ?? options[0];

  return (
    <div className="relative w-44">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border px-2.5 py-1.5 text-left text-sm font-medium shadow-sm transition-all ${
          open
            ? isDark
              ? "border-gray-500 bg-gray-700 text-white"
              : "border-stone-400 bg-white text-stone-900"
            : isDark
              ? "border-gray-500 bg-gray-700/90 text-white hover:border-gray-300"
              : "border-stone-300 bg-white/95 text-stone-900 hover:border-stone-400"
        }`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={selected.label}
      >
        <span className="truncate">{selected.label}</span>
        <span
          className={`text-xs transition-transform ${open ? "rotate-180" : ""} ${
            isDark ? "text-gray-200" : "text-stone-600"
          }`}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>

      {open && (
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
            aria-label={t("scaleDialog")}
            onClick={(e) => e.stopPropagation()}
            className={`absolute left-0 top-[calc(100%+0.5rem)] z-30 w-64 overflow-hidden rounded-2xl border p-2 shadow-2xl backdrop-blur ${
              isDark ? "border-gray-700 bg-gray-900/95" : "border-stone-200 bg-white/95"
            }`}
          >
            <div className="space-y-2">
              {groups.map((group) => (
                <div key={group.title} className="space-y-1">
                  <div
                    className={`px-2 text-xs font-semibold tracking-wide ${
                      isDark ? "text-gray-400" : "text-stone-500"
                    }`}
                  >
                    {group.title}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {group.options.map((option) => {
                      const active = option.value === value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            onChange(option.value);
                            setOpen(false);
                          }}
                          className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                            active
                              ? isDark
                                ? "border-transparent bg-emerald-600 text-white"
                                : "border-transparent bg-emerald-600 text-white"
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
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface ChordTypeSelectProps {
  theme: Theme;
  value: ChordType;
  onChange: (value: string) => void;
  options: { value: ChordType; label: string }[];
}

function ChordTypeSelect({ theme, value, onChange, options }: ChordTypeSelectProps) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const isDark = theme === "dark";
  const selected = options.find((option) => option.value === value) ?? options[0];

  return (
    <div className="relative w-36">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border px-2.5 py-1.5 text-left text-sm font-medium shadow-sm transition-all ${
          open
            ? isDark
              ? "border-gray-500 bg-gray-700 text-white"
              : "border-stone-400 bg-white text-stone-900"
            : isDark
              ? "border-gray-500 bg-gray-700/90 text-white hover:border-gray-300"
              : "border-stone-300 bg-white/95 text-stone-900 hover:border-stone-400"
        }`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={selected.label}
      >
        <span className="truncate">{selected.label}</span>
        <span
          className={`text-xs transition-transform ${open ? "rotate-180" : ""} ${
            isDark ? "text-gray-200" : "text-stone-600"
          }`}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>

      {open && (
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
            aria-label={t("controls.chordType")}
            onClick={(e) => e.stopPropagation()}
            className={`absolute left-0 top-[calc(100%+0.5rem)] z-30 w-48 overflow-hidden rounded-2xl border p-2 shadow-2xl backdrop-blur ${
              isDark ? "border-gray-700 bg-gray-900/95" : "border-stone-200 bg-white/95"
            }`}
          >
            <div className="flex flex-wrap gap-1">
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
                    className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                      active
                        ? "border-transparent bg-amber-500 text-white"
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
        </>
      )}
    </div>
  );
}

export { DropdownSelect } from "./SettingsMenu";
export type { DropdownSelectProps } from "./SettingsMenu";
