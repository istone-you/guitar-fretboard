import type { ComponentProps } from "react";
import { describe, it, expect, vi } from "vite-plus/test";
import { render, screen, fireEvent } from "@testing-library/react";
import QuizPanel from ".";
import type { Theme, ChordType, ScaleType } from "../../types";
import type { QuizMode, QuizType, QuizQuestion } from ".";

function makeQuestion(overrides: Partial<QuizQuestion> = {}): QuizQuestion {
  return {
    stringIdx: 0,
    fret: 3,
    correct: "G",
    choices: ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"],
    ...overrides,
  };
}

function makeProps(
  overrides: Partial<ComponentProps<typeof QuizPanel>> = {},
): ComponentProps<typeof QuizPanel> {
  return {
    theme: "dark" as Theme,
    mode: "note" as QuizMode,
    quizType: "choice" as QuizType,
    question: makeQuestion(),
    score: { correct: 0, total: 0 },
    selectedAnswer: null,
    rootNote: "C",
    quizSelectedChoices: [],
    noteOptions: ["C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"],
    quizSelectedChordRoot: null,
    quizSelectedChordType: null,
    diatonicSelectedRoot: null,
    diatonicSelectedChordType: null,
    diatonicAllAnswers: {},
    diatonicEditingDegree: null,
    diatonicQuizKeyType: "major",
    diatonicQuizChordSize: "triad",
    chordQuizTypes: ["Major", "Minor", "7th", "maj7", "m7"] as ChordType[],
    availableChordQuizTypes: ["Major", "Minor", "7th", "maj7", "m7", "sus2"] as ChordType[],
    scaleType: "major" as ScaleType,
    onKindChange: vi.fn(),
    onChordQuizTypesChange: vi.fn(),
    onScaleTypeChange: vi.fn(),
    onDiatonicQuizKeyTypeChange: vi.fn(),
    onDiatonicQuizChordSizeChange: vi.fn(),
    onAnswer: vi.fn(),
    onChordQuizRootSelect: vi.fn(),
    onChordQuizTypeSelect: vi.fn(),
    onDiatonicAnswerRootSelect: vi.fn(),
    onDiatonicAnswerTypeSelect: vi.fn(),
    onDiatonicDegreeCardClick: vi.fn(),
    onDiatonicSubmitAll: vi.fn(),
    onNextQuestion: vi.fn(),
    onRetryQuestion: vi.fn(),
    fretboardAllStrings: false,
    onFretboardAllStringsChange: vi.fn(),
    ...overrides,
  };
}

