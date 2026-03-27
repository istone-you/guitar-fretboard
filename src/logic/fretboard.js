// 音名配列（半音12音）
export const NOTES_SHARP = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B']
export const NOTES_FLAT  = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B']
export const NOTES = NOTES_FLAT // 後方互換

// スタンダードチューニング（6弦から1弦、開放弦の音名インデックス）
// 6弦=E2, 5弦=A2, 4弦=D3, 3弦=G3, 2弦=B3, 1弦=E4
export const OPEN_STRINGS = [4, 9, 2, 7, 11, 4] // E, A, D, G, B, E

// フレット数（0〜14フレット = 15フレット分）
export const FRET_COUNT = 15

// ポジションマーク（シングル: 3,5,7,9、ダブル: 12）
export const POSITION_MARKS = {
  3: 'single',
  5: 'single',
  7: 'single',
  9: 'single',
  12: 'double',
}

// 指定弦・フレットの音名インデックスを返す（カポ考慮）
export function getNoteIndex(stringIndex, fret, capo = 0) {
  const effectiveFret = fret + capo
  return (OPEN_STRINGS[stringIndex] + effectiveFret) % 12
}

// 指定弦・フレットの音名を返す
export function getNoteName(stringIndex, fret, capo = 0) {
  return NOTES[getNoteIndex(stringIndex, fret, capo)]
}

// 度数名配列（半音インターバル → 度数表記）
export const DEGREE_NAMES = [
  'P1',  // 0: 完全1度
  'm2',  // 1: 短2度
  'M2',  // 2: 長2度
  'm3',  // 3: 短3度
  'M3',  // 4: 長3度
  'P4',  // 5: 完全4度
  'b5',  // 6: 減5度
  'P5',  // 7: 完全5度
  'm6',  // 9: 短6度
  'M6',  // 10: 長6度
  'm7',  // 11: 短7度
  'M7',  // 12: 長7度
]

// 実際に使う度数マップ（0〜11の半音 → 度数名）
export const SEMITONE_TO_DEGREE = [
  'P1',  // 0
  'm2',  // 1
  'M2',  // 2
  'm3',  // 3
  'M3',  // 4
  'P4',  // 5
  'b5',  // 6
  'P5',  // 7
  'm6',  // 8
  'M6',  // 9
  'm7',  // 10
  'M7',  // 11
]

// 度数計算: (TargetNoteIndex - RootNoteIndex + 12) % 12
export function calcDegree(noteIndex, rootIndex) {
  return (noteIndex - rootIndex + 12) % 12
}

// 度数名を返す
export function getDegreeName(noteIndex, rootIndex) {
  const semitone = calcDegree(noteIndex, rootIndex)
  return SEMITONE_TO_DEGREE[semitone]
}

// 度数の色マッピング
export const DEGREE_COLORS = {
  'P1':  { bg: '#ef4444', text: '#fff' },   // 赤: 完全1度
  'P5':  { bg: '#3b82f6', text: '#fff' },   // 青: 5度
  'M3':  { bg: '#22c55e', text: '#fff' },   // 緑: 長3度
  'm3':  { bg: '#a855f7', text: '#fff' },   // 紫: 短3度
  'M7':  { bg: '#f59e0b', text: '#fff' },   // 橙: 長7度
  'm7':  { bg: '#f97316', text: '#fff' },   // オレンジ: 短7度
  'P4':  { bg: '#06b6d4', text: '#fff' },   // シアン: 4度
  'M2':  { bg: '#84cc16', text: '#fff' },   // 黄緑: 長2度
  'm2':  { bg: '#ec4899', text: '#fff' },   // ピンク
  'm6':  { bg: '#8b5cf6', text: '#fff' },
  'M6':  { bg: '#10b981', text: '#fff' },
  'b5':  { bg: '#6b7280', text: '#fff' },
}

// ===== コードフォーム定義 =====
// 各コードの「フォーム」を相対フレット・弦のオフセットで定義
// rootString: 0=6弦, 1=5弦
// positions: [{string, fretOffset}] fretOffsetはルートフレットからの差分

