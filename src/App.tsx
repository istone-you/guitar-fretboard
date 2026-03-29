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
import { CHORD_QUIZ_TYPES_ALL, useQuiz } from "./hooks/useQuiz";
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

const DEFAULT_CHORD_QUIZ_TYPES: ChordType[] = ["Major", "Minor", "7th", "maj7", "m7"];

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
  const [chordQuizTypes, setChordQuizTypes] = useState<ChordType[]>(DEFAULT_CHORD_QUIZ_TYPES);
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
  const [highlightedOverlayNotes, setHighlightedOverlayNotes] = useState<Set<string>>(new Set());

  // レイヤー表示フラグ
  const [showChord, setShowChord] = useState(false);
  const [showScale, setShowScale] = useState(false);
  const [showCaged, setShowCaged] = useState(false);

  // コードフォーム設定
  const [chordDisplayMode, setChordDisplayMode] = useState<ChordDisplayMode>("form");
  const [chordType, setChordType] = useState<ChordType>("Major");
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

  const handleToggleOverlayNoteHighlight = (note: string) => {
    setHighlightedOverlayNotes((current) => {
      const next = new Set(current);
      if (next.has(note)) {
        next.delete(note);
      } else {
        next.add(note);
      }
      return next;
    });
  };

  const handleSetOverlayNoteHighlights = (notes: string[]) => {
    setHighlightedOverlayNotes(new Set(notes));
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
    quizSelectedCells,
    quizSelectedChoices,
    diatonicQuizKeyType,
    diatonicQuizChordSize,
    quizSelectedChordRoot,
    quizSelectedChordType,
    diatonicSelectedRoot,
    diatonicSelectedChordType,
    diatonicAllAnswers,
    diatonicEditingDegree,
    quizRevealNoteNames,
    handleQuizKindChange,
    handleQuizAnswer,
    handleChordQuizRootSelect,
    handleChordQuizTypeSelect,
    handleDiatonicAnswerRootSelect,
    handleDiatonicAnswerTypeSelect,
    handleDiatonicDegreeCardClick,
    handleDiatonicSubmitAll,
    handleFretboardQuizAnswer,
    handleNextQuestion,
    handleRetryQuestion,
    setDiatonicQuizKeyType,
    setDiatonicQuizChordSize,
    fretboardAllStrings,
    setFretboardAllStrings,
  } = useQuiz({
    accidental,
    chordQuizTypes,
    fretRange,
    rootNote,
    scaleType,
    showQuiz,
  });
  const triadLayout = triadInversion;
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
  const quizRootChangeEnabled =
    !showQuiz || quizMode === "degree" || quizMode === "scale" || quizMode === "diatonic";
  const quizNoteOptions = accidental === "sharp" ? [...NOTES_SHARP] : [...NOTES_FLAT];
  const allNotes = (() => {
    const notes = accidental === "sharp" ? NOTES_SHARP : NOTES_FLAT;
    const rootIdx = getRootIndex(rootNote);
    return [...notes.slice(rootIdx), ...notes.slice(0, rootIdx)];
  })();

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
          rootChangeDisabled={!quizRootChangeEnabled}
          onBaseLabelModeChange={setBaseLabelMode}
          onRootNoteChange={quizRootChangeEnabled ? handleNoteClick : () => {}}
          onFretRangeChange={setFretRange}
        />
        {showQuiz ? (
          <QuizFretboard
            theme={theme}
            rootNote={
              quizMode === "chord" && quizType === "choice" && quizQuestion?.promptChordRoot
                ? quizQuestion.promptChordRoot
                : rootNote
            }
            accidental={accidental}
            baseLabelMode={baseLabelMode}
            displaySize={fretboardDisplaySize}
            fretRange={fretRange}
            showChord={quizMode === "chord" && quizType === "choice"}
            chordDisplayMode={"form"}
            showScale={showScale}
            scaleType={scaleType}
            showCaged={showCaged}
            cagedForms={cagedForms}
            chordType={
              quizMode === "chord" && quizType === "choice" && quizQuestion?.promptChordType
                ? quizQuestion.promptChordType
                : chordType
            }
            triadPosition={triadLayout}
            diatonicScaleType={diatonicScaleType}
            diatonicDegree={diatonicDegree}
            onNoteClick={quizRootChangeEnabled ? handleNoteClick : () => {}}
            highlightedNotes={highlightedOverlayNotes}
            hiddenDegrees={hiddenDegrees}
            quizModeActive
            quizCell={
              quizQuestion && quizType === "choice" && quizMode !== "chord" && quizMode !== "scale"
                ? { stringIdx: quizQuestion.stringIdx, fret: quizQuestion.fret }
                : undefined
            }
            quizAnswerMode={quizType === "fretboard"}
            quizTargetString={
              quizType === "fretboard" &&
              quizMode !== "chord" &&
              quizMode !== "scale" &&
              !fretboardAllStrings
                ? quizQuestion?.stringIdx
                : undefined
            }
            quizAnsweredCell={quizAnsweredCell}
            quizCorrectCell={quizCorrectCell}
            quizSelectedCells={quizSelectedCells}
            onQuizCellClick={handleFretboardQuizAnswer}
            quizRevealNoteNames={quizRevealNoteNames}
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
            highlightedNotes={highlightedOverlayNotes}
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
              quizSelectedChoices={quizSelectedChoices}
              noteOptions={quizNoteOptions}
              quizSelectedChordRoot={quizSelectedChordRoot}
              quizSelectedChordType={quizSelectedChordType}
              diatonicSelectedRoot={diatonicSelectedRoot}
              diatonicSelectedChordType={diatonicSelectedChordType}
              diatonicAllAnswers={diatonicAllAnswers}
              diatonicEditingDegree={diatonicEditingDegree}
              diatonicQuizKeyType={diatonicQuizKeyType}
              diatonicQuizChordSize={diatonicQuizChordSize}
              chordQuizTypes={chordQuizTypes}
              availableChordQuizTypes={CHORD_QUIZ_TYPES_ALL}
              scaleType={scaleType}
              onKindChange={handleQuizKindChange}
              onChordQuizTypesChange={setChordQuizTypes}
              onScaleTypeChange={(value) => setScaleType(value as ScaleType)}
              onDiatonicQuizKeyTypeChange={setDiatonicQuizKeyType}
              onDiatonicQuizChordSizeChange={setDiatonicQuizChordSize}
              onAnswer={handleQuizAnswer}
              onChordQuizRootSelect={handleChordQuizRootSelect}
              onChordQuizTypeSelect={handleChordQuizTypeSelect}
              onDiatonicAnswerRootSelect={handleDiatonicAnswerRootSelect}
              onDiatonicAnswerTypeSelect={handleDiatonicAnswerTypeSelect}
              onDiatonicDegreeCardClick={handleDiatonicDegreeCardClick}
              onDiatonicSubmitAll={handleDiatonicSubmitAll}
              onNextQuestion={handleNextQuestion}
              onRetryQuestion={handleRetryQuestion}
              fretboardAllStrings={fretboardAllStrings}
              onFretboardAllStringsChange={setFretboardAllStrings}
            />
          </div>
        )}

        <FretboardFooter
          theme={theme}
          baseLabelMode={baseLabelMode}
          showQuiz={showQuiz}
          allNotes={allNotes}
          overlayNotes={overlayNotes}
          highlightedOverlayNotes={highlightedOverlayNotes}
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
          onSetOverlayNoteHighlights={handleSetOverlayNoteHighlights}
          onToggleOverlayNoteHighlight={handleToggleOverlayNoteHighlight}
          onToggleDegree={toggleDegree}
        />
      </main>
    </div>
  );
}
