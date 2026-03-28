import { describe, it, expect } from "vite-plus/test";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useQuiz } from "./useQuiz";

describe("useQuiz", () => {
  it("コード識別クイズはルートと種別の2段階で判定する", async () => {
    const { result } = renderHook(() =>
      useQuiz({
        accidental: "flat",
        fretRange: [0, 14],
        rootNote: "C",
        scaleType: "major",
        showQuiz: true,
        chordQuizTypes: ["Major", "m7"],
      }),
    );

    await waitFor(() => expect(result.current.quizQuestion).not.toBeNull());

    act(() => {
      result.current.handleQuizKindChange("chord", "choice");
    });

    await waitFor(() => expect(result.current.quizQuestion?.promptChordRoot).toBeTruthy());

    act(() => {
      result.current.handleChordQuizRootSelect(result.current.quizQuestion?.promptChordRoot ?? "C");
    });

    expect(result.current.selectedAnswer).toBeNull();

    act(() => {
      result.current.handleChordQuizTypeSelect(
        result.current.quizQuestion?.promptChordType ?? "Major",
      );
    });

    expect(result.current.selectedAnswer).toBeTruthy();
    expect(result.current.quizScore).toEqual({ correct: 1, total: 1 });
  });

  it("scale 指板クイズは表示範囲の正解セルを全部選ぶまで完了しない", async () => {
    const { result } = renderHook(() =>
      useQuiz({
        accidental: "flat",
        fretRange: [0, 1],
        rootNote: "C",
        scaleType: "major",
        showQuiz: true,
        chordQuizTypes: ["Major"],
      }),
    );

    await waitFor(() => expect(result.current.quizQuestion).not.toBeNull());

    act(() => {
      result.current.handleQuizKindChange("scale", "fretboard");
    });

    const correctCells = [
      { stringIdx: 0, fret: 0 },
      { stringIdx: 0, fret: 1 },
      { stringIdx: 1, fret: 0 },
      { stringIdx: 2, fret: 0 },
      { stringIdx: 3, fret: 0 },
      { stringIdx: 4, fret: 0 },
      { stringIdx: 4, fret: 1 },
      { stringIdx: 5, fret: 0 },
      { stringIdx: 5, fret: 1 },
    ];

    correctCells.slice(0, -1).forEach((cell) => {
      act(() => {
        result.current.handleFretboardQuizAnswer(cell.stringIdx, cell.fret);
      });
    });

    expect(result.current.selectedAnswer).toBeNull();
    expect(result.current.quizSelectedCells).toHaveLength(8);

    act(() => {
      const lastCell = correctCells[correctCells.length - 1];
      result.current.handleFretboardQuizAnswer(lastCell.stringIdx, lastCell.fret);
    });

    expect(result.current.selectedAnswer).toBe("C");
    expect(result.current.quizSelectedCells).toHaveLength(9);
    expect(result.current.quizScore).toEqual({ correct: 1, total: 1 });
  });
});