// 6弦ルートのバレーコードフォーム
export const CHORD_FORMS_6TH = {
  'Major':    [
    { string: 0, fretOffset: 0 },  // 6弦ルート
    { string: 1, fretOffset: 2 },  // 5弦
    { string: 2, fretOffset: 2 },  // 4弦
    { string: 3, fretOffset: 1 },  // 3弦
    { string: 4, fretOffset: 0 },  // 2弦
    { string: 5, fretOffset: 0 },  // 1弦
  ],
  'Minor':    [
    { string: 0, fretOffset: 0 },
    { string: 1, fretOffset: 2 },
    { string: 2, fretOffset: 2 },
    { string: 3, fretOffset: 0 },
    { string: 4, fretOffset: 0 },
    { string: 5, fretOffset: 0 },
  ],
  '7th':      [
    { string: 0, fretOffset: 0 },
    { string: 1, fretOffset: 2 },
    { string: 2, fretOffset: 0 },
    { string: 3, fretOffset: 1 },
    { string: 4, fretOffset: 0 },
    { string: 5, fretOffset: 0 },
  ],
  'maj7':     [
    { string: 0, fretOffset: 0 },
    { string: 1, fretOffset: 2 },
    { string: 2, fretOffset: 1 },
    { string: 3, fretOffset: 1 },
    { string: 4, fretOffset: 0 },
    { string: 5, fretOffset: 0 },
  ],
  'm7':       [
    { string: 0, fretOffset: 0 },
    { string: 1, fretOffset: 2 },
    { string: 2, fretOffset: 0 },
    { string: 3, fretOffset: 0 },
    { string: 4, fretOffset: 0 },
    { string: 5, fretOffset: 0 },
  ],
  'm7(b5)':  [
    { string: 0, fretOffset: 0 },
    { string: 1, fretOffset: 1 },
    { string: 2, fretOffset: 0 },
    { string: 3, fretOffset: 0 },
    { string: 4, fretOffset: -1 },
    { string: 5, fretOffset: 0 },
  ],
  'dim7':     [
    { string: 0, fretOffset: 0 },
    { string: 1, fretOffset: 1 },
    { string: 2, fretOffset: 2 },
    { string: 3, fretOffset: 0 },
    { string: 4, fretOffset: 2 },
    { string: 5, fretOffset: 0 },
  ],
  'm(maj7)':  [
    { string: 0, fretOffset: 0 },
    { string: 1, fretOffset: 2 },
    { string: 2, fretOffset: 1 },
    { string: 3, fretOffset: 0 },
    { string: 4, fretOffset: 0 },
    { string: 5, fretOffset: 0 },
  ],
}

// 5弦ルートのバレーコードフォーム
export const CHORD_FORMS_5TH = {
  'Major':   [
    { string: 1, fretOffset: 0 },  // 5弦ルート
    { string: 2, fretOffset: 2 },
    { string: 3, fretOffset: 2 },
    { string: 4, fretOffset: 2 },
    { string: 5, fretOffset: 0 },
  ],
  'Minor':   [
    { string: 1, fretOffset: 0 },
    { string: 2, fretOffset: 2 },
    { string: 3, fretOffset: 2 },
    { string: 4, fretOffset: 1 },
    { string: 5, fretOffset: 0 },
  ],
  '7th':     [
    { string: 1, fretOffset: 0 },
    { string: 2, fretOffset: 2 },
    { string: 3, fretOffset: 0 },
    { string: 4, fretOffset: 2 },
    { string: 5, fretOffset: 0 },
  ],
  'maj7':    [
    { string: 1, fretOffset: 0 },
    { string: 2, fretOffset: 2 },
    { string: 3, fretOffset: 1 },
    { string: 4, fretOffset: 2 },
    { string: 5, fretOffset: 0 },
  ],
  'm7':      [
    { string: 1, fretOffset: 0 },
    { string: 2, fretOffset: 2 },
    { string: 3, fretOffset: 0 },
    { string: 4, fretOffset: 1 },
    { string: 5, fretOffset: 0 },
  ],
  'm7(b5)': [
    { string: 1, fretOffset: 0 },
    { string: 2, fretOffset: 1 },
    { string: 3, fretOffset: 0 },
    { string: 4, fretOffset: 1 },
  ],
  'dim7':    [
    { string: 1, fretOffset: 0 },
    { string: 2, fretOffset: 1 },
    { string: 3, fretOffset: 2 },
    { string: 4, fretOffset: 1 },
    { string: 5, fretOffset: 2 },
  ],
  'm(maj7)': [
    { string: 1, fretOffset: 0 },
    { string: 2, fretOffset: 2 },
    { string: 3, fretOffset: 1 },
    { string: 4, fretOffset: 1 },
    { string: 5, fretOffset: 0 },
  ],
}

