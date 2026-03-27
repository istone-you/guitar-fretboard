import { describe, it, expect, vi } from "vite-plus/test";
import { render, screen, fireEvent } from "@testing-library/react";
import Fretboard from "./Fretboard";
import type {
  Theme,
  Accidental,
  BaseLabelMode,
  ChordDisplayMode,
  ScaleType,
  ChordType,
} from "../types";

function makeProps(overrides: Record<string, unknown> = {}) {
  return {
    theme: "dark" as Theme,
    rootNote: "C",
    accidental: "flat" as Accidental,
    baseLabelMode: "note" as BaseLabelMode,
    showChord: false,
    chordDisplayMode: "form" as ChordDisplayMode,
    showScale: false,
    scaleType: "major" as ScaleType,
    showCaged: false,
    cagedForms: new Set<string>(),
    chordType: "Major" as ChordType,
    triadPosition: "1-3-root",
    diatonicScaleType: "major-triad",
    diatonicDegree: "I",
    onNoteClick: vi.fn(),
    ...overrides,
  };
}

describe("Fretboard", () => {
  // ===== レンダリング =====
  it("6弦分の開放弦ラベルが表示される", () => {
    render(<Fretboard {...makeProps()} />);
    // 弦ラベル（E,A,D,G,B,E）が存在する（指板セルと重複するため getAllByText）
    expect(screen.getAllByText("E").length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText("A").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("D").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("G").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("B").length).toBeGreaterThanOrEqual(1);
  });

  it("フレット番号 0〜14 が表示される", () => {
    render(<Fretboard {...makeProps()} />);
    for (let i = 0; i <= 14; i++) {
      expect(screen.getByText(String(i))).toBeTruthy();
    }
  });

  it("音名モードで C が表示される", () => {
    render(<Fretboard {...makeProps({ rootNote: "C", baseLabelMode: "note" as BaseLabelMode })} />);
    const cells = screen.getAllByText("C");
    expect(cells.length).toBeGreaterThan(0);
  });

  it("度数モードで P1 が表示される", () => {
    render(<Fretboard {...makeProps({ baseLabelMode: "degree" as BaseLabelMode })} />);
    const cells = screen.getAllByText("P1");
    expect(cells.length).toBeGreaterThan(0);
  });

  // ===== ルートクリック =====
  it("指板のセルをクリックすると onNoteClick が呼ばれる", () => {
    const props = makeProps();
    render(<Fretboard {...props} />);
    // 音名が表示されているセル（C）をクリック
    const cell = screen.getAllByText("C")[0];
    fireEvent.click(cell);
    expect(props.onNoteClick).toHaveBeenCalled();
  });

  it("onNoteClick に音名文字列が渡される", () => {
    const props = makeProps({ rootNote: "C" });
    render(<Fretboard {...props} />);
    // C はセルとして表示されている（弦ラベルと被らない）
    const cells = screen.getAllByText("C");
    fireEvent.click(cells[0]);
    expect(props.onNoteClick).toHaveBeenCalledWith("C");
  });

  // ===== ♯/♭表示切り替え =====
  it("♯モードで C♯ が表示される", () => {
    render(<Fretboard {...makeProps({ accidental: "sharp" as Accidental })} />);
    const cells = screen.getAllByText("C♯");
    expect(cells.length).toBeGreaterThan(0);
  });

  it("♭モードで D♭ が表示される", () => {
    render(<Fretboard {...makeProps({ accidental: "flat" as Accidental })} />);
    const cells = screen.getAllByText("D♭");
    expect(cells.length).toBeGreaterThan(0);
  });

  it("♯モードで D♭ が表示されない", () => {
    render(<Fretboard {...makeProps({ accidental: "sharp" as Accidental })} />);
    expect(screen.queryAllByText("D♭")).toHaveLength(0);
  });

  it("♭モードで C♯ が表示されない", () => {
    render(<Fretboard {...makeProps({ accidental: "flat" as Accidental })} />);
    expect(screen.queryAllByText("C♯")).toHaveLength(0);
  });

  // ===== ルート音ハイライト =====
  it("ルートが変わると対応する音のセルが存在する", () => {
    render(<Fretboard {...makeProps({ rootNote: "A" })} />);
    const cells = screen.getAllByText("A");
    expect(cells.length).toBeGreaterThan(0);
  });

  it("メジャースケール表示でもレンダリングできる", () => {
    render(<Fretboard {...makeProps({ showScale: true, scaleType: "major" as ScaleType })} />);
    expect(screen.getAllByText("C").length).toBeGreaterThan(0);
  });

  it("ナチュラルマイナー表示でもレンダリングできる", () => {
    render(
      <Fretboard {...makeProps({ showScale: true, scaleType: "natural-minor" as ScaleType })} />,
    );
    expect(screen.getAllByText("C").length).toBeGreaterThan(0);
  });

  it("ブルース表示でもレンダリングできる", () => {
    render(<Fretboard {...makeProps({ showScale: true, scaleType: "blues" as ScaleType })} />);
    expect(screen.getAllByText("C").length).toBeGreaterThan(0);
  });

  it("メジャーペンタ表示でもレンダリングできる", () => {
    render(
      <Fretboard {...makeProps({ showScale: true, scaleType: "major-penta" as ScaleType })} />,
    );
    expect(screen.getAllByText("C").length).toBeGreaterThan(0);
  });

  it("マイナーペンタ表示でもレンダリングできる", () => {
    render(
      <Fretboard {...makeProps({ showScale: true, scaleType: "minor-penta" as ScaleType })} />,
    );
    expect(screen.getAllByText("C").length).toBeGreaterThan(0);
  });

  it("CAGED表示でもレンダリングできる", () => {
    render(<Fretboard {...makeProps({ showCaged: true, cagedForms: new Set(["C", "A"]) })} />);
    expect(screen.getAllByText("C").length).toBeGreaterThan(0);
  });

  it("コードフォーム表示でもレンダリングできる", () => {
    render(
      <Fretboard
        {...makeProps({ showChord: true, chordDisplayMode: "form" as ChordDisplayMode })}
      />,
    );
    expect(screen.getAllByText("C").length).toBeGreaterThan(0);
  });

  it("パワーコード表示でもレンダリングできる", () => {
    render(
      <Fretboard
        {...makeProps({ showChord: true, chordDisplayMode: "power" as ChordDisplayMode })}
      />,
    );
    expect(screen.getAllByText("C").length).toBeGreaterThan(0);
  });

  it("トライアド表示でもレンダリングできる", () => {
    render(
      <Fretboard
        {...makeProps({
          showChord: true,
          chordDisplayMode: "triad" as ChordDisplayMode,
          chordType: "Major" as ChordType,
          triadPosition: "1-3-root",
        })}
      />,
    );
    expect(screen.getAllByText("C").length).toBeGreaterThan(0);
  });

  it("ダイアトニック表示でもレンダリングできる", () => {
    render(
      <Fretboard
        {...makeProps({
          showChord: true,
          chordDisplayMode: "diatonic" as ChordDisplayMode,
          diatonicScaleType: "major-seventh",
          diatonicDegree: "V",
        })}
      />,
    );
    expect(screen.getAllByText("C").length).toBeGreaterThan(0);
  });

  it("hiddenDegrees に含まれる度数は非表示になる", () => {
    render(
      <Fretboard
        {...makeProps({
          baseLabelMode: "degree" as BaseLabelMode,
          hiddenDegrees: new Set(["P1"]),
        })}
      />,
    );
    expect(screen.queryAllByText("P1")).toHaveLength(0);
    expect(screen.getAllByText("P5").length).toBeGreaterThan(0);
  });

  it("ライトテーマでもレンダリングできる", () => {
    render(<Fretboard {...makeProps({ theme: "light" as Theme })} />);
    expect(screen.getAllByText("E").length).toBeGreaterThanOrEqual(2);
  });

  it("空の CAGED フォーム集合でもレンダリングできる", () => {
    render(<Fretboard {...makeProps({ showCaged: true, cagedForms: new Set<string>() })} />);
    expect(screen.getAllByText("C").length).toBeGreaterThan(0);
  });

  it("不正なトライアド種別でもレンダリングできる", () => {
    render(
      <Fretboard
        {...makeProps({
          showChord: true,
          chordDisplayMode: "triad" as ChordDisplayMode,
          chordType: "7th" as ChordType,
        })}
      />,
    );
    expect(screen.getAllByText("C").length).toBeGreaterThan(0);
  });

  it("オープンフォームがないルートでもレンダリングできる", () => {
    render(
      <Fretboard
        {...makeProps({
          showChord: true,
          chordDisplayMode: "form" as ChordDisplayMode,
          rootNote: "D♭",
          chordType: "Major" as ChordType,
        })}
      />,
    );
    expect(screen.getAllByText("D♭").length).toBeGreaterThan(0);
  });
});
