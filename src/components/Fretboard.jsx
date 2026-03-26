import React, { useMemo } from 'react'
import {
  FRET_COUNT,
  NOTES,
  POSITION_MARKS,
  getNoteIndex,
  getDegreeName,
  calcDegree,
  DEGREE_COLORS,
  CHORD_FORMS_6TH,
  CHORD_FORMS_5TH,
  isInMajorScale,
  isInNaturalMinorScale,
  isInPowerChord,
  isInPenta,
  calcCagedPositions,
  getRootIndex,
} from '../logic/fretboard'

const STRING_COUNT = 6

export default function Fretboard({
  theme,
  rootNote,
  capo,
  baseLabelMode,
  showChord,
  showScale,
  scaleType,
  showPowerChord,
  showCaged,
  cagedForms,
  chordType,
  chordRootString,
  layerOpacity,
  onNoteClick,
}) {
  const rootIndex = getRootIndex(rootNote)
  const isDark = theme === 'dark'

  // コードフォームのポジションをセット化（弦×フレット → key）
  const chordPositions = useMemo(() => {
    if (!showChord) return new Set()
    const forms = chordRootString === 0 ? CHORD_FORMS_6TH : CHORD_FORMS_5TH
    const form = forms[chordType]
    if (!form) return new Set()

    // ルート音が指板上でどのフレットにあるかを探す（カポ考慮）
    const rootStringIdx = chordRootString // 0=6弦, 1=5弦
    let rootFret = -1
    for (let f = 0; f < FRET_COUNT; f++) {
      if (getNoteIndex(rootStringIdx, f, capo) === rootIndex) {
        rootFret = f
        break
      }
    }
    if (rootFret === -1) return new Set()

    const set = new Set()
    form.forEach(({ string, fretOffset }) => {
      const fret = rootFret + fretOffset
      if (fret >= 0 && fret < FRET_COUNT) {
        set.add(`${string}-${fret}`)
      }
    })
    return set
  }, [showChord, chordType, chordRootString, rootIndex, capo])

  // CAGEDポジションマップ（選択中の全フォームをマージ）
  const cagedPositions = useMemo(() => {
    if (!showCaged || cagedForms.size === 0) return new Map()
    const merged = new Map()
    for (const key of cagedForms) {
      for (const [cell, val] of calcCagedPositions(key, rootIndex, capo)) {
        if (!merged.has(cell) || val.degree === 'R') {
          merged.set(cell, val)
        }
      }
    }
    return merged
  }, [showCaged, cagedForms, rootIndex, capo])

  const opacity = layerOpacity / 100

  return (
    <div className="overflow-x-auto">
      <div className="min-w-max">
        {/* フレット番号ヘッダー */}
        <div className="flex mb-1">
          <div className="w-8 shrink-0" />
          {Array.from({ length: FRET_COUNT }, (_, fret) => (
            <FretHeader key={fret} fret={fret} capo={capo} theme={theme} />
          ))}
        </div>

        {/* ポジションマーク行 */}
        <div className="flex mb-2">
          <div className="w-8 shrink-0" />
          {Array.from({ length: FRET_COUNT }, (_, fret) => (
            <PositionMark key={fret} fret={fret} theme={theme} />
          ))}
        </div>

        {/* 指板本体（1弦 → 6弦、タブ譜標準：上が高音） */}
        {Array.from({ length: STRING_COUNT }, (_, i) => STRING_COUNT - 1 - i).map((stringIdx) => (
          <StringRow
            key={stringIdx}
            theme={theme}
            stringIdx={stringIdx}
            capo={capo}
            rootIndex={rootIndex}
            baseLabelMode={baseLabelMode}
            showScale={showScale}
            scaleType={scaleType}
            showPowerChord={showPowerChord}
            cagedPositions={cagedPositions}
            chordPositions={chordPositions}
            opacity={opacity}
            onNoteClick={onNoteClick}
          />
        ))}
      </div>
    </div>
  )
}

function FretHeader({ fret, capo, theme }) {
  const isDark = theme === 'dark'
  const isCapo = fret === capo && capo > 0
  return (
    <div className={`w-14 shrink-0 text-center text-sm font-mono
      ${isCapo ? 'text-yellow-400 font-bold' : isDark ? 'text-gray-500' : 'text-stone-500'}
    `}>
      {isCapo ? `♯${fret}` : fret}
    </div>
  )
}

function PositionMark({ fret, theme }) {
  const isDark = theme === 'dark'
  const mark = POSITION_MARKS[fret]
  if (!mark) return <div className="w-14 shrink-0 h-5" />
  return (
    <div className="w-14 shrink-0 h-5 flex items-center justify-center gap-1">
      {mark === 'double' ? (
        <>
          <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-gray-500' : 'bg-stone-400'}`} />
          <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-gray-500' : 'bg-stone-400'}`} />
        </>
      ) : (
        <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-gray-500' : 'bg-stone-400'}`} />
      )}
    </div>
  )
}

