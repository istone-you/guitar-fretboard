import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./i18n";
import Controls from "./components/Controls";
import Fretboard from "./components/Fretboard";
import FretboardHeader from "./components/FretboardHeader";
import {
  DIATONIC_CHORDS,
  NOTES_SHARP,
  NOTES_FLAT,
  getRootIndex,
  SCALE_DEGREES,
  CHORD_SEMITONES,
  getDiatonicChordSemitones,
} from "./logic/fretboard";
import type {
  Theme,
  Accidental,
  BaseLabelMode,
  FretboardDisplaySize,
  ChordDisplayMode,
  ScaleType,
  ChordType,
  DegreeName,
} from "./types";

const STORAGE_KEYS = {
  theme: "guiter:theme",
  accidental: "guiter:accidental",
  fretboardDisplaySize: "guiter:fretboard-display-size",
} as const;

function readStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(STORAGE_KEYS.theme);
  return stored === "light" || stored === "dark" ? stored : "dark";
}

function readStoredAccidental(): Accidental {
  if (typeof window === "undefined") return "flat";
  const stored = window.localStorage.getItem(STORAGE_KEYS.accidental);
  return stored === "sharp" || stored === "flat" ? stored : "flat";
}

function readStoredFretboardDisplaySize(): FretboardDisplaySize {
  if (typeof window === "undefined") return "standard";
  const stored = window.localStorage.getItem(STORAGE_KEYS.fretboardDisplaySize);
  if (stored === "standard" || stored === "compact" || stored === "tiny") return stored;
  if (window.innerWidth < 640) return "tiny";
  return "standard";
}

