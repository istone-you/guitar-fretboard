// 音名配列（半音12音）
export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

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
  'R',   // 0: ルート
  'm2',  // 1: 短2度
  'M2',  // 2: 長2度
  'm3',  // 3: 短3度
  'M3',  // 4: 長3度
  'P4',  // 5: 完全4度
  '#4',  // 6: 増4度 / 減5度
  'P5',  // 7: 完全5度
  'b5',  // 8: 減5度（表示上b5も使う）→ #4と同じ
  'm6',  // 9: 短6度
  'M6',  // 10: 長6度
  'm7',  // 11: 短7度
  'M7',  // 12: 長7度
]

// 実際に使う度数マップ（0〜11の半音 → 度数名）
export const SEMITONE_TO_DEGREE = [
  'R',   // 0
  'm2',  // 1
  'M2',  // 2
  'm3',  // 3
  'M3',  // 4
  'P4',  // 5
  '#4',  // 6 (tritone)
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
  'R':   { bg: '#ef4444', text: '#fff' },   // 赤: ルート
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
  '#4':  { bg: '#6b7280', text: '#fff' },
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
    { string: 2, fretOffset: 0 },
    { string: 3, fretOffset: 0 }, // bb7 = M6 から-1
    { string: 4, fretOffset: -1 },
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
    { string: 3, fretOffset: 1 },
    { string: 4, fretOffset: 2 },
    { string: 5, fretOffset: 0 },
  ],
  'maj7':    [
    { string: 1, fretOffset: 0 },
    { string: 2, fretOffset: 2 },
    { string: 3, fretOffset: 1 },
    { string: 4, fretOffset: 1 },
    { string: 5, fretOffset: 0 },
  ],
  'm7':      [
    { string: 1, fretOffset: 0 },
    { string: 2, fretOffset: 2 },
    { string: 3, fretOffset: 1 },
    { string: 4, fretOffset: 1 },
    { string: 5, fretOffset: 0 },
  ],
  'm7(b5)': [
    { string: 1, fretOffset: 0 },
    { string: 2, fretOffset: 1 },
    { string: 3, fretOffset: 1 },
    { string: 4, fretOffset: 1 },
    { string: 5, fretOffset: 0 },
  ],
  'dim7':    [
    { string: 1, fretOffset: 0 },
    { string: 2, fretOffset: 1 },
    { string: 3, fretOffset: 0 },
    { string: 4, fretOffset: 1 },
    { string: 5, fretOffset: 0 },
  ],
  'm(maj7)': [
    { string: 1, fretOffset: 0 },
    { string: 2, fretOffset: 2 },
    { string: 3, fretOffset: 1 },
    { string: 4, fretOffset: 0 },
    { string: 5, fretOffset: 0 },
  ],
}

// ===== スケールフォーム定義 =====
// メジャースケール（イオニアン）の度数パターン: R, M2, M3, P4, P5, M6, M7
export const MAJOR_SCALE_DEGREES = new Set([0, 2, 4, 5, 7, 9, 11])

// パワーコード度数パターン: R, P5
export const POWER_CHORD_DEGREES = new Set([0, 7])

// スケールに含まれるか判定
export function isInMajorScale(semitone) {
  return MAJOR_SCALE_DEGREES.has(semitone)
}

export function isInPowerChord(semitone) {
  return POWER_CHORD_DEGREES.has(semitone)
}

// ルート音のノートインデックスを返す
export function getRootIndex(rootNote) {
  return NOTES.indexOf(rootNote)
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
export const CAGED_FORMS = {
  // オープンEコード形: 0-2-2-1-0-0
  E: {
    label: 'E',
    color: '#3b82f6',
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
    color: '#ef4444',
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
    color: '#f59e0b',
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
    color: '#a855f7',
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
    color: '#10b981',
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
