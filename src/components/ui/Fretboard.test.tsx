import { describe, it, expect, vi } from "vite-plus/test";
import { render, screen, fireEvent } from "@testing-library/react";
import Fretboard from "./Fretboard";
import type {
  Theme,
  Accidental,
  BaseLabelMode,
  FretboardDisplaySize,
  ChordDisplayMode,
  ScaleType,
  ChordType,
} from "../../types";

function makeProps(overrides: Record<string, unknown> = {}) {
  return {
    theme: "dark" as Theme,
    rootNote: "C",
    accidental: "flat" as Accidental,
    baseLabelMode: "note" as BaseLabelMode,
    displaySize: "standard" as FretboardDisplaySize,
    fretRange: [0, 14] as [number, number],
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
    highlightedNotes: new Set<string>(),
    ...overrides,
  };
}

describe("ui/Fretboard", () => {
  const scaleCases: ScaleType[] = [
    "major",
    "natural-minor",
    "major-penta",
    "minor-penta",
    "blues",
    "harmonic-minor",
    "melodic-minor",
    "ionian",
    "dorian",
    "phrygian",
    "lydian",
    "mixolydian",
    "aeolian",
    "locrian",
  ];

  it("6弦分の開放弦ラベルが表示される", () => {
    render(<Fretboard {...makeProps()} />);
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
    expect(screen.getAllByText("C").length).toBeGreaterThan(0);
  });

  it("度数モードで P1 が表示される", () => {
    render(<Fretboard {...makeProps({ baseLabelMode: "degree" as BaseLabelMode })} />);
    expect(screen.getAllByText("P1").length).toBeGreaterThan(0);
  });

  it("指板のセルをクリックすると onNoteClick が呼ばれる", () => {
    const props = makeProps();
    render(<Fretboard {...props} />);
    fireEvent.click(screen.getAllByText("C")[0]);
    expect(props.onNoteClick).toHaveBeenCalled();
  });

  it("onNoteClick に音名文字列が渡される", () => {
    const props = makeProps({ rootNote: "C" });
    render(<Fretboard {...props} />);
    fireEvent.click(screen.getAllByText("C")[0]);
    expect(props.onNoteClick).toHaveBeenCalledWith("C");
  });

  it("♯モードで C♯ が表示される", () => {
    render(<Fretboard {...makeProps({ accidental: "sharp" as Accidental })} />);
    expect(screen.getAllByText("C♯").length).toBeGreaterThan(0);
  });

  it("♭モードで D♭ が表示される", () => {
    render(<Fretboard {...makeProps({ accidental: "flat" as Accidental })} />);
    expect(screen.getAllByText("D♭").length).toBeGreaterThan(0);
  });

  it("♯モードで D♭ が表示されない", () => {
    render(<Fretboard {...makeProps({ accidental: "sharp" as Accidental })} />);
    expect(screen.queryAllByText("D♭")).toHaveLength(0);
  });

  it("♭モードで C♯ が表示されない", () => {
    render(<Fretboard {...makeProps({ accidental: "flat" as Accidental })} />);
    expect(screen.queryAllByText("C♯")).toHaveLength(0);
  });

  it("ルートが変わると対応する音のセルが存在する", () => {
    render(<Fretboard {...makeProps({ rootNote: "A" })} />);
    expect(screen.getAllByText("A").length).toBeGreaterThan(0);
  });

  scaleCases.forEach((scaleType) => {
    it(`${scaleType} 表示でもレンダリングできる`, () => {
      render(<Fretboard {...makeProps({ showScale: true, scaleType })} />);
      expect(screen.getAllByText("C").length).toBeGreaterThan(0);
    });
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

  it("hideChordNoteLabels のときコードフォーム内の音名は表示しない", () => {
    render(
      <Fretboard
        {...makeProps({
          showChord: true,
          chordDisplayMode: "form" as ChordDisplayMode,
          hideChordNoteLabels: true,
          suppressRegularDisplay: true,
        })}
      />,
    );

    expect(screen.queryAllByText("C")).toHaveLength(0);
  });

  it("hideChordNoteLabels のときコードフォーム上に ? を表示して点滅する", () => {
    const { container } = render(
      <Fretboard
        {...makeProps({
          showChord: true,
          chordDisplayMode: "form" as ChordDisplayMode,
          hideChordNoteLabels: true,
          suppressRegularDisplay: true,
        })}
      />,
    );

    expect(screen.getAllByText("?").length).toBeGreaterThan(0);
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(1);
    expect(container.querySelector(".border-indigo-500\\/70")).toBeTruthy();
  });

  it("indigo のコードフォーム色を指定できる", () => {
    const { container } = render(
      <Fretboard
        {...makeProps({
          showChord: true,
          chordDisplayMode: "form" as ChordDisplayMode,
          suppressRegularDisplay: true,
          chordOverlayTone: "indigo",
        })}
      />,
    );

    expect(container.querySelector(".border-indigo-500")).toBeTruthy();
    expect(container.querySelector(".bg-indigo-500")).toBeTruthy();
  });

  it("E メジャーではオープンコードとバレーコードの枠が重複しない", () => {
    const { container } = render(
      <Fretboard
        {...makeProps({
          rootNote: "E",
          showChord: true,
          chordDisplayMode: "form" as ChordDisplayMode,
          chordType: "Major" as ChordType,
          suppressRegularDisplay: true,
        })}
      />,
    );

    const frames = Array.from(container.querySelectorAll(".border-amber-300\\/60")).map((element) =>
      element.getAttribute("style"),
    );
    expect(new Set(frames).size).toBe(frames.length);
  });

  it("A メジャーではオープンコードとバレーコードの枠が重複しない", () => {
    const { container } = render(
      <Fretboard
        {...makeProps({
          rootNote: "A",
          showChord: true,
          chordDisplayMode: "form" as ChordDisplayMode,
          chordType: "Major" as ChordType,
          suppressRegularDisplay: true,
        })}
      />,
    );

    const frames = Array.from(container.querySelectorAll(".border-amber-300\\/60")).map((element) =>
      element.getAttribute("style"),
    );
    expect(new Set(frames).size).toBe(frames.length);
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

  it("追加したコードフォームでもレンダリングできる", () => {
    (["sus2", "sus4", "6", "m6", "dim", "aug"] as ChordType[]).forEach((chordType) => {
      const { unmount } = render(
        <Fretboard
          {...makeProps({
            showChord: true,
            chordDisplayMode: "form" as ChordDisplayMode,
            chordType,
          })}
        />,
      );
      expect(screen.getAllByText("C").length).toBeGreaterThan(0);
      unmount();
    });
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

  it("音名モードでは hiddenDegrees があっても音名表示は消えない", () => {
    render(
      <Fretboard
        {...makeProps({
          baseLabelMode: "note" as BaseLabelMode,
          hiddenDegrees: new Set(["P1"]),
        })}
      />,
    );

    expect(screen.getAllByText("C").length).toBeGreaterThan(0);
  });

  it("highlightedNotes に含まれる音は追加リングを表示する", () => {
    const { container } = render(
      <Fretboard
        {...makeProps({
          highlightedNotes: new Set(["C"]),
        })}
      />,
    );

    expect(container.querySelector(".border-sky-300")).toBeTruthy();
  });

  it("度数モードでは highlightedNotes があっても追加リングを表示しない", () => {
    const { container } = render(
      <Fretboard
        {...makeProps({
          baseLabelMode: "degree" as BaseLabelMode,
          highlightedNotes: new Set(["C"]),
        })}
      />,
    );

    expect(container.querySelector(".border-sky-300")).toBeNull();
  });

  it("ライトテーマでもレンダリングできる", () => {
    render(<Fretboard {...makeProps({ theme: "light" as Theme })} />);
    expect(screen.getAllByText("E").length).toBeGreaterThanOrEqual(2);
  });

  it("コンパクト表示でもレンダリングできる", () => {
    render(<Fretboard {...makeProps({ displaySize: "compact" as FretboardDisplaySize })} />);
    expect(screen.getAllByText("E").length).toBeGreaterThanOrEqual(2);
  });

  it("極小表示でもレンダリングできる", () => {
    render(<Fretboard {...makeProps({ displaySize: "tiny" as FretboardDisplaySize })} />);
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

  it("コード構成音クイズの途中選択を保持できる", () => {
    render(
      <Fretboard
        {...makeProps({
          quizModeActive: true,
          quizAnswerMode: true,
          accidental: "sharp" as Accidental,
          quizSelectedCells: [{ stringIdx: 0, fret: 8 }],
        })}
      />,
    );

    expect(screen.getAllByText("C").length).toBeGreaterThan(0);
  });
});