describe("QuizPanel", () => {
  it("問題文と選択肢が表示される", () => {
    render(<QuizPanel {...makeProps()} />);
    expect(screen.getByText(/弦.*フレット/)).toBeTruthy();
    expect(screen.getByText("G")).toBeTruthy();
    expect(screen.getByText("A")).toBeTruthy();
    expect(screen.getByText("B")).toBeTruthy();
    expect(screen.getByText("C")).toBeTruthy();
  });

  it("正解を選ぶと correct スタイルが当たる", () => {
    render(<QuizPanel {...makeProps({ selectedAnswer: "G" })} />);
    const correctBtn = screen.getByText("G").closest("button");
    expect(correctBtn?.className).toContain("bg-green-600");
  });

  it("不正解を選んだとき選択肢に incorrect スタイルが当たる", () => {
    render(<QuizPanel {...makeProps({ selectedAnswer: "A" })} />);
    const wrongBtn = screen.getByText("A").closest("button");
    expect(wrongBtn?.className).toContain("bg-red-500");
    const correctBtn = screen.getByText("G").closest("button");
    expect(correctBtn?.className).toContain("bg-green-600");
  });

  it("スコアが表示される", () => {
    render(<QuizPanel {...makeProps()} />);
    expect(screen.getByText(/✓.*0.*\/.*0/)).toBeTruthy();
  });

  it("種別ドロップダウンが表示される", () => {
    render(<QuizPanel {...makeProps()} />);
    expect(screen.getByText("音名・12択")).toBeTruthy();
  });

  it("種別ドロップダウンで度数・指板を選ぶと統合ハンドラが呼ばれる", () => {
    const props = makeProps();
    render(<QuizPanel {...props} />);
    fireEvent.click(screen.getByText("音名・12択"));
    fireEvent.click(screen.getByText("度数・指板"));
    expect(props.onKindChange).toHaveBeenCalledWith("degree", "fretboard");
  });

  it("scale モードではスケール構成音の問題文が表示される", () => {
    render(
      <QuizPanel
        {...makeProps({
          mode: "scale" as QuizMode,
          question: makeQuestion({
            promptScaleRoot: "C",
            promptScaleType: "major" as ScaleType,
            correctNoteNames: ["C", "D", "E", "F", "G", "A", "B"],
            answerLabel: "C / D / E / F / G / A / B",
          }),
        })}
      />,
    );

    expect(screen.getByText(/Cメジャースケールの音は/)).toBeTruthy();
  });

  it("chord モードではコード構成音の問題文が表示される", () => {
    render(
      <QuizPanel
        {...makeProps({
          mode: "chord" as QuizMode,
          quizType: "fretboard" as QuizType,
          question: makeQuestion({
            choices: [],
            promptChordLabel: "Cm7",
            correctNoteNames: ["C", "E♭", "G", "B♭"],
            answerLabel: "C / E♭ / G / B♭",
          }),
        })}
      />,
    );

    expect(screen.getByText(/Cm7 の構成音/)).toBeTruthy();
  });

  it("コード識別ではルートとコード種別を順に選べる", () => {
    const props = makeProps();
    const { rerender } = render(
      <QuizPanel
        {...props}
        mode={"chord" as QuizMode}
        quizType={"choice" as QuizType}
        question={makeQuestion({
          promptChordLabel: "Cmaj7",
          promptChordRoot: "C",
          promptChordType: "maj7" as ChordType,
        })}
      />,
    );

    expect(screen.getByText("このコードは？")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "C" }));
    expect(props.onChordQuizRootSelect).toHaveBeenCalledWith("C");

    rerender(
      <QuizPanel
        {...props}
        mode={"chord" as QuizMode}
        quizType={"choice" as QuizType}
        quizSelectedChordRoot={"C"}
        question={makeQuestion({
          promptChordLabel: "Cmaj7",
          promptChordRoot: "C",
          promptChordType: "maj7" as ChordType,
        })}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "maj7" }));
    expect(props.onChordQuizTypeSelect).toHaveBeenCalledWith("maj7");
  });

  it("chord モードでは出題コード選択が表示される", () => {
    render(
      <QuizPanel
        {...makeProps({
          mode: "chord" as QuizMode,
          quizType: "choice" as QuizType,
          question: makeQuestion({
            choices: ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"],
            promptChordLabel: "Cm7",
            correctNoteNames: ["C", "E♭", "G", "B♭"],
          }),
        })}
      />,
    );

    expect(screen.getByText("出題コード")).toBeTruthy();
    expect(screen.getByRole("button", { name: "5種類" })).toBeTruthy();
  });

  it("chord モードの出題コードを切り替えるとハンドラが呼ばれる", () => {
    const props = makeProps();
    render(
      <QuizPanel
        {...props}
        mode={"chord" as QuizMode}
        quizType={"choice" as QuizType}
        question={makeQuestion({
          choices: ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"],
          promptChordLabel: "Cm7",
          correctNoteNames: ["C", "E♭", "G", "B♭"],
        })}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "5種類" }));
    fireEvent.click(screen.getByRole("button", { name: "sus2" }));
    expect(props.onChordQuizTypesChange).toHaveBeenCalledWith([
      "Major",
      "Minor",
      "7th",
      "maj7",
      "m7",
      "sus2",
    ]);
  });

  it("scale モードではスケール選択が表示される", () => {
    render(
      <QuizPanel
        {...makeProps({
          mode: "scale" as QuizMode,
          question: makeQuestion({
            promptScaleRoot: "C",
            promptScaleType: "major" as ScaleType,
            correctNoteNames: ["C", "D", "E", "F", "G", "A", "B"],
            answerLabel: "C / D / E / F / G / A / B",
          }),
        })}
      />,
    );

    expect(screen.getByText("スケール")).toBeTruthy();
    expect(screen.getByRole("button", { name: "メジャースケール" })).toBeTruthy();
  });

  it("scale モードのスケールを切り替えるとハンドラが呼ばれる", () => {
    const props = makeProps();
    render(
      <QuizPanel
        {...props}
        mode={"scale" as QuizMode}
        question={makeQuestion({
          promptScaleRoot: "C",
          promptScaleType: "major" as ScaleType,
          correctNoteNames: ["C", "D", "E", "F", "G", "A", "B"],
          answerLabel: "C / D / E / F / G / A / B",
        })}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "メジャースケール" }));
    fireEvent.click(screen.getByRole("button", { name: "ハーモニックマイナー" }));

    expect(props.onScaleTypeChange).toHaveBeenCalledWith("harmonic-minor");
  });

  it("scale モードのスケール選択は上に開く", () => {
    render(
      <QuizPanel
        {...makeProps({
          mode: "scale" as QuizMode,
          question: makeQuestion({
            promptScaleRoot: "C",
            promptScaleType: "major" as ScaleType,
            correctNoteNames: ["C", "D", "E", "F", "G", "A", "B"],
            answerLabel: "C / D / E / F / G / A / B",
          }),
        })}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "メジャースケール" }));

    const panel = screen.getByRole("dialog", { name: "スケール一覧" });
    expect(panel.style.position).toBe("fixed");
    expect(panel.style.bottom).not.toBe("");
  });

  it("ダイアトニック全答では7枠が表示される", () => {
    render(
      <QuizPanel
        {...makeProps({
          mode: "diatonic" as QuizMode,
          quizType: "all" as QuizType,
          question: makeQuestion({
            choices: [],
            promptDiatonicKeyType: "major",
            promptDiatonicChordSize: "triad",
            diatonicChordTypeOptions: ["Major", "Minor", "dim7"] as ChordType[],
            diatonicAnswers: [
              { degree: "I", root: "C", chordType: "Major", label: "C" },
              { degree: "ii", root: "D", chordType: "Minor", label: "Dm" },
              { degree: "iii", root: "E", chordType: "Minor", label: "Em" },
              { degree: "IV", root: "F", chordType: "Major", label: "F" },
              { degree: "V", root: "G", chordType: "Major", label: "G" },
              { degree: "vi", root: "A", chordType: "Minor", label: "Am" },
              { degree: "vii", root: "B", chordType: "dim7", label: "Bdim7" },
            ],
          }),
        })}
      />,
    );

    expect(screen.getByText(/Cメジャー \/ 3和音 のダイアトニックコード/)).toBeTruthy();
    expect(screen.getAllByText("--").length).toBeGreaterThan(0);
    expect(screen.getByText("I")).toBeTruthy();
    expect(screen.getByText("ii")).toBeTruthy();
    expect(screen.getByText("vii")).toBeTruthy();
  });

  it("回答済みのとき種別ドロップダウンは disabled", () => {
    render(<QuizPanel {...makeProps({ selectedAnswer: "G" })} />);
    const btn = screen.getByText("音名・12択").closest("button");
    expect(btn).toHaveProperty("disabled", true);
  });

  it("未回答時の次へボタンは disabled", () => {
    render(<QuizPanel {...makeProps()} />);

    expect(screen.getByRole("button", { name: "次へ" })).toHaveProperty("disabled", true);
  });

  it("回答後は次へボタンが表示される", () => {
    const props = makeProps({ selectedAnswer: "G" });
    render(<QuizPanel {...props} />);

    expect(screen.getByRole("button", { name: "次へ" })).toHaveProperty("disabled", false);
    fireEvent.click(screen.getByRole("button", { name: "次へ" }));

    expect(props.onNextQuestion).toHaveBeenCalled();
  });

  it("scale モードでは回答後にもう一度ボタンが表示される", () => {
    const props = makeProps({
      mode: "scale" as QuizMode,
      selectedAnswer: "C",
      question: makeQuestion({
        promptScaleRoot: "C",
        promptScaleType: "major" as ScaleType,
        correctNoteNames: ["C", "D", "E", "F", "G", "A", "B"],
        answerLabel: "C / D / E / F / G / A / B",
      }),
    });
    render(<QuizPanel {...props} />);

    expect(screen.getByRole("button", { name: "もう一度" })).toHaveProperty("disabled", false);
    fireEvent.click(screen.getByRole("button", { name: "もう一度" }));

    expect(props.onRetryQuestion).toHaveBeenCalled();
  });

  it("fretboardモードではタップ指示が表示され選択肢グリッドが非表示", () => {
    const fretboardQuestion = makeQuestion({ choices: [] });
    render(
      <QuizPanel
        {...makeProps({ quizType: "fretboard" as QuizType, question: fretboardQuestion })}
      />,
    );
    expect(screen.getByText(/指板をタップ/)).toBeTruthy();
    expect(screen.queryByText("G")).toBeNull();
    expect(screen.queryByText("A")).toBeNull();
  });

  it("fretboard問題文は弦名と音名を含む", () => {
    const fretboardQuestion = makeQuestion({ stringIdx: 0, correct: "G", choices: [] });
    render(
      <QuizPanel
        {...makeProps({ quizType: "fretboard" as QuizType, question: fretboardQuestion })}
      />,
    );
    expect(screen.getByText(/6弦.*G.*どこ/)).toBeTruthy();
  });

  it("度数・指板問題文はルートを含む", () => {
    render(
      <QuizPanel
        {...makeProps({
          mode: "degree" as QuizMode,
          quizType: "fretboard" as QuizType,
          rootNote: "C",
          question: makeQuestion({ stringIdx: 0, correct: "M3", choices: [] }),
        })}
      />,
    );

    expect(screen.getByText(/6弦.*M3.*ルート: C/)).toBeTruthy();
  });
});