export const POWER_CHORD_FORMS = {
  0: [
    { string: 0, fretOffset: 0 },
    { string: 1, fretOffset: 2 },
  ],
  1: [
    { string: 1, fretOffset: 0 },
    { string: 2, fretOffset: 2 },
  ],
}

export const TRIAD_STRING_SET_OPTIONS = [
  { value: '1-3', label: '1~3弦', strings: [3, 4, 5] },
  { value: '2-4', label: '2~4弦', strings: [2, 3, 4] },
  { value: '3-5', label: '3~5弦', strings: [1, 2, 3] },
  { value: '4-6', label: '4~6弦', strings: [0, 1, 2] },
]

export const TRIAD_INVERSION_OPTIONS = [
  { value: 'root', label: '基本' },
  { value: 'first', label: '第一転回' },
  { value: 'second', label: '第二転回' },
]

export const TRIAD_LAYOUT_OPTIONS = TRIAD_STRING_SET_OPTIONS.flatMap((stringSet) =>
  TRIAD_INVERSION_OPTIONS.map((inversion) => ({
    value: `${stringSet.value}-${inversion.value}`,
    label: `${stringSet.label}（${inversion.label}）`,
    strings: stringSet.strings,
    inversion: inversion.value,
  }))
)

export function getTriadLayout(layoutValue) {
  return TRIAD_LAYOUT_OPTIONS.find((option) => option.value === layoutValue) ?? TRIAD_LAYOUT_OPTIONS[0]
}

