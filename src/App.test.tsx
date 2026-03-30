import { describe, it, expect, vi, beforeEach } from "vite-plus/test";
import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

const controlsState: { latest: Record<string, unknown> | null } = { latest: null };
const normalFretboardState: { latest: Record<string, unknown> | null } = { latest: null };
const quizFretboardState: { latest: Record<string, unknown> | null } = { latest: null };
const headerState: { latest: Record<string, unknown> | null } = { latest: null };
const footerState: { latest: Record<string, unknown> | null } = { latest: null };

vi.mock("./components/AppHeader/index", () => ({
  default: (props: any) => (
    <div>
      <button onClick={() => props.setShowQuiz?.(true)}>quiz-toggle</button>
      <button onClick={() => props.onAccidentalChange?.("sharp")}>acc-sharp</button>
      <button onClick={() => props.onAccidentalChange?.("flat")}>acc-flat</button>
      <button onClick={() => props.onThemeChange?.()}>theme-toggle</button>
    </div>
  ),
  DropdownSelect: ({ value, onChange, options }: any) => (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {(options ?? []).map((o: any) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  ),
}));

vi.mock("./components/LayerControls/index", () => ({
  default: (props: any) => {
    controlsState.latest = props;
    return (
      <div>
        <button onClick={() => props.setShowScale?.(!(props.showScale as boolean))}>
          scale-toggle
        </button>
        <button onClick={() => props.setShowChord?.(!(props.showChord as boolean))}>
          chord-toggle
        </button>
        <button onClick={() => props.setShowCaged?.(!(props.showCaged as boolean))}>
          caged-toggle
        </button>
        <button onClick={() => props.toggleCagedForm?.("C")}>caged-c</button>
        <button onClick={() => props.toggleCagedForm?.("E")}>caged-e</button>
        <button onClick={() => props.setScaleType?.("blues")}>scale-blues</button>
        <button onClick={() => props.setChordDisplayMode?.("power")}>mode-power</button>
        <button onClick={() => props.setChordDisplayMode?.("diatonic")}>mode-diatonic</button>
        <button onClick={() => props.setChordDisplayMode?.("triad")}>mode-triad</button>
        <button onClick={() => props.setChordType?.("Minor")}>chord-minor</button>
        <button onClick={() => props.setDiatonicDegree?.("V")}>degree-v</button>
        <button onClick={() => props.setDiatonicDegree?.("I")}>degree-i</button>
        <button onClick={() => props.setDiatonicKeyType?.("major")}>key-major</button>
        <button onClick={() => props.setDiatonicKeyType?.("natural-minor")}>key-minor</button>
        <button onClick={() => props.setDiatonicChordSize?.("triad")}>size-triad</button>
        <button onClick={() => props.setDiatonicChordSize?.("seventh")}>size-seventh</button>
        <button onClick={() => props.setTriadInversion?.("1st")}>triad-inversion</button>
      </div>
    );
  },
}));

vi.mock("./components/FretboardHeader/index", () => ({
  default: (props: any) => {
    headerState.latest = props;
    return (
      <div>
        <span>header-root:{String(props.rootNote)}</span>
        <span>header-mode:{String(props.baseLabelMode)}</span>
        <button onClick={() => props.onBaseLabelModeChange?.("degree")}>header-degree</button>
        <button onClick={() => props.onBaseLabelModeChange?.("note")}>header-note</button>
        <button onClick={() => props.onRootNoteChange?.("D♭")}>header-root-db</button>
      </div>
    );
  },
}));

vi.mock("./components/FretboardFooter/index", () => ({
  default: (props: any) => {
    footerState.latest = props;
    return (
      <div>
        <span>footer-mode:{String(props.baseLabelMode)}</span>
        <span>footer-notes:{String((props.overlayNotes as string[]).join(","))}</span>
        <button onClick={() => props.onAutoFilter?.()}>footer-auto</button>
        <button onClick={() => props.onResetOrHighlightAll?.()}>footer-reset</button>
        <button onClick={() => props.onToggleDegree?.("P1")}>footer-toggle-p1</button>
      </div>
    );
  },
}));

vi.mock("./components/NormalFretboard/index", () => ({
  default: (props: any) => {
    normalFretboardState.latest = props;
    return (
      <div>
        <span>fb-root:{String(props.rootNote)}</span>
        <span>fb-accidental:{String(props.accidental)}</span>
        <span>fb-theme:{String(props.theme)}</span>
        <span>fb-mode:{String(props.chordDisplayMode)}</span>
        <span>fb-scale:{String(props.scaleType)}</span>
        <span>
          fb-diatonic:{String(props.diatonicScaleType)}:{String(props.diatonicDegree)}
        </span>
        <span>fb-triad:{String(props.triadPosition)}</span>
        <span>fb-highlighted:{String((props.highlightedDegrees as Set<string>).size)}</span>
        <button onClick={() => props.onNoteClick?.("D♭")}>note-db</button>
      </div>
    );
  },
}));

vi.mock("./components/QuizFretboard/index", () => ({
  default: (props: any) => {
    quizFretboardState.latest = props;
    return (
      <div>
        <span>quiz-fb-root:{String(props.rootNote)}</span>
        <span>quiz-fb-mode:{String(props.chordDisplayMode)}</span>
        <span>quiz-fb-scale:{String(props.scaleType)}</span>
      </div>
    );
  },
}));

describe("App", () => {
  beforeEach(() => {
    window.localStorage.clear();
    controlsState.latest = null;
    normalFretboardState.latest = null;
    quizFretboardState.latest = null;
    headerState.latest = null;
    footerState.latest = null;
  });

  it("ヘッダーと指板に初期状態を渡す", () => {
    render(<App />);

    expect(screen.getByText("header-root:C")).toBeTruthy();
    expect(screen.getByText("header-mode:note")).toBeTruthy();
    expect(screen.getByText("fb-root:C")).toBeTruthy();
    expect(screen.getByText("fb-accidental:flat")).toBeTruthy();
    expect(screen.getByText("fb-triad:root")).toBeTruthy();
    expect(screen.getByText("fb-diatonic:major-triad:I")).toBeTruthy();
    expect(screen.getByText("footer-mode:note")).toBeTruthy();
  });

  it("theme と accidental を localStorage から復元する", () => {
    window.localStorage.setItem("guiter:theme", "light");
    window.localStorage.setItem("guiter:accidental", "sharp");

    render(<App />);

    expect(screen.getByText("fb-theme:light")).toBeTruthy();
    expect(screen.getByText("fb-accidental:sharp")).toBeTruthy();
  });

  it("指板クリックと臨時記号変更でルート表記を更新する", () => {
    render(<App />);

    fireEvent.click(screen.getByText("note-db"));
    expect(screen.getByText("header-root:D♭")).toBeTruthy();

    fireEvent.click(screen.getByText("acc-sharp"));
    expect(screen.getByText("header-root:C♯")).toBeTruthy();
    expect(screen.getByText("fb-accidental:sharp")).toBeTruthy();
    expect(window.localStorage.getItem("guiter:accidental")).toBe("sharp");
  });

  it("テーマと各表示モードの状態を更新する", () => {
    render(<App />);

    fireEvent.click(screen.getByText("theme-toggle"));
    fireEvent.click(screen.getByText("scale-toggle"));
    fireEvent.click(screen.getByText("chord-toggle"));
    fireEvent.click(screen.getByText("caged-toggle"));
    fireEvent.click(screen.getByText("caged-c"));
    fireEvent.click(screen.getByText("scale-blues"));
    fireEvent.click(screen.getByText("mode-power"));
    fireEvent.click(screen.getByText("chord-minor"));

    expect(screen.getByText("fb-theme:dark")).toBeTruthy();
    expect(window.localStorage.getItem("guiter:theme")).toBe("dark");
    expect(screen.getByText("fb-scale:blues")).toBeTruthy();
    expect(screen.getByText("fb-mode:power")).toBeTruthy();
    expect(normalFretboardState.latest).toBeTruthy();
    expect((normalFretboardState.latest!.cagedForms as Set<string>).has("C")).toBe(true);

    fireEvent.click(screen.getByText("caged-e"));
    expect((normalFretboardState.latest!.cagedForms as Set<string>).has("E")).toBe(false);
  });

  it("ダイアトニックとトライアド設定を更新する", () => {
    render(<App />);

    fireEvent.click(screen.getByText("mode-diatonic"));
    fireEvent.click(screen.getByText("degree-v"));
    fireEvent.click(screen.getByText("key-minor"));
    fireEvent.click(screen.getByText("size-seventh"));

    expect(screen.getByText("fb-diatonic:natural-minor-seventh:i")).toBeTruthy();

    fireEvent.click(screen.getByText("mode-diatonic"));
    fireEvent.click(screen.getByText("degree-v"));
    fireEvent.click(screen.getByText("key-major"));
    fireEvent.click(screen.getByText("size-triad"));

    expect(screen.getByText("fb-diatonic:major-triad:V")).toBeTruthy();

    fireEvent.click(screen.getByText("mode-triad"));
    fireEvent.click(screen.getByText("triad-inversion"));

    expect(screen.getByText("fb-triad:1st")).toBeTruthy();
  });

  it("度数モードで絞り込みとリセットが動く", () => {
    render(<App />);

    fireEvent.click(screen.getByText("header-degree"));
    expect(screen.getByText("footer-mode:degree")).toBeTruthy();

    fireEvent.click(screen.getByText("footer-auto"));
    expect(screen.getByText("fb-highlighted:0")).toBeTruthy();

    fireEvent.click(screen.getByText("footer-reset"));
    expect(screen.getByText("fb-highlighted:12")).toBeTruthy();

    fireEvent.click(screen.getByText("footer-reset"));
    expect(screen.getByText("fb-highlighted:0")).toBeTruthy();

    fireEvent.click(screen.getByText("scale-toggle"));
    fireEvent.click(screen.getByText("chord-toggle"));
    fireEvent.click(screen.getByText("mode-diatonic"));
    fireEvent.click(screen.getByText("degree-v"));
    fireEvent.click(screen.getByText("footer-auto"));

    expect(normalFretboardState.latest).toBeTruthy();
    expect((normalFretboardState.latest!.highlightedDegrees as Set<string>).size).toBeGreaterThan(
      0,
    );
  });

  it("度数チップをトグルできる", () => {
    render(<App />);

    fireEvent.click(screen.getByText("header-degree"));
    fireEvent.click(screen.getByText("footer-toggle-p1"));
    expect(screen.getByText("fb-highlighted:1")).toBeTruthy();

    fireEvent.click(screen.getByText("footer-toggle-p1"));
    expect(screen.getByText("fb-highlighted:0")).toBeTruthy();

    fireEvent.click(screen.getByText("header-note"));
    expect(screen.getByText("footer-mode:note")).toBeTruthy();
  });

  it("音名表示時は表示中オーバーレイの構成音を下に表示する", () => {
    render(<App />);

    expect(screen.getByText("footer-notes:")).toBeTruthy();

    fireEvent.click(screen.getByText("scale-toggle"));

    expect(screen.getByText("footer-notes:C,D,E,F,G,A,B")).toBeTruthy();
  });

  it("臨時記号設定に応じて下部の音名表示も切り替わる", () => {
    render(<App />);

    fireEvent.click(screen.getByText("note-db"));
    fireEvent.click(screen.getByText("scale-toggle"));

    expect(screen.getByText("footer-notes:D♭,E♭,F,G♭,A♭,B♭,C")).toBeTruthy();

    fireEvent.click(screen.getByText("acc-sharp"));
    expect(screen.getByText("footer-notes:C♯,D♯,F,F♯,G♯,A♯,C")).toBeTruthy();
  });

  it("コードフォームとパワーコードでも自動絞り込みできる", () => {
    render(<App />);

    fireEvent.click(screen.getByText("header-degree"));
    fireEvent.click(screen.getByText("chord-toggle"));
    fireEvent.click(screen.getByText("footer-auto"));
    expect(normalFretboardState.latest).toBeTruthy();
    expect((normalFretboardState.latest!.highlightedDegrees as Set<string>).size).toBeGreaterThan(
      0,
    );

    fireEvent.click(screen.getByText("footer-reset"));
    fireEvent.click(screen.getByText("mode-power"));
    fireEvent.click(screen.getByText("footer-auto"));
    expect((normalFretboardState.latest!.highlightedDegrees as Set<string>).size).toBeGreaterThan(
      0,
    );
  });

  it("CAGED表示のみでも自動絞り込みできる", () => {
    render(<App />);

    fireEvent.click(screen.getByText("header-degree"));
    fireEvent.click(screen.getByText("caged-toggle"));
    fireEvent.click(screen.getByText("footer-auto"));

    expect(normalFretboardState.latest).toBeTruthy();
    expect((normalFretboardState.latest!.highlightedDegrees as Set<string>).size).toBeGreaterThan(
      0,
    );
  });

  it("クイズ中にルートを変えると問題も更新される", () => {
    render(<App />);

    fireEvent.click(screen.getByText("quiz-toggle"));
    fireEvent.click(screen.getByText("音名・12択"));
    fireEvent.click(screen.getByText("度数・指板"));

    expect(screen.getByText(/ルート: C/)).toBeTruthy();

    fireEvent.click(screen.getByText("header-root-db"));

    expect(screen.getByText(/ルート: D♭/)).toBeTruthy();
  });
});
