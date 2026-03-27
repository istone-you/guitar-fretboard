import { describe, it, expect } from "vite-plus/test";
import {
  NOTES_SHARP,
  NOTES_FLAT,
  OPEN_STRINGS,
  SCALE_DEGREES,
  getNoteIndex,
  getNoteName,
  calcDegree,
  getDegreeName,
  getRootIndex,
  isInMajorScale,
  isInNaturalMinorScale,
  isInPenta,
  isInScale,
  getDiatonicChord,
  getDiatonicChordSemitones,
  getTriadLayout,
  CHORD_SEMITONES,
  calcCagedPositions,
  getOpenChordForm,
  buildTriadVoicing,
} from "./fretboard";

// ===== 音名配列 =====
describe("NOTES_SHARP / NOTES_FLAT", () => {
  it("12音ある", () => {
    expect(NOTES_SHARP).toHaveLength(12);
    expect(NOTES_FLAT).toHaveLength(12);
  });

  it("同じインデックスが異名同音になっている", () => {
    // C♯ と D♭ は同じ半音
    expect(NOTES_SHARP[1]).toBe("C♯");
    expect(NOTES_FLAT[1]).toBe("D♭");
    // F♯ と G♭
    expect(NOTES_SHARP[6]).toBe("F♯");
    expect(NOTES_FLAT[6]).toBe("G♭");
  });
});

// ===== getRootIndex =====
describe("getRootIndex", () => {
  it("♭表記を正しくインデックス変換する", () => {
    expect(getRootIndex("C")).toBe(0);
    expect(getRootIndex("D♭")).toBe(1);
    expect(getRootIndex("A")).toBe(9);
    expect(getRootIndex("B")).toBe(11);
  });

  it("♯表記を正しくインデックス変換する", () => {
    expect(getRootIndex("C♯")).toBe(1);
    expect(getRootIndex("F♯")).toBe(6);
    expect(getRootIndex("A♯")).toBe(10);
  });

  it("♯と♭が同じインデックスを返す", () => {
    expect(getRootIndex("C♯")).toBe(getRootIndex("D♭"));
    expect(getRootIndex("F♯")).toBe(getRootIndex("G♭"));
    expect(getRootIndex("A♯")).toBe(getRootIndex("B♭"));
  });
});

// ===== getNoteIndex =====
describe("getNoteIndex", () => {
  it("開放弦の音名インデックスが正しい（OPEN_STRINGSと一致）", () => {
    for (let s = 0; s < 6; s++) {
      expect(getNoteIndex(s, 0)).toBe(OPEN_STRINGS[s]);
    }
  });

  it("6弦0フレット = E (index 4)", () => {
    expect(getNoteIndex(0, 0)).toBe(4);
  });

  it("6弦12フレット = E（オクターブ上、同じインデックス）", () => {
    expect(getNoteIndex(0, 12)).toBe(4);
  });

  it("5弦0フレット = A (index 9)", () => {
    expect(getNoteIndex(1, 0)).toBe(9);
  });

  it("6弦5フレット = A（チューニングの基準）", () => {
    expect(getNoteIndex(0, 5)).toBe(9);
  });

  it("1弦5フレット = A", () => {
    expect(getNoteIndex(5, 5)).toBe(9);
  });
});

// ===== getNoteName =====
describe("getNoteName", () => {
  it("6弦0フレット = E", () => {
    expect(getNoteName(0, 0)).toBe("E");
  });

  it("5弦0フレット = A", () => {
    expect(getNoteName(1, 0)).toBe("A");
  });

  it("4弦0フレット = D", () => {
    expect(getNoteName(2, 0)).toBe("D");
  });

  it("3弦0フレット = G", () => {
    expect(getNoteName(3, 0)).toBe("G");
  });

  it("2弦0フレット = B", () => {
    expect(getNoteName(4, 0)).toBe("B");
  });

  it("1弦0フレット = E", () => {
    expect(getNoteName(5, 0)).toBe("E");
  });
});

// ===== calcDegree =====
describe("calcDegree", () => {
  it("同音 = 0（完全1度）", () => {
    expect(calcDegree(0, 0)).toBe(0);
    expect(calcDegree(4, 4)).toBe(0);
  });

  it("半音上 = 1（短2度）", () => {
    expect(calcDegree(1, 0)).toBe(1);
  });

  it("長3度 = 4", () => {
    expect(calcDegree(4, 0)).toBe(4); // C→E
  });

  it("完全5度 = 7", () => {
    expect(calcDegree(7, 0)).toBe(7); // C→G
  });

  it("オクターブをまたぐ計算（ルートより低いインデックス）", () => {
    expect(calcDegree(0, 4)).toBe(8); // E→C = 短6度
  });

  it("12を法として循環する", () => {
    expect(calcDegree(0, 11)).toBe(1); // B→C = 短2度
  });
});

