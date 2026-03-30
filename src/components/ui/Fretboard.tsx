import { useMemo } from "react";
import {
  FRET_COUNT,
  NOTES_SHARP,
  NOTES_FLAT,
  POSITION_MARKS,
  getNoteIndex,
  getDegreeName,
  calcDegree,
  DEGREE_COLORS,
  CHORD_FORMS_6TH,
  CHORD_FORMS_5TH,
  POWER_CHORD_FORMS,
  TRIAD_STRING_SET_OPTIONS,
  buildTriadVoicing,
  getDiatonicChord,
  getOpenChordForm,
  isInScale,
  calcCagedPositions,
  getRootIndex,
  type FretCell,
  type CagedPositionValue,
} from "../../logic/fretboard";
import type {
  Theme,
  Accidental,
  BaseLabelMode,
  FretboardDisplaySize,
  ChordDisplayMode,
  ScaleType,
  ChordType,
  DegreeName,
} from "../../types";

const STRING_COUNT = 6;
const FRETBOARD_SIZE_CONFIG: Record<
  FretboardDisplaySize,
  {
    cellWidth: number;
    stringLabelWidth: number;
    rowHeight: number;
    rowGap: number;
    headerFontSize: number;
    stringFontSize: number;
    markHeight: number;
    markerSize: number;
    markerGap: number;
    baseFontSize: number;
    overlayFontSize: number;
    stringLabelPaddingRight: number;
    rootRingInset: number;
    overlayInset: number;
    chordBorderWidth: number;
  }
> = {
  standard: {
    cellWidth: 56,
    stringLabelWidth: 32,
    rowHeight: 40,
    rowGap: 1,
    headerFontSize: 14,
    stringFontSize: 14,
    markHeight: 20,
    markerSize: 8,
    markerGap: 4,
    baseFontSize: 14,
    overlayFontSize: 14,
    stringLabelPaddingRight: 4,
    rootRingInset: 2,
    overlayInset: 4,
    chordBorderWidth: 4,
  },
  compact: {
    cellWidth: 41,
    stringLabelWidth: 23,
    rowHeight: 31,
    rowGap: 1,
    headerFontSize: 12,
    stringFontSize: 12,
    markHeight: 15,
    markerSize: 6,
    markerGap: 3,
    baseFontSize: 12,
    overlayFontSize: 12,
    stringLabelPaddingRight: 3,
    rootRingInset: 2,
    overlayInset: 3,
    chordBorderWidth: 3,
  },
  tiny: {
    cellWidth: 34,
    stringLabelWidth: 18,
    rowHeight: 26,
    rowGap: 1,
    headerFontSize: 10,
    stringFontSize: 10,
    markHeight: 12,
    markerSize: 4,
    markerGap: 2,
    baseFontSize: 10,
    overlayFontSize: 10,
    stringLabelPaddingRight: 2,
    rootRingInset: 1,
    overlayInset: 2,
    chordBorderWidth: 2,
  },
};

interface ChordGroup {
  id: string;
  kind: string;
  cells: FretCell[];
  minFret: number;
  maxFret: number;
  minString: number;
  maxString: number;
  rootStringIdx?: number;
}

function buildCellKey(cells: FretCell[]): string {
  return cells
    .map((cell) => `${cell.string}-${cell.fret}`)
    .sort()
    .join("|");
}

export interface FretboardProps {
  theme: Theme;
  rootNote: string;
  accidental: Accidental;
  baseLabelMode: BaseLabelMode;
  displaySize: FretboardDisplaySize;
  fretRange: [number, number];
  showChord: boolean;
  chordDisplayMode: ChordDisplayMode;
  showScale: boolean;
  scaleType: ScaleType;
  showCaged: boolean;
  cagedForms: Set<string>;
  chordType: ChordType;
  triadPosition: string;
  diatonicScaleType: string;
  diatonicDegree: string;
  onNoteClick: (noteName: string) => void;
  highlightedNotes?: Set<string>;
  hiddenDegrees?: Set<string>;
  quizModeActive?: boolean;
  quizCell?: { stringIdx: number; fret: number };
  quizAnswerMode?: boolean;
  quizTargetString?: number;
  quizAnsweredCell?: { stringIdx: number; fret: number } | null;
  quizCorrectCell?: { stringIdx: number; fret: number } | null;
  quizSelectedCells?: { stringIdx: number; fret: number }[];
  onQuizCellClick?: (stringIdx: number, fret: number) => void;
  quizRevealNoteNames?: string[] | null;
  suppressRegularDisplay?: boolean;
  hideChordNoteLabels?: boolean;
  chordOverlayTone?: "amber" | "indigo";
}

