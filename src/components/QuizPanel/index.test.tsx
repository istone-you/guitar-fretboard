import { describe, it, expect, vi } from "vite-plus/test";
import { render, screen, fireEvent } from "@testing-library/react";
import QuizPanel from ".";
import type { Theme, ChordType } from "../../types";
import type { QuizMode, QuizType, QuizQuestion } from ".";

function makeQuestion(overrides: Partial<QuizQuestion> = {}): QuizQuestion {
  return {
    stringIdx: 0,
    fret: 3,
    correct: "G",
    choices: ["G", "A", "B", "C"],
    ...overrides,
  };
}

function makeProps(overrides: Record<string, unknown> = {}) {
  return {
    theme: "dark" as Theme,
    mode: "note" as QuizMode,
    quizType: "choice" as QuizType,
    question: makeQuestion(),
    score: { correct: 0, total: 0 },
    selectedAnswer: null,
    rootNote: "C",
    chordQuizTypes: ["Major", "Minor", "7th", "maj7", "m7"] as ChordType[],
    availableChordQuizTypes: ["Major", "Minor", "7th", "maj7", "m7", "sus2"] as ChordType[],
    onKindChange: vi.fn(),
    onChordQuizTypesChange: vi.fn(),
    onAnswer: vi.fn(),
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
    expect(screen.getByText("音名・4択")).toBeTruthy();
  });

  it("種別ドロップダウンで度数・指板を選ぶと統合ハンドラが呼ばれる", () => {
    const props = makeProps();
    render(<QuizPanel {...props} />);
    fireEvent.click(screen.getByText("音名・4択"));
    fireEvent.click(screen.getByText("度数・指板"));
    expect(props.onKindChange).toHaveBeenCalledWith("degree", "fretboard");
  });

  it("relative モードではルート基準の問題文が表示される", () => {
    render(
      <QuizPanel
        {...makeProps({
          mode: "relative" as QuizMode,
          question: makeQuestion({
            correct: "F",
            promptRoot: "C",
            promptDegree: "P4",
          }),
        })}
      />,
    );

    expect(screen.getByText(/CのP4は/)).toBeTruthy();
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

  it("chord モードでは出題コード選択が表示される", () => {
    render(
      <QuizPanel
        {...makeProps({
          mode: "chord" as QuizMode,
          quizType: "fretboard" as QuizType,
          question: makeQuestion({
            choices: [],
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
        quizType={"fretboard" as QuizType}
        question={makeQuestion({
          choices: [],
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

  it("回答済みのとき種別ドロップダウンは disabled", () => {
    render(<QuizPanel {...makeProps({ selectedAnswer: "G" })} />);
    const btn = screen.getByText("音名・4択").closest("button");
    expect(btn).toHaveProperty("disabled", true);
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
});
