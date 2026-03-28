import { describe, it, expect, vi } from "vite-plus/test";
import { fireEvent, render, screen } from "@testing-library/react";
import QuizKindSelect from "./QuizKindSelect";
import type { Theme } from "../../types";

const options = [
  { value: "note-choice", label: "音名・12択" },
  { value: "note-fretboard", label: "音名・指板" },
  { value: "degree-choice", label: "度数・12択" },
  { value: "degree-fretboard", label: "度数・指板" },
  { value: "chord-choice", label: "コード・識別" },
  { value: "chord-fretboard", label: "コード・指板" },
  { value: "scale-choice", label: "スケール・音名選択" },
  { value: "scale-fretboard", label: "スケール・指板" },
];

function makeProps(overrides: Record<string, unknown> = {}) {
  return {
    theme: "dark" as Theme,
    value: "note-choice",
    options,
    disabled: false,
    onChange: vi.fn(),
    ...overrides,
  };
}

describe("QuizKindSelect", () => {
  it("開くと一覧パネルが表示される", () => {
    render(<QuizKindSelect {...makeProps()} />);

    fireEvent.click(screen.getByText("音名・12択"));

    expect(screen.getByRole("dialog", { name: "quiz-kind-select" })).toBeTruthy();
    expect(screen.getByText("コード・指板")).toBeTruthy();
  });

  it("選択すると onChange が呼ばれる", () => {
    const props = makeProps();
    render(<QuizKindSelect {...props} />);

    fireEvent.click(screen.getByText("音名・12択"));
    fireEvent.click(screen.getByText("度数・指板"));

    expect(props.onChange).toHaveBeenCalledWith("degree-fretboard");
  });

  it("disabled のとき開かない", () => {
    render(<QuizKindSelect {...makeProps({ disabled: true })} />);

    fireEvent.click(screen.getByText("音名・12択"));

    expect(screen.queryByRole("dialog", { name: "quiz-kind-select" })).toBeNull();
  });

  it("対応する 12択 と 指板 が並ぶ順で表示される", () => {
    render(<QuizKindSelect {...makeProps()} />);

    fireEvent.click(screen.getByText("音名・12択"));

    const labels = Array.from(
      screen.getByRole("dialog", { name: "quiz-kind-select" }).querySelectorAll("button"),
    ).map((button) => button.textContent);

    expect(labels).toEqual([
      "音名・12択",
      "音名・指板",
      "度数・12択",
      "度数・指板",
      "コード・識別",
      "コード・指板",
      "スケール・音名選択",
      "スケール・指板",
    ]);
  });
});
