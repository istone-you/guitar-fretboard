import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./i18n";
import Controls from "./components/Controls/index";
import SettingsMenu from "./components/SettingsMenu/index";
import Fretboard from "./components/Fretboard/index";
import QuizPanel from "./components/QuizPanel/index";
import FretboardHeader from "./components/FretboardHeader/index";
import { useDegreeFilter } from "./hooks/useDegreeFilter";
import { useDiatonicSelection } from "./hooks/useDiatonicSelection";
import { usePersistedSetting } from "./hooks/usePersistedSetting";
import { useQuiz } from "./hooks/useQuiz";
import { NOTES_SHARP, NOTES_FLAT, getRootIndex } from "./logic/fretboard";
import type {
  Theme,
  Accidental,
  BaseLabelMode,
  FretboardDisplaySize,
  ChordDisplayMode,
  ScaleType,
  ChordType,
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
  // フレット範囲
  const [fretRange, setFretRange] = useState<[number, number]>([0, 14]);
  // クイズ機能
  const [showQuiz, setShowQuiz] = useState(false);
  // 臨時記号表示（sharp / flat）
  const [accidental, setAccidental] = usePersistedSetting<Accidental>(
    STORAGE_KEYS.accidental,
    readStoredAccidental,
  );
  // ベースレイヤー表示
  const [baseLabelMode, setBaseLabelMode] = useState<BaseLabelMode>("note");
  const [fretboardDisplaySize, setFretboardDisplaySize] = usePersistedSetting<FretboardDisplaySize>(
    STORAGE_KEYS.fretboardDisplaySize,
    readStoredFretboardDisplaySize,
  );

  const [theme, setTheme] = usePersistedSetting<Theme>(STORAGE_KEYS.theme, readStoredTheme);

  // レイヤー表示フラグ
  const [showChord, setShowChord] = useState(false);
  const [showScale, setShowScale] = useState(false);
  const [showCaged, setShowCaged] = useState(false);

  // コードフォーム設定
  const [chordDisplayMode, setChordDisplayMode] = useState<ChordDisplayMode>("form");
  const [chordType, setChordType] = useState<ChordType>("Major");
  const [triadStringSet, setTriadStringSet] = useState("1-3");
  const [triadInversion, setTriadInversion] = useState("root");
  const {
    diatonicKeyType,
    diatonicChordSize,
    diatonicDegree,
    setDiatonicDegree,
    handleDiatonicKeyTypeChange,
    handleDiatonicChordSizeChange,
  } = useDiatonicSelection();

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
  };

  // 指板の音をクリックしてルートを設定
  const handleNoteClick = (noteName: string) => {
    setRootNote(noteName);
  };

  const { hiddenDegrees, handleAutoFilter, toggleDegree, resetHiddenDegrees, hideAllDegrees } =
    useDegreeFilter();
  const {
    quizMode,
    quizType,
    quizQuestion,
    selectedAnswer,
    quizScore,
    quizAnsweredCell,
    quizCorrectFret,
    handleQuizModeChange,
    handleQuizTypeChange,
    handleQuizAnswer,
    handleFretboardQuizAnswer,
  } = useQuiz({
    accidental,
    fretRange,
    rootNote,
    showQuiz,
  });
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
        <SettingsMenu
          theme={theme}
          fretboardDisplaySize={fretboardDisplaySize}
          onFretboardDisplaySizeChange={setFretboardDisplaySize}
          onThemeChange={() =>
            setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"))
          }
          accidental={accidental}
          onAccidentalChange={handleAccidentalChange}
          showQuiz={showQuiz}
          setShowQuiz={setShowQuiz}
        />
        <Controls
          theme={theme}
          rootNote={rootNote}
          accidental={accidental}
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
          showQuiz={showQuiz}
        />

        <FretboardHeader
          theme={theme}
          rootNote={rootNote}
          accidental={accidental}
          baseLabelMode={baseLabelMode}
          fretRange={fretRange}
          showQuiz={showQuiz}
          onBaseLabelModeChange={setBaseLabelMode}
          onRootNoteChange={handleNoteClick}
          onFretRangeChange={setFretRange}
        />
        <Fretboard
          theme={theme}
          rootNote={rootNote}
          accidental={accidental}
          baseLabelMode={baseLabelMode}
          displaySize={fretboardDisplaySize}
          fretRange={fretRange}
          showChord={showQuiz ? false : showChord}
          chordDisplayMode={chordDisplayMode}
          showScale={showQuiz ? false : showScale}
          scaleType={scaleType}
          showCaged={showQuiz ? false : showCaged}
          cagedForms={cagedForms}
          chordType={chordType}
          triadPosition={triadLayout}
          diatonicScaleType={diatonicScaleType}
          diatonicDegree={diatonicDegree}
          onNoteClick={handleNoteClick}
          hiddenDegrees={hiddenDegrees}
          quizCell={
            showQuiz && quizQuestion && quizType === "choice"
              ? { stringIdx: quizQuestion.stringIdx, fret: quizQuestion.fret }
              : undefined
          }
          quizAnswerMode={showQuiz && quizType === "fretboard"}
          quizTargetString={
            showQuiz && quizType === "fretboard" ? quizQuestion?.stringIdx : undefined
          }
          quizAnsweredCell={quizAnsweredCell}
          quizCorrectFret={quizCorrectFret}
          onQuizCellClick={handleFretboardQuizAnswer}
        />

        {showQuiz && quizQuestion && (
          <div className="max-w-[840px] mx-auto w-full">
            <QuizPanel
              theme={theme}
              mode={quizMode}
              quizType={quizType}
              question={quizQuestion}
              score={quizScore}
              selectedAnswer={selectedAnswer}
              rootNote={rootNote}
              onModeChange={handleQuizModeChange}
              onQuizTypeChange={handleQuizTypeChange}
              onAnswer={handleQuizAnswer}
            />
          </div>
        )}

        <div className="mt-4 min-h-[5.75rem]">
          {baseLabelMode === "degree" && (
            <>
              <div className="flex items-center justify-center gap-2 mb-3">
                <h3 className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-stone-600"}`}>
                  {t("degreeFilter.title")}
                </h3>
                <button
                  onClick={() =>
                    handleAutoFilter({
                      rootNote,
                      showScale,
                      scaleType,
                      showCaged,
                      showChord,
                      chordDisplayMode,
                      diatonicScaleType,
                      diatonicDegree,
                      chordType,
                    })
                  }
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
                  onClick={() => (hiddenDegrees.size > 0 ? resetHiddenDegrees() : hideAllDegrees())}
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