export default function Fretboard({
  theme,
  rootNote,
  accidental,
  baseLabelMode,
  displaySize,
  fretRange,
  showChord,
  chordDisplayMode,
  showScale,
  scaleType,
  showCaged,
  cagedForms,
  chordType,
  triadPosition,
  diatonicScaleType,
  diatonicDegree,
  onNoteClick,
  highlightedNotes = new Set(),
  hiddenDegrees = new Set(),
  quizModeActive = false,
  quizCell,
  quizAnswerMode = false,
  quizTargetString,
  quizAnsweredCell,
  quizCorrectCell,
  quizSelectedCells = [],
  onQuizCellClick,
  quizRevealNoteNames = null,
  suppressRegularDisplay = false,
  hideChordNoteLabels = false,
  chordOverlayTone = "amber",
}: FretboardProps) {
  const [fretMin, fretMax] = fretRange;
  const quizActive = quizModeActive && quizCell !== undefined;
  const size = FRETBOARD_SIZE_CONFIG[displaySize];
  const rootIndex = getRootIndex(rootNote);
  const diatonicChord =
    chordDisplayMode === "diatonic"
      ? getDiatonicChord(rootIndex, diatonicScaleType, diatonicDegree)
      : null;
  const effectiveDisplayMode = chordDisplayMode === "diatonic" ? "form" : chordDisplayMode;
  const effectiveRootIndex = diatonicChord != null ? diatonicChord.rootIndex : rootIndex;
  const effectiveChordType: ChordType = diatonicChord != null ? diatonicChord.chordType : chordType;

  const chordGroups = useMemo<ChordGroup[]>(() => {
    if (!showChord) return [];

    if (chordDisplayMode === "triad") {
      const groups: ChordGroup[] = [];
      for (const stringSetOpt of TRIAD_STRING_SET_OPTIONS) {
        const layoutValue = `${stringSetOpt.value}-${triadPosition}`;
        const cells = buildTriadVoicing(rootIndex, chordType, layoutValue);
        if (cells.length === 0) continue;
        const frets = cells.map((cell) => cell.fret);
        const strings = cells.map((cell) => cell.string);
        groups.push({
          id: `triad-${stringSetOpt.value}-${rootIndex}-${chordType}-${triadPosition}`,
          kind: "triad",
          cells,
          minFret: Math.min(...frets),
          maxFret: Math.max(...frets),
          minString: Math.min(...strings),
          maxString: Math.max(...strings),
        });
      }
      return groups;
    }

    const movableGroups: ChordGroup[] = [0, 1].flatMap((rootStringIdx) => {
      const fullForm =
        effectiveDisplayMode === "power"
          ? POWER_CHORD_FORMS[rootStringIdx]
          : (rootStringIdx === 0 ? CHORD_FORMS_6TH : CHORD_FORMS_5TH)[effectiveChordType];
      if (!fullForm) return [];

      let rootFret = -1;
      for (let fret = 0; fret < FRET_COUNT; fret++) {
        if (getNoteIndex(rootStringIdx, fret) === effectiveRootIndex) {
          rootFret = fret;
          break;
        }
      }
      if (rootFret === -1) return [];

      const cells = fullForm
        .map(({ string, fretOffset }) => ({ string, fret: rootFret + fretOffset }))
        .filter(({ fret }) => fret >= 0 && fret < FRET_COUNT);
      if (cells.length === 0) return [];

      const frets = cells.map((cell) => cell.fret);
      const strings = cells.map((cell) => cell.string);
      return [
        {
          id: `${rootStringIdx}-${effectiveDisplayMode}-${effectiveChordType}-${effectiveRootIndex}`,
          kind: rootStringIdx === 0 ? "6th" : "5th",
          rootStringIdx,
          cells,
          minFret: Math.min(...frets),
          maxFret: Math.max(...frets),
          minString: Math.min(...strings),
          maxString: Math.max(...strings),
        },
      ];
    });

    if (effectiveDisplayMode !== "form") return movableGroups;

    const openForm = getOpenChordForm(effectiveRootIndex, effectiveChordType);
    if (!openForm) return movableGroups;
    const openFormKey = buildCellKey(openForm);
    const overlapsMovableGroup = movableGroups.some(
      (group) => buildCellKey(group.cells) === openFormKey,
    );
    if (overlapsMovableGroup) return movableGroups;

    const frets = openForm.map((cell) => cell.fret);
    const strings = openForm.map((cell) => cell.string);
    return [
      ...movableGroups,
      {
        id: `open-${effectiveChordType}-${effectiveRootIndex}`,
        kind: "open",
        cells: openForm,
        minFret: Math.min(...frets),
        maxFret: Math.max(...frets),
        minString: Math.min(...strings),
        maxString: Math.max(...strings),
      },
    ];
  }, [
    showChord,
    chordDisplayMode,
    rootIndex,
    chordType,
    triadPosition,
    effectiveDisplayMode,
    effectiveChordType,
    effectiveRootIndex,
  ]);

  const chordPositions = useMemo(() => {
    const set = new Set<string>();
    chordGroups.forEach((group) => {
      group.cells.forEach(({ string, fret }) => {
        set.add(`${string}-${fret}`);
      });
    });
    return set;
  }, [chordGroups]);

  const cagedPositions = useMemo(() => {
    if (!showCaged || cagedForms.size === 0) return new Map<string, CagedPositionValue>();
    const merged = new Map<string, CagedPositionValue>();
    for (const key of cagedForms) {
      for (const [cell, val] of calcCagedPositions(key, rootIndex)) {
        if (!merged.has(cell) || val.degree === "R") {
          merged.set(cell, val);
        }
      }
    }
    return merged;
  }, [showCaged, cagedForms, rootIndex]);

  const opacity = 0.85;
  const visibleFrets = Array.from({ length: fretMax - fretMin + 1 }, (_, i) => fretMin + i);

  return (
    <div className="overflow-x-auto">
      <div className="w-fit mx-auto">
        <div className="flex mb-1">
          <div className="shrink-0" style={{ width: size.stringLabelWidth }} />
          {visibleFrets.map((fret) => (
            <FretHeader key={fret} fret={fret} theme={theme} size={size} />
          ))}
        </div>

        <div className="flex mb-2">
          <div className="shrink-0" style={{ width: size.stringLabelWidth }} />
          {visibleFrets.map((fret) => (
            <PositionMark key={fret} fret={fret} theme={theme} size={size} />
          ))}
        </div>

        <div className="relative">
          {chordGroups
            .filter((group) => group.maxFret >= fretMin && group.minFret <= fretMax)
            .map((group) => {
              const clampedMin = Math.max(group.minFret, fretMin);
              const clampedMax = Math.min(group.maxFret, fretMax);
              const top = (STRING_COUNT - 1 - group.maxString) * (size.rowHeight + size.rowGap);
              const left = size.stringLabelWidth + (clampedMin - fretMin) * size.cellWidth;
              const width = (clampedMax - clampedMin + 1) * size.cellWidth;
              const height =
                (group.maxString - group.minString + 1) * size.rowHeight +
                (group.maxString - group.minString) * size.rowGap;

              return (
                <div
                  key={group.id}
                  className={`pointer-events-none absolute rounded-2xl border-2 z-[6] ${
                    hideChordNoteLabels
                      ? "animate-pulse border-sky-500/70 bg-sky-500/10"
                      : "border-amber-300/60 bg-amber-300/8"
                  }`}
                  style={{ top, left, width, height }}
                />
              );
            })}

          {Array.from({ length: STRING_COUNT }, (_, i) => STRING_COUNT - 1 - i).map((stringIdx) => (
            <StringRow
              key={stringIdx}
              theme={theme}
              stringIdx={stringIdx}
              accidental={accidental}
              rootIndex={rootIndex}
              baseLabelMode={baseLabelMode}
              showScale={showScale}
              scaleType={scaleType}
              cagedPositions={cagedPositions}
              chordPositions={chordPositions}
              opacity={opacity}
              size={size}
              visibleFrets={visibleFrets}
              onNoteClick={onNoteClick}
              highlightedNotes={highlightedNotes}
              hiddenDegrees={hiddenDegrees}
              quizActive={quizActive}
              quizTargetFret={quizCell?.stringIdx === stringIdx ? quizCell.fret : null}
              quizAnswerMode={quizAnswerMode}
              quizTargetString={quizTargetString}
              quizAnsweredCell={quizAnsweredCell}
              quizCorrectCell={quizCorrectCell}
              quizSelectedCells={quizSelectedCells}
              onQuizCellClick={onQuizCellClick}
              quizRevealNoteNames={quizRevealNoteNames}
              suppressRegularDisplay={suppressRegularDisplay}
              hideChordNoteLabels={hideChordNoteLabels}
              chordOverlayTone={chordOverlayTone}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface FretHeaderProps {
  fret: number;
  theme: Theme;
  size: (typeof FRETBOARD_SIZE_CONFIG)[FretboardDisplaySize];
}

function FretHeader({ fret, theme, size }: FretHeaderProps) {
  const isDark = theme === "dark";
  return (
    <div
      className={`shrink-0 text-center font-mono ${isDark ? "text-gray-500" : "text-stone-500"}`}
      style={{ width: size.cellWidth, fontSize: size.headerFontSize }}
    >
      {fret}
    </div>
  );
}

interface PositionMarkProps {
  fret: number;
  theme: Theme;
  size: (typeof FRETBOARD_SIZE_CONFIG)[FretboardDisplaySize];
}

function PositionMark({ fret, theme, size }: PositionMarkProps) {
  const isDark = theme === "dark";
  const mark = POSITION_MARKS[fret];
  if (!mark) {
    return <div className="shrink-0" style={{ width: size.cellWidth, height: size.markHeight }} />;
  }
  return (
    <div
      className="shrink-0 flex items-center justify-center"
      style={{ width: size.cellWidth, height: size.markHeight, gap: size.markerGap }}
    >
      {mark === "double" ? (
        <>
          <div
            className={`rounded-full ${isDark ? "bg-gray-500" : "bg-stone-400"}`}
            style={{ width: size.markerSize, height: size.markerSize }}
          />
          <div
            className={`rounded-full ${isDark ? "bg-gray-500" : "bg-stone-400"}`}
            style={{ width: size.markerSize, height: size.markerSize }}
          />
        </>
      ) : (
        <div
          className={`rounded-full ${isDark ? "bg-gray-500" : "bg-stone-400"}`}
          style={{ width: size.markerSize, height: size.markerSize }}
        />
      )}
    </div>
  );
}

interface StringRowProps {
  theme: Theme;
  stringIdx: number;
  accidental: Accidental;
  rootIndex: number;
  baseLabelMode: BaseLabelMode;
  showScale: boolean;
  scaleType: ScaleType;
  cagedPositions: Map<string, CagedPositionValue>;
  chordPositions: Set<string>;
  opacity: number;
  size: (typeof FRETBOARD_SIZE_CONFIG)[FretboardDisplaySize];
  visibleFrets: number[];
  onNoteClick: (noteName: string) => void;
  highlightedNotes: Set<string>;
  hiddenDegrees: Set<string>;
  quizActive: boolean;
  quizTargetFret: number | null;
  quizAnswerMode?: boolean;
  quizTargetString?: number;
  quizAnsweredCell?: { stringIdx: number; fret: number } | null;
  quizCorrectCell?: { stringIdx: number; fret: number } | null;
  quizSelectedCells?: { stringIdx: number; fret: number }[];
  onQuizCellClick?: (stringIdx: number, fret: number) => void;
  quizRevealNoteNames?: string[] | null;
  suppressRegularDisplay?: boolean;
  hideChordNoteLabels?: boolean;
  chordOverlayTone?: "amber" | "indigo";
}

function StringRow({
  theme,
  stringIdx,
  accidental,
  rootIndex,
  baseLabelMode,
  showScale,
  scaleType,
  cagedPositions,
  chordPositions,
  opacity,
  size,
  visibleFrets,
  onNoteClick,
  highlightedNotes,
  hiddenDegrees,
  quizActive,
  quizTargetFret,
  quizAnswerMode = false,
  quizTargetString,
  quizAnsweredCell,
  quizCorrectCell,
  quizSelectedCells = [],
  onQuizCellClick,
  quizRevealNoteNames,
  suppressRegularDisplay = false,
  hideChordNoteLabels = false,
  chordOverlayTone = "amber",
}: StringRowProps) {
  const isDark = theme === "dark";
  const NOTES = accidental === "sharp" ? NOTES_SHARP : NOTES_FLAT;
  const openStringNotes = ["E", "A", "D", "G", "B", "E"];
  const shouldSuppressRegularDisplay = suppressRegularDisplay || quizActive || quizAnswerMode;

  const isTargetString =
    quizAnswerMode && (quizTargetString == null || stringIdx === quizTargetString);
  const isNonTargetString =
    quizAnswerMode && quizTargetString != null && stringIdx !== quizTargetString;

  return (
    <div
      className="flex items-center mb-px"
      style={{ opacity: isNonTargetString ? 0.3 : undefined }}
    >
      <div
        className={`shrink-0 text-right font-mono ${isDark ? "text-gray-400" : "text-stone-500"}`}
        style={{
          width: size.stringLabelWidth,
          paddingRight: size.stringLabelPaddingRight,
          fontSize: size.stringFontSize,
        }}
      >
        {!shouldSuppressRegularDisplay && openStringNotes[stringIdx]}
      </div>

      {visibleFrets.map((fret) => {
        const noteIdx = getNoteIndex(stringIdx, fret);
        const noteName = NOTES[noteIdx];
        const semitone = calcDegree(noteIdx, rootIndex);
        const degreeName = getDegreeName(noteIdx, rootIndex);

        const isRoot = semitone === 0;
        const inChord = chordPositions.has(`${stringIdx}-${fret}`);
        const cagedCell = cagedPositions.get(`${stringIdx}-${fret}`);
        const baseLabel =
          baseLabelMode === "degree"
            ? {
                text: degreeName,
                color: (DEGREE_COLORS[degreeName] || { bg: "#6b7280" }).bg,
                isDegree: true,
              }
            : {
                text: noteName,
                color: "#6b7280",
                isDegree: false,
              };
        const degreeRing =
          baseLabelMode === "degree" ? { color: baseLabel.color, label: degreeName } : null;
        const isHighlighted = baseLabelMode === "note" && highlightedNotes.has(noteName);

        let overlayColor: { bg: string; text: string } | null = null;
        let overlayLabel = noteName;

        if (showScale && isInScale(semitone, scaleType)) {
          overlayColor = { bg: "#22c55e", text: "#fff" };
          overlayLabel = noteName;
        }
        if (cagedCell) {
          overlayColor = { bg: cagedCell.color, text: "#fff" };
          overlayLabel = noteName;
        }

        const degreeHidden = baseLabelMode === "degree" && hiddenDegrees.has(degreeName);
        const isAnswered = quizAnswerMode && quizAnsweredCell != null;
        const isTappedCell =
          isAnswered &&
          quizAnsweredCell?.stringIdx === stringIdx &&
          quizAnsweredCell?.fret === fret;
        const isCorrectCell =
          isAnswered && quizCorrectCell?.stringIdx === stringIdx && quizCorrectCell?.fret === fret;
        const isSelectedCell = quizSelectedCells.some(
          (cell) => cell.stringIdx === stringIdx && cell.fret === fret,
        );
        const shouldRevealChoiceAnswer =
          quizRevealNoteNames != null && quizRevealNoteNames.includes(noteName);

        let quizAnswerOverlay: "correct" | "wrong" | "correct-hint" | null = null;
        if (isTappedCell) {
          quizAnswerOverlay = isCorrectCell ? "correct" : "wrong";
        } else if (isCorrectCell && !isTappedCell) {
          quizAnswerOverlay = "correct-hint";
        }

        const handleClick = () => {
          if (quizAnswerMode) {
            if (isTargetString && !isAnswered && onQuizCellClick) {
              onQuizCellClick(stringIdx, fret);
            }
            return;
          }
          onNoteClick(noteName);
        };

        return (
          <FretCellComponent
            key={fret}
            fret={fret}
            baseLabel={baseLabel}
            noteName={noteName}
            degreeRing={degreeHidden || shouldSuppressRegularDisplay ? null : degreeRing}
            isHighlighted={isHighlighted}
            overlayColor={overlayColor}
            overlayLabel={overlayLabel}
            inChord={inChord}
            isRoot={isRoot}
            hidden={degreeHidden}
            opacity={opacity}
            theme={theme}
            size={size}
            onClick={handleClick}
            isQuizTarget={fret === quizTargetFret}
            suppressRegularDisplay={shouldSuppressRegularDisplay}
            hideChordNoteLabels={hideChordNoteLabels}
            chordOverlayTone={chordOverlayTone}
            quizAnswerMode={quizAnswerMode}
            isTargetStringCell={isTargetString}
            isAnswered={isAnswered}
            isSelectedCell={isSelectedCell}
            quizAnswerOverlay={quizAnswerOverlay}
            showChoiceAnswerReveal={shouldRevealChoiceAnswer}
          />
        );
      })}
    </div>
  );
}

interface BaseLabelInfo {
  text: string;
  color: string;
  isDegree: boolean;
}

interface DegreeRingInfo {
  color: string;
  label: DegreeName;
}

interface FretCellComponentProps {
  fret: number;
  baseLabel: BaseLabelInfo;
  noteName: string;
  degreeRing: DegreeRingInfo | null;
  isHighlighted: boolean;
  overlayColor: { bg: string; text: string } | null;
  overlayLabel: string;
  inChord: boolean;
  isRoot: boolean;
  hidden: boolean;
  opacity: number;
  theme: Theme;
  size: (typeof FRETBOARD_SIZE_CONFIG)[FretboardDisplaySize];
  onClick: () => void;
  isQuizTarget: boolean;
  suppressRegularDisplay: boolean;
  hideChordNoteLabels?: boolean;
  chordOverlayTone?: "amber" | "indigo";
  quizAnswerMode?: boolean;
  isTargetStringCell?: boolean;
  isAnswered?: boolean;
  isSelectedCell?: boolean;
  quizAnswerOverlay?: "correct" | "wrong" | "correct-hint" | null;
  showChoiceAnswerReveal?: boolean;
}

function FretCellComponent({
  fret,
  baseLabel,
  noteName,
  degreeRing,
  isHighlighted,
  overlayColor,
  overlayLabel,
  inChord,
  isRoot,
  hidden,
  opacity,
  theme,
  size,
  onClick,
  isQuizTarget,
  suppressRegularDisplay,
  hideChordNoteLabels = false,
  chordOverlayTone = "amber",
  quizAnswerMode = false,
  isTargetStringCell = false,
  isAnswered = false,
  isSelectedCell = false,
  quizAnswerOverlay = null,
  showChoiceAnswerReveal = false,
}: FretCellComponentProps) {
  const isDark = theme === "dark";
  const shouldShowBaseLabel = !overlayColor && !inChord && !hidden && !suppressRegularDisplay;
  const chordOverlayClass =
    chordOverlayTone === "indigo" ? "border-sky-500 bg-sky-500" : "border-amber-500 bg-amber-500";

  return (
    <div
      className={`shrink-0 relative flex items-center justify-center cursor-pointer ${
        isDark ? "border-l border-gray-600" : "border-l border-stone-300"
      } ${
        fret === 0
          ? isDark
            ? "border-r-4 border-r-gray-300"
            : "border-r-4 border-r-stone-500"
          : ""
      } ${
        isDark
          ? "[@media(hover:hover)]:hover:bg-gray-700/30"
          : "[@media(hover:hover)]:hover:bg-stone-200/70"
      } transition-colors`}
      style={{ width: size.cellWidth, height: size.rowHeight }}
      onClick={onClick}
    >
      <div className="absolute inset-0 flex items-center pointer-events-none">
        <div className={`w-full h-px ${isDark ? "bg-gray-500" : "bg-stone-400"}`} />
      </div>

      {isRoot && !suppressRegularDisplay && (
        <div
          className="absolute rounded-full border-2 border-red-500 z-[18]"
          style={{ inset: size.rootRingInset }}
        />
      )}

      {shouldShowBaseLabel && (
        <span
          className={`absolute font-mono z-0 select-none ${baseLabel.isDegree ? "font-bold" : ""}`}
          style={{ fontSize: size.baseFontSize }}
        >
          <span style={{ color: baseLabel.color }}>{baseLabel.text}</span>
        </span>
      )}

      {degreeRing && (
        <div
          className="absolute rounded-full border-2 z-[8]"
          style={{ inset: size.rootRingInset, borderColor: degreeRing.color }}
        />
      )}

      {isHighlighted && (
        <div
          className={`absolute rounded-full border-2 z-[9] ${
            isDark ? "border-sky-300" : "border-sky-500"
          }`}
          style={{ inset: Math.max(0, size.rootRingInset - 1) }}
        />
      )}

      {overlayColor && (
        <div
          className="absolute rounded-full flex items-center justify-center z-10"
          style={{
            inset: size.overlayInset,
            backgroundColor: overlayColor.bg,
            color: overlayColor.text,
            opacity,
          }}
        >
          <span className="font-bold leading-none" style={{ fontSize: size.overlayFontSize }}>
            {overlayLabel}
          </span>
        </div>
      )}

      {inChord && (
        <div
          className={`absolute rounded-full z-20 ${hideChordNoteLabels ? "" : chordOverlayClass.split(" ")[0]}`}
          style={{
            inset: size.overlayInset,
            borderWidth: hideChordNoteLabels ? 0 : size.chordBorderWidth,
            opacity,
          }}
        >
          <div
            className={`w-full h-full rounded-full flex items-center justify-center ${
              chordOverlayClass.split(" ")[1]
            } ${hideChordNoteLabels ? "animate-pulse" : ""}`}
          >
            {hideChordNoteLabels ? (
              <span
                className="font-bold text-white leading-none"
                style={{ fontSize: size.overlayFontSize }}
              >
                ?
              </span>
            ) : (
              <span
                className="font-bold text-white leading-none"
                style={{ fontSize: size.overlayFontSize }}
              >
                {noteName}
              </span>
            )}
          </div>
        </div>
      )}

      {isQuizTarget && (
        <div
          className="absolute rounded-full flex items-center justify-center z-30 animate-pulse"
          style={{ inset: size.overlayInset, backgroundColor: "#0ea5e9" }}
        >
          <span
            className="font-bold text-white leading-none"
            style={{ fontSize: size.overlayFontSize }}
          >
            ?
          </span>
        </div>
      )}

      {showChoiceAnswerReveal && (
        <div
          className="absolute rounded-full flex items-center justify-center z-29"
          style={{ inset: size.overlayInset, backgroundColor: "#16a34a", opacity: 0.75 }}
        >
          <span
            className="font-bold text-white leading-none"
            style={{ fontSize: size.overlayFontSize }}
          >
            {noteName}
          </span>
        </div>
      )}

      {isSelectedCell && !isAnswered && (
        <div
          className="absolute rounded-full flex items-center justify-center z-29"
          style={{ inset: size.overlayInset, backgroundColor: "#16a34a", opacity: 0.9 }}
        >
          <span
            className="font-bold text-white leading-none"
            style={{ fontSize: size.overlayFontSize }}
          >
            {noteName}
          </span>
        </div>
      )}

      {quizAnswerMode && isTargetStringCell && !isAnswered && (
        <div
          className="absolute rounded-full border-2 border-sky-400/50 z-[15]"
          style={{ inset: size.overlayInset }}
        />
      )}

      {quizAnswerOverlay === "correct" && (
        <div
          className="absolute rounded-full flex items-center justify-center z-30"
          style={{ inset: size.overlayInset, backgroundColor: "#16a34a" }}
        >
          <span
            className="font-bold text-white leading-none"
            style={{ fontSize: size.overlayFontSize }}
          >
            {noteName}
          </span>
        </div>
      )}
      {quizAnswerOverlay === "wrong" && (
        <div
          className="absolute rounded-full flex items-center justify-center z-30"
          style={{ inset: size.overlayInset, backgroundColor: "#ef4444" }}
        >
          <span
            className="font-bold text-white leading-none"
            style={{ fontSize: size.overlayFontSize }}
          >
            {noteName}
          </span>
        </div>
      )}
      {quizAnswerOverlay === "correct-hint" && (
        <div
          className="absolute rounded-full flex items-center justify-center z-29"
          style={{ inset: size.overlayInset, backgroundColor: "#16a34a", opacity: 0.7 }}
        >
          <span
            className="font-bold text-white leading-none"
            style={{ fontSize: size.overlayFontSize }}
          >
            {noteName}
          </span>
        </div>
      )}
    </div>
  );
}
