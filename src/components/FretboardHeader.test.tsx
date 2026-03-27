import { describe, it, expect, vi } from "vite-plus/test";
import { fireEvent, render, screen } from "@testing-library/react";
import FretboardHeader from "./FretboardHeader";
import type { BaseLabelMode, Theme } from "../types";

function makeProps(overrides: Record<string, unknown> = {}) {
  return {
    theme: "dark" as Theme,
    rootNote: "C",
    baseLabelMode: "note" as BaseLabelMode,
    onBaseLabelModeChange: vi.fn(),
    ...overrides,
  };
}

describe("FretboardHeader", () => {
  it("ルート音と表示切り替えが表示される", () => {
    render(<FretboardHeader {...makeProps()} />);

    expect(screen.getByText("ルート:")).toBeTruthy();
    expect(screen.getByText("C")).toBeTruthy();
    expect(screen.getByText("表示")).toBeTruthy();
    expect(screen.getByRole("button", { name: "音名" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "度数" })).toBeTruthy();
  });

  it("音名ボタンを押すと note が通知される", () => {
    const props = makeProps({ baseLabelMode: "degree" as BaseLabelMode });
    render(<FretboardHeader {...props} />);

    fireEvent.click(screen.getByRole("button", { name: "音名" }));

    expect(props.onBaseLabelModeChange).toHaveBeenCalledWith("note");
  });

  it("度数ボタンを押すと degree が通知される", () => {
    const props = makeProps();
    render(<FretboardHeader {...props} />);

    fireEvent.click(screen.getByRole("button", { name: "度数" }));

    expect(props.onBaseLabelModeChange).toHaveBeenCalledWith("degree");
  });

  it("ライトテーマと degree 選択状態でも表示できる", () => {
    render(
      <FretboardHeader
        {...makeProps({ theme: "light" as Theme, baseLabelMode: "degree" as BaseLabelMode })}
      />,
    );

    expect(screen.getByText("ルート:")).toBeTruthy();
    expect(screen.getByRole("button", { name: "度数" })).toBeTruthy();
  });
});