export default function App() {
  const { t } = useTranslation();
  // ルート音
  const [rootNote, setRootNote] = useState("C");
  // 臨時記号表示（sharp / flat）
  const [accidental, setAccidental] = useState<Accidental>(readStoredAccidental);
  // ベースレイヤー表示
  const [baseLabelMode, setBaseLabelMode] = useState<BaseLabelMode>("note");
  const [fretboardDisplaySize, setFretboardDisplaySize] = useState<FretboardDisplaySize>(
    readStoredFretboardDisplaySize,
  );

  // レイヤー表示フラグ
  const [showChord, setShowChord] = useState(false);
  const [showScale, setShowScale] = useState(false);
  const [showCaged, setShowCaged] = useState(false);

  // コードフォーム設定
  const [chordDisplayMode, setChordDisplayMode] = useState<ChordDisplayMode>("form");
  const [chordType, setChordType] = useState<ChordType>("Major");
  const [triadStringSet, setTriadStringSet] = useState("1-3");
  const [triadInversion, setTriadInversion] = useState("root");
  const [diatonicKeyType, setDiatonicKeyType] = useState("major");
  const [diatonicChordSize, setDiatonicChordSize] = useState("triad");
  const [diatonicDegree, setDiatonicDegree] = useState("I");

  // スケール設定
  const [scaleType, setScaleType] = useState<ScaleType>("major");

  // CAGED設定（複数選択可）
  const [cagedForms, setCagedForms] = useState(new Set(["E"]));

  const toggleCagedForm = (key: string) => {
    setCagedForms((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  // 臨時記号モード切り替え時にルート音の表記を変換
  const handleAccidentalChange = (mode: Accidental) => {
    const idx = getRootIndex(rootNote);
    const notes = mode === "sharp" ? NOTES_SHARP : NOTES_FLAT;
    setRootNote(notes[idx]);
    setAccidental(mode);
    window.localStorage.setItem(STORAGE_KEYS.accidental, mode);
  };

  // 指板の音をクリックしてルートを設定
  const handleNoteClick = (noteName: string) => {
    setRootNote(noteName);
  };

  const handleDiatonicKeyTypeChange = (value: string) => {
    const validDegrees = DIATONIC_CHORDS[`${value}-${diatonicChordSize}`].map((item) => item.value);
    setDiatonicKeyType(value);
    if (!validDegrees.includes(diatonicDegree)) setDiatonicDegree(validDegrees[0]);
  };

  const handleDiatonicChordSizeChange = (value: string) => {
    const validDegrees = DIATONIC_CHORDS[`${diatonicKeyType}-${value}`].map((item) => item.value);
    setDiatonicChordSize(value);
    if (!validDegrees.includes(diatonicDegree)) setDiatonicDegree(validDegrees[0]);
  };

  const [theme, setTheme] = useState<Theme>(readStoredTheme);
  const [hiddenDegrees, setHiddenDegrees] = useState(new Set<string>());

  const handleFretboardDisplaySizeChange = (size: FretboardDisplaySize) => {
    setFretboardDisplaySize(size);
    window.localStorage.setItem(STORAGE_KEYS.fretboardDisplaySize, size);
  };

  const DEGREE_BY_SEMITONE: DegreeName[] = [
    "P1",
    "m2",
    "M2",
    "m3",
    "M3",
    "P4",
    "b5",
    "P5",
    "m6",
    "M6",
    "m7",
    "M7",
  ];
  const handleAutoFilter = () => {
    const active = new Set<number>();
    const keyRootIndex = getRootIndex(rootNote);
    if (showScale) {
      for (const s of SCALE_DEGREES[scaleType] ?? []) active.add(s);
    }
    if (showCaged) {
      for (const s of CHORD_SEMITONES.Major) active.add(s);
    }
    if (showChord) {
      let semitones: Set<number> | undefined;
      if (chordDisplayMode === "power") {
        semitones = CHORD_SEMITONES.power;
      } else if (chordDisplayMode === "diatonic") {
        semitones = getDiatonicChordSemitones(keyRootIndex, diatonicScaleType, diatonicDegree);
      } else {
        semitones = CHORD_SEMITONES[chordType];
      }
      for (const s of semitones ?? []) active.add(s);
    }
    if (active.size === 0) {
      setHiddenDegrees(new Set());
      return;
    }
    setHiddenDegrees(new Set(DEGREE_BY_SEMITONE.filter((_, i) => !active.has(i))));
  };

  const toggleDegree = (name: string) => {
    setHiddenDegrees((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };
  const triadLayout = `${triadStringSet}-${triadInversion}`;
  const diatonicScaleType = `${diatonicKeyType}-${diatonicChordSize}`;

  return (
    <div
      className={`min-h-screen p-4 flex flex-col gap-4 ${
        theme === "dark" ? "bg-gray-950" : "bg-stone-100"
      }`}
    >
      <main
        className={`rounded-xl p-4 space-y-4 ${
          theme === "dark" ? "bg-gray-900" : "bg-white border border-stone-300 shadow-sm"
        }`}
      >
        <Controls
          theme={theme}
          onThemeChange={() =>
            setTheme((currentTheme) => {
              const nextTheme = currentTheme === "dark" ? "light" : "dark";
              window.localStorage.setItem(STORAGE_KEYS.theme, nextTheme);
              return nextTheme;
            })
          }
          rootNote={rootNote}
          accidental={accidental}
          onAccidentalChange={handleAccidentalChange}
          fretboardDisplaySize={fretboardDisplaySize}
          onFretboardDisplaySizeChange={handleFretboardDisplaySizeChange}
          showChord={showChord}
          setShowChord={setShowChord}
          chordDisplayMode={chordDisplayMode}
          setChordDisplayMode={(value) => setChordDisplayMode(value as ChordDisplayMode)}
          showScale={showScale}
          setShowScale={setShowScale}
          scaleType={scaleType}
          setScaleType={(value) => setScaleType(value as ScaleType)}
          showCaged={showCaged}
          setShowCaged={setShowCaged}
          cagedForms={cagedForms}
          toggleCagedForm={toggleCagedForm}
          chordType={chordType}
          setChordType={(value) => setChordType(value as ChordType)}
          triadStringSet={triadStringSet}
          setTriadStringSet={setTriadStringSet}
          triadInversion={triadInversion}
          setTriadInversion={setTriadInversion}
          diatonicKeyType={diatonicKeyType}
          setDiatonicKeyType={handleDiatonicKeyTypeChange}
          diatonicChordSize={diatonicChordSize}
          setDiatonicChordSize={handleDiatonicChordSizeChange}
          diatonicDegree={diatonicDegree}
          setDiatonicDegree={setDiatonicDegree}
        />

        <FretboardHeader
          theme={theme}
          rootNote={rootNote}
          accidental={accidental}
          baseLabelMode={baseLabelMode}
          onBaseLabelModeChange={setBaseLabelMode}
          onRootNoteChange={handleNoteClick}
        />
        <Fretboard
          theme={theme}
          rootNote={rootNote}
          accidental={accidental}
          baseLabelMode={baseLabelMode}
          displaySize={fretboardDisplaySize}
          showChord={showChord}
          chordDisplayMode={chordDisplayMode}
          showScale={showScale}
          scaleType={scaleType}
          showCaged={showCaged}
          cagedForms={cagedForms}
          chordType={chordType}
          triadPosition={triadLayout}
          diatonicScaleType={diatonicScaleType}
          diatonicDegree={diatonicDegree}
          onNoteClick={handleNoteClick}
          hiddenDegrees={hiddenDegrees}
        />

        <div className="mt-4 min-h-[5.75rem]">
          {baseLabelMode === "degree" && (
            <>
              <div className="flex items-center justify-center gap-2 mb-3">
                <h3 className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-stone-600"}`}>
                  {t("degreeFilter.title")}
                </h3>
                <button
                  onClick={handleAutoFilter}
                  title={t("degreeFilter.filterTitle")}
                  className={`text-xs px-2 py-0.5 rounded-full border transition-all ${
                    theme === "dark"
                      ? "border-gray-600 text-gray-400 hover:border-gray-400 hover:text-gray-200"
                      : "border-stone-300 text-stone-500 hover:border-stone-500 hover:text-stone-700"
                  }`}
                >
                  {t("degreeFilter.filter")}
                </button>
                <button
                  onClick={() =>
                    hiddenDegrees.size > 0
                      ? setHiddenDegrees(new Set())
                      : setHiddenDegrees(new Set(DEGREE_BY_SEMITONE))
                  }
                  className={`text-xs px-2 py-0.5 rounded-full border transition-all ${
                    theme === "dark"
                      ? "border-indigo-500 text-indigo-400 hover:bg-indigo-500/20"
                      : "border-indigo-400 text-indigo-500 hover:bg-indigo-50"
                  }`}
                >
                  {hiddenDegrees.size > 0 ? t("degreeFilter.reset") : t("degreeFilter.hideAll")}
                </button>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  ["P1", "#ef4444"],
                  ["m2", "#ec4899"],
                  ["M2", "#84cc16"],
                  ["m3", "#a855f7"],
                  ["M3", "#22c55e"],
                  ["P4", "#06b6d4"],
                  ["b5", "#6b7280"],
                  ["P5", "#3b82f6"],
                  ["m6", "#8b5cf6"],
                  ["M6", "#10b981"],
                  ["m7", "#f97316"],
                  ["M7", "#f59e0b"],
                ].map(([name, color]) => {
                  const hidden = hiddenDegrees.has(name);
                  return (
                    <div
                      key={name}
                      className="flex items-center gap-1 cursor-pointer select-none"
                      style={{ opacity: hidden ? 0.3 : 1 }}
                      onClick={() => toggleDegree(name)}
                    >
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: color }} />
                      <span
                        className={`text-xs ${theme === "dark" ? "text-gray-300" : "text-stone-700"}`}
                      >
                        {name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
