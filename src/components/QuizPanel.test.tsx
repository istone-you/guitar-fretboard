import { describe, it, expect, vi } from "vite-plus/test";
import { render, screen, fireEvent } from "@testing-library/react";
import QuizPanel from "./QuizPanel";
import type { Theme } from "../types";
import type { QuizMode, QuizQuestion } from "./QuizPanel";

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
    question: makeQuestion(),
    score: { correct: 0, total: 0 },
    selectedAnswer: null,
    rootNote: "C",
    onModeChange: vi.fn(),
    onAnswer: vi.fn(),
    ...overrides,
  };
}

describe("QuizPanel", () => {
  it("問題文と選択肢が表示される", () => {
    render(<QuizPanel {...makeProps()} />);
    // 問題文が表示される（弦・フレット番号を含む）
    expect(screen.getByText(/弦.*フレット/)).toBeTruthy();
    // 選択肢が表示される
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
    // 正解はグリーン
    const correctBtn = screen.getByText("G").closest("button");
    expect(correctBtn?.className).toContain("bg-green-600");
  });

  it("スコアが表示される", () => {
    render(<QuizPanel {...makeProps()} />);
    expect(screen.getByText(/✓.*0.*\/.*0/)).toBeTruthy();
  });

  it("モード切り替えボタンで onModeChange が呼ばれる", () => {
    const props = makeProps();
    render(<QuizPanel {...props} />);
    // 未回答時にモード切り替えが呼ばれる
    fireEvent.click(screen.getByText("度数"));
    expect(props.onModeChange).toHaveBeenCalledWith("degree");
  });

  it("回答済みのときモード切り替えは呼ばれない", () => {
    const props = makeProps({ selectedAnswer: "G" });
    render(<QuizPanel {...props} />);
    fireEvent.click(screen.getByText("度数"));
    expect(props.onModeChange).not.toHaveBeenCalled();
  });
});