const TRIAD_SHAPES = {
  '1-3-root': {
    Major: {
      anchorString: 3,
      positions: [
        { string: 3, fretOffset: 0 },
        { string: 4, fretOffset: 0 },
        { string: 5, fretOffset: -2 },
      ],
    },
    Minor: {
      anchorString: 3,
      positions: [
        { string: 3, fretOffset: 0 },
        { string: 4, fretOffset: -1 },
        { string: 5, fretOffset: -2 },
      ],
    },
    Diminished: {
      anchorString: 3,
      positions: [
        { string: 3, fretOffset: 0 },
        { string: 4, fretOffset: -1 },
        { string: 5, fretOffset: -3 },
      ],
    },
    Augmented: {
      anchorString: 3,
      positions: [
        { string: 3, fretOffset: 0 },
        { string: 4, fretOffset: 0 },
        { string: 5, fretOffset: -1 },
      ],
    },
  },
  '1-3-first': {
    Major: {
      anchorString: 5,
      positions: [
        { string: 3, fretOffset: 1 },
        { string: 4, fretOffset: 0 },
        { string: 5, fretOffset: 0 },
      ],
    },
    Minor: {
      anchorString: 5,
      positions: [
        { string: 3, fretOffset: 0 },
        { string: 4, fretOffset: 0 },
        { string: 5, fretOffset: 0 },
      ],
    },
    Diminished: {
      anchorString: 5,
      positions: [
        { string: 3, fretOffset: 0 },
        { string: 4, fretOffset: -1 },
        { string: 5, fretOffset: 0 },
      ],
    },
    Augmented: {
      anchorString: 5,
      positions: [
        { string: 3, fretOffset: 1 },
        { string: 4, fretOffset: 1 },
        { string: 5, fretOffset: 0 },
      ],
    },
  },
  '1-3-second': {
    Major: {
      anchorString: 4,
      positions: [
        { string: 3, fretOffset: -1 },
        { string: 4, fretOffset: 0 },
        { string: 5, fretOffset: -1 },
      ],
    },
    Minor: {
      anchorString: 4,
      positions: [
        { string: 3, fretOffset: -1 },
        { string: 4, fretOffset: 0 },
        { string: 5, fretOffset: -2 },
      ],
    },
    Diminished: {
      anchorString: 4,
      positions: [
        { string: 3, fretOffset: -2 },
        { string: 4, fretOffset: 0 },
        { string: 5, fretOffset: -2 },
      ],
    },
    Augmented: {
      anchorString: 4,
      positions: [
        { string: 3, fretOffset: 0 },
        { string: 4, fretOffset: 0 },
        { string: 5, fretOffset: -1 },
      ],
    },
  },
  '2-4-root': {
    Major: {
      anchorString: 2,
      positions: [
        { string: 2, fretOffset: 0 },
        { string: 3, fretOffset: -1 },
        { string: 4, fretOffset: -2 },
      ],
    },
    Minor: {
      anchorString: 2,
      positions: [
        { string: 2, fretOffset: 0 },
        { string: 3, fretOffset: -2 },
        { string: 4, fretOffset: -2 },
      ],
    },
    Diminished: {
      anchorString: 2,
      positions: [
        { string: 2, fretOffset: 0 },
        { string: 3, fretOffset: -2 },
        { string: 4, fretOffset: -3 },
      ],
    },
    Augmented: {
      anchorString: 2,
      positions: [
        { string: 2, fretOffset: 0 },
        { string: 3, fretOffset: -1 },
        { string: 4, fretOffset: -1 },
      ],
    },
  },
  '2-4-first': {
    Major: {
      anchorString: 4,
      positions: [
        { string: 2, fretOffset: 1 },
        { string: 3, fretOffset: -1 },
        { string: 4, fretOffset: 0 },
      ],
    },
    Minor: {
      anchorString: 4,
      positions: [
        { string: 2, fretOffset: 0 },
        { string: 3, fretOffset: -1 },
        { string: 4, fretOffset: 0 },
      ],
    },
    Diminished: {
      anchorString: 4,
      positions: [
        { string: 2, fretOffset: -2 },
        { string: 3, fretOffset: -2 },
        { string: 4, fretOffset: 0 },
      ],
    },
    Augmented: {
      anchorString: 4,
      positions: [
        { string: 2, fretOffset: 1 },
        { string: 3, fretOffset: 0 },
        { string: 4, fretOffset: 0 },
      ],
    },
  },
  '2-4-second': {
    Major: {
      anchorString: 3,
      positions: [
        { string: 2, fretOffset: 0 },
        { string: 3, fretOffset: 0 },
        { string: 4, fretOffset: 0 },
      ],
    },
    Minor: {
      anchorString: 3,
      positions: [
        { string: 2, fretOffset: 0 },
        { string: 3, fretOffset: 0 },
        { string: 4, fretOffset: -1 },
      ],
    },
    Diminished: {
      anchorString: 3,
      positions: [
        { string: 2, fretOffset: -1 },
        { string: 3, fretOffset: 0 },
        { string: 4, fretOffset: -1 },
      ],
    },
    Augmented: {
      anchorString: 3,
      positions: [
        { string: 2, fretOffset: 1 },
        { string: 3, fretOffset: 0 },
        { string: 4, fretOffset: 0 },
      ],
    },
  },
  '3-5-root': {
    Major: {
      anchorString: 1,
      positions: [
        { string: 1, fretOffset: 0 },
        { string: 2, fretOffset: -1 },
        { string: 3, fretOffset: -3 },
      ],
    },
    Minor: {
      anchorString: 1,
      positions: [
        { string: 1, fretOffset: 0 },
        { string: 2, fretOffset: -2 },
        { string: 3, fretOffset: -3 },
      ],
    },
    Diminished: {
      anchorString: 1,
      positions: [
        { string: 1, fretOffset: 0 },
        { string: 2, fretOffset: 1 },
        { string: 3, fretOffset: 0 },
      ],
    },
    Augmented: {
      anchorString: 1,
      positions: [
        { string: 1, fretOffset: 0 },
        { string: 2, fretOffset: -1 },
        { string: 3, fretOffset: -2 },
      ],
    },
  },
  '3-5-first': {
    Major: {
      anchorString: 3,
      positions: [
        { string: 1, fretOffset: 2 },
        { string: 2, fretOffset: 0 },
        { string: 3, fretOffset: 0 },
      ],
    },
    Minor: {
      anchorString: 3,
      positions: [
        { string: 1, fretOffset: 1 },
        { string: 2, fretOffset: 0 },
        { string: 3, fretOffset: 0 },
      ],
    },
    Diminished: {
      anchorString: 3,
      positions: [
        { string: 1, fretOffset: 1 },
        { string: 2, fretOffset: -1 },
        { string: 3, fretOffset: 0 },
      ],
    },
    Augmented: {
      anchorString: 3,
      positions: [
        { string: 1, fretOffset: 2 },
        { string: 2, fretOffset: 1 },
        { string: 3, fretOffset: 0 },
      ],
    },
  },
  '3-5-second': {
    Major: {
      anchorString: 2,
      positions: [
        { string: 1, fretOffset: 0 },
        { string: 2, fretOffset: 0 },
        { string: 3, fretOffset: -1 },
      ],
    },
    Minor: {
      anchorString: 2,
      positions: [
        { string: 1, fretOffset: 0 },
        { string: 2, fretOffset: 0 },
        { string: 3, fretOffset: -2 },
      ],
    },
    Diminished: {
      anchorString: 2,
      positions: [
        { string: 1, fretOffset: -1 },
        { string: 2, fretOffset: 0 },
        { string: 3, fretOffset: -2 },
      ],
    },
    Augmented: {
      anchorString: 2,
      positions: [
        { string: 1, fretOffset: 1 },
        { string: 2, fretOffset: 0 },
        { string: 3, fretOffset: -1 },
      ],
    },
  },
  '4-6-root': {
    Major: {
      anchorString: 0,
      positions: [
        { string: 0, fretOffset: 0 },
        { string: 1, fretOffset: -1 },
        { string: 2, fretOffset: -3 },
      ],
    },
    Minor: {
      anchorString: 0,
      positions: [
        { string: 0, fretOffset: 0 },
        { string: 1, fretOffset: -2 },
        { string: 2, fretOffset: -3 },
      ],
    },
    Diminished: {
      anchorString: 0,
      positions: [
        { string: 0, fretOffset: 0 },
        { string: 1, fretOffset: -2 },
        { string: 2, fretOffset: -4 },
      ],
    },
    Augmented: {
      anchorString: 0,
      positions: [
        { string: 0, fretOffset: 0 },
        { string: 1, fretOffset: -1 },
        { string: 2, fretOffset: -2 },
      ],
    },
  },
  '4-6-first': {
    Major: {
      anchorString: 2,
      positions: [
        { string: 0, fretOffset: 2 },
        { string: 1, fretOffset: 0 },
        { string: 2, fretOffset: 0 },
      ],
    },
    Minor: {
      anchorString: 2,
      positions: [
        { string: 0, fretOffset: 1 },
        { string: 1, fretOffset: 0 },
        { string: 2, fretOffset: 0 },
      ],
    },
    Diminished: {
      anchorString: 2,
      positions: [
        { string: 0, fretOffset: 1 },
        { string: 1, fretOffset: -1 },
        { string: 2, fretOffset: 0 },
      ],
    },
    Augmented: {
      anchorString: 2,
      positions: [
        { string: 0, fretOffset: 2 },
        { string: 1, fretOffset: 1 },
        { string: 2, fretOffset: 0 },
      ],
    },
  },
  '4-6-second': {
    Major: {
      anchorString: 1,
      positions: [
        { string: 0, fretOffset: 0 },
        { string: 1, fretOffset: 0 },
        { string: 2, fretOffset: -1 },
      ],
    },
    Minor: {
      anchorString: 1,
      positions: [
        { string: 0, fretOffset: 0 },
        { string: 1, fretOffset: 0 },
        { string: 2, fretOffset: -2 },
      ],
    },
    Diminished: {
      anchorString: 1,
      positions: [
        { string: 0, fretOffset: -1 },
        { string: 1, fretOffset: 0 },
        { string: 2, fretOffset: -2 },
      ],
    },
    Augmented: {
      anchorString: 1,
      positions: [
        { string: 0, fretOffset: 1 },
        { string: 1, fretOffset: 0 },
        { string: 2, fretOffset: -1 },
      ],
    },
  },
}

