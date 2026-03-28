import { describe, it, expect, vi } from "vite-plus/test";
import { fireEvent, render, screen } from "@testing-library/react";
import FretboardFooter from "./index";

function makeProps(overrides: Record<string, unknown> = {}) {
  return {
    theme: "dark" as const,
    baseLabelMode: "note" as const,
    showQuiz: false,
    overlayNotes: [] as string[],
    hiddenDegrees: new Set<string>(),
    onAutoFilter: vi.fn(),
    onResetOrHideAll: vi.fn(),
    onToggleDegree: vi.fn(),
    ...overrides,
  };
}

describe("FretboardFooter", () => {
  it("音名モードでは構成音を表示する", () => {
    render(<FretboardFooter {...makeProps({ overlayNotes: ["C", "E", "G"] })} />);

    expect(screen.getByText("表示中の音名")).toBeTruthy();
    expect(screen.getByText("C")).toBeTruthy();
    expect(screen.getByText("E")).toBeTruthy();
    expect(screen.getByText("G")).toBeTruthy();
  });

  it("度数モードではフィルター UI を表示する", () => {
    const props = makeProps({ baseLabelMode: "degree" as const });
    render(<FretboardFooter {...props} />);

    fireEvent.click(screen.getByTitle("表示中のオーバーレイに合わせて絞り込む"));
    fireEvent.click(screen.getByText("P1"));
    fireEvent.click(screen.getByText("全非表示"));

    expect(screen.getByText("度数")).toBeTruthy();
    expect(props.onAutoFilter).toHaveBeenCalledTimes(1);
    expect(props.onToggleDegree).toHaveBeenCalledWith("P1");
    expect(props.onResetOrHideAll).toHaveBeenCalledTimes(1);
  });

  it("クイズ表示中は中身を描画しない", () => {
    render(
      <FretboardFooter
        {...makeProps({
          showQuiz: true,
          baseLabelMode: "degree" as const,
          overlayNotes: ["C"],
        })}
      />,
    );

    expect(screen.queryByText("表示中の音名")).toBeNull();
    expect(screen.queryByText("度数")).toBeNull();
  });
});
