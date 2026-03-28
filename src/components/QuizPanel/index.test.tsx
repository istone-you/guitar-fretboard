import { describe, it, expect, vi } from "vite-plus/test";
import { render, screen, fireEvent } from "@testing-library/react";
import QuizPanel from ".";
import type { Theme } from "../../types";
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
    onModeChange: vi.fn(),
    onQuizTypeChange: vi.fn(),
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

  it("種別ドロップダウンで度数・指板を選ぶと両方のハンドラが呼ばれる", () => {
    const props = makeProps();
    render(<QuizPanel {...props} />);
    fireEvent.click(screen.getByText("音名・4択"));
    fireEvent.click(screen.getByText("度数・指板"));
    expect(props.onModeChange).toHaveBeenCalledWith("degree");
    expect(props.onQuizTypeChange).toHaveBeenCalledWith("fretboard");
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