export function buildTriadVoicing(rootIndex, chordType, layoutValue) {
  const shape = TRIAD_SHAPES[layoutValue]?.[chordType]
  if (!shape) return []

  let best = null
  for (let anchorFret = 0; anchorFret < FRET_COUNT; anchorFret++) {
    if (getNoteIndex(shape.anchorString, anchorFret, 0) !== rootIndex) continue

    const cells = shape.positions.map(({ string, fretOffset }) => ({
      string,
      fret: anchorFret + fretOffset,
    }))

    if (cells.some(({ fret }) => fret < 0 || fret >= FRET_COUNT)) continue

    const frets = cells.map((cell) => cell.fret)
    const score = Math.max(...frets) * 10 + (Math.max(...frets) - Math.min(...frets))
    if (!best || score < best.score) {
      best = { cells, score }
    }
  }

  return best?.cells ?? []
}

export const OPEN_CHORD_FORMS = {
  Major: {
    C: [
      { string: 1, fret: 3 },
      { string: 2, fret: 2 },
      { string: 3, fret: 0 },
      { string: 4, fret: 1 },
      { string: 5, fret: 0 },
    ],
    D: [
      { string: 2, fret: 0 },
      { string: 3, fret: 2 },
      { string: 4, fret: 3 },
      { string: 5, fret: 2 },
    ],
    E: [
      { string: 0, fret: 0 },
      { string: 1, fret: 2 },
      { string: 2, fret: 2 },
      { string: 3, fret: 1 },
      { string: 4, fret: 0 },
      { string: 5, fret: 0 },
    ],
    G: [
      { string: 0, fret: 3 },
      { string: 1, fret: 2 },
      { string: 2, fret: 0 },
      { string: 3, fret: 0 },
      { string: 4, fret: 0 },
      { string: 5, fret: 3 },
    ],
    A: [
      { string: 1, fret: 0 },
      { string: 2, fret: 2 },
      { string: 3, fret: 2 },
      { string: 4, fret: 2 },
      { string: 5, fret: 0 },
    ],
  },
  Minor: {
    D: [
      { string: 2, fret: 0 },
      { string: 3, fret: 2 },
      { string: 4, fret: 3 },
      { string: 5, fret: 1 },
    ],
    E: [
      { string: 0, fret: 0 },
      { string: 1, fret: 2 },
      { string: 2, fret: 2 },
      { string: 3, fret: 0 },
      { string: 4, fret: 0 },
      { string: 5, fret: 0 },
    ],
    A: [
      { string: 1, fret: 0 },
      { string: 2, fret: 2 },
      { string: 3, fret: 2 },
      { string: 4, fret: 1 },
      { string: 5, fret: 0 },
    ],
  },
  '7th': {
    A: [
      { string: 1, fret: 0 },
      { string: 2, fret: 2 },
      { string: 3, fret: 0 },
      { string: 4, fret: 2 },
      { string: 5, fret: 0 },
    ],
    B: [
      { string: 1, fret: 2 },
      { string: 2, fret: 1 },
      { string: 3, fret: 2 },
      { string: 4, fret: 0 },
      { string: 5, fret: 2 },
    ],
    C: [
      { string: 1, fret: 3 },
      { string: 2, fret: 2 },
      { string: 3, fret: 3 },
      { string: 4, fret: 1 },
      { string: 5, fret: 0 },
    ],
    D: [
      { string: 2, fret: 0 },
      { string: 3, fret: 2 },
      { string: 4, fret: 1 },
      { string: 5, fret: 2 },
    ],
    E: [
      { string: 0, fret: 0 },
      { string: 1, fret: 2 },
      { string: 2, fret: 0 },
      { string: 3, fret: 1 },
      { string: 4, fret: 0 },
      { string: 5, fret: 0 },
    ],
    G: [
      { string: 0, fret: 1 },
      { string: 1, fret: 2 },
      { string: 2, fret: 0 },
      { string: 3, fret: 0 },
      { string: 4, fret: 0 },
      { string: 5, fret: 1 },
    ],
  },
  maj7: {
    A: [
      { string: 1, fret: 0 },
      { string: 2, fret: 2 },
      { string: 3, fret: 1 },
      { string: 4, fret: 2 },
      { string: 5, fret: 0 },
    ],
    C: [
      { string: 1, fret: 3 },
      { string: 2, fret: 2 },
      { string: 3, fret: 0 },
      { string: 4, fret: 0 },
      { string: 5, fret: 0 },
    ],
    E: [
      { string: 0, fret: 0 },
      { string: 1, fret: 2 },
      { string: 2, fret: 1 },
      { string: 3, fret: 1 },
      { string: 4, fret: 0 },
      { string: 5, fret: 0 },
    ],
    F: [
      { string: 0, fret: 1 },
      { string: 1, fret: 3 },
      { string: 2, fret: 2 },
      { string: 3, fret: 2 },
      { string: 4, fret: 1 },
      { string: 5, fret: 0 },
    ],
    G: [
      { string: 0, fret: 2 },
      { string: 1, fret: 0 },
      { string: 2, fret: 0 },
      { string: 3, fret: 0 },
      { string: 4, fret: 0 },
      { string: 5, fret: 2 },
    ],
  },
  m7: {
    A: [
      { string: 1, fret: 0 },
      { string: 2, fret: 2 },
      { string: 3, fret: 0 },
      { string: 4, fret: 1 },
      { string: 5, fret: 0 },
    ],
    D: [
      { string: 2, fret: 0 },
      { string: 3, fret: 2 },
      { string: 4, fret: 1 },
      { string: 5, fret: 1 },
    ],
    E: [
      { string: 0, fret: 0 },
      { string: 1, fret: 2 },
      { string: 2, fret: 0 },
      { string: 3, fret: 0 },
      { string: 4, fret: 0 },
      { string: 5, fret: 0 },
    ],
  },
}

