import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "../../i18n";
import {
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
  scaleColor: string;
  setScaleColor: (value: string) => void;
  cagedColor: string;
  setCagedColor: (value: string) => void;
  chordColor: string;
  setChordColor: (value: string) => void;
}

function ToggleSwitch({
  active,
  onClick,
  theme,
}: {
  active: boolean;
  onClick: () => void;
  theme: Theme;
}) {
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      onClick={onClick}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ${
        active ? "bg-sky-500" : isDark ? "bg-gray-600" : "bg-stone-300"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${
          active ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
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
  scaleColor,
  setScaleColor,
  cagedColor,
  setCagedColor,
  chordColor,
  setChordColor,
}: LayerControlsProps) {
  const { t } = useTranslation();
  const isDark = theme === "dark";
  const [activeTab, setActiveTab] = useState<MobileTab>("scale");
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("left");
  const touchStartXRef = useRef(0);
  const TABS: MobileTab[] = ["scale", "caged", "chord"];

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - touchStartXRef.current;
    if (Math.abs(delta) < 50) return;
    const currentIndex = TABS.indexOf(activeTab);
    if (delta < 0) {
      const nextIndex = (currentIndex + 1) % TABS.length;
      setSlideDirection("left");
      setActiveTab(TABS[nextIndex]);
    } else {
      const prevIndex = (currentIndex - 1 + TABS.length) % TABS.length;
      setSlideDirection("right");
      setActiveTab(TABS[prevIndex]);
    }
  };

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
    ? "relative h-[14.5rem] sm:h-[12.5rem] lg:h-[13rem] rounded-[24px] border p-4 text-white"
    : "relative h-[14.5rem] sm:h-[12.5rem] lg:h-[13rem] rounded-[24px] border p-4 text-stone-900";
  const activeCardToneClass = isDark
    ? "border-white/10 bg-white/[0.045]"
    : "border-stone-200 bg-stone-50/90";
  const inactiveCardToneClass = isDark
    ? "border-white/5 bg-white/[0.02]"
    : "border-stone-200 bg-stone-100/70";
  const layerOffCardToneClass = isDark
    ? "border-white/5 bg-white/[0.015]"
    : "border-stone-200/60 bg-stone-100/40";
  const sectionLabelClass = `text-center text-[11px] font-semibold uppercase tracking-wide ${
    isDark ? "text-gray-400" : "text-stone-500"
  }`;
  const headingClass = `text-sm ${isDark ? "text-gray-400" : "text-stone-600"}`;
  const layerCardStateClass = showLayers ? "opacity-100" : "opacity-45";

  const getCardToneClass = (layerOn: boolean) => {
    if (!showLayers) return inactiveCardToneClass;
    return layerOn ? activeCardToneClass : layerOffCardToneClass;
  };
  const getCardContentClass = (layerOn: boolean) =>
    showLayers && layerOn ? "opacity-100" : "opacity-45";

  const scaleCard = (
    <div
      className={`${cardClass} ${getCardToneClass(showScale)} flex min-h-full flex-col transition-colors`}
    >
      <div className="absolute right-3 top-3 z-10">
        <div className={layerCardStateClass}>
          <ToggleSwitch active={showScale} onClick={() => setShowScale(!showScale)} theme={theme} />
        </div>
      </div>
      <div className={`${getCardContentClass(showScale)} flex flex-1 flex-col transition-opacity`}>
        <div className="mb-2 flex items-center justify-center gap-2">
          <span className={sectionLabelClass}>{t("layers.scale")}</span>
          <input
            type="color"
            value={scaleColor}
            onChange={(e) => setScaleColor(e.target.value)}
            disabled={!showLayers || !showScale}
            className="h-5 w-5 cursor-pointer overflow-hidden rounded-full border-0 p-0 disabled:cursor-not-allowed [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0"
            style={{ padding: 0 }}
          />
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
              disabled={!showLayers || !showScale}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const cagedCard = (
    <div
      className={`${cardClass} ${getCardToneClass(showCaged)} flex min-h-full flex-col transition-colors`}
    >
      <div className="absolute right-3 top-3 z-10">
        <div className={layerCardStateClass}>
          <ToggleSwitch active={showCaged} onClick={() => setShowCaged(!showCaged)} theme={theme} />
        </div>
      </div>
      <div className={`${getCardContentClass(showCaged)} flex flex-1 flex-col transition-opacity`}>
        <div className="mb-2 flex items-center justify-center gap-2">
          <span className={sectionLabelClass}>{t("layers.caged")}</span>
          <input
            type="color"
            value={cagedColor}
            onChange={(e) => setCagedColor(e.target.value)}
            disabled={!showLayers || !showCaged}
            className="h-5 w-5 cursor-pointer overflow-hidden rounded-full border-0 p-0 disabled:cursor-not-allowed [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0"
            style={{ padding: 0 }}
          />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="space-y-1 text-center">
            <span className={sectionLabelClass}>{t("mobileControls.cagedForms")}</span>
            <div className="flex flex-wrap content-center justify-center gap-2">
              {CAGED_ORDER.map((key) => {
                const active = cagedForms.has(key);
                const cagedDisabled = !showLayers || !showCaged;
                return (
                  <button
                    key={key}
                    type="button"
                    disabled={cagedDisabled}
                    onClick={() => toggleCagedForm(key)}
                    className={`h-9 w-9 rounded-full border-2 text-sm font-bold transition-all ${
                      active
                        ? isDark
                          ? "scale-105 border-transparent bg-sky-600 text-white shadow-[0_10px_28px_-18px_rgba(2,132,199,0.6)]"
                          : "scale-105 border-transparent bg-sky-500 text-white shadow-lg"
                        : isDark
                          ? "border-gray-500 bg-gray-700 text-gray-100"
                          : "border-stone-300 bg-white text-stone-700"
                    } ${cagedDisabled ? "cursor-not-allowed" : ""}`}
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
    <div className={`${cardClass} ${getCardToneClass(showChord)} flex flex-col transition-colors`}>
      <div className="absolute right-3 top-3 z-10">
        <div className={layerCardStateClass}>
          <ToggleSwitch active={showChord} onClick={() => setShowChord(!showChord)} theme={theme} />
        </div>
      </div>
      <div className={`${getCardContentClass(showChord)} flex flex-1 flex-col transition-opacity`}>
        <div className="mb-2 flex items-center justify-center gap-2">
          <span className={sectionLabelClass}>{t("layers.chord")}</span>
          <input
            type="color"
            value={chordColor}
            onChange={(e) => setChordColor(e.target.value)}
            disabled={!showLayers || !showChord}
            className="h-5 w-5 cursor-pointer overflow-hidden rounded-full border-0 p-0 disabled:cursor-not-allowed [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0"
            style={{ padding: 0 }}
          />
        </div>
        <div className="grid flex-1 content-center grid-cols-2 gap-2">
          <div className="space-y-1 text-center">
            <span className={sectionLabelClass}>{t("controls.displayMode")}</span>
            <DropdownSelect
              theme={theme}
              value={chordDisplayMode}
              onChange={setChordDisplayMode}
              options={chordDisplayOptions}
              accent="sky"
              widthClass="w-full"
              direction="up"
              disabled={!showLayers || !showChord}
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
              accent="sky"
              widthClass="w-full"
              direction="up"
              disabled={!showLayers || !showChord || chordDisplayMode === "power"}
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
              accent="sky"
              widthClass="w-full"
              direction="up"
              disabled={
                !showLayers ||
                !showChord ||
                (chordDisplayMode !== "diatonic" && chordDisplayMode !== "triad")
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
              accent="sky"
              widthClass="w-full"
              direction="up"
              disabled={!showLayers || !showChord || chordDisplayMode !== "diatonic"}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto mt-4 w-full max-w-[840px] space-y-3 pt-2 sm:pt-0">
      <div className="flex justify-center">
        <div className="flex items-center gap-2">
          <h3 className={headingClass}>{t("mobileControls.layers")}</h3>
          <button
            type="button"
            onClick={() => setShowLayers(!showLayers)}
            className={`rounded-full border px-2.5 py-1 text-xs transition-all ${
              isDark
                ? "border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-400 hover:text-gray-100"
                : "border-stone-300 bg-white text-stone-600 hover:border-stone-400 hover:text-stone-800"
            }`}
          >
            {showLayers ? t("mobileControls.hide") : t("mobileControls.show")}
          </button>
        </div>
      </div>
      <div className="flex justify-center lg:hidden">
        <div className="flex items-center gap-5">
          {(
            [
              {
                tab: "scale" as MobileTab,
                label: t("layers.scale"),
                on: showScale,
                color: scaleColor,
              },
              {
                tab: "caged" as MobileTab,
                label: t("layers.caged"),
                on: showCaged,
                color: cagedColor,
              },
              {
                tab: "chord" as MobileTab,
                label: t("layers.chord"),
                on: showChord,
                color: chordColor,
              },
            ] as const
          ).map(({ tab, label, on, color }) => {
            const isCurrent = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  const currentIndex = TABS.indexOf(activeTab);
                  const nextIndex = TABS.indexOf(tab);
                  setSlideDirection(nextIndex > currentIndex ? "left" : "right");
                  setActiveTab(tab);
                }}
                className="flex flex-col items-center gap-1"
              >
                <span
                  className={`text-xs transition-colors ${
                    isCurrent
                      ? isDark
                        ? "font-semibold text-gray-100"
                        : "font-semibold text-stone-800"
                      : isDark
                        ? "text-gray-500"
                        : "text-stone-400"
                  }`}
                >
                  {label}
                </span>
                <span
                  className="h-2 w-2 rounded-full transition-colors"
                  style={{ backgroundColor: on ? color : isDark ? "#4b5563" : "#d6d3d1" }}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="lg:hidden overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          key={activeTab}
          className={slideDirection === "left" ? "slide-in-from-right" : "slide-in-from-left"}
        >
          {activeTab === "scale" && scaleCard}
          {activeTab === "caged" && cagedCard}
          {activeTab === "chord" && chordCard}
        </div>
      </div>

      <div className="hidden lg:grid lg:grid-cols-3 lg:gap-3">
        {scaleCard}
        {cagedCard}
        {chordCard}
      </div>
    </div>
  );
}