// ===== getDegreeName =====
describe("getDegreeName", () => {
  it("同音 = P1", () => {
    expect(getDegreeName(0, 0)).toBe("P1");
  });

  it("完全5度 = P5", () => {
    expect(getDegreeName(7, 0)).toBe("P5"); // C→G
  });

  it("長3度 = M3", () => {
    expect(getDegreeName(4, 0)).toBe("M3"); // C→E
  });

  it("短3度 = m3", () => {
    expect(getDegreeName(3, 0)).toBe("m3"); // C→E♭
  });

  it("短7度 = m7", () => {
    expect(getDegreeName(10, 0)).toBe("m7"); // C→B♭
  });
});

// ===== スケール判定 =====
describe("isInMajorScale", () => {
  // メジャースケール: R, M2, M3, P4, P5, M6, M7 = 0,2,4,5,7,9,11
  it("スケール内の音を正しく判定する", () => {
    [0, 2, 4, 5, 7, 9, 11].forEach((s) => expect(isInMajorScale(s)).toBe(true));
  });

  it("スケール外の音を正しく判定する", () => {
    [1, 3, 6, 8, 10].forEach((s) => expect(isInMajorScale(s)).toBe(false));
  });
});

describe("isInNaturalMinorScale", () => {
  // ナチュラルマイナー: R, M2, m3, P4, P5, m6, m7 = 0,2,3,5,7,8,10
  it("スケール内の音を正しく判定する", () => {
    [0, 2, 3, 5, 7, 8, 10].forEach((s) => expect(isInNaturalMinorScale(s)).toBe(true));
  });

  it("スケール外の音を正しく判定する", () => {
    [1, 4, 6, 9, 11].forEach((s) => expect(isInNaturalMinorScale(s)).toBe(false));
  });
});

describe("isInPenta", () => {
  // マイナーペンタ: 0,3,5,7,10
  it("マイナーペンタのスケール内音", () => {
    [0, 3, 5, 7, 10].forEach((s) => expect(isInPenta(s, "minor")).toBe(true));
  });

  it("マイナーペンタのスケール外音", () => {
    [1, 2, 4, 6, 8, 9, 11].forEach((s) => expect(isInPenta(s, "minor")).toBe(false));
  });

  // メジャーペンタ: 0,2,4,7,9
  it("メジャーペンタのスケール内音", () => {
    [0, 2, 4, 7, 9].forEach((s) => expect(isInPenta(s, "major")).toBe(true));
  });

  it("メジャーペンタのスケール外音", () => {
    [1, 3, 5, 6, 8, 10, 11].forEach((s) => expect(isInPenta(s, "major")).toBe(false));
  });
});

describe("isInScale / SCALE_DEGREES", () => {
  const cases = [
    { scale: "major", inScale: [0, 2, 4, 5, 7, 9, 11], outOfScale: [1, 3, 6, 8, 10] },
    { scale: "natural-minor", inScale: [0, 2, 3, 5, 7, 8, 10], outOfScale: [1, 4, 6, 9, 11] },
    { scale: "major-penta", inScale: [0, 2, 4, 7, 9], outOfScale: [1, 3, 5, 6, 8, 10, 11] },
    { scale: "minor-penta", inScale: [0, 3, 5, 7, 10], outOfScale: [1, 2, 4, 6, 8, 9, 11] },
    { scale: "blues", inScale: [0, 3, 5, 6, 7, 10], outOfScale: [1, 2, 4, 8, 9, 11] },
    { scale: "harmonic-minor", inScale: [0, 2, 3, 5, 7, 8, 11], outOfScale: [1, 4, 6, 9, 10] },
    { scale: "melodic-minor", inScale: [0, 2, 3, 5, 7, 9, 11], outOfScale: [1, 4, 6, 8, 10] },
    { scale: "ionian", inScale: [0, 2, 4, 5, 7, 9, 11], outOfScale: [1, 3, 6, 8, 10] },
    { scale: "dorian", inScale: [0, 2, 3, 5, 7, 9, 10], outOfScale: [1, 4, 6, 8, 11] },
    { scale: "phrygian", inScale: [0, 1, 3, 5, 7, 8, 10], outOfScale: [2, 4, 6, 9, 11] },
    { scale: "lydian", inScale: [0, 2, 4, 6, 7, 9, 11], outOfScale: [1, 3, 5, 8, 10] },
    { scale: "mixolydian", inScale: [0, 2, 4, 5, 7, 9, 10], outOfScale: [1, 3, 6, 8, 11] },
    { scale: "aeolian", inScale: [0, 2, 3, 5, 7, 8, 10], outOfScale: [1, 4, 6, 9, 11] },
    { scale: "locrian", inScale: [0, 1, 3, 5, 6, 8, 10], outOfScale: [2, 4, 7, 9, 11] },
  ] as const;

  cases.forEach(({ scale, inScale, outOfScale }) => {
    it(`${scale} の構成音を正しく持つ`, () => {
      inScale.forEach((s) => expect(SCALE_DEGREES[scale].has(s)).toBe(true));
      outOfScale.forEach((s) => expect(SCALE_DEGREES[scale].has(s)).toBe(false));
    });

    it(`${scale} を共通判定で正しく判定する`, () => {
      inScale.forEach((s) => expect(isInScale(s, scale)).toBe(true));
      outOfScale.forEach((s) => expect(isInScale(s, scale)).toBe(false));
    });
  });
});