export function getOpenChordForm(rootIndex, chordType, capo = 0) {
  const physicalRoot = NOTES[(rootIndex - capo + 12) % 12]
  return OPEN_CHORD_FORMS[chordType]?.[physicalRoot] ?? null
}

export const DIATONIC_CHORDS = {
  'major-triad': [
    { value: 'I', offset: 0, chordType: 'Major' },
    { value: 'ii', offset: 2, chordType: 'Minor' },
    { value: 'iii', offset: 4, chordType: 'Minor' },
    { value: 'IV', offset: 5, chordType: 'Major' },
    { value: 'V', offset: 7, chordType: 'Major' },
    { value: 'vi', offset: 9, chordType: 'Minor' },
    { value: 'vii', offset: 11, chordType: 'dim7' },
  ],
  'major-seventh': [
    { value: 'I', offset: 0, chordType: 'maj7' },
    { value: 'ii', offset: 2, chordType: 'm7' },
    { value: 'iii', offset: 4, chordType: 'm7' },
    { value: 'IV', offset: 5, chordType: 'maj7' },
    { value: 'V', offset: 7, chordType: '7th' },
    { value: 'vi', offset: 9, chordType: 'm7' },
    { value: 'vii', offset: 11, chordType: 'm7(b5)' },
  ],
  'natural-minor-triad': [
    { value: 'i', offset: 0, chordType: 'Minor' },
    { value: 'ii', offset: 2, chordType: 'dim7' },
    { value: 'III', offset: 3, chordType: 'Major' },
    { value: 'iv', offset: 5, chordType: 'Minor' },
    { value: 'v', offset: 7, chordType: 'Minor' },
    { value: 'VI', offset: 8, chordType: 'Major' },
    { value: 'VII', offset: 10, chordType: 'Major' },
  ],
  'natural-minor-seventh': [
    { value: 'i', offset: 0, chordType: 'm7' },
    { value: 'ii', offset: 2, chordType: 'm7(b5)' },
    { value: 'III', offset: 3, chordType: 'maj7' },
    { value: 'iv', offset: 5, chordType: 'm7' },
    { value: 'v', offset: 7, chordType: 'm7' },
    { value: 'VI', offset: 8, chordType: 'maj7' },
    { value: 'VII', offset: 10, chordType: '7th' },
  ],
}