function StringRow({
  theme,
  stringIdx,
  capo,
  rootIndex,
  baseLabelMode,
  showScale,
  scaleType,
  showPowerChord,
  cagedPositions,
  chordPositions,
  opacity,
  onNoteClick,
}) {
  const isDark = theme === 'dark'
  const openStringNotes = ['E', 'A', 'D', 'G', 'B', 'E']

  return (
    <div className="flex items-center mb-px">
      {/* 弦ラベル */}
      <div className={`w-8 shrink-0 text-right pr-1 text-sm font-mono ${isDark ? 'text-gray-400' : 'text-stone-500'}`}>
        {openStringNotes[stringIdx]}
      </div>

      {Array.from({ length: FRET_COUNT }, (_, fret) => {
        const noteIdx = getNoteIndex(stringIdx, fret, capo)
        const noteName = NOTES[noteIdx]
        const semitone = calcDegree(noteIdx, rootIndex)
        const degreeName = getDegreeName(noteIdx, rootIndex)

        const isRoot = semitone === 0
        const inMajorScale = isInMajorScale(semitone)
        const inNaturalMinorScale = isInNaturalMinorScale(semitone)
        const inPowerChord = isInPowerChord(semitone)
        const inChord = chordPositions.has(`${stringIdx}-${fret}`)
        const inPenta = isInPenta(semitone, scaleType === 'minor-penta' ? 'minor' : 'major')
        const cagedCell = cagedPositions.get(`${stringIdx}-${fret}`)
        const baseLabel = baseLabelMode === 'degree'
          ? {
              text: degreeName,
              color: (DEGREE_COLORS[degreeName] || { bg: '#6b7280' }).bg,
              isDegree: true,
            }
          : {
              text: noteName,
              color: '#6b7280',
              isDegree: false,
            }
        const degreeRing = baseLabelMode === 'degree'
          ? { color: baseLabel.color, label: degreeName }
          : null

        // メインオーバーレイ（後勝ち = ボタン後半が前面に来る）
        // ボタン順: スケール < CAGED < パワーコード → 後ろほど前面
        let overlayColor = null
        let overlayLabel = noteName

        if (showScale) {
          const inSelectedScale = scaleType === 'major'
            ? inMajorScale
            : scaleType === 'natural-minor'
              ? inNaturalMinorScale
              : inPenta
          if (inSelectedScale) {
            overlayColor = { bg: '#22c55e', text: '#fff' }
            overlayLabel = noteName
          }
        }
        if (cagedCell) {
          overlayColor = { bg: cagedCell.color, text: '#fff' }
          overlayLabel = noteName
        }
        if (showPowerChord && inPowerChord) {
          overlayColor = { bg: '#3b82f6', text: '#fff' }
          overlayLabel = noteName
        }

        const isCapoFret = fret === capo && capo > 0

        return (
          <FretCell
            key={fret}
            fret={fret}
            baseLabel={baseLabel}
            noteName={noteName}
            degreeRing={degreeRing}
            overlayColor={overlayColor}
            overlayLabel={overlayLabel}
            inChord={inChord}
            isRoot={isRoot}
            isCapoFret={isCapoFret}
            opacity={opacity}
            theme={theme}
            onClick={() => onNoteClick(noteName)}
          />
        )
      })}
    </div>
  )
}

function FretCell({
  fret,
  baseLabel,
  noteName,
  degreeRing,
  overlayColor,
  overlayLabel,
  inChord,
  isRoot,
  isCapoFret,
  opacity,
  theme,
  onClick,
}) {
  const isDark = theme === 'dark'
  const shouldShowBaseLabel = !overlayColor && !inChord

  return (
    <div
      className={`w-14 h-10 shrink-0 relative flex items-center justify-center
        cursor-pointer
        ${isDark ? 'border-l border-gray-600' : 'border-l border-stone-300'}
        ${fret === 0 ? (isDark ? 'border-r-4 border-r-gray-300' : 'border-r-4 border-r-stone-500') : ''}
        ${isCapoFret ? 'border-l-4 border-l-yellow-400' : ''}
        ${isDark ? 'hover:bg-gray-700/30' : 'hover:bg-stone-200/70'} transition-colors
      `}
      onClick={onClick}
    >
      {/* 弦ライン */}
      <div className="absolute inset-0 flex items-center pointer-events-none">
        <div className={`w-full h-px ${isDark ? 'bg-gray-500' : 'bg-stone-400'}`} />
      </div>

      {/* ルート共通ハイライト */}
      {isRoot && (
        <div className="absolute inset-0.5 rounded-full border-2 border-red-500 z-[18]" />
      )}

      {/* ベースレイヤー表示（音名 or 度数） */}
      {shouldShowBaseLabel && (
        <span className={`absolute text-sm font-mono z-0 select-none
          ${baseLabel.isDegree ? 'font-bold' : ''}
        `}>
          <span style={{ color: baseLabel.color }}>
            {baseLabel.text}
          </span>
        </span>
      )}

      {/* 度数表示時の色枠 */}
      {degreeRing && (
        <div
          className="absolute inset-0.5 rounded-full border-2 z-[8]"
          style={{ borderColor: degreeRing.color }}
        />
      )}

      {/* メインオーバーレイ（スケール / CAGED / パワーコード） */}
      {overlayColor && (
        <div
          className="absolute inset-1 rounded-full flex items-center justify-center z-10"
          style={{
            backgroundColor: overlayColor.bg,
            color: overlayColor.text,
            opacity,
          }}
        >
          <span className="text-sm font-bold leading-none">{overlayLabel}</span>
        </div>
      )}

      {/* コードフォームドット */}
      {inChord && (
        <div
          className="absolute inset-1 rounded-full border-4 border-amber-500 z-20"
          style={{ opacity }}
        >
          <div className="w-full h-full rounded-full bg-amber-500 flex items-center justify-center">
            <span className="text-sm font-bold text-white leading-none">
              {noteName}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
