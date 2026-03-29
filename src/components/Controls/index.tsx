import { useTranslation } from "react-i18next";
import "../../i18n";
import {
  NOTES_SHARP,
  NOTES_FLAT,
  CAGED_FORMS,
  CAGED_ORDER,
  DIATONIC_CHORDS,
  TRIAD_INVERSION_OPTIONS,
  getDiatonicChord,
  getRootIndex,
} from "../../logic/fretboard";
import { DropdownSelect } from "../ui/DropdownSelect";
import { LayerRow } from "./LayerRow";
import { ScaleSelect } from "./ScaleSelect";
import { ChordTypeSelect } from "./ChordTypeSelect";
import { buildScaleOptions } from "./scaleOptions";
import type { Theme, Accidental, ChordDisplayMode, ScaleType, ChordType } from "../../types";

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
  const { options: scaleOptions, groups: scaleGroups } = buildScaleOptions(t);
  const triadInversionOptions = TRIAD_INVERSION_OPTIONS.map(({ value }) => ({
    value,
    label: t(`options.triadInversions.${value}`),
  }));
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
                  {chordDisplayMode === "diatonic" ? t("controls.key") : t("controls.inversion")}
                </span>
                <DropdownSelect
                  theme={theme}
                  value={
                    chordDisplayMode === "diatonic"
                      ? diatonicKeyType
                      : chordDisplayMode === "triad"
                        ? triadInversion
                        : ""
                  }
                  onChange={
                    chordDisplayMode === "diatonic" ? setDiatonicKeyType : setTriadInversion
                  }
                  options={
                    chordDisplayMode === "diatonic"
                      ? diatonicKeyOptions
                      : chordDisplayMode === "triad"
                        ? triadInversionOptions
                        : [{ value: "", label: "--" }]
                  }
                  disabled={chordDisplayMode !== "diatonic" && chordDisplayMode !== "triad"}
                  accent="amber"
                  widthClass="w-36"
                />
              </div>

              <div className="flex flex-col gap-1 items-center sm:items-start">
                <span
                  className={`pl-1 text-xs ${isDark ? "text-gray-200" : "text-stone-600"} ${chordDisplayMode === "diatonic" ? "" : "invisible"}`}
                >
                  {t("controls.chordType")}
                </span>
                <DropdownSelect
                  theme={theme}
                  value={chordDisplayMode === "diatonic" ? diatonicChordSize : ""}
                  onChange={setDiatonicChordSize}
                  options={
                    chordDisplayMode === "diatonic"
                      ? diatonicChordSizeOptions
                      : [{ value: "", label: "--" }]
                  }
                  disabled={chordDisplayMode !== "diatonic"}
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