// ===== ダイアトニックコード =====
describe("getDiatonicChord", () => {
  it("Cメジャー I = Cmaj7 (rootIndex=0)", () => {
    const chord = getDiatonicChord(0, "major-seventh", "I");
    expect(chord.rootIndex).toBe(0);
    expect(chord.chordType).toBe("maj7");
  });

  it("Cメジャー V = G7 (rootIndex=7)", () => {
    const chord = getDiatonicChord(0, "major-seventh", "V");
    expect(chord.rootIndex).toBe(7);
    expect(chord.chordType).toBe("7th");
  });

  it("Cメジャー vii = Bm7(b5) (rootIndex=11)", () => {
    const chord = getDiatonicChord(0, "major-seventh", "vii");
    expect(chord.rootIndex).toBe(11);
    expect(chord.chordType).toBe("m7(b5)");
  });

  it("Aマイナー i = Am7 (rootIndex=9)", () => {
    const chord = getDiatonicChord(9, "natural-minor-seventh", "i");
    expect(chord.rootIndex).toBe(9);
    expect(chord.chordType).toBe("m7");
  });

  it("Aマイナー III = Cmaj7 (rootIndex=0)", () => {
    const chord = getDiatonicChord(9, "natural-minor-seventh", "III");
    expect(chord.rootIndex).toBe(0);
    expect(chord.chordType).toBe("maj7");
  });

  it("ルートが12を超えてもインデックスが循環する", () => {
    // B (rootIndex=11) のメジャー V = F♯ (index=6)
    const chord = getDiatonicChord(11, "major-triad", "V");
    expect(chord.rootIndex).toBe(6);
  });
});

describe("getDiatonicChordSemitones", () => {
  it("Cメジャー I はキー基準で Cメジャーの構成音になる", () => {
    expect([...getDiatonicChordSemitones(0, "major-triad", "I")].sort((a, b) => a - b)).toEqual([
      0, 4, 7,
    ]);
  });

  it("Cメジャー ii はキー基準で Dm の度数になる", () => {
    expect([...getDiatonicChordSemitones(0, "major-triad", "ii")].sort((a, b) => a - b)).toEqual([
      2, 5, 9,
    ]);
  });

  it("Aナチュラルマイナー III7 はキー基準で Cmaj7 の度数になる", () => {
    expect(
      [...getDiatonicChordSemitones(9, "natural-minor-seventh", "III")].sort((a, b) => a - b),
    ).toEqual([3, 7, 10, 2].sort((a, b) => a - b));
  });

  it("コード種別の半音定義が欠けている場合は空集合になる", () => {
    const original = CHORD_SEMITONES.Major;
    delete CHORD_SEMITONES.Major;

    try {
      expect(getDiatonicChordSemitones(0, "major-triad", "I").size).toBe(0);
    } finally {
      CHORD_SEMITONES.Major = original;
    }
  });
});

describe("getTriadLayout", () => {
  it("不明なレイアウト値では先頭レイアウトを返す", () => {
    expect(getTriadLayout("unknown-layout").value).toBe("1-3-root");
  });
});

describe("calcCagedPositions", () => {
  it("不明なフォームでは空マップを返す", () => {
    expect(calcCagedPositions("Z", 0).size).toBe(0);
  });
});

// ===== オープンコードフォーム =====
describe("getOpenChordForm", () => {
  it("Cメジャーのオープンフォームが存在する", () => {
    const form = getOpenChordForm(0, "Major");
    expect(form).not.toBeNull();
    expect(form!.length).toBeGreaterThan(0);
  });

  it("Eメジャーのオープンフォームが存在する", () => {
    const form = getOpenChordForm(4, "Major");
    expect(form).not.toBeNull();
  });

  it("D♭メジャーのオープンフォームは存在しない", () => {
    const form = getOpenChordForm(1, "Major");
    expect(form).toBeNull();
  });

  it("Cのdim7オープンフォームは存在しない", () => {
    const form = getOpenChordForm(0, "dim7");
    expect(form).toBeNull();
  });
});

// ===== トライアドボイシング =====
describe("buildTriadVoicing", () => {
  it("Cメジャートライアド 1~3弦 基本形が返る", () => {
    const cells = buildTriadVoicing(0, "Major", "1-3-root");
    expect(cells.length).toBe(3);
    // 弦は 3,4,5 (1~3弦)
    const strings = cells.map((c) => c.string).sort();
    expect(strings).toEqual([3, 4, 5]);
  });

  it("フレットが有効範囲内（0~14）", () => {
    const cells = buildTriadVoicing(0, "Minor", "2-4-first");
    cells.forEach(({ fret }) => {
      expect(fret).toBeGreaterThanOrEqual(0);
      expect(fret).toBeLessThan(15);
    });
  });

  it("定義のないレイアウトは空配列を返す", () => {
    const cells = buildTriadVoicing(0, "Major", "invalid-layout");
    expect(cells).toEqual([]);
  });
});
