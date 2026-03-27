import React, { useEffect, useState } from "react";
import Controls from "./components/Controls";
import Fretboard from "./components/Fretboard";
import { DIATONIC_CHORDS, NOTES_SHARP, NOTES_FLAT, getRootIndex } from "./logic/fretboard";

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

  useEffect(() => {
    const diatonicScaleType = `${diatonicKeyType}-${diatonicChordSize}`;
    const validDegrees = DIATONIC_CHORDS[diatonicScaleType].map((item) => item.value);
    if (!validDegrees.includes(diatonicDegree)) {
      setDiatonicDegree(validDegrees[0]);
    }
  }, [diatonicKeyType, diatonicChordSize, diatonicDegree]);

  const [theme, setTheme] = useState("dark");
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
          setDiatonicKeyType={setDiatonicKeyType}
          diatonicChordSize={diatonicChordSize}
          setDiatonicChordSize={setDiatonicChordSize}
          diatonicDegree={diatonicDegree}
          setDiatonicDegree={setDiatonicDegree}
        />

        <div className="mb-2 flex items-center justify-center gap-3 flex-wrap">
          <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-stone-600"}`}>
            Root: <span className={`font-bold text-base ${theme === "dark" ? "text-white" : "text-stone-900"}`}>{rootNote}</span>
          </span>
          <span className={`text-xs ${theme === "dark" ? "text-gray-600" : "text-stone-500"}`}>
            （指板の音をクリックしてルートを変更）
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
        />

        <div className="mt-4 min-h-[5.75rem]">
          {baseLabelMode === "degree" && (
            <>
              <h3
                className={`text-sm mb-3 text-center ${theme === "dark" ? "text-gray-400" : "text-stone-600"}`}
              >
                度数の凡例
              </h3>
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
                ].map(([name, color]) => (
                  <div key={name} className="flex items-center gap-1">
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: color }} />
                    <span
                      className={`text-xs ${theme === "dark" ? "text-gray-300" : "text-stone-700"}`}
                    >
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
