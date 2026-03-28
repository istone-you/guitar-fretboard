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
  buildTriadVoicing,
  getDiatonicChord,
  getOpenChordForm,
  isInScale,
  calcCagedPositions,
  getRootIndex,
  type FretCell,
  type CagedPositionValue,
} from "../logic/fretboard";
import type {
  Theme,
  Accidental,
  BaseLabelMode,
  FretboardDisplaySize,
  ChordDisplayMode,
  ScaleType,
  ChordType,
  DegreeName,
} from "../types";

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

interface FretboardProps {
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
  hiddenDegrees?: Set<string>;
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
  hiddenDegrees = new Set(),
}: FretboardProps) {
  const [fretMin, fretMax] = fretRange;
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
      const cells = buildTriadVoicing(rootIndex, chordType, triadPosition);
      if (cells.length === 0) return [];

      const frets = cells.map((cell) => cell.fret);
      const strings = cells.map((cell) => cell.string);
      return [
        {
          id: `triad-${rootIndex}-${chordType}-${triadPosition}`,
          kind: "triad",
          cells,
          minFret: Math.min(...frets),
          maxFret: Math.max(...frets),
          minString: Math.min(...strings),
          maxString: Math.max(...strings),
        },
      ];
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

  // CAGEDポジションマップ（選択中の全フォームをマージ）
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
        {/* フレット番号ヘッダー */}
        <div className="flex mb-1">
          <div className="shrink-0" style={{ width: size.stringLabelWidth }} />
          {visibleFrets.map((fret) => (
            <FretHeader key={fret} fret={fret} theme={theme} size={size} />
          ))}
        </div>

        {/* ポジションマーク行 */}
        <div className="flex mb-2">
          <div className="shrink-0" style={{ width: size.stringLabelWidth }} />
          {visibleFrets.map((fret) => (
            <PositionMark key={fret} fret={fret} theme={theme} size={size} />
          ))}
        </div>

        {/* 指板本体（1弦 → 6弦、タブ譜標準：上が高音） */}
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
                  className="pointer-events-none absolute rounded-2xl border-2 border-amber-300/60 bg-amber-300/8 z-[6]"
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
              hiddenDegrees={hiddenDegrees}
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
      className={`shrink-0 text-center font-mono
      ${isDark ? "text-gray-500" : "text-stone-500"}
    `}
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
  if (!mark)
    return <div className="shrink-0" style={{ width: size.cellWidth, height: size.markHeight }} />;
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
  hiddenDegrees: Set<string>;
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
  hiddenDegrees,
}: StringRowProps) {
  const isDark = theme === "dark";
  const NOTES = accidental === "sharp" ? NOTES_SHARP : NOTES_FLAT;
  const openStringNotes = ["E", "A", "D", "G", "B", "E"];

  return (
    <div className="flex items-center mb-px">
      {/* 弦ラベル */}
      <div
        className={`shrink-0 text-right font-mono ${isDark ? "text-gray-400" : "text-stone-500"}`}
        style={{
          width: size.stringLabelWidth,
          paddingRight: size.stringLabelPaddingRight,
          fontSize: size.stringFontSize,
        }}
      >
        {openStringNotes[stringIdx]}
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

        // メインオーバーレイ（後勝ち = ボタン後半が前面に来る）
        // ボタン順: スケール < CAGED → 後ろほど前面
        let overlayColor: { bg: string; text: string } | null = null;
        let overlayLabel = noteName;

        if (showScale) {
          if (isInScale(semitone, scaleType)) {
            overlayColor = { bg: "#22c55e", text: "#fff" };
            overlayLabel = noteName;
          }
        }
        if (cagedCell) {
          overlayColor = { bg: cagedCell.color, text: "#fff" };
          overlayLabel = noteName;
        }

        const degreeHidden = hiddenDegrees.has(degreeName);

        return (
          <FretCellComponent
            key={fret}
            fret={fret}
            baseLabel={baseLabel}
            noteName={noteName}
            degreeRing={degreeHidden ? null : degreeRing}
            overlayColor={overlayColor}
            overlayLabel={overlayLabel}
            inChord={inChord}
            isRoot={isRoot}
            hidden={degreeHidden}
            opacity={opacity}
            theme={theme}
            size={size}
            onClick={() => onNoteClick(noteName)}
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
  overlayColor: { bg: string; text: string } | null;
  overlayLabel: string;
  inChord: boolean;
  isRoot: boolean;
  hidden: boolean;
  opacity: number;
  theme: Theme;
  size: (typeof FRETBOARD_SIZE_CONFIG)[FretboardDisplaySize];
  onClick: () => void;
}

function FretCellComponent({
  fret,
  baseLabel,
  noteName,
  degreeRing,
  overlayColor,
  overlayLabel,
  inChord,
  isRoot,
  hidden,
  opacity,
  theme,
  size,
  onClick,
}: FretCellComponentProps) {
  const isDark = theme === "dark";
  const shouldShowBaseLabel = !overlayColor && !inChord && !hidden;

  return (
    <div
      className={`shrink-0 relative flex items-center justify-center
        cursor-pointer
        ${isDark ? "border-l border-gray-600" : "border-l border-stone-300"}
        ${fret === 0 ? (isDark ? "border-r-4 border-r-gray-300" : "border-r-4 border-r-stone-500") : ""}
        ${isDark ? "hover:bg-gray-700/30" : "hover:bg-stone-200/70"} transition-colors
      `}
      style={{ width: size.cellWidth, height: size.rowHeight }}
      onClick={onClick}
    >
      {/* 弦ライン */}
      <div className="absolute inset-0 flex items-center pointer-events-none">
        <div className={`w-full h-px ${isDark ? "bg-gray-500" : "bg-stone-400"}`} />
      </div>

      {/* ルート共通ハイライト */}
      {isRoot && (
        <div
          className="absolute rounded-full border-2 border-red-500 z-[18]"
          style={{ inset: size.rootRingInset }}
        />
      )}

      {/* ベースレイヤー表示（音名 or 度数） */}
      {shouldShowBaseLabel && (
        <span
          className={`absolute font-mono z-0 select-none
          ${baseLabel.isDegree ? "font-bold" : ""}
        `}
          style={{ fontSize: size.baseFontSize }}
        >
          <span style={{ color: baseLabel.color }}>{baseLabel.text}</span>
        </span>
      )}

      {/* 度数表示時の色枠 */}
      {degreeRing && (
        <div
          className="absolute rounded-full border-2 z-[8]"
          style={{ inset: size.rootRingInset, borderColor: degreeRing.color }}
        />
      )}

      {/* メインオーバーレイ（スケール / CAGED） */}
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

      {/* コードフォームドット */}
      {inChord && (
        <div
          className="absolute rounded-full border-amber-500 z-20"
          style={{ inset: size.overlayInset, borderWidth: size.chordBorderWidth, opacity }}
        >
          <div className="w-full h-full rounded-full bg-amber-500 flex items-center justify-center">
            <span
              className="font-bold text-white leading-none"
              style={{ fontSize: size.overlayFontSize }}
            >
              {noteName}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
