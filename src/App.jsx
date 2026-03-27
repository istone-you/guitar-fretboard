import React, { useState } from "react";
import Controls from "./components/Controls";
import Fretboard from "./components/Fretboard";
import {
  DIATONIC_CHORDS, NOTES_SHARP, NOTES_FLAT, getRootIndex,
  MAJOR_SCALE_DEGREES, NATURAL_MINOR_SCALE_DEGREES,
  MINOR_PENTA_DEGREES, MAJOR_PENTA_DEGREES, BLUES_SCALE_DEGREES,
  CHORD_SEMITONES, getDiatonicChord,
} from "./logic/fretboard";

export default function App() {
  // ルート音
  const [rootNote, setRootNote] = useState("C");
  // 臨時記号表示（sharp / flat）
  const [accidental, setAccidental] = useState("flat");
  // ベースレイヤー表示
  const [baseLabelMode, setBaseLabelMode] = useState("note");

  // レイヤー表示フラグ
  const [showChord, setShowChord] = useState(false);
  const [showScale, setShowScale] = useState(false);
  const [showCaged, setShowCaged] = useState(false);

  // コードフォーム設定
  const [chordDisplayMode, setChordDisplayMode] = useState("form");
  const [chordType, setChordType] = useState("Major");
  const [triadStringSet, setTriadStringSet] = useState("1-3");
  const [triadInversion, setTriadInversion] = useState("root");
  const [diatonicKeyType, setDiatonicKeyType] = useState("major");
  const [diatonicChordSize, setDiatonicChordSize] = useState("triad");
  const [diatonicDegree, setDiatonicDegree] = useState("I");

  // スケール設定
  const [scaleType, setScaleType] = useState("major");

  // CAGED設定（複数選択可）
  const [cagedForms, setCagedForms] = useState(new Set(["E"]));

  const toggleCagedForm = (key) => {
    setCagedForms((prev) => {
      const next = new Set(prev);
      if (next.has(key)) { next.delete(key) } else { next.add(key) }
      return next;
    });
  };

  // 臨時記号モード切り替え時にルート音の表記を変換
  const handleAccidentalChange = (mode) => {
    const idx = getRootIndex(rootNote);
    const notes = mode === "sharp" ? NOTES_SHARP : NOTES_FLAT;
    setRootNote(notes[idx]);
    setAccidental(mode);
  };

  // 指板の音をクリックしてルートを設定
  const handleNoteClick = (noteName) => {
    setRootNote(noteName);
  };

  const handleDiatonicKeyTypeChange = (value) => {
    const validDegrees = DIATONIC_CHORDS[`${value}-${diatonicChordSize}`].map((item) => item.value);
    setDiatonicKeyType(value);
    if (!validDegrees.includes(diatonicDegree)) setDiatonicDegree(validDegrees[0]);
  };

  const handleDiatonicChordSizeChange = (value) => {
    const validDegrees = DIATONIC_CHORDS[`${diatonicKeyType}-${value}`].map((item) => item.value);
    setDiatonicChordSize(value);
    if (!validDegrees.includes(diatonicDegree)) setDiatonicDegree(validDegrees[0]);
  };

  const [theme, setTheme] = useState("dark");
  const [hiddenDegrees, setHiddenDegrees] = useState(new Set());

  const DEGREE_BY_SEMITONE = ["P1","m2","M2","m3","M3","P4","b5","P5","m6","M6","m7","M7"];
  const SCALE_SEMITONES = {
    major: MAJOR_SCALE_DEGREES,
    "natural-minor": NATURAL_MINOR_SCALE_DEGREES,
    "major-penta": MAJOR_PENTA_DEGREES,
    "minor-penta": MINOR_PENTA_DEGREES,
    blues: BLUES_SCALE_DEGREES,
  };

  const handleAutoFilter = () => {
    const active = new Set();
    if (showScale) {
      for (const s of SCALE_SEMITONES[scaleType] ?? []) active.add(s);
    }
    if (showCaged) {
      for (const s of CHORD_SEMITONES.Major) active.add(s);
    }
    if (showChord) {
      let semitones;
      if (chordDisplayMode === "power") {
        semitones = CHORD_SEMITONES.power;
      } else if (chordDisplayMode === "diatonic") {
        const chord = getDiatonicChord(getRootIndex(rootNote), diatonicScaleType, diatonicDegree);
        semitones = CHORD_SEMITONES[chord.chordType];
      } else {
        semitones = CHORD_SEMITONES[chordType];
      }
      for (const s of semitones ?? []) active.add(s);
    }
    if (active.size === 0) { setHiddenDegrees(new Set()); return; }
    setHiddenDegrees(new Set(DEGREE_BY_SEMITONE.filter((_, i) => !active.has(i))));
  };

  const toggleDegree = (name) => {
    setHiddenDegrees((prev) => {
      const next = new Set(prev);
      if (next.has(name)) { next.delete(name); } else { next.add(name); }
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
      <div
        className={`rounded-xl p-4 space-y-4 ${
          theme === "dark" ? "bg-gray-900" : "bg-white border border-stone-300 shadow-sm"
        }`}
      >
        <Controls
          theme={theme}
          onThemeChange={() => setTheme((t) => t === "dark" ? "light" : "dark")}
          rootNote={rootNote}
          accidental={accidental}
          onAccidentalChange={handleAccidentalChange}
          showChord={showChord}
          setShowChord={setShowChord}
          chordDisplayMode={chordDisplayMode}
          setChordDisplayMode={setChordDisplayMode}
          showScale={showScale}
          setShowScale={setShowScale}
          scaleType={scaleType}
          setScaleType={setScaleType}
          showCaged={showCaged}
          setShowCaged={setShowCaged}
          cagedForms={cagedForms}
          toggleCagedForm={toggleCagedForm}
          chordType={chordType}
          setChordType={setChordType}
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

        <div className="mb-2 flex items-center justify-center gap-3 flex-wrap">
          <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-stone-600"}`}>
            ルート: <span className={`font-bold text-base ${theme === "dark" ? "text-white" : "text-stone-900"}`}>{rootNote}</span>
          </span>
          <div className={`inline-flex items-center gap-2 rounded-lg p-1 ${theme === "dark" ? "bg-gray-800" : "bg-stone-100"}`}>
            <span className={`w-12 px-2 text-sm font-semibold ${theme === "dark" ? "text-gray-300" : "text-stone-700"}`}>
              表示
            </span>
            {[
              { value: "note", label: "音名" },
              { value: "degree", label: "度数" },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setBaseLabelMode(value)}
                className={`w-[4rem] whitespace-nowrap px-2.5 py-1 rounded text-sm font-semibold transition-all ${
                  baseLabelMode === value
                    ? "bg-indigo-600 text-white"
                    : theme === "dark"
                      ? "bg-gray-700 text-gray-400 hover:bg-gray-600"
                      : "bg-white text-stone-600 hover:bg-stone-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <Fretboard
          theme={theme}
          rootNote={rootNote}
          accidental={accidental}
          baseLabelMode={baseLabelMode}
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
                <h3 className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-stone-600"}`}>度数</h3>
                <button
                  onClick={handleAutoFilter}
                  title="表示中のオーバーレイに合わせて絞り込む"
                  className={`text-xs px-2 py-0.5 rounded-full border transition-all ${
                    theme === "dark"
                      ? "border-gray-600 text-gray-400 hover:border-gray-400 hover:text-gray-200"
                      : "border-stone-300 text-stone-500 hover:border-stone-500 hover:text-stone-700"
                  }`}
                >
                  絞り込む
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
                  {hiddenDegrees.size > 0 ? "リセット" : "全非表示"}
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
                      <span className={`text-xs ${theme === "dark" ? "text-gray-300" : "text-stone-700"}`}>
                        {name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
