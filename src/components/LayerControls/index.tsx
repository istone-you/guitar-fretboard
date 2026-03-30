import { useState } from "react";
import { useTranslation } from "react-i18next";
import "../../i18n";
import {
  CAGED_FORMS,
  CAGED_ORDER,
  DIATONIC_CHORDS,
  NOTES_FLAT,
  NOTES_SHARP,
  TRIAD_INVERSION_OPTIONS,
  getDiatonicChord,
  getRootIndex,
} from "../../logic/fretboard";
import type { Theme, Accidental, ChordDisplayMode, ScaleType, ChordType } from "../../types";
import { DropdownSelect } from "../ui/DropdownSelect";
import { ScaleSelect } from "../ui/ScaleSelect";
import { SegmentedToggle } from "../ui/SegmentedToggle";
import { buildScaleOptions } from "../ui/scaleOptions";

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

type MobileTab = "scale" | "caged" | "chord";

interface LayerControlsProps {
  theme: Theme;
  rootNote: string;
  accidental: Accidental;
  showLayers: boolean;
  setShowLayers: (value: boolean) => void;
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
}

function TogglePill({
  active,
  onClick,
  theme,
}: {
  active: boolean;
  onClick: () => void;
  theme: Theme;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
        active
          ? "bg-indigo-600 text-white"
          : theme === "dark"
            ? "bg-gray-700 text-gray-200"
            : "bg-stone-200 text-stone-700"
      }`}
    >
      {active ? "ON" : "OFF"}
    </button>
  );
}

export default function LayerControls({
  theme,
  rootNote,
  accidental,
  showLayers,
  setShowLayers,
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
}: LayerControlsProps) {
  const { t } = useTranslation();
  const isDark = theme === "dark";
  const [activeTab, setActiveTab] = useState<MobileTab>("scale");

  const { options: scaleOptions, groups: scaleGroups } = buildScaleOptions(t);
  const notes = accidental === "sharp" ? NOTES_SHARP : NOTES_FLAT;
  const rootIndex = getRootIndex(rootNote);
  const diatonicScaleType = `${diatonicKeyType}-${diatonicChordSize}`;

  const diatonicKeyOptions = [
    { value: "major", label: t("options.diatonicKey.major") },
    { value: "natural-minor", label: t("options.diatonicKey.naturalMinor") },
  ];
  const diatonicChordSizeOptions = [
    { value: "triad", label: t("options.diatonicChordSize.triad") },
    { value: "seventh", label: t("options.diatonicChordSize.seventh") },
  ];
  const chordDisplayOptions: { value: ChordDisplayMode; label: string }[] = [
    { value: "form", label: t("options.chordDisplayMode.form") },
    { value: "power", label: t("options.chordDisplayMode.power") },
    { value: "triad", label: t("options.chordDisplayMode.triad") },
    { value: "diatonic", label: t("options.chordDisplayMode.diatonic") },
  ];
  const triadInversionOptions = TRIAD_INVERSION_OPTIONS.map(({ value }) => ({
    value,
    label: t(`options.triadInversions.${value}`),
  }));
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
      label: `${value} (${notes[chord.rootIndex]}${suffixMap[chord.chordType] ?? chord.chordType})`,
    };
  });
  const placeholderOptions = [{ value: "", label: "--" }];
  const chordValueOptions =
    chordDisplayMode === "form"
      ? CHORD_TYPES.map((value) => ({ value, label: value }))
      : chordDisplayMode === "triad"
        ? TRIAD_CHORD_TYPES.map((value) => ({ value, label: value }))
        : chordDisplayMode === "diatonic"
          ? diatonicCodeOptions
          : placeholderOptions;
  const chordValue = chordDisplayMode === "diatonic" ? diatonicDegree : chordType;
  const thirdOptions =
    chordDisplayMode === "diatonic"
      ? diatonicKeyOptions
      : chordDisplayMode === "triad"
        ? triadInversionOptions
        : placeholderOptions;
  const thirdValue =
    chordDisplayMode === "diatonic"
      ? diatonicKeyType
      : chordDisplayMode === "triad"
        ? triadInversion
        : "";
  const fourthOptions =
    chordDisplayMode === "diatonic" ? diatonicChordSizeOptions : placeholderOptions;
  const fourthValue = chordDisplayMode === "diatonic" ? diatonicChordSize : "";

  const cardClass = isDark
    ? "relative h-[14.5rem] sm:h-[12.5rem] lg:h-[13rem] rounded-2xl border p-3 text-white"
    : "relative h-[14.5rem] sm:h-[12.5rem] lg:h-[13rem] rounded-2xl border p-3 text-stone-900";
  const activeCardToneClass = isDark
    ? "border-gray-700 bg-gray-800/80"
    : "border-stone-300 bg-stone-50";
  const inactiveCardToneClass = isDark
    ? "border-gray-800 bg-gray-900/70"
    : "border-stone-200 bg-stone-100/70";
  const sectionLabelClass = `text-center text-[11px] font-semibold uppercase tracking-wide ${
    isDark ? "text-gray-400" : "text-stone-500"
  }`;
  const headingClass = `text-sm ${isDark ? "text-gray-400" : "text-stone-600"}`;
  const layerCardStateClass = showLayers ? "opacity-100" : "opacity-45";

  const scaleCard = (
    <div
      className={`${cardClass} ${showLayers ? activeCardToneClass : inactiveCardToneClass} flex min-h-full flex-col`}
    >
      <div className="absolute right-3 top-3">
        <div className={layerCardStateClass}>
          <TogglePill active={showScale} onClick={() => setShowScale(!showScale)} theme={theme} />
        </div>
      </div>
      <div className={`${layerCardStateClass} flex flex-1 flex-col`}>
        <div className="mb-2 flex items-center justify-center">
          <span className={sectionLabelClass}>{t("layers.scale")}</span>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="space-y-1 text-center">
            <span className={sectionLabelClass}>{t("mobileControls.scaleKind")}</span>
            <ScaleSelect
              theme={theme}
              value={scaleType}
              onChange={setScaleType}
              options={scaleOptions}
              groups={scaleGroups}
              direction="up"
              disabled={!showLayers}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const cagedCard = (
    <div
      className={`${cardClass} ${showLayers ? activeCardToneClass : inactiveCardToneClass} flex min-h-full flex-col`}
    >
      <div className="absolute right-3 top-3">
        <div className={layerCardStateClass}>
          <TogglePill active={showCaged} onClick={() => setShowCaged(!showCaged)} theme={theme} />
        </div>
      </div>
      <div className={`${layerCardStateClass} flex flex-1 flex-col`}>
        <div className="mb-2 flex items-center justify-center">
          <span className={sectionLabelClass}>{t("layers.caged")}</span>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="space-y-1 text-center">
            <span className={sectionLabelClass}>{t("mobileControls.cagedForms")}</span>
            <div className="flex flex-wrap content-center justify-center gap-2">
              {CAGED_ORDER.map((key) => {
                const active = cagedForms.has(key);
                return (
                  <button
                    key={key}
                    type="button"
                    disabled={!showLayers}
                    onClick={() => toggleCagedForm(key)}
                    className={`h-9 w-9 rounded-full border-2 text-sm font-bold transition-all ${
                      active
                        ? "scale-105 border-transparent text-white shadow-lg"
                        : isDark
                          ? "border-gray-500 bg-gray-700 text-gray-100"
                          : "border-stone-300 bg-white text-stone-700"
                    } ${!showLayers ? "cursor-not-allowed" : ""}`}
                    style={active ? { backgroundColor: CAGED_FORMS[key].color } : undefined}
                  >
                    {key}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const chordCard = (
    <div
      className={`${cardClass} ${showLayers ? activeCardToneClass : inactiveCardToneClass} flex flex-col`}
    >
      <div className="absolute right-3 top-3">
        <div className={layerCardStateClass}>
          <TogglePill active={showChord} onClick={() => setShowChord(!showChord)} theme={theme} />
        </div>
      </div>
      <div className={`${layerCardStateClass} flex flex-1 flex-col`}>
        <div className="mb-2 flex items-center justify-center">
          <span className={sectionLabelClass}>{t("layers.chord")}</span>
        </div>
        <div className="grid flex-1 content-center grid-cols-2 gap-2">
          <div className="space-y-1 text-center">
            <span className={sectionLabelClass}>{t("controls.displayMode")}</span>
            <DropdownSelect
              theme={theme}
              value={chordDisplayMode}
              onChange={setChordDisplayMode}
              options={chordDisplayOptions}
              accent="amber"
              widthClass="w-full"
              direction="up"
              disabled={!showLayers}
            />
          </div>
          <div className="space-y-1 text-center">
            <span className={sectionLabelClass}>
              {chordDisplayMode === "diatonic" ? t("controls.degree") : t("controls.chord")}
            </span>
            <DropdownSelect
              theme={theme}
              value={chordValue}
              onChange={chordDisplayMode === "diatonic" ? setDiatonicDegree : setChordType}
              options={chordValueOptions}
              accent="amber"
              widthClass="w-full"
              direction="up"
              disabled={!showLayers || chordDisplayMode === "power"}
            />
          </div>
          <div className="space-y-1 text-center">
            <span className={sectionLabelClass}>
              {chordDisplayMode === "diatonic" ? t("controls.key") : t("controls.inversion")}
            </span>
            <DropdownSelect
              theme={theme}
              value={thirdValue}
              onChange={chordDisplayMode === "diatonic" ? setDiatonicKeyType : setTriadInversion}
              options={thirdOptions}
              accent="amber"
              widthClass="w-full"
              direction="up"
              disabled={
                !showLayers || (chordDisplayMode !== "diatonic" && chordDisplayMode !== "triad")
              }
            />
          </div>
          <div className="space-y-1 text-center">
            <span className={sectionLabelClass}>{t("controls.chordType")}</span>
            <DropdownSelect
              theme={theme}
              value={fourthValue}
              onChange={setDiatonicChordSize}
              options={fourthOptions}
              accent="amber"
              widthClass="w-full"
              direction="up"
              disabled={!showLayers || chordDisplayMode !== "diatonic"}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mt-4 mx-auto w-full max-w-[840px] space-y-2 pt-2 sm:pt-0">
      <div className="flex justify-center">
        <div className="flex items-center gap-2">
          <h3 className={headingClass}>{t("mobileControls.layers")}</h3>
          <button
            type="button"
            onClick={() => setShowLayers(!showLayers)}
            className={`rounded-full border px-2 py-0.5 text-xs transition-all ${
              isDark
                ? "border-gray-600 text-gray-400 hover:border-gray-400 hover:text-gray-200"
                : "border-stone-300 text-stone-500 hover:border-stone-500 hover:text-stone-700"
            }`}
          >
            {showLayers ? t("mobileControls.hide") : t("mobileControls.show")}
          </button>
        </div>
      </div>
      <div className="flex justify-center lg:hidden">
        <SegmentedToggle
          theme={theme}
          value={activeTab}
          onChange={setActiveTab}
          size="compact"
          buttonWidthClass="w-[5.5rem] text-center"
          options={[
            { value: "scale", label: t("layers.scale") },
            { value: "caged", label: t("layers.caged") },
            { value: "chord", label: t("layers.chord") },
          ]}
        />
      </div>

      <div className="lg:hidden">
        {activeTab === "scale" && scaleCard}
        {activeTab === "caged" && cagedCard}
        {activeTab === "chord" && chordCard}
      </div>

      <div className="hidden lg:grid lg:grid-cols-3 lg:gap-3">
        {scaleCard}
        {cagedCard}
        {chordCard}
      </div>
    </div>
  );
}