export function getDiatonicChord(rootIndex, scaleType, degreeValue) {
  const progression = DIATONIC_CHORDS[scaleType] ?? DIATONIC_CHORDS['major-triad']
  const selected = progression.find((item) => item.value === degreeValue) ?? progression[0]
  return {
    rootIndex: (rootIndex + selected.offset) % 12,
    chordType: selected.chordType,
  }
}

// ===== スケールフォーム定義 =====
// メジャースケール（イオニアン）の度数パターン: R, M2, M3, P4, P5, M6, M7
export const MAJOR_SCALE_DEGREES = new Set([0, 2, 4, 5, 7, 9, 11])
// ナチュラルマイナー（エオリアン）の度数パターン: R, M2, m3, P4, P5, m6, m7
export const NATURAL_MINOR_SCALE_DEGREES = new Set([0, 2, 3, 5, 7, 8, 10])

// スケールに含まれるか判定
export function isInMajorScale(semitone) {
  return MAJOR_SCALE_DEGREES.has(semitone)
}

export function isInNaturalMinorScale(semitone) {
  return NATURAL_MINOR_SCALE_DEGREES.has(semitone)
}

// ルート音のノートインデックスを返す（♯・♭どちらの表記でも対応）
export function getRootIndex(rootNote) {
  const idx = NOTES_SHARP.indexOf(rootNote)
  return idx !== -1 ? idx : NOTES_FLAT.indexOf(rootNote)
}

// ===== ペンタトニックスケール =====
// マイナーペンタ: R, m3, P4, P5, m7 → 半音: 0, 3, 5, 7, 10
export const MINOR_PENTA_DEGREES = new Set([0, 3, 5, 7, 10])
// メジャーペンタ: R, M2, M3, P5, M6 → 半音: 0, 2, 4, 7, 9
export const MAJOR_PENTA_DEGREES = new Set([0, 2, 4, 7, 9])

