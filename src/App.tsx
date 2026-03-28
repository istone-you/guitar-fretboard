import { useMemo, useState } from "react";
import "./i18n";
import Controls from "./components/Controls/index";
import SettingsMenu from "./components/SettingsMenu/index";
import NormalFretboard from "./components/NormalFretboard/index";
import QuizFretboard from "./components/QuizFretboard/index";
import QuizPanel from "./components/QuizPanel/index";
import FretboardHeader from "./components/FretboardHeader/index";
import FretboardFooter from "./components/FretboardFooter/index";
import { useDegreeFilter } from "./hooks/useDegreeFilter";
import { useDiatonicSelection } from "./hooks/useDiatonicSelection";
import { usePersistedSetting } from "./hooks/usePersistedSetting";
import { useQuiz } from "./hooks/useQuiz";
import {
  NOTES_SHARP,
  NOTES_FLAT,
  getActiveOverlaySemitones,
  getRootIndex,
} from "./logic/fretboard";
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
    quizCorrectCell,
    handleQuizKindChange,
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
  const overlaySemitones = useMemo(
    () =>
      getActiveOverlaySemitones({
        rootNote,
        showScale,
        scaleType,
        showCaged,
        showChord,
        chordDisplayMode,
        diatonicScaleType,
        diatonicDegree,
        chordType,
      }),
    [
      rootNote,
      showScale,
      scaleType,
      showCaged,
      showChord,
      chordDisplayMode,
      diatonicScaleType,
      diatonicDegree,
      chordType,
    ],
  );
  const overlayNotes = useMemo(() => {
    const notes = accidental === "sharp" ? NOTES_SHARP : NOTES_FLAT;
    const rootIndex = getRootIndex(rootNote);
    return [...overlaySemitones]
      .sort((left, right) => left - right)
      .map((semitone) => notes[(rootIndex + semitone) % 12]);
  }, [accidental, overlaySemitones, rootNote]);

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
        {showQuiz ? (
          <QuizFretboard
            theme={theme}
            rootNote={rootNote}
            accidental={accidental}
            baseLabelMode={baseLabelMode}
            displaySize={fretboardDisplaySize}
            fretRange={fretRange}
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
            quizModeActive
            quizCell={
              quizQuestion && quizType === "choice" && quizMode !== "relative"
                ? { stringIdx: quizQuestion.stringIdx, fret: quizQuestion.fret }
                : undefined
            }
            quizAnswerMode={quizType === "fretboard"}
            quizTargetString={
              quizType === "fretboard" && quizMode !== "relative"
                ? quizQuestion?.stringIdx
                : undefined
            }
            quizAnsweredCell={quizAnsweredCell}
            quizCorrectCell={quizCorrectCell}
            onQuizCellClick={handleFretboardQuizAnswer}
            quizRevealNoteName={
              quizMode === "relative" && selectedAnswer !== null
                ? (quizQuestion?.correct ?? null)
                : null
            }
          />
        ) : (
          <NormalFretboard
            theme={theme}
            rootNote={rootNote}
            accidental={accidental}
            baseLabelMode={baseLabelMode}
            displaySize={fretboardDisplaySize}
            fretRange={fretRange}
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
        )}

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
              onKindChange={handleQuizKindChange}
              onAnswer={handleQuizAnswer}
            />
          </div>
        )}

        <FretboardFooter
          theme={theme}
          baseLabelMode={baseLabelMode}
          showQuiz={showQuiz}
          overlayNotes={overlayNotes}
          hiddenDegrees={hiddenDegrees}
          onAutoFilter={() =>
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
          onResetOrHideAll={() =>
            hiddenDegrees.size > 0 ? resetHiddenDegrees() : hideAllDegrees()
          }
          onToggleDegree={toggleDegree}
        />
      </main>
    </div>
  );
}