export function isInPenta(semitone, type) {
  return type === 'minor'
    ? MINOR_PENTA_DEGREES.has(semitone)
    : MAJOR_PENTA_DEGREES.has(semitone)
}

// ===== CAGEDシステム =====
// 各フォームをオープンコードの形から定義
// anchorString: ルート音を探す基準弦（0=6弦, 1=5弦, 2=4弦）
// positions: ルート位置からの相対フレットオフセット + 度数ラベル
//   degree: 'R'=ルート, '3'=長3度, '5'=完全5度
const CAGED_COLOR = '#6366f1'

export const CAGED_FORMS = {
  // オープンEコード形: 0-2-2-1-0-0
  E: {
    label: 'E',
    color: CAGED_COLOR,
    anchorString: 0,
    positions: [
      { string: 0, fretOffset: 0, degree: 'R' },
      { string: 1, fretOffset: 2, degree: '5' },
      { string: 2, fretOffset: 2, degree: 'R' },
      { string: 3, fretOffset: 1, degree: '3' },
      { string: 4, fretOffset: 0, degree: '5' },
      { string: 5, fretOffset: 0, degree: 'R' },
    ],
  },
  // オープンDコード形: x-x-0-2-3-2
  D: {
    label: 'D',
    color: CAGED_COLOR,
    anchorString: 2,
    positions: [
      { string: 2, fretOffset: 0, degree: 'R' },
      { string: 3, fretOffset: 2, degree: '5' },
      { string: 4, fretOffset: 3, degree: 'R' },
      { string: 5, fretOffset: 2, degree: '3' },
    ],
  },
  // オープンCコード形: x-3-2-0-1-0
  C: {
    label: 'C',
    color: CAGED_COLOR,
    anchorString: 1,
    positions: [
      { string: 1, fretOffset: 0,  degree: 'R' },
      { string: 2, fretOffset: -1, degree: '3' },
      { string: 3, fretOffset: -3, degree: '5' },
      { string: 4, fretOffset: -2, degree: 'R' },
      { string: 5, fretOffset: -3, degree: '3' },
    ],
  },
  // オープンAコード形: x-0-2-2-2-0
  A: {
    label: 'A',
    color: CAGED_COLOR,
    anchorString: 1,
    positions: [
      { string: 1, fretOffset: 0, degree: 'R' },
      { string: 2, fretOffset: 2, degree: '5' },
      { string: 3, fretOffset: 2, degree: 'R' },
      { string: 4, fretOffset: 2, degree: '3' },
      { string: 5, fretOffset: 0, degree: '5' },
    ],
  },
  // オープンGコード形: 3-2-0-0-0-3
  G: {
    label: 'G',
    color: CAGED_COLOR,
    anchorString: 0,
    positions: [
      { string: 0, fretOffset: 0,  degree: 'R' },
      { string: 1, fretOffset: -1, degree: '3' },
      { string: 2, fretOffset: -3, degree: '5' },
      { string: 3, fretOffset: -3, degree: 'R' },
      { string: 4, fretOffset: -3, degree: '3' },
      { string: 5, fretOffset: 0,  degree: 'R' },
    ],
  },
}

// CAGED表示順（ネック上で低フレット→高フレットの順）
export const CAGED_ORDER = ['C', 'A', 'G', 'E', 'D']

// 指定フォームの表示セルを返す: Map<"string-fret", { color, degree }>
export function calcCagedPositions(formKey, rootIndex, capo) {
  const form = CAGED_FORMS[formKey]
  if (!form) return new Map()

  const map = new Map()

  // anchor弦でルートが出現するフレットを全探索
  for (let f = 0; f < FRET_COUNT; f++) {
    if (getNoteIndex(form.anchorString, f, capo) !== rootIndex) continue

    // このルートフレットを基準にフォームの全ポジションを展開
    for (const { string, fretOffset, degree } of form.positions) {
      const fret = f + fretOffset
      if (fret < 0 || fret >= FRET_COUNT) continue
      const key = `${string}-${fret}`
      // すでに登録済みなら上書きしない（Rを優先）
      if (!map.has(key) || degree === 'R') {
        map.set(key, { color: form.color, degree })
      }
    }
  }

  return map
}
